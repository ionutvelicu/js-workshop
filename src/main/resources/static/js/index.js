// equality vs identity
// set interval / timeout


// Domain Module
// In charge to define all available objects / domain models used in the application
// The module contains function constructors which can be called with the `new` keyword from other modules
var Domain = (function (){

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

    Member.prototype.fullName = function () {
        return this.firstName + ' ' + this.lastName;
    }

    var Order = function (data) {
        this.id = data.id || 'id';
        this.date = data.date || (new Date()).getTime();
        this.website = data.website;
        this.subTotal = data.subTotal;
        this.total = data.total;
        this.currency = data.currency;
        this.status = data.status;
        this.member = new Member(data.member || {});

        data.items = data.items || []
        this.items = data.items.map(function (item) { return new Item(item) })
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
            '<a class="page-link" data-page="' + (idx + 1) + '">' +
            (idx + 1) +
            '</a></li>';
        return html;
    }

    var getOrderRow = function (order) {
        var html =
            '<tr>' +
            '<td>' + order.id + '</td>' +
            '<td><span class="badge badge-pill badge-primary">' + order.status + '</span></td>' +
            '<td>' + order.date + '</td>' +
            '<td>' + order.website + '</td>' +
            '<td class="subtotal"> &euro;' + order.subTotal + '</td>' +
            '<td class="total"> &euro;' + order.total + '</td>' +
            '<td><a class="btn btn-success btn-sm view-order" data-id="' + order.id + '">View</a></td>' +
            '</tr>'
        return html;
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


// App Module
// It makes use of all the other modules to handles the app flows and functionality
var App = (function () {
    var currentPage = 1
    var pageCount = 1

    var populateOrdersFromResponse = function (response) {
        var orders = response.orders.map(function(data){
            return new Domain.Order(data)
        })
        Html.populateTable(orders)
    }

    var renderPaginationFromResponse = function (response) {
        currentPage = response.currentPage
        pageCount = response.pageCount
        Html.populatePagination(currentPage, pageCount)
    }

    var onPageLinkClick = function (ev) {
        ev.stopPropagation()

        // this = event.target
        var $element = $(this)

        // Set HTML style
        // Commented out because of renderPaginationFromResponse function
        // $('#pagination').find('.page-item.active').removeClass('active')
        // $element.parent().addClass('active')

        // Show page results
        var page = $element.attr('data-page')

        Service.getOrders(page).done(function (response) {
            populateOrdersFromResponse(response);
            renderPaginationFromResponse(response);
        })
    }

    var onViewOrderClick = function (ev) {
        Html.showOrderDetails();

        var id = $(this).attr('data-id');
        Service.getOrderDetails(id).done(function (response) {
            var order = new Domain.Order(response)
            Html.populateOrderDetails(order)
        })
    }

    var onBackToOrderClick = function () {
        Html.showSearchOrders()
    }

    var onInputKeyDown = function (ev) {
        if (ev.target === document.body && ev.which === 9) {
            ev.preventDefault();
            currentPage = (currentPage >= pageCount) ? pageCount : currentPage + 1;
            Service.getOrders(currentPage).done(function (response) {
                populateOrdersFromResponse(response);
                renderPaginationFromResponse(response);
            })
        }
    }

    var onWindowKeyUp = function (ev) {
        var code = ev.keyCode;
        if (ev.target !== document.body && (code === 37 || code === 39)) return;

        if (code === 37 || code === 39) {
            if (code === 37) {
                currentPage = (currentPage <= 1) ? 1 : currentPage -1;
            } else if (code === 39) {
                currentPage = (currentPage >= pageCount) ? pageCount : currentPage + 1;
            }
            Service.getOrders(currentPage).done(function (response) {
                populateOrdersFromResponse(response);
                renderPaginationFromResponse(response);
            })
        }
    }

    var onChangeSearchField = function (ev) {
        var $this = $(this)
        var type = $this.attr('data-name')

        var body = {}
        body[type] = $this.val()

        Service.findOrders(body).done(function (response) {
            populateOrdersFromResponse(response)
            renderPaginationFromResponse(response)
        })

    }

    var initListeners = function () {
        $('#pagination').on('click', '.page-link', onPageLinkClick)
        $('.search-field').on('change', onChangeSearchField)
        $('#orderList').on('click', '.view-order', onViewOrderClick)
        $('#backToOrder').on('click', onBackToOrderClick)

        $(window).on('keyup', onWindowKeyUp)
        $(window).on('keydown', onInputKeyDown)
    }

    var init = function () {
        initListeners()

        var sub = Service.getOrders()

        sub.done(function (response) {
            populateOrdersFromResponse(response)
            renderPaginationFromResponse(response)
        })
    }

    return {
        init: init
    }
})()

// Start app
App.init()
