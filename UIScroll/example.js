require.config({
    baseUrl: '../'
});
require(
    [
        'jquery',
        'UIComponents/UIScroll'
    ],
    function($, UIScroll) {
        //uiScroll
        var scroll = UIScroll.create($('.js-some-page-ui-scroll'), {
            $target: $('.js-scroll-target')
        });

        $('.js-textarea').on('keyup', function () {
            $('.js-scroll').html($(this).val());
            scroll.resize();
        });

        var scroll2 = UIScroll.create($('.js-simple-some-page-ui-scroll'), {
            $target: $('.js-simple-scroll-target')
        });
    }
);
