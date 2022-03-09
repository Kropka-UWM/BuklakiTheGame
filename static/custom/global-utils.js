let KEY_CONFIG = {
    'UP': [38, 87],
    'DOWN': [40, 83],
    'LEFT': [37, 65],
    'RIGHT': [39, 68],
    'ENTER': [13],
    'ESC': [27],
}

let jqueryGet = (selector) => {
    return $(selector);
}

const LOGGER = {
    success: (msg) => {
        console.log(`%c ${msg}`, 'color: lightgreen;');
    },
    info: (msg) => {
        console.log(`%c ${msg}`, 'color: aquamarine;');
    }
}

let checkIfPressed = (string, key) => {
    return KEY_CONFIG[string].includes(key);
}

let switchMenus = (selectorName) => {
    $('.menu').each((index, item) => {
        $(item).removeClass('curr-menu');
    })
    if(selectorName !== undefined) $(selectorName).addClass('curr-menu');
}