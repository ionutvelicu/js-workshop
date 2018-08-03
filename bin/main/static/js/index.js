// equality vs identity
// set interval / timeout


// Domain Module
// In charge to define all available objects / domain models used in the application
// The module contains function constructors which can be called with the `new` keyword from other modules
var Domain = (function (){

	var Adjustemnts = function (data) {
		this.amount = data.amount || 0;
		this.type = data.type || '';
	}
	
	var Item = function (data) {
		this.isPromo = data.isPromo || false
		this.name = data.name || '';
		this.price = data.price || 0;
		this.productId = data.productId || '';
		this.quantity = data.quantity || 0;
		this.squence = data.sequence || 0;
	}
	
	var Member = function (data) {
		this.firstName = data.firstName || '';
		this.lastName = data.lastName || '';
		this.id = data.id || '';
	}
	
    var OrderDetail = function (data) {
    	data.adjustments = data.adjustments || [];
    	this.adjustments =  data.adjustments.map(function (data) {
    		return new Adjustemnts(data);
    	});
    	
    	data.items = data.items || [];
    	this.items = data.items.map(function (data) {
    		return new Item(data);
    	});
    	
    	data.member = data.member || {};
    	this.member = new Member(data.member);
    	
    	this.status = data.status ||'';
    	this.subTotal = data.subTotal || 0;
    	this.total = data.total || 0;
    	this.website = data.website || '';
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
        Order: Order,
        OrderDetail: OrderDetail
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
    
    var populateClientDetails = function (orderDetails) {
        
    	$clientDetails = $("#clientDetails");
    	
    	var html =
            '<tr>' +
            '<td>First Name</td>' +
            '<td>' + orderDetails.member.firstName + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Last Name</td>' +
            '<td>' + orderDetails.member.lastName + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>ID</td>' +
            '<td>' + orderDetails.member.id + '</td>' +
            '</tr>';
    	
        $clientDetails.html(html);
    }
    
    var populateItemDetails = function (orderDetails) {    	
    	$itemDetails = $("#itemDetails");
    	var html = orderDetails.items.map(function (orderItem) {
    		return populateItemRow(orderItem);
    	});
    	$itemDetails.html(html);        
    }
    
    var populateItemRow = function (orderItem) {
    	var html =
            '<tr>' +
            '<td>' + orderItem.productId + '</td>' +
            '<td>' + orderItem.name + '</td>' +
            '<td>' + orderItem.price + '</td>' +
            '<td>' + orderItem.quantity + '</td>' +
            '<td>' + orderItem.isPromo + '</td>' +
            '</tr>'
        return html;
    }

    var toggleOrderDetails = function () {
    	$("#orderSearch").toggle();
    	$("#orderDetails").toggle();    	
    }
    
    return {
        populateTable: populateTable,
        populatePagination: populatePagination,
        toggleOrderDetails: toggleOrderDetails,
        populateClientDetails: populateClientDetails,
        populateItemDetails: populateItemDetails
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
    var currentPage = 1;
    var pageCount = 1;
    var searchParams = {};

    var populateOrderDetails = function (response) {
    	var orderDetail = new Domain.OrderDetail(response);
    	console.log(orderDetail);
    	Html.populateClientDetails(orderDetail);
    	Html.populateItemDetails(orderDetail);
    	
    }
    
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
            populateOrdersFromResponse(response)
            renderPaginationFromResponse(response)
        })
    }

    var onViewOrderClick = function (ev) {
    	var $orderButton = $(this);
    	var orderId = $orderButton.attr('data-id');
        Html.toggleOrderDetails();
        
        Service.getOrderDetails(orderId).done(populateOrderDetails);
    }

    var onInputKeyDown = function (ev) {
        if (ev.target === document.body && ev.which === 9) {
            ev.preventDefault()
            currentPage = (currentPage >= pageCount) ? pageCount : currentPage + 1
            Service.getOrders(currentPage).done(function (response) {
                populateOrdersFromResponse(response)
                renderPaginationFromResponse(response)
            })
        }
    }

    var onWindowKeyUp = function (ev) {
        var code = ev.keyCode
        if (ev.target !== document.body && (code === 37 || code === 39)) return

        if (code === 37 || code === 39) {
            if (code === 37) {
                currentPage = (currentPage <= 1) ? 1 : currentPage -1
            } else if (code === 39) {
                currentPage = (currentPage >= pageCount) ? pageCount : currentPage + 1
            }
            Service.getOrders(currentPage).done(function (response) {
                populateOrdersFromResponse(response)
                renderPaginationFromResponse(response)
            })
        }
    }

    var onChangeSearchField = function (ev) {
        var $this = $(this)
        var type = $this.attr('data-name')

        if (!!$this.val()) {
        	searchParams[type] = $this.val()
        } else if (!!searchParams[type]) {
        	delete searchParams[type];
        }

        Service.findOrders(searchParams).done(function (response) {
            populateOrdersFromResponse(response)
            renderPaginationFromResponse(response)
        })

    }

    var initListeners = function () {
        $('#pagination').on('click', '.page-link', onPageLinkClick)
        $('.search-field').on('change', onChangeSearchField)
        $('#orderList').on('click', '.view-order', onViewOrderClick)        
        $('#backToSearch').on('click', Html.toggleOrderDetails)

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
