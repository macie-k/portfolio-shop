import {$, cart, showCartBubble} from './common.js';
import {NoticeBox} from './noticebox.js';

const cartItems = [];
const prices = {};
const EMAIL_REGEX = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

window.addEventListener('load', async function() {
        await loadItems(cart.items);
        addEvents();
        setTotalPrice();
});

function validateEmail(element, changeBorder=true) {
    const value = element.value;
    const filled = value.length !== 0;
    const valid = EMAIL_REGEX.test(value) && filled;

    if(changeBorder) {
        if(valid || !filled) {
            element.parentNode.classList.remove('invalid');
        } else {
            element.parentNode.classList.add('invalid');
        }
    }
    if(valid) {
        $('.input[type=submit]').removeAttribute('disabled');
    } else {
        $('.input[type=submit]').disabled = 'disabled';
    }
}

async function loadItems(items) {
    const container = $('#cart-items');

    let counter = 1;
    items.forEach(item => {
        const id = item.id;
        const price = item.price;
        const size = item.size;
        const type = item.type.charAt(0).toUpperCase() + item.type.slice(1);
        const amount = item.amount;

        const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.dataset.id = id;
            cartItem.id = `item-${counter++}`;
            cartItem.innerHTML = `
                <div class="cart-description">
                    <a href="./prints/p/${id}" target="_blank">
                        <img class="cart-thumb" src="https://i.imgur.com/${id}m.jpg">
                    </a>
                    <div class="cart-info">
                        <div class="cart-info-type">${type}</div>
                        <div class="cart-info-size">${size}</div>
                    </div>
                </div>
                <div class="cart-quantity">
                    <input class="cart-quantity-count" type="number" value="${amount}">
                </div>
                <div class="cart-item-price">
                    <div class="item-price-total">${price*amount} €</div>
                </div>
                <img title="Remove" class="cart-close-icon" src="./resources/img/icons/cart-remove.svg">
            `;
        cartItems.push(cartItem);
        cartItem.addEventListener('load', function() {
            this.fadeIn();
        });

        prices[cartItem.id] = {price: price};
        container.appendChild(cartItem);
    });
}

/* add events after DOM is ready */
function addEvents() {
    const closeIcons = document.querySelectorAll('.cart-close-icon');
    const quantityCounts = document.querySelectorAll('.cart-quantity-count');

    /* (x) icons event */
    closeIcons.forEach(element => {
        element.addEventListener('click', function() {
            const parent = this.parentNode;
            const itemIndex = cartItems.indexOf(parent);
            parent.fadeOut(300, true, undefined, function() {
                cartItems.splice(itemIndex, 1);
                cart.removeItem(itemIndex, showCartBubble);
                parent.remove();
                setTotalPrice();
                const removedNotice = new NoticeBox('error', 'Removed item');
                    removedNotice.show(300, 1000);
            });
        });
    });

    /* quantity inputs event */
    quantityCounts.forEach(element => {
        const itemElement = element.closest('.cart-item');
        const priceElement = itemElement.querySelector('.item-price-total');
        
        element.addEventListener('change', function() {
            if(element.valueAsNumber > 20) {
                element.value = 20;
            }
            if(element.valueAsNumber < 1) {
                element.value = 1;
            }
            
            priceElement.innerHTML = `${prices[itemElement.id].price * element.valueAsNumber} €`;
            setTotalPrice();
        });
    })
}

function setTotalPrice() {
    const prices = document.querySelectorAll('.item-price-total');
    const shipping = $('#shipping-select').options[$('#shipping-select').selectedIndex].data("price");

    let total = 0;
    prices.forEach(element => {
        total += parseInt(element.innerHTML.split(' ')[0]);
    });

    $('#cart-finish-button').disabled = (total <= 0);
    $('#cart-items-value').innerHTML = `${total} €`;
    $('#total-value').innerHTML = (total === 0) ? `0 €` : `${total + shipping} €`
}

$('#cart-finish-button').addEventListener('click', function() {
    if(!this.disabled) {
        $('#order-confirm').fadeIn(400, 'flex');
        const itemsInput = document.createElement('textarea');
            itemsInput.name = 'items-information';
            itemsInput.style.display = 'none';

        document.querySelectorAll('.cart-item').forEach(item => {
            const itemId = item.dataset.id;
            const itemType = item.querySelector('.cart-info-type').innerHTML;
            const itemSize = item.querySelector('.cart-info-size').innerHTML;
            const itemQuantity = item.querySelector('.cart-quantity-count').value;
            const totalItemPrice = item.querySelector('.item-price-total').innerHTML;

            itemsInput.value += `
                ID: ${itemId}
                Type: ${itemType}
                Size: ${itemSize}
                Quantity: ${itemQuantity} <br>
                Item total: ${totalItemPrice} 
                ----------------------------
            `;
        });

        const totalItems = $('#cart-items-value').innerHTML;
        const shipping = $('#shipping-select').value;
        const total = $('#total-value').innerHTML;
        itemsInput.value += `
            <br><b> SUMMARY </b><br>
            <b> Items: </b> ${totalItems}
            <b> Shipping: </b> ${shipping} <br>
            <b> TOTAL: </b> ${total}
        `;

        $('#confirm-form').appendChild(itemsInput)
    }
})

$('#confirm-box-close').addEventListener('click', () => {
    $('#order-confirm').fadeOut(400, true);
});

$('#shipping-select').addEventListener('change', () => {
    setTotalPrice();
});

$('#form-email').addEventListener('blur', function(){
    validateEmail(this);
});

$('#form-email').addEventListener('keyup', function(){
    validateEmail(this, false);
});

export function getItemPrice(type, sizeIndex) {
    return items[type].sizes[sizeIndex].price;
}

export function getItemSizes(type) {
    return items[type].sizes;
}