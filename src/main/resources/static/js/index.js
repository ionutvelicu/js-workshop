// Domain Module
// In charge to define all available objects / domain models used in the application
// The module contains function constructors which can be called with the `new` keyword from other modules
var Domain = (function (){

    var OrderItem = function () {

    }

    var Order = function (data) {
        this.id = data.id || 'id';
        this.date = data.date || (new Date()).getTime();
        this.website = data.website;
        this.subTotal = data.subTotal;
        this.total = data.total;
        this.currency = data.currency;
        this.status = data.status;
    }

    return {
        Order: Order
    }
})()


// Html Module
// In charge of altering / modifying the DOM
// In order to maintain separation of concerns in the app, any kind of DOM change should be defined only in this module
var Html = (function () {

    var populatePagination = function (current, total) {
        current = current || 1;
        total = total || 1;

        var $pagination = $('#pagination>ul:first-child');
        var html = '';
        for (var i = 0; i < total; i++) {
            html += getPageLink(i,(i + 1 === current))
        }
        $pagination.html(html)
    }

    var populateTable = function (orders) {
        orders = orders || []
        var $orderList = $('#orderList')
        var mapOrderToRow = function (order) {
            return getOrderRow(order)
        }
        var html = orders.map(mapOrderToRow)
        $orderList.html(html)
    }

    var getPageLink = function (idx, isSelected) {
        var selected = isSelected ? 'active' : '';
        var html =
            '<li class="page-item ' + selected + '">' +
            '<a class="page-link" href="#">' +
            (idx + 1) +
            '</a></li>';
        return html;
    }

    var getOrderRow = function (order) {
        var html =
            '<tr>' +
            '<td>' + order.id + '</td>' +
            '<td>' + order.date + '</td>' +
            '<td>' + order.website + '</td>' +
            '<td>' + order.subTotal + '</td>' +
            '<td>' + order.total + '</td>' +
            '<td>' + order.status + '</td>' +
            '</tr>'
        return html;
    }

    return {
        populateTable: populateTable,
        populatePagination: populatePagination
    }
})()


// Service Module
// In charge of making async calls to the server
// This should be a thin layer that only abstracts away the Ajax logic and returns promises to be used by other modules
var Service = (function () {
    var ORDERS_PATH = '/api/orders';

    var getOrders = function (page, batch) {
        page = page || 1;
        batch = batch || 10;
        return $.get(ORDERS_PATH);
    }

    var getOrderDetails = function(id) {
        return $.get(ORDERS_PATH + '/' + id);
    }

    var updateOrderStatus = function(id, status) {
        return $.post(ORDERS_PATH + '/' + id, {
            status: status
        })
    }

    return {
        getOrders: getOrders,
        getOrderDetails: getOrderDetails,
        updateOrderStatus: updateOrderStatus
    }
})()


// App Module
// It makes use of all the other modules to handles the app flows and functionality
var App = (function () {

    var init = function () {
        var sub = Service.getOrders()

        sub.done(function (response) {
            var orders = response.orders.map(function(data){
                return new Domain.Order(data)
            })
            Html.populateTable(orders)

            var currentPage = response.currentPage
            var pageCount = response.pageCount
            Html.populatePagination(currentPage, pageCount)
        })
    }

    return {
        init: init
    }
})()


// Start app
App.init()
