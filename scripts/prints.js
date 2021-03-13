import {$, cart, showCartBubble} from './common.js';
import {NoticeBox} from './noticebox.js';

const clientID = '084e31407b21fa0';
var currentPhoto;
var openedSizeMenu = false;

// 'album_ID' : 'product_type'
const albums =  {
    'PwSjiCw': 'Calendar',
    'SSUYPd5': 'Print',
}

window.addEventListener('load', async function() {
    const album = await Promise.all(Object.keys(albums).map(getImages));
    await Promise.all(album.map(loadAlbum));

    /* adjust columns after timeout */
    // setTimeout(() => {
    //     adjustColumns();
    // }, 500);

    const imgId = location.href.split("/p/")[1];
    if(imgId === undefined) {
        $('.img').forEach(element => {
            element.removeAttribute('data-id');
        });
    } else {
        previewFromURL(imgId);
    }
});

window.onpopstate = () => window.location.href = location.href;

window.addEventListener('resize', () => {
    if(isPreview()) {
        resizePreview();
    }
    adjustColumns();
});

async function getImages(albumID) {
    const result = await fetch(`https://api.imgur.com/3/album/${albumID}`, {
        headers: {
            "Authorization": "Client-ID " + clientID,
        }
    });

    if (result.status !== 200) {
        const $errorDiv = document.createElement('div');
        $errorDiv.id = 'error-div';

        const $error = document.createElement('p');
        const $errorInfo = document.createElement('p');

        $error.innerHTML = `Could not load images: <span class="red">#${result.status}</span>`;
        $errorInfo.innerHTML = `If the <span class="red">#</span> is <span class="red">4xx</span>
                                - contact me at: <br><br> <span> contact@xafex.com </span>`;

        $('#content').appendChild($errorDiv);
        $errorDiv.appendChild($error);
        $errorDiv.appendChild($errorInfo);
        $errorDiv.fadeIn();

        throw new Error('Cannot load imgur album # status: ' + result.status);
    }

    const data = await result.json();
    return data.data;
}

function loadAlbum(album) {
    let colIndex = 1;
    let subColIndex = 1;

    let i = 0;
    for (let image of album.images) {           
        const imgContainer = document.createElement('div');
            imgContainer.classList.add('img-container');
            imgContainer.innerHTML = '<div class="overlay"><div class="buy">BUY</div></div>';
        
        /* distributing photos across 3 columns */
        let column = $(`#column-${colIndex}`);
        if(colIndex === 3) {
            column = $(`#column-${colIndex}-${subColIndex}`);
            subColIndex = (subColIndex < 2) ? subColIndex+1 : 1;
        }
        column.appendChild(imgContainer);

        const img = document.createElement('img');
            img.classList.add('img');                               // add class for image
            img.loading = 'lazy';                                   // add lazy loading option
            img.src = `https://i.imgur.com/${image.id}l.jpg`;       // set src
            img.data('id', image.id);                               // save image id
            img.data('title', image.description);                   // save image title
            img.data('type', albums[album.id]);                     // save image type

        imgContainer.appendChild(img);
        img.addEventListener('load', function(e) {
            setTimeout(() => {
                img.fadeIn(300);
                i++;
            }, 200);
        });
        colIndex = (colIndex < 3) ? colIndex+1 : 1;
    }

    $('.img').forEach(element => {
        const parent = element.parentNode;
        const buyButton = parent.querySelector('.overlay');
        buyButton.addEventListener('click', () => {
            currentPhoto = element;
            showPreview(element);
        });
    });
    
    /* wait for all photos to load and then adjust columns (fires n times for n albums) */
    const checkForImgs = setInterval(() => {
        if(i >= album.images.length) {
            adjustColumns();
            clearInterval(checkForImgs);
        }
    }, 100);
}

$('#add-button').addEventListener('click', () => {
    const type = currentPhoto.data('type');
    const ID = currentPhoto.src.substr(20, 7);
    const price = parseInt($('#preview-price-value').innerHTML.slice(0, -1));
    const size = $('#preview-size').value;
    const amount = $('#quantity').valueAsNumber;

    cart.addItem(type, ID, price, size, amount, showCartBubble);
    new NoticeBox('success', 'Added to cart', true);
});

