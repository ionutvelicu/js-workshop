// App Module
// It makes use of all the other modules to handles the app flows and functionality

import 'regenerator-runtime/runtime'

import Service from './service'
import Domain from './domain'
import Store from './store'
import Html from './html'

const initComponents = () => {
    Vue.component('app-pagination', {
        template: Html.appPaginationTemplate,

        props: ['pageCount', 'currentPage'],

        methods: {
            onPageClick (page) {
                this.$emit('changed', page)
            }
        }
    })
}

const init = () => {
    initComponents()

    const App = new Vue({
        el: '#app',

        data: {
            orders:                 [],
            pageCount:              1,
            currentPage:            1,

            newStatus:              '',
            suggestions:            [],
            view:                   'orders',
            activeOrder:            null,

            isChangeStatusToggled:  false
        },

        created () {
            this.populateOrdersForPage(1)
            this.initListeners()
            this.handleRoute()
            Service.getStatuses().done(response => Store.statuses = response)
        },

        methods: {
            initListeners () {
                window.onpopstate = history.onpushstate = () => {
                    this.handleRoute()
                }
            },

            handleRoute () {
                const path = window.location.pathname
                if (path === '/') {
                    this.view = 'orders'
                } else if (path.indexOf('/orders/') > -1) {
                    this.viewOrderDetails(path.replace('/orders', ''))
                }
            },

            populateOrdersForPage (page) {
                Service.getOrders(page).done((response) => {
                    this.orders = response.orders.map(data => new Domain.Order(data))
                    this.pageCount = response.pageCount
                    this.currentPage = response.currentPage
                })
            },

            onPageClick (page) {
                this.populateOrdersForPage(page)
            },

            viewOrderDetails (orderId) {
                this.view = 'details'
                const path = window.location.pathname
                if (path.indexOf(orderId) === -1) {
                    window.history.pushState(null, '', `/orders/${orderId}`)
                }

                Service.getOrderDetails(orderId).done((response) => {
                    this.activeOrder = new Domain.Order(response)
                })
            },

            goToOrders () {
                if (window.history.length > 1) {
                    window.history.back()
                } else {
                    window.history.pushState(null, '', '/')
                }

            },

            toggleChangeStatus () {
                this.isChangeStatusToggled = !this.isChangeStatusToggled
            },

            saveNewStatus () {
                Service.updateOrderStatus(this.activeOrder.id, this.newStatus)
                this.activeOrder.status = this.newStatus
                this.isChangeStatusToggled = !this.isChangeStatusToggled
            },

            onStatusKeyup (ev) {
                const val = ev.target.value
                this.suggestions = Store.statuses.filter((status) => {
                    return status.indexOf(val) > -1
                })
                this.newStatus = val
            },

            selectSuggestion (suggestion) {
                this.newStatus = suggestion
                this.suggestions = []
            }
        }
    })
}

// Start app
init()