// App Module
// It makes use of all the other modules to handles the app flows and functionality

import Vue from 'vue'
import VueRouter from 'vue-router'
import OrderList from './component/OrderList.vue'
import OrderDetails from './component/OrderDetails.vue'
import AppHeader from './component/AppHeader.vue'

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
        { path: '/', component: OrderList },
        { path: '/orders/:id', component: OrderDetails }
    ]
})

new Vue({

    components: { AppHeader },

    router

}).$mount('#app')