module.exports = function Cart(oldCart){
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item, id){
        var storedItem = this.items[id];
        if(!storedItem){
            this.items[id] = {
                item: item,
                qty: 0,
                price: 0
            };
            storedItem = this.items[id];
        }
        storedItem.qty++;
        //console.log('item:');
        //console.log(storedItem.item);
        storedItem.price += storedItem.item.ticketPrice;// * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.ticketPrice;
    };

    //

    this.reduceByOne = function(id) {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.ticketPrice;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.ticketPrice;

        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
    };

    this.removeItem = function(id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };

    //

    this.generateArray = function(){
        var arr = [];
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    };
};