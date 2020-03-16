# async-fluent

A library that lets you chain `async` functions.


## Idea
The idea behing this is that you'd have a _state_, which you want to mutate. 

`async-fluent` allows you to pass that state through a pipeline of async pure functions using the __builder pattern__

## Examples (WIP)
```js
const getFirstName = async state => ({ ... state, firstName: 'firstName' })
const getLastName = async state => ({ ... state, lastName: 'lastName' })

const pipeline = fluent({ getFirstName, getLastName })

const user = await pipeline
    .getFirstName()
    .getLasName()
    .build()

console.log(user)
// The output is exactly what you'd expect
```