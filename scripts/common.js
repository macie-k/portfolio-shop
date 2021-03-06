import {ShoppingCart} from './shoppingCart.js';

var listOpened = false;
var lastScrollTop = 0;

export const cart = new ShoppingCart();

window.addEventListener('load', () => {
    lastScrollTop = window.scrollY;
    showCartBubble(cart);
    setTimeout(() => {
        $('#content').style.opacity = 1;
    }, 300);
});

window.addEventListener('scroll', () => {
    if(!isDesktop()) {
        if(!listOpened) {
            let scrollTop = window.scrollY;
            if(Math.abs(scrollTop - lastScrollTop) > 70) {
                if(scrollTop > lastScrollTop) {
                    $('#header').style.top = isDesktop() ? '-100' : '-90';
                } else {
                    $('#header').style.top = '0';
                }
                lastScrollTop = scrollTop;
            }
        }
    }
});

/* event to flip the arrow icon */
document.querySelectorAll('.flip-arrow-input').forEach(element => {
    element.addEventListener('click', function() {
        element.data("opened", ("opened" in element.dataset) ? !element.data("opened") : true);
        if(element.data("opened")) {
            this.classList.add('active');
        } else {
            this.classList.remove('active');
        }
    });
});

$('#list-icon').addEventListener('click', function() {
    showSideMenu(!listOpened);
});

document.addEventListener('dragstart', function(e) {
    e.preventDefault();
});

export function showCartBubble(cart) {
    const bubble = $('#cart-bubble');
    if(cart.items.length > 0) {
        bubble.style.height = '5px';
        bubble.style.width = '5px';
    } else  {
        bubble.style.height = '0px';
        bubble.style.width = '0px';
    }
}

export function $(selector) {
    const nodes = document.querySelectorAll(selector);
    const nodesArray = Array.from(nodes);
    return (nodesArray.length == 1) ? nodesArray[0] : nodesArray; 
}

export function showSideMenu(show) {
    if(!isDesktop()) {
        $('#list-icon').classList.remove('is-active');
        if(show) {
            $('#list-icon').classList.add('is-active');
        }

        const container = $('#list-container');
        const vw = window.innerWidth/100;
        const value = listOpened ? `-${60*vw}px` : '0px';

        container.animate('left', value, 400)

        listOpened = show;
    }
}

export function isDesktop() {
    return window.innerWidth > 775;
}

export function isBoolean(val) {
    return val === "true" || val === "false";
}

export function isNumber(val) {
    return !isNaN(parseInt(val));
}

Element.prototype.animate = function(property, value, duration=400, timing='ease-in-out', callback) {
    this.classList.add('animating');
    this.style.transition = `${property} ${duration}ms ${timing}`;

    setTimeout(() => {
        this.style[property] = value;
        this.addEventListener('transitionend', () => {
            this.classList.remove('animating');
            if(typeof callback == "function") {
                callback();
            }
        });
    }, 100);
}

Element.prototype.fadeIn = function(duration=400, displayMode=false, limit=1, callback) {
    const currentTransiton = this.style.transition;

    this.classList.add('fading');
    this.style.transition = `opacity ${duration}ms ease-in`;
    if(displayMode !== false) {
        this.style.display = displayMode;
    }

    setTimeout(() => {
        this.style.opacity = limit;
    }, 100);

    setTimeout(() => {
        this.classList.remove('fading');
        this.style.transition = currentTransiton;

        if(typeof callback == 'function') {
            callback();
        }
    }, duration + 200);

};

Element.prototype.fadeOut = function(duration=400, disable=false, limit=0, callback) {
    const currentTransiton = this.style.transition;

    this.classList.add('fading');
    this.style.transition = `opacity ${duration}ms ease-out`;
    setTimeout(() => {
        this.style.opacity = limit;
    }, 100);

    setTimeout(() => {
        this.classList.remove('fading');
        this.style.transition = currentTransiton;
        if(disable) {
            this.style.display = 'none';
        }
        if(typeof callback == 'function') {
            callback();
        }
    }, duration + 200);
};

Element.prototype.data = function(key, value) {
    if(value === undefined) {
        const rawVal = this.getAttribute(`data-${key}`);
        let returnVal = rawVal;

        if(isNumber(rawVal)) returnVal = parseInt(rawVal);
        if(isBoolean(rawVal)) returnVal = (rawVal == 'true');

        return returnVal;
    } else {
        return this.setAttribute(`data-${key}`, value);
    }
}
