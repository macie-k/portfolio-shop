import {$} from './common.js';

$('img').forEach(element => {
    element.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
});
