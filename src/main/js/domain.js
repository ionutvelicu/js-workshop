// Domain Module
// In charge to define all available objects / domain models used in the application
// The module contains function constructors which can be called with the `new` keyword from other modules
var Item = function (data) {
    this.id = data.productId;
    this.price = data.price;
    this.name = data.name;
    this.quantity = data.quantity
}

var Member = function (data) {
    this.id = data.id;
    this.firstName = data.firstName || 'John';
    this.lastName = data.lastName || 'Doe';
}

Member.prototype = {}
Member.prototype.fullName = function () {
    return this.firstName + ' ' + this.lastName;
}

var Order = function (data) {
    this.id = data.id || 'id';
    this.date = moment(data.date).format('HH:mm, DD')
    this.website = data.website;
    this.subTotal = data.subTotal;
    this.total = data.total;
    this.currency = data.currency;
    this.status = data.status;
    this.member = new Member(data.member || {});

    data.items = data.items || []
    this.items = data.items.map(function (item) { return new Item(item) })
}

export default {
    Order: Order
}
