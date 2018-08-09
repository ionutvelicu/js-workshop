<template>
    <div class="row">
        <div class="col">
            <search-orders-form></search-orders-form>

            <table class="table" style="margin-top: 2rem">
                <thead>
                    <tr>
                        <th scope="col">#ID</th>
                        <th scope="col">Status</th>
                        <th scope="col">Created</th>
                        <th scope="col">Website</th>
                        <th scope="col" class="subtotal">Subtotal</th>
                        <th scope="col" class="total">Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <order-list-item v-for="order in orders" :order="order" :key="order.id"></order-list-item>
                </tbody>
            </table>
            <order-pagination :page-count="pageCount" :current-page="currentPage" v-on:changed="onPageClick"></order-pagination>
        </div>
    </div>
</template>

<script>
import SearchOrdersForm from './SearchOrdersForm.vue'
import OrderListItem from './OrderListItem.vue'
import OrderPagination from './OrderPagination.vue'

import orderService from '../service/orderService'
import domain from '../domain'

export default {
    components: { SearchOrdersForm, OrderListItem, OrderPagination },

    data: () => {
        return {
            orders:         [],
            pageCount:      1,
            currentPage:    1
        }
    },

    created () {
        this.populateOrdersForPage(1)
    },

    methods: {
        populateOrdersForPage (page) {
            orderService.getOrders(page).done(response => {
                this.orders = response.orders.map(data => new domain.Order(data))
                this.pageCount = response.pageCount
                this.currentPage = response.currentPage
            })
        },

        onPageClick (page) {
             this.populateOrdersForPage(page)
        },
    }

}

</script>