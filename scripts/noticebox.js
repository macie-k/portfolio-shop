export class NoticeBox {
    element = document.createElement('div');

    types = {
        'success': '<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M6.125 11.375L8.75 14L14.875 7.875" stroke="black" stroke-width="1.4" stroke-linecap="round"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 19.25C15.3325 19.25 19.25 15.3325 19.25 10.5C19.25 5.66751 15.3325 1.75 10.5 1.75C5.66751 1.75 1.75 5.66751 1.75 10.5C1.75 15.3325 5.66751 19.25 10.5 19.25Z" stroke="black" stroke-width="1.4"/> </svg>' ,
        'warning': '<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10.5 7V11.375" stroke="black" stroke-width="1.4" stroke-linecap="round"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 14.875C10.9832 14.875 11.375 14.4832 11.375 14C11.375 13.5168 10.9832 13.125 10.5 13.125C10.0168 13.125 9.625 13.5168 9.625 14C9.625 14.4832 10.0168 14.875 10.5 14.875Z" fill="black"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 19.25C15.3325 19.25 19.25 15.3325 19.25 10.5C19.25 5.66751 15.3325 1.75 10.5 1.75C5.66751 1.75 1.75 5.66751 1.75 10.5C1.75 15.3325 5.66751 19.25 10.5 19.25Z" stroke="black" stroke-width="1.4"/> </svg>',
        'error': '<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M13.5936 7.40641L7.40641 13.5936" stroke="black" stroke-width="1.4" stroke-linecap="round"/> <path d="M13.5936 13.5936L7.40641 7.40641" stroke="black" stroke-width="1.4" stroke-linecap="round"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 19.25C15.3325 19.25 19.25 15.3325 19.25 10.5C19.25 5.66751 15.3325 1.75 10.5 1.75C5.66751 1.75 1.75 5.66751 1.75 10.5C1.75 15.3325 5.66751 19.25 10.5 19.25Z" stroke="black" stroke-width="1.4"/> </svg>'
    }

    constructor(type, message, parent, show, top, right, bottom, left) {
        this.type = type;
        this.message = message;

        this.create(type, message, parent, show, top, right, bottom, left);
    }

    create(type, message, show=false, parent='body', top, right, bottom, left) {
        this.element.classList.add('notice-box');
        this.element.classList.add(type);
        
        this.element.innerHTML = `<span>${message}</span>${this.types[type]}`;
        document.querySelector(parent).appendChild(this.element);

        if(top !== undefined) this.element.style.top = top;
        if(right !== undefined) this.element.style.right = right;
        if(bottom !== undefined) this.element.style.bottom = bottom;
        if(left !== undefined) this.element.style.left = left;

        if(show) {
            this.show();
        }
    }

    show(fadeDuration=300, showDuration=1500, easing='ease-in') {
        this.element.style.transition = `opacity ${fadeDuration}ms ${easing}`;

        setTimeout(() => {
            this.element.style.opacity = 1;

            setTimeout(() => {
                this.element.style.opacity = 0;

                setTimeout(() => {
                    this.element.remove();
                }, fadeDuration*2);
                
            }, showDuration);
        }, 100);
    }
}