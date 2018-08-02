// Html Module
// In charge of altering / modifying the DOM
// In order to maintain separation of concerns in the app, any kind of DOM change should be defined only in this module
var Html = (function () {
    var orderRowTemplate = Handlebars.compile($('#order-row').html());
    var orderInfoTemplate = Handlebars.compile($('#order-info').html());

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
        $('#orderInfo').html(orderInfoTemplate({ order: order }));
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