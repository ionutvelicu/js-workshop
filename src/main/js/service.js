// Service Module
// In charge of making async calls to the server
// This should be a thin layer that only abstracts away the Ajax logic and returns promises to be used by other modules

const ORDERS_PATH = '/api/orders';
const STATUSES_PATH = '/api/statuses';

const getOrders = function (page, batch) {
    page = page || 1;
    batch = batch || 5;
    return $.get(ORDERS_PATH, { page: page, batch: batch});
}

const getOrderDetails = async function(id) {
    return $.get(ORDERS_PATH + '/' + id);
}

const findOrders = function (body) {
    return $.get(ORDERS_PATH + '/find', body);
}

const getStatuses = function () {
    return $.get(STATUSES_PATH);
}

const updateOrderStatus = async function (id, status) {
    return $.ajax({
        type: 'PUT',
        url: ORDERS_PATH + '/' + id,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ status: status }),
    });
}

export default {
    getOrders,
    getOrderDetails,
    updateOrderStatus,
    findOrders,
    getStatuses
}
