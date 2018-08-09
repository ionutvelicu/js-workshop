<template>
    <tr>
        <td>{{order.id}}</td>
        <td><span class="badge badge-pill badge-primary">{{order.status}}</span></td>
        <td>{{order.date}}</td>
        <td>{{order.website}}</td>
        <td class="subtotal"> &euro; {{order.subTotal}}</td>
        <td class="total"> &euro;{{order.total}}</td>
        <td>
            <router-link class="btn btn-success btn-sm" :to="`/orders/${order.id}`">View</router-link>
        </td>
    </tr>
</template>

<script>
export default {
    props: ['order'],
}
</script>