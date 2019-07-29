const { fluent } = require('..');

describe("Fluid interface test", () => {

    it("Should execute some sync things", async () => {
        const addLastName = state => ({
            ...state,
            lastName: 'stojkovski'
        })

        const addFirstName = state => ({
            ...state,
            firstName: 'darko'
        })


        const executor = fluent({ addFirstName, addLastName })
        const res = await executor.addFirstName().addLastName().build()

        expect(res).toEqual({
            firstName: 'darko',
            lastName: 'stojkovski'
        })
    })

    it("Should execute some async things", async () => {
        const addLastName = async state => ({
            ...state,
            lastName: 'stojkovski'
        })

        const addFirstName = async state => ({
            ...state,
            firstName: 'darko'
        })

        const executor = fluent({ addFirstName, addLastName })
        const res = await executor.addFirstName().addLastName().build()

        expect(res).toEqual({
            firstName: 'darko',
            lastName: 'stojkovski'
        })
    })

    it("Should execute a mix of sync/async things", async () => {
        const addLastName = async state => ({
            ...state,
            lastName: 'stojkovski'
        })

        const addFirstName = state => ({
            ...state,
            firstName: 'darko'
        })

        const executor = fluent({ addFirstName, addLastName })
        const res = await executor.addFirstName().addLastName().build()

        expect(res).toEqual({
            firstName: 'darko',
            lastName: 'stojkovski'
        })
    })

});