// Store Module
// Share data between modules

var Store = (function () {
    var statuses = []
    var activeOrderId = ''

    return {
        statuses: statuses,
        activeOrderId: activeOrderId
    }
})()