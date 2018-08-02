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