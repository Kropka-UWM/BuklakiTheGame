// Web Storage also works on the desktop's standard custom origin. Read existing
// HTTP cookies as a fallback so browser players keep their previous settings.
const GameSettings = {
    get: (name) => localStorage.getItem(name) ?? Cookies.get(name),
    set: (name, value) => {
        localStorage.setItem(name, String(value));
        if (['http:', 'https:'].includes(location.protocol)) Cookies.set(name, value, { expires: 365 });
    },
};

const BACKEND = {
    url: (endpoint) => {
        const base = document.querySelector('meta[name="backend-url"]').content;
        return new URL(endpoint, base.endsWith('/') ? base : base + '/').href;
    },
};

let KEY_CONFIG = {
    'UP': [38, 87],
    'DOWN': [40, 83],
    'LEFT': [37, 65],
    'RIGHT': [39, 68],
    'ENTER': [13],
    'ESC': [27],
}
const ARROW_SPAN = '<span class="arrows"></span>';

let jqueryGet = (selector) => {
    return $(selector);
}

const LOGGER = {
    success: (msg) => {
        console.log(`%c ${msg}`, 'color: lightgreen;');
    },
    info: (msg) => {
        console.log(`%c ${msg}`, 'color: aquamarine;');
    },
    error: (msg) => {
        console.log(`%c ${msg}`, 'color: red;');
    }
}

let checkIfPressed = (string, key) => {
    return KEY_CONFIG[string].includes(key);
}

let switchMenus = (selectorName) => {
    $('.arrows').remove();
    $('.menu-selected').each((index, item) => {$(item).removeClass('menu-selected')})
    $('.menu').each((index, item) => {
        $(item).removeClass('curr-menu');
    })
    if(selectorName !== undefined) $(selectorName).addClass('curr-menu');
}

let getMenuPropertyIndex = () => {
    let getMenuItems = $('.curr-menu').find('h3');
    let getIndex = 0;
    getMenuItems.each((index, item) => {
      if($(item).find('a').hasClass('menu-selected')) getIndex = index;
    })
    return getIndex;
  }
