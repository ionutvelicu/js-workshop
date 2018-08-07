## Virtual DOM
The Virtual DOM is an abstraction of the HTML DOM. It is lightweight and detached from the browser-specific implementation details. 
Since working with the actual DOM can be slow / cumbersome, this abstractions allow algorithms to figure out in a more efficient manner when and how the actual DOM has to be updated.


## One way / Two way data binding

In most frameworks, both options are available.

- Two way data binding - the view / template can directly change the state (through form events such as field changes)
- One way data binding - the state can be changed only from the JavsScript context. The component would listen to form input changes, and will decide if the state should be updated or not.

When possible, use the one way binding approach since it is less error prone.

## Vue.js

[Vue.js](https://vuejs.org/)

Easy to use & lightweight framework that can be dropped in as a <script> and doesn't require any compilation step.

```aidl

<div id ="app"></div>


const app = new Vue({
    el: '#app',     // the DOM element which will be considered by Vue the "template"
    
    data: {         // the state - Vue will keep track of all changes in this object, and update the template when necessary
        orders: []
    }                
    
    created () {    // method called once, when the Vue instance is created
        this.populateOrdersForPage(1)
    }
    
    methods: {      // the behavior - can be called from anywhere in the Vue instance, or from the template
        populateOrdersForPage (page) {
            Service.getOrders(page).done((response) => {
                this.orders = response.orders.map(data => new Domain.Order(data))
            })
        },

        onPageClick (page) {
            this.populateOrdersForPage(page)
        },
    }
})

```

## Flux
[The Flux / Redux pattern](https://facebook.github.io/flux/docs/overview.html)


