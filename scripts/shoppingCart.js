export class ShoppingCart {
    storageKey = 'shopping_cart';
    items = [];

    constructor() {
        this.load();
    }

    addItem(type, id, price, size, amount, callback) {
        const newItem = {
            type: type,
            id: id,
            price: price,
            amount: amount,
            size: size
        };

        const duplicate = this.checkForDuplicate(newItem);
        if(duplicate !== null) {
            this.items[duplicate].amount += newItem.amount;
        } else {
            this.items.push(newItem);
        }
        this.save();

        if(typeof callback === 'function') {
            callback(this);
        }
    }

    removeItem(itemIndex, callback) {
        this.items.splice(itemIndex, 1);
        this.save();

        if(typeof callback === 'function') {
            callback(this);
        }
    }

    load() {
        if(localStorage.getItem(this.storageKey) === null) {
            this.items = [];
        } else {
            this.items = JSON.parse(localStorage[this.storageKey]);
        }
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    }

    checkForDuplicate(newItem) {
        for(let i=0; i<this.items.length; i++) {
            if(this.items[i].id === newItem.id && this.items[i].size === newItem.size) {
                return i;
            }
        }
        return null;
    }
}