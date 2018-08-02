// Html Module
// In charge of altering / modifying the DOM
// In order to maintain separation of concerns in the app, any kind of DOM change should be defined only in this module
var Html = (function () {
    var orderRowTemplate = Handlebars.compile($('#order-row').html());

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
            '<a class="page-link" data-page="' + (idx + 1) + '">' +
            (idx + 1) +
            '</a></li>';
        return html;
    }

    var getOrderRow = function (order) {
        return orderRowTemplate(order)
    }

    var showOrderDetails = function () {
        $('#searchOrders').hide()
        $('#orderDetails').show()
    }

    var showSearchOrders = function () {
        $('#searchOrders').show()
        $('#orderDetails').hide()
    }

    var populateOrderDetails = function (order) {
        populateOrderInfo(order)
        populateOrderItems(order.items)
    }

    var populateOrderInfo = function (order) {
        var html = '';
        html += '<tr><td>ID</td><td>' + order.id + '</td></tr>';
        html += '<tr><td>Author</td><td>' + order.member.fullName() + '</td></tr>';
        html += '<tr><td>Status</td><td>' + order.status + '</td></tr>';
        html += '<tr><td>Website</td><td>' + order.website + '</td></tr>';
        html += '<tr><td class="subtotal">Subtotal</td><td class="subtotal">' + order.subTotal + '</td></tr>';
        html += '<tr><td class="total">Total</td><td class="total">' + order.total + '</td></tr>';
        $('#orderInfo').html(html);
    }

    var populateOrderItems = function (items) {
        var html = items.map(function (item) {
            var snippet = '';

            snippet += '<tr>';
            snippet += '<td>' + item.id + '</td>';
            snippet += '<td>' + item.name + '</td>';
            snippet += '<td>' + item.quantity + '</td>';
            snippet += '<td class="total">' + item.price + '</td>';
            snippet += '</tr>';

            return snippet;
        }).join()
        $('#orderItems').html(html)
    }

    return {
        populateTable:          populateTable,
        populatePagination:     populatePagination,
        showOrderDetails:       showOrderDetails,
        showSearchOrders:       showSearchOrders,
        populateOrderDetails:   populateOrderDetails
    }
})()


// Service Module
// In charge of making async calls to the server
// This should be a thin layer that only abstracts away the Ajax logic and returns promises to be used by other modules
var Service = (function () {
    var ORDERS_PATH = '/api/orders';

    var getOrders = function (page, batch) {
        page = page || 1;
        batch = batch || 5;
        return $.get(ORDERS_PATH, { page: page, batch: batch});
    }

    var getOrderDetails = function(id) {
        return $.get(ORDERS_PATH + '/' + id);
    }

    var updateOrderStatus = function(id, status) {
        return $.post(ORDERS_PATH + '/' + id, {
            status: status
        })
    }

    var findOrders = function (body) {
        return $.get(ORDERS_PATH + '/find', body);
    }

    return {
        getOrders: getOrders,
        getOrderDetails: getOrderDetails,
        updateOrderStatus: updateOrderStatus,
        findOrders: findOrders
    }
})()
