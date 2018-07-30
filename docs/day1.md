## Truthy / Falsy values

Truthy values are values that is considered true when evaluated to boolean.

Falsy values: `false`, `0`, `empty string`, `null`, `undefined`, `NaN` (the result of dividing by 0)

Truthy values: anything that's not falsy :)

```$xslt
var x = !false;      // evaluates to true
var y = !0;          // evaluates to true
var yy = !1;         // evaluates to false
var z = !'';         // evaluates to true
var zz = !'A';       // evaluates to false
var t = !null;       // evaluates to true
```

## Immediately-invoked Function Expression (IIFE)

A function that is executed immediately after definition in order to define a private scope from which only the necessary function / variables can be exported.

Reminder: When you are using `var` In JavaScript the scope is evaluated at the function level.

**Hoisting:** When using `var` all variable declarations are "pushed" to the top of the function before any other evaluation happens.

```$xslt
var App = (function () {
    var privateVariable = 'private';
    var publicVariable = 'public';
    
    return {
        publicVariable: publicVariable
    }
})()

console.log(App.publicVariable);        // prints "public"
console.log(App.privateVariable);       // prints "undefined"

```

## Object creation

There are two main ways to define object in Javascript:

###### Constructor functions
A constructor function is a simple function which can assign values to the `this` keyword pointing to the resulting object reference.

As a good practice, constructor functions will be capitalized.

Best used for model / domain instances received from the server, where a degree of constraint is needed.

```$xslt
var Person = function (firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.fullName = function () {
        return this.firstName + ' ' + this.lastName;
    }
}

var john = new Person('John', 'Doe');
console.log(john.fullName());
```

###### Object Literal
Dictionary like construct easier to use for one-off type objects - such as modules where the object constructor is needed, but the structure is not fixed.

```$xslt

var App = {
    getOrders: function () { ... },
    getOrderDetails: function () { ... },
    removeOrder: function () { ... }
}
```
