require.config({
    baseUrl: '../'
});
require(
    [
        'jquery',
        'UIComponents/UIPopup'
    ],
    function($, UIPopup){
        'use strict';

        $(function() {
            UIPopup.create('.show-popup', {
                contentEl: '.js-popup'
            });

            UIPopup.create('.js-popup-open-fade', {
                contentEl: '.js-popup-fade',
                isFadeScreen: true
            });

        });
    }
);