## Event bubbling

When an event happens on an element, it first runs the handlers on it, then on its parent, then all the way up on other ancestors.

[A very good, visual explanation here](https://javascript.info/bubbling-and-capturing)

To avoid unwanted side effects, always use `.stopPropagation()` on the event handler function, to stop the event from bubbling to its parents.

Use `.preventDefault()` if you need to overwrite the event default behavior for various actions (such as pressing `tab` or `ctrl`) in the browser.

## Dom rendering and script evaluation

The HTML file is evaluated line by line from the top `<html>` tag to the bottom `</html>` tag.

When accessing DOM elements in the JS / jQuery context make sure that your `<script>` is positioned after the elements you need to access.
Otherwise, the script is evaluated before the elements are registered in the DOM, and the JS engine will act like there are no such elements on the page.

_Best practice:_ Add your `<script>` before the `</body>` closing tag.

Alternatively, you can use the `$(document).ready(functionToRun)` or the shorthand version `$(functionToRun)`, which will make sure that your code is executed after the DOM was fully evaluated.

## CSS Selectors

Javascript offers basic functions to identify elements in the DOM: `document.getElementById`, `document.getElementsByClassName`, `getElementsByTagName()` and the more advanced `document.querySelector()`.

jQuery allows for more advanced CSS selectors such as:

```aidl

$('#pagination .link:first') // select the first element with the .link class from the parent element with the #pagination id
$('.link.selected') // select all the elements that have both the .lonk and the .selected class
$('header>.logo') // select elements with class .logo from any header element, as long as the .logo is a direct child (first level child)

```

## Equality vs Identity

JavaScript is a dynamic typed language. This means that a variable can be assigned multiple value types:

```aidl
var x = "JavaScript"    // x is a String
x = 14                  // x was reasigned to a Number
x = true                // x is now a Boolean

```

Due to this flexibility, it is sometimes difficult to keep track of a value type throughout a complex app.
When comparing such values, if their types is not the same, the engine will attempt to convert both values to the same type as `==` is used.
For efficiency and to avoid side effects, always compare for identity using the `===` :

```aidl
var x = '1'
var y = 1
console.log(x == y)     // will output true
console.log(x === y)    // will output false
``` 