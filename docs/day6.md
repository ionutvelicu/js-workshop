## Webpack

[Visit webpack website](https://webpack.js.org/)
Webpack it is, among others, a package manager that helps converting es6 module structured code into browser compatible code.
With a minimum configuration, Webpack will bundle all code modules (personal and from npm) into a file distribution file.
Loaders (such as babel loader) can be hooked up into the configuration in order to perform various transformations to the code (such as linting, or transpiling ES6+ into browser compatible)

## Babel
[Visit babel website](https://babeljs.io/)
A tool that allows you to ue the latest ECMAScript features, and transpiles them into code safe to run on most browsers.

## ES6 modules
ES6 allows better code structuring via modules. 
1. Each file is a module;
2. Anything that is not exported will be private to that module;

```aidl
/* service.js module */

const privateFunc = function () { ... }

export const publicFunc = function () { ... }

const const thirdPublicFunc = function () { ... }

export default {
    thirdPublicFunc: thirdPublicFunc
}
```

- To import a classic export: `import { publicFunc } from './service'` - the `{}` are important.
- To import the `default` export: `import Service from './service'` - the default exported object literal is assigned to the `Service`
- To import personal modules use relative paths: `import Service from './service'`.
- To import 3rd party libraries, use absolute imports: `import $ from 'jquery'`.


## ES6 classes

With ES6, classes can be defined using more familiar constructors:

```aidl

class Member {
    constructor (data) {
        this.firstName = data.first
        this.lastName = data.last
    }
    
    get initials () {
        return this.firstName[0] + this.lastName[0]
    }
    
    fullName () {
        return this.firstName + ' ' + this.lastName
    }
}

const john = new Member({ first: 'John', last: 'Doe' })

console.log(john.initials)      // Will output JD
console.log(john.fullName())    // Will output John Doe

```

- getters (such as `initials`) can be called without the function call operand `()`
- methods defined in calsses will be automatically attached to the function prototype


## let / const
In ES6 always use `let` and `const` instead of `var`.

This will allow you to avoid the usual scoping issues, where variable scope is handled at the function level, and where variable declarations are hoisted to the top of the function.

## Arrow functions
Arrow functions will always bound the `this` keyword to the object the function is associated with. If the function is not associated with an object, `this` will be evaluated to `undefined` in an arrow function.

```aidl

const numbers = [1, 2, 3]
const squares = numbers.map(no => no ** no)

```

## async / await

In order to avoid callback hell (multiple nested callback functions) `async + await` were introduced.
These allow you to rewrite asynchronous code in a synchronous / sequential way.

```aidl
Service.updateMember(memberId).done(function (response) {
    Service.getMemberDetails(memberId).done(function (details) {
        Service.getMemberOrder(details.orderId).done(function (order) {
            console.log(order.status)
        })
    })
});

await Service.updateMember(memberId)
const details = await Service.getMemberDetails(memberId)
const order = await Service.getMemberOrder(memberId)
```

Two main rules:

1.Any function that contains an `await` keyword has to be marked as `async`: 
```aidl

const updateMember = async function () { return <Promise> }

```

2.In order to be able to `await` a function, that function has to be marked as async.
