// App Module
// It makes use of all the other modules to handles the app flows and functionality

// https://facebook.github.io/flux/docs/overview.html

import 'regenerator-runtime/runtime'

import Service from './service'
import Domain from './domain'
import Html from './html'
import Store from './store'

let currentPage = 1
let pageCount = 1

const populateOrdersFromResponse = (response) => {
    let orders = response.orders.map(data => new Domain.Order(data))
    Html.populateTable(orders)
}

const renderPaginationFromResponse = (response) => {
    currentPage = response.currentPage
    pageCount = response.pageCount
    Html.populatePagination(currentPage, pageCount)
}

const onPageLinkClick = function (ev) {
    ev.stopPropagation()

    // this = event.target
    const $element = $(this)

    // Set HTML style
    // Commented out because of renderPaginationFromResponse function
    // $('#pagination').find('.page-item.active').removeClass('active')
    // $element.parent().addClass('active')

    // Show page results
    const page = $element.attr('data-page')

    Service.getOrders(page).done((response) => {
        populateOrdersFromResponse(response)
        renderPaginationFromResponse(response)
    })
}

const onViewOrderClick = async function (ev) {
    Html.showOrderDetails();

    const id = $(this).attr('data-id');
    Store.activeOrderId = id

    const response = await Service.getOrderDetails(id)
    Html.populateOrderDetails(new Domain.Order(response))
}

const onBackToOrderClick = () => {
    initOrders()
    Html.showSearchOrders()
}

const onInputKeyDown = (ev) => {
    if (ev.target === document.body && ev.which === 9) {
        ev.preventDefault();
        currentPage = (currentPage >= pageCount) ? pageCount : currentPage + 1;
        Service.getOrders(currentPage).done(response => {
            populateOrdersFromResponse(response);
            renderPaginationFromResponse(response);
        })
    }
}

const onWindowKeyUp = (ev) => {
    const code = ev.keyCode;
    if (ev.target !== document.body && (code === 37 || code === 39)) return;

    if (code === 37 || code === 39) {
        if (code === 37) {
            currentPage = (currentPage <= 1) ? 1 : currentPage -1;
        } else if (code === 39) {
            currentPage = (currentPage >= pageCount) ? pageCount : currentPage + 1;
        }
        Service.getOrders(currentPage).done(response => {
            populateOrdersFromResponse(response);
            renderPaginationFromResponse(response);
        })
    }
}

const onChangeSearchField = function (ev) {
    const $this = $(this)
    const type = $this.attr('data-name')

    const body = {}
    body[type] = $this.val()

    Service.findOrders(body).done((response) => {
        populateOrdersFromResponse(response)
        renderPaginationFromResponse(response)
    })
}

const onShowStatusEditBlockClick = () => {
    $('#statusLabelBlock').hide()
    $('#statusEditBlock').show()
}

const onSaveNewStatusClick = async () => {
    const status = $('#statusField').val()

    await Service.updateOrderStatus(Store.activeOrderId, status)
    const response = await Service.getOrderDetails(Store.activeOrderId)

    const order = new Domain.Order(response)
    Html.populateOrderInfo(order)

    $('#statusLabelBlock').show()
    $('#statusEditBlock').hide()
}

const onStatusFieldKeyup = (ev) => {
    const val = ev.target.value
    let suggestions = []
    if (val.length > 0) {
        suggestions = Store.statuses.filter((status) => {
            return status.indexOf(val) > -1
        })
    }
    Html.populateStatusSuggestionList(suggestions)
}

const onStatusSuggestionClick = function () {
    const status = $(this).attr('data-text')
    $('#statusField').val(status)
}

const initListeners = () => {
    $('#pagination').on('click', '.page-link', onPageLinkClick)
    $('.search-field').on('change', onChangeSearchField)
    $('#orderList').on('click', '.view-order', onViewOrderClick)
    $('#backToOrder').on('click', onBackToOrderClick)

    $('#orderInfo').on('click', '#showStatusEditBlock', onShowStatusEditBlockClick)
    $('#orderInfo').on('click', '#saveNewStatus', onSaveNewStatusClick)
    $('#orderInfo').on('keyup', '#statusField', onStatusFieldKeyup)
    $('#orderInfo').on('click', '.status-suggestion', onStatusSuggestionClick)

    $('body').on('click', () =>  $('.dropdown-menu').removeClass('show'))

    $(window).on('keyup', onWindowKeyUp)
    $(window).on('keydown', onInputKeyDown)
}

const initOrders = () => {
    Service.getOrders().done(function (response) {
        populateOrdersFromResponse(response)
        renderPaginationFromResponse(response)
    })
}

const init = () => {
    // initListeners()
    // initOrders()
    //
    // Service.getStatuses().done(response => Store.statuses = response)

    Vue.component('app-pagination', {
        template: Html.appPaginationTemplate,

        props: ['pageCount', 'currentPage'],

        methods: {
            onPageClick (page) {
                this.$emit('changed', page)
            }
        }
    })

    const app = new Vue({
        el: '#app',

        data: {
            orders: [],
            pageCount: 1,
            currentPage: 1,

            searchByIdField: ''
        },

        created () {
            this.populateOrdersForPage(1)

        },

        methods: {
            populateOrdersForPage (page) {
                Service.getOrders(page).done((response) => {
                    this.orders = response.orders.map(data => new Domain.Order(data))
                    this.pageCount = response.pageCount
                    this.currentPage = response.currentPage
                })
            },

            onPageClick (page) {
                this.populateOrdersForPage(page)
                this.searchByIdField = ''
            },

            updateSearchField (ev) {
                this.searchByIdField = ev.target.value
            },

            doSearch () {
            }
        }
    })
}

// Start app
init()