## Iterate through objects keys

```aidl
var member = {
    name:   'John',
    last:   'Doe'
}

for (var keyName in member) {
    if (member.hasOwnProperty(keyName) {
        console.log(keyName + '->' + member[keyName];
    }
}
```

Make sure to use the `.hasOwnProperty()` method to iterate only over the current object keys, and avoid iterating on parent objects from the prototype chain.
You can access an object property either through dot notation: `object.key` if the key name is a known value, or through the `[]` operator if the key is dynamically defined:

```aidl
var keyName = 'name'
console.log(member[keyName])    // outputs 'John'
``` 

## Forcefully convert a value to boolean

`!value` will be evaluated to `false` if the value is truthy and to `true` if the value is falsy

`!!value` will be evaluated to `true` if the value is truthy and to `false` if the value is falsy

```aidl

!null       // evaluates to true
!!null      // evaluates to false

!'John'     // evaluates to false
!!'John'    // evaluates to true

```

## Mapping JSON to JS Objects
As a best practice, always map the JSON you are receiving from the back end, to a well defined JS object structure.

```aidl
var json1 = {
    id: '1',
    total: 20,
    items: [
        {id: '2', name: 'One'}, {id: '2', name: 'Two'}, {id: '2', name: 'Three'}
    ]
}
var json2 = {
    id: '2',
    total: undefined,
    items: [],
    adjustments: [{id: 'aa', name: null}]
}


var Adjustment = function (json) {
    this.id = json.id || '#';
    this.name = json.name || 'Adjustment';
}

var Item = function (json) {
    this.id = json.id || '#';
    this.name = json.name || 'Item';
}

var Order = function (json) {
    this.id = json.id || '#';
    this.total = json.total || 0;
    
    json.adjustments = json.adjustments || [];
    this.adjustments = jsonOrder.adjustments.map(function (json) { 
        return new Adjustment(json);
    })
        
    json.items = json.items || [];
    this.items = jsonOrder.items.map(function (json) { 
        return new Item(json);
    })
}

var Order1 = new Order(json1)
var Order2 = new Order(json2)
```

## Prototypes

In JavaScript objects can inherit state and behavior from *parent* objects by assigning the parent object to the constructor's function prototype attribute:

```aidl

var Shape = function (color, name, sides) {
    this.color = color || 'red'
    this.name = name || 'Shape'
    this.sides = sides || 0
}

var Square = function(color) {
    this.sides = 4
    this.name = 'Square'
}

var ShapeProto = new Shape()
Square.prototype = ShapeProto

var square1 = new Square()

console.log(square1.color) // outputs red
console.log(square1.__proto__ === ShapeProto) //outputs true 

```

An object created with no specific prototype, will receive `Object` as the default prototype.

You can access an object prototype via the `.__proto__` key. With `.__proto__.__proto__ ...` you can go up the prototype chain until the root _parent_ which will always be `Object`.

**Best Practice**: always define your constructor function methods in the function constructor prototype! Otherwise, each instance of your object will have a copy of your method definitions:

```aidl
var Member = function (data) {
    this.id = data.id;
    this.firstName = data.firstName || 'John';
    this.lastName = data.lastName || 'Doe';
}

Member.prototype = {}
Member.prototype.fullName = function () {
    return this.firstName + ' ' + this.lastName;
}
```