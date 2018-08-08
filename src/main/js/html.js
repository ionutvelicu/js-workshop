const appPaginationTemplate = `
        <div id="pagination" style="margin-top: 2rem; display: flex">
            <ul class="pagination" style="margin: 0 auto;">
                <li class="page-item" :class="{ active: page === currentPage }" v-for="page in pageCount">
                    <a class="page-link" @click="onPageClick(page)">{{page}}</a>
                </li>
            </ul>
        </div>`

export default {
    appPaginationTemplate
}