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
