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


## let / const


## Arrow functions


## async / await