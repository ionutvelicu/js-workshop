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
        Store.activeOrderId = id
        Service.getOrderDetails(id).done(function (response) {
            var order = new Domain.Order(response);
            Html.populateOrderDetails(order);
        })
    }

    var onBackToOrderClick = function () {
        initOrders()
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

    var onShowStatusEditBlockClick = function () {
        $('#statusLabelBlock').hide()
        $('#statusEditBlock').show()
    }

    var onSaveNewStatusClick = function () {
        var status = $('#statusField').val()
        Service.updateOrderStatus(Store.activeOrderId, status).done(function () {
            Service.getOrderDetails(Store.activeOrderId).done(function (response) {
                var order = new Domain.Order(response);
                Html.populateOrderInfo(order);
            })
        })

        $('#statusLabelBlock').show()
        $('#statusEditBlock').hide()
    }

    var onStatusFieldKeyup = function (ev) {
        var val = ev.target.value
        var suggestions = []
        if (val.length > 0) {
            suggestions = Store.statuses.filter(function (status) {
                return status.indexOf(val) > -1
            })
        }
        Html.populateStatusSuggestionList(suggestions)
    }

    var onStatusSuggestionClick = function () {
        var status = $(this).attr('data-text')
        $('#statusField').val(status)
    }

    var initListeners = function () {
        $('#pagination').on('click', '.page-link', onPageLinkClick)
        $('.search-field').on('change', onChangeSearchField)
        $('#orderList').on('click', '.view-order', onViewOrderClick)
        $('#backToOrder').on('click', onBackToOrderClick)

        $('#orderInfo').on('click', '#showStatusEditBlock', onShowStatusEditBlockClick)
        $('#orderInfo').on('click', '#saveNewStatus', onSaveNewStatusClick)
        $('#orderInfo').on('keyup', '#statusField', onStatusFieldKeyup)
        $('#orderInfo').on('click', '.status-suggestion', onStatusSuggestionClick)

        $('body').on('click', function () {
            $('.dropdown-menu').removeClass('show')
        })

        $(window).on('keyup', onWindowKeyUp)
        $(window).on('keydown', onInputKeyDown)
    }

    var initOrders = function () {
        Service.getOrders().done(function (response) {
            populateOrdersFromResponse(response)
            renderPaginationFromResponse(response)
        })
    }

    var init = function () {
        initListeners()
        initOrders()

        Service.getStatuses().done(function (response) {
            Store.statuses = response
        })
    }

    return {
        init: init
    }
})()

// Start app
App.init()