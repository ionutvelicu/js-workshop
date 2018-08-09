<template>
    <h1>Order Details</h1>
</template>

<script>

export default {
    mounted () {
        console.log()
        this.getOrderDetails(this.$route.params.id)
    },

    methods: {
        getOrderDetails (id) {
        }
    }
}

</script>