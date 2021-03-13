import {$} from './common.js';

const EMAIL_REGEX = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
const validators = [validateMinLength, validateEmail];

window.addEventListener('load', () => {
    const form = document.forms['contact-form'];

    $('input, textarea').forEach(element => {
        element.addEventListener('blur', function(){
            validateAll(form);
        });
    });
    $('input, textarea').forEach(element => {
        element.addEventListener('keyup', function(){
            validateAll(form, false);
        });
    });

    $('#copy-email').addEventListener('click', function() {
        const _fadeTime = 400;
        const _waitTime = 1200;

        const originalValue = this.innerText;
        const originalWidth = this.offsetWidth;       

        this.classList.add('fade-out');
        this.style.width = originalWidth;
        setTimeout(() => {
            this.style.color = '#1ee854';
            this.innerText = "COPIED";
            this.classList.remove('fade-out');
        }, _fadeTime);

        const tmp = document.createElement('textarea');
            tmp.id = 'tmp-email-copier';
            tmp.value = originalValue;

        document.body.appendChild(tmp);
        tmp.select();
        tmp.setSelectionRange(0, 99999);
        document.execCommand('copy');
        tmp.remove();

        setTimeout(() => {
            this.classList.add('fade-out');
            setTimeout(() => {
                this.removeAttribute('style');
                this.innerText = originalValue;
                this.classList.remove('fade-out');
            }, _fadeTime);
        }, _waitTime);
    });
});

function validateAll(form, changeBorder=true) {
    const elements = [...form.elements];

    const validMap = elements.map(element => {
        const valid = validateInput(element);

        if(changeBorder) {
            if(valid) {
                element.parentNode.classList.remove('invalid');
            } else {
                element.parentNode.classList.add('invalid');
            }
        }
        return valid;
    });

    const isValid = validMap.every(Boolean);

    const fieldsAreNotEmpty = elements.every((element) => {
        return (element.required) ? (element.value.length !== 0) : true;
    });

    if (isValid && fieldsAreNotEmpty) {
        $('.input[type=submit]').removeAttribute('disabled');
    } else {
        $('.input[type=submit]').disabled = 'disabled';
    }
}

function validateInput(element) {
    return validators.every(validateFunc => {
        const result = validateFunc(element);

        return result === true || result === null;
    });
}

function validateEmail(element) {
    const value = element.value;

    if (element.data('validate') !== 'email' || value.length === 0) {
        return null;
    }
    return EMAIL_REGEX.test(value);
}

function validateMinLength(element) {
    const minLength = element.data('min-length');
    const length = element.value.length;
    
    if (minLength === undefined || length === 0) {
        return null;
    }
    return length >= minLength;
}