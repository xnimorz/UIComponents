$(function() {
    new UIPopup('.show-popup', {
        contentEl: '.js-popup'
    });

    new UIPopup('.js-popup-open-fade', {
        contentEl: '.js-popup-fade',
        isFadeScreen: true
    });
});