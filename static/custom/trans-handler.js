// Translation handler.

let firstRun = true;

const LANGUAGES = [
    'Polski',
    'English',
];

const TRANS_OBJECT = {
    'Polski': [
        'Nowa gra',
        'Opcje',
        'Ranking',
        'O grze',
        'Muzyka',
        'Dzwieki z gry',
        'Język / Language',
        'Powrót do menu',
        'Wróć do gry',
        'Przejdź do menu',
        'UWAGA! Utrata postępu.',
        'Oaza',
        'Cel',
        'Pauza',
        'Ilość bukłaków',
        'Dystans',
        'Rozwiąż i zakończ',
        'UWAGA! Wykluczenie z rankingu dla tej gry.'
    ],
    'English': [
        'New game',
        'Options',
        'Ranks',
        'About the game',
        'Music',
        'Audio sounds',
        'Language',
        'Return to menu',
        'Return to game',
        'Go to menu',
        'WARNING! Loss of progress.',
        'Oasis',
        'End',
        'Pause',
        'Basket amount',
        'Distance',
        'Solve and finish',
        'WARNING! Exclude from ranks for this game.'
    ],
}

const switchLang = (lang) => {
    const textElements = [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7',
        'a', 'span', 'div',
    ]
    let currLang = Cookies.get('lang');
    if(firstRun){
        currLang = 'Polski';
        firstRun = false;
    }
    $(textElements.join(', ')).each((index, item) => {
        let getItem = $(item);
        let getIndex = TRANS_OBJECT[currLang].indexOf(getItem.text());
        if(getIndex !== -1 && !getItem.children().length){
            getItem.text(TRANS_OBJECT[lang][getIndex]);
        }
    })
    Cookies.set('lang', lang);
}

$(document).ready((e) => {
    let lang = Cookies.get('lang');
    if(!lang){
        lang = 'Polski';
        Cookies.set('lang', lang)
    }
    if(lang !== 'Polski') switchLang(lang);
    let getLangElement = $('.lang');
    if(getLangElement.length) getLangElement.text(lang);
})