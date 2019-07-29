
function _defaultValue(val, msg, level) {
    this.val = val
    this.msg = msg
    this.level = level
}

const defaultValue = (val, msg, level) => Promise.reject(new _defaultValue(val, msg, level));

const logIfMsg = (e, logger) => {
    if (!e.msg) {
        return;
    }

    const level = e.level || 'warn';
    logger[level](e.msg);
}

const catcher = logger => (e) => {
    if (!_defaultValue.prototype.isPrototypeOf(e)) {
        return Promise.reject(e);
    }

    logIfMsg(e, logger);

    return Promise.resolve(e.val);
}

const unfoldReducers = (reducers, logger) => () => reducers.catch(catcher(logger))
const mapValues = (obj, mapper) => Object.entries(obj)
    .reduce((obj, [key, val]) => ({
        ...obj,
        [key]: mapper(val),
    }), {})

const fluent = (userHandlers, logger = console) => {
    const sequencer = (reducers = Promise.resolve()) => ({
        ...mapValues(userHandlers, fn => () => sequencer(reducers.then(fn))),
        build: unfoldReducers(reducers, logger)
    });


    return sequencer();
}

module.exports = {
    fluent,
    defaultValue
}
