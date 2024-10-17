class ListingStatus {
    constructor(_id, status, price, categoryCode, url) {
        this._id = _id
        this.status = status
        this.price = price
        this.categoryCode = categoryCode
        this.url = url
    }
}

modules.export = ListingStatus