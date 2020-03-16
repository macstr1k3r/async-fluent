const { fluent, defaultValue } = require('../');
const faker = require('faker');

describe('Flow control capabilities', () => {
    const addFirstName = state => ({ ...state, firstName: faker.name.firstName() });
    const addLastName = state => ({ ...state, lastName: faker.name.lastName() });
    const failingReducer = async (state) => Promise.reject(new Error('boooom!'))
    const defaultingReducer = () => defaultValue({ default: true })
    const loggingDefaultingReducer = () => defaultValue({ default: true }, 'log msg', 'warn');
    const loggingDefaultingReducerNoLogLevel = () => defaultValue({ default: true }, 'log msg');

    it('Should throw an error', async () => {
        const job = fluent({ addLastName, addFirstName, failingReducer })


        await expect(
            job.addLastName()
                .addFirstName()
                .failingReducer() // exit point
                .build()
        ).rejects.toEqual(new Error('boooom!'));

        await expect(
            job.addFirstName()
                .failingReducer() // exit point
                .addLastName()
                .build()
        ).rejects.toEqual(new Error('boooom!'));

        await expect(
            job.failingReducer() // exit point
                .addLastName()
                .addFirstName()
                .build()
        ).rejects.toEqual(new Error('boooom!'));
    });

    it('Should short circuit the execution', async () => {

        const job = fluent({ addLastName, addFirstName, defaultingReducer, failingReducer });

        await expect(
            job.addFirstName()
                .addLastName()
                .defaultingReducer()
                .failingReducer()
                .build()
        ).resolves.toEqual({ default: true })
    });

    it('Should short circuit the execution and log to console', async () => {
        const logger = {
            info: jest.fn(),
            warn: jest.fn(),
        }

        const job = fluent({
            addLastName, addFirstName,
            loggingDefaultingReducer, failingReducer
        }, logger);

        await expect(
            job.addFirstName()
                .addLastName()
                .loggingDefaultingReducer()
                .failingReducer()
                .build()
        ).resolves.toEqual({ default: true });

        expect(logger.warn).toBeCalled();
        expect(logger.info).not.toBeCalled();
    });

    it('Should short circuit the execution and log to console with default level', async () => {
        const logger = {
            warn: jest.fn()
        };

        const job = fluent({
            addFirstName,
            loggingDefaultingReducerNoLogLevel,
            failingReducer,
        }, logger);

        await expect(
            job.addFirstName()
                .loggingDefaultingReducerNoLogLevel()
                .failingReducer()
                .build()
        ).resolves.toEqual({ default: true });

        expect(logger.warn).toBeCalled();
    })
})