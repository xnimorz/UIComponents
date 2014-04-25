$(function() {
    'use strict';

    $('.js-fast-start').carriage({
        maxOffset: 390,
        carriageMoveEvent: 'carriage:move'
    }).on('carriage:move', function(e, eventArgs) {
        console.log(eventArgs);
    });

    $('.js-input-linear-carriage').carriage({
        maxOffset: 390,
        carriageMoveEvent: 'carriage:move'
    }).on('carriage:move', function(e, args) {
        $('.js-input-linear').val(args.value);
    });

    $('.js-input-linear-segments-carriage').carriage({
        maxOffset: 390,
        carriageMoveEvent: 'carriage:move',
        segments: [{offset: 0, value: 0},
                    {offset: 390, value: 7800}]
    }).on('carriage:move', function(e, args) {
        $('.js-input-linear-segments').val(args.value);
    });

    $('.js-input-segments-carriage').carriage({
        maxOffset: 390,
        carriageMoveEvent: 'carriage:move',
        segments: [{offset: 0, value: 0},
            {offset: 100, value: 1000},
            {offset: 200, value: 1200},
            {offset: 390, value: 39200}]
    }).on('carriage:move', function(e, args) {
        $('.js-input-segments').val(args.value);
    });

    $('.js-start-value-carriage').carriage({
        maxOffset: 390,
        carriageMoveEvent: 'carriage:move'
    })
        .on('carriage:move', function(e, args) {
            $('.js-start-value').val(args.value);
        })
        .restoreCarriage(150);

    $('.js-some-page').carriage({
        maxOffset: 400,
        carriageMoveEvent: 'carriage:move',
        isHorizontal: false
    }).on('carriage:move', function(e, args) {
        $('.js-page').css({
            '-webkit-transform': 'translate(0, ' + -args.value +'px)',
            '-moz-transform': 'translate(0, ' + -args.value +'px)',
            '-ms-transform': 'translate(0, ' + -args.value +'px)',
            'transform': 'translate(0, ' + -args.value +'px)'
        });
    });

    $('.js-some-page-scroll').carriage({
        maxOffset: 400,
        carriageMoveEvent: 'carriage:move',
        isHorizontal: false,
        segments: [
            {offset: 0, value: 0},
            {offset: 400, value: 3825}
        ]
    })
        .on('carriage:move', function(e, args) {
            $('.js-page-scroll').css({
                '-webkit-transform': 'translate(0, ' + -args.value +'px)',
                '-moz-transform': 'translate(0, ' + -args.value +'px)',
                '-ms-transform': 'translate(0, ' + -args.value +'px)',
                'transform': 'translate(0, ' + -args.value +'px)'
            });
        });
    $('.js-page-scroll').on('mousewheel DOMMouseScroll', function(e) {
        var event = window.event || e.originalEvent,
            delta = event.wheelDelta || (-120) * event.detail;
        var position = -$('.js-some-page-scroll').getCurrentValue() + delta;

        //Проверки, чтобы не вышли за пределы
        if (position > 0) {
            position = 0;
        }
        if (position < -3825) {
            position = -3825;
        }

        $(this).css({
            '-webkit-transform': 'translate(0, ' + position +'px)',
            '-moz-transform': 'translate(0, ' + position +'px)',
            '-ms-transform': 'translate(0, ' + position +'px)',
            'transform': 'translate(0, ' + position +'px)'
        });

        $('.js-some-page-scroll').restoreCarriage(-position);
        e.preventDefault();
    });
});