$('#preview-size-container').addEventListener('click', function() {
    openedSizeMenu = !openedSizeMenu;
    if(openedSizeMenu) {
        this.classList.add('active');
    } else {
        this.classList.remove('active');
    }
});

$('#preview-size-container').addEventListener('focusout', function() {
    this.classList.remove('active');
});

$('#preview-back').addEventListener('click', () => {
    hidePreview();
});

function updatePrice() {
    const list = $('#preview-size');
    $('#preview-price-value').innerHTML = `${list[list.selectedIndex].data('price')}€`;
}

$('#preview-size').addEventListener('change', function() {
    updatePrice();
});

$('#quantity').addEventListener('change', function() {
    if(this.valueAsNumber < 0) {
        this.value = 1;
    }
    if(this.valueAsNumber > 10) {
        this.value = 10;
    }
});

/* event for changing quantity */
$('.change-quantity').forEach(element => {
    element.addEventListener('click', function(e) {
        const inputBox = $('#quantity');
        const more = e.target.id.includes("+");
        const newValue = inputBox.valueAsNumber + (more ? 1 : -1);
    
        inputBox.value = newValue;
        verifyQuantity();
    });
});

function verifyQuantity() {
    const input = $('#quantity');
    if(input.valueAsNumber <= 0) {
        input.value = 1;
    }
    if(input.valueAsNumber > 10) {
        input.value = 10;
    }
}

function hidePreview() {
    $('body').style.overflow = '';

    $('#preview-container').fadeOut(300, true, undefined, function() {
        $('#preview-img').src = '';
    });

    window.history.replaceState({} , '', './prints');
}

function showPreview(img, dontUpdate=false) {
    const prevIMG = $('#preview-img');
    prevIMG.addEventListener('load', function() {
        if(isDesktop()) {
            resizePreview();
            positionBackButton();
        }
    });

    $('body').style.overflow = 'hidden';
    $('#header').style.top = '0';
    $('.preview-title').forEach(element => {
        element.innerHTML = img.data('title');
    });
    updatePrice();

    $('#preview-container').fadeIn(300, 'flex');
    prevIMG.src = img.src;

    if(!dontUpdate) {
        updateUrl();
    }
}

async function previewFromURL(imgId, dontUpdate=false) {
    /* find matching image */
    $('.img').forEach(element => {
        if(element.dataset.id == imgId) {
            currentPhoto = element;
        }
    });

    /* if it exists display preview, else clear url */
    if(currentPhoto !== undefined) {
        showPreview(currentPhoto, true);
    } else {
        window.history.replaceState({} , '', './prints');
    }
}

function resizePreview() {
    if(isDesktop()) {
        $('#preview-information').style.height = $('#preview-img').offsetHeight;
    } else {
        $('#preview-information').style.height = '';
    }
}

function positionBackButton() {
    const prevIMG = $('#preview-img');
    const backArrow = $('#preview-back');

    if(!isDesktop()) {
        backArrow.style.top = '95px';
        backArrow.style.left = '20px';
    } else {
        backArrow.style.top = prevIMG.offsetTop - 40;
        backArrow.style.left = prevIMG.offsetLeft;
    }        
}

/* fixes columns' margin in 2-column view */
function adjustColumns() {
    const ref1 = $('#column-1'); const ref2 = $('#column-2');
    const adj1 = $('#column-3-1'); const adj2 = $('#column-3-2');

    /* reset margin */
    adj1.style.marginTop = ''; adj2.style.marginTop = '';

    /* only if 2-column view */
    if(window.innerWidth >= 775 && window.innerWidth <= 1100) {
        const ref1Top = ref1.offsetTop; const adj1Top = adj1.offsetTop;
        const ref2Top = ref2.offsetTop; const adj2Top = adj2.offsetTop;

        /* set margin to negative difference between bottom of the top column and top of the bottom column */
        adj1.style.marginTop = `-${adj1Top - (ref1Top + ref1.offsetHeight)}px`;
        adj2.style.marginTop = `-${adj2Top - (ref2Top + ref2.offsetHeight)}px`;
    }
}

function updateUrl() {
    const imgId = currentPhoto.src.substr(20, 7);
    window.history.pushState({} , '', `./prints/p/${imgId}`);
}

function isPreview() {
    return $('#preview-container').style.display === 'flex';
}

function isDesktop() {
    return window.innerWidth > 775;
}
