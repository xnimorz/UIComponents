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
        carriageMoveEvent: 'carriage:move',
        carriageMoveEndEvent: 'carriage:end'
    })
        .on('carriage:move', function(e, args) {
            $('.js-input-linear').val(args.value);
        })
        .on('carriage:end', function(e, args) {
            $('.js-input-mouse-up').html(args.value);
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

    $('.js-steps-line').carriage({
        maxOffset: 350,
        isSteps: true,
        carriageMoveEvent: 'carriage:move',
        carriageMoveEndEvent: 'carriage:end',
        segments: [
            {offset: 0, value: 0},
            {offset: 98, value: 98},
            {offset: 209, value: 209},
            {offset: 350, value: 350}
        ]
    })
        .on('carriage:move', function(e, args) {
            $('.js-steps-move').html(args.value);
        })
        .on('carriage:end', function(e, args) {
            $('.js-steps-end').html(args.value);
        });

    $('.js-auto-steps-line').carriage({
        maxOffset: 390,
        isSteps: true,
        computedStepsCount: 3,
        carriageMoveEvent: 'carriage:move',
        carriageMoveEndEvent: 'carriage:end'
    })
        .on('carriage:move', function(e, args) {
            $('.js-auto-steps-move').html(args.value);
        })
        .on('carriage:end', function(e, args) {
            $('.js-auto-steps-end').html(args.value);
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

    var $buttonsSteps = $('.js-buttons-steps-line').carriage({
        maxOffset: 400,
        carriageMoveEvent: 'carriage:move',
        carriageMoveEndEvent: 'carriage:end',
        isHorizontal: true,
        isSteps: true,
        isCyclic: true,
        segments: [
            {offset: 0, value: 0},
            {offset: 100, value: 100},
            {offset: 200, value: 200},
            {offset: 300, value: 300},
            {offset: 400, value: 400}
        ]
    })
        .on('carriage:move', function(e, args) {
            $('.js-buttons-steps-move').html(args.value);
        })
        .on('carriage:end', function(e, args) {
            $('.js-buttons-steps-end').html(args.value);
        });

    $('.buttons-steps-less').click(function() {
        $buttonsSteps.prev();
    });

    $('.buttons-steps-greater').click(function() {
        $buttonsSteps.next();
    });

    var $buttons = $('.js-buttons-line').carriage({
        maxOffset: 400,
        carriageMoveEvent: 'carriage:move',
        carriageMoveEndEvent: 'carriage:end',
        isHorizontal: true,
        segments: [
            {offset: 0, value: 0},
            {offset: 100, value: 100},
            {offset: 200, value: 200},
            {offset: 300, value: 300},
            {offset: 400, value: 400}
        ]
    })
        .on('carriage:move', function(e, args) {
            $('.js-buttons-move').html(args.value);
        })
        .on('carriage:end', function(e, args) {
            $('.js-buttons-end').html(args.value);
        });

    $('.buttons-less').click(function() {
        $buttons.prev();
    });

    $('.buttons-greater').click(function() {
        $buttons.next();
    });

});