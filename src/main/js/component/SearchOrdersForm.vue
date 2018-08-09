<template>
    <div class="card">
        <div class="card-body">
            <form id="search-form">
                <h4>Search</h4>
                <div class="row">
                    <div class="form-group col">
                        <label>Id</label>
                        <input type="text" class="form-control search-field" placeholder="Id">
                    </div>
                    <div class="form-group col">
                        <label for="searchStatus">Status</label>
                        <input type="text" class="form-control search-field" id="searchStatus" data-name="status" placeholder="Status">
                    </div>
                    <div class="form-group col">
                        <label for="searchAfter">Placed after</label>
                        <input type="text" class="form-control search-field" id="searchAfter" data-name="after" placeholder="Placed after">
                    </div>
                    <div class="form-group col">
                        <label for="createdBy">Created by</label>
                        <input type="text" class="form-control search-field" id="createdBy" data-name="createdBy" placeholder="Created by">
                    </div>
                    <div class="col">
                        <a style="color: #FFF; margin-top: 2rem;"class="btn btn-primary">Search</a>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>


<script>


</script>