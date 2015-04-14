require.config({
    baseUrl: '../'
});
require(
    [
        'jquery',
        'UIComponents/UIHint'
    ],
    function($, UIHint) {
        $(function() {
            UIHint.create('.js-tooltip', {content: 'js hint content', timeout: 100});
        });
    }
);