<template>
    <div id="pagination" style="margin-top: 2rem; display: flex">
        <ul class="pagination" style="margin: 0 auto;">
            <li class="page-item" :class="{ active: page === currentPage }" v-for="page in pageCount">
                <a class="page-link" @click="onPageClick(page)">{{page}}</a>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: ['pageCount', 'currentPage'],

    methods: {
        onPageClick(page) {
            this.$emit('changed', page)
        }
    }
}
</script>