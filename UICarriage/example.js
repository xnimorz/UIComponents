require.config({
    baseUrl: '../'
});
require(
    [
        'jquery',
        'UIComponents/UICarriage'
    ],
    function($, UICarriage) {
        'use strict';

        $(function() {
            $('.js-fast-start').on('carriage:move', function (e, eventArgs) {
                console.log(eventArgs);
            });

            UICarriage.create(
                $('.js-fast-start'),
                {
                    maxOffset: 390,
                    carriageMoveEvent: 'carriage:move'
                }
            );


            $('.js-input-linear-carriage').on('carriage:move', function (e, args) {
                $('.js-input-linear').val(args.value);
            })
                .on('carriage:end', function (e, args) {
                    $('.js-input-mouse-up').html(args.value);
                });

            UICarriage.create(
                $('.js-input-linear-carriage'),
                {
                    maxOffset: 390,
                    carriageMoveEvent: 'carriage:move',
                    carriageMoveEndEvent: 'carriage:end'
                }
            );


            $('.js-input-linear-segments-carriage').on('carriage:move', function (e, args) {
                $('.js-input-linear-segments').val(args.value);
            });

            UICarriage.create(
                $('.js-input-linear-segments-carriage'),
                {
                    maxOffset: 390,
                    carriageMoveEvent: 'carriage:move',
                    segments: [
                        {offset: 0, value: 0},
                        {offset: 390, value: 7800}
                    ]
                }
            );


            $('.js-input-segments-carriage').on('carriage:move', function (e, args) {
                $('.js-input-segments').val(args.value);
            });

            UICarriage.create(
                $('.js-input-segments-carriage'),
                {
                    maxOffset: 390,
                    carriageMoveEvent: 'carriage:move',
                    segments: [
                        {offset: 0, value: 0},
                        {offset: 100, value: 1000},
                        {offset: 200, value: 1200},
                        {offset: 390, value: 39200}
                    ]
                }
            );


            $('.js-start-value-carriage').on('carriage:move', function (e, args) {
                $('.js-start-value').val(args.value);
            })

            UICarriage.create(
                $('.js-start-value-carriage'),
                {
                    maxOffset: 390,
                    carriageMoveEvent: 'carriage:move'
                }
            ).restoreCarriage(150);


            $('.js-some-page').on('carriage:move', function (e, args) {
                $('.js-page').css({
                    '-webkit-transform': 'translate(0, ' + -args.value + 'px)',
                    '-moz-transform': 'translate(0, ' + -args.value + 'px)',
                    '-ms-transform': 'translate(0, ' + -args.value + 'px)',
                    'transform': 'translate(0, ' + -args.value + 'px)'
                });
            })

            UICarriage.create(
                $('.js-some-page'),
                {
                    maxOffset: 400,
                    carriageMoveEvent: 'carriage:move',
                    isHorizontal: false
                }
            );

            $('.js-steps-line').on('carriage:move', function (e, args) {
                $('.js-steps-move').html(args.value);
            })
                .on('carriage:end', function (e, args) {
                    $('.js-steps-end').html(args.value);
                });

            UICarriage.create(
                $('.js-steps-line'),
                {
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
                }
            );


            $('.js-auto-steps-line').on('carriage:move', function (e, args) {
                $('.js-auto-steps-move').html(args.value);
            })
                .on('carriage:end', function (e, args) {
                    $('.js-auto-steps-end').html(args.value);
                });

            UICarriage.create(
                $('.js-auto-steps-line'),
                {
                    maxOffset: 390,
                    isSteps: true,
                    computedStepsCount: 3,
                    carriageMoveEvent: 'carriage:move',
                    carriageMoveEndEvent: 'carriage:end'
                }
            );


            var pageScroll = $('.js-some-page-scroll').on('carriage:move', function (e, args) {
                $('.js-page-scroll').css({
                    '-webkit-transform': 'translate(0, ' + -args.value + 'px)',
                    '-moz-transform': 'translate(0, ' + -args.value + 'px)',
                    '-ms-transform': 'translate(0, ' + -args.value + 'px)',
                    'transform': 'translate(0, ' + -args.value + 'px)'
                });
            });

            var pageScrollCarriage = UICarriage.create(
                pageScroll,
                {
                    maxOffset: 400,
                    carriageMoveEvent: 'carriage:move',
                    isHorizontal: false,
                    segments: [
                        {offset: 0, value: 0},
                        {offset: 400, value: 3825}
                    ]
                }
            );

            $('.js-page-scroll').on('mousewheel DOMMouseScroll', function (e) {
                var event = window.event || e.originalEvent,
                    delta = event.wheelDelta || (-120) * event.detail;
                var position = -pageScrollCarriage.getCurrentValue() + delta;

                //Проверки, чтобы не вышли за пределы
                if (position > 0) {
                    position = 0;
                }
                if (position < -3825) {
                    position = -3825;
                }

                $(this).css({
                    '-webkit-transform': 'translate(0, ' + position + 'px)',
                    '-moz-transform': 'translate(0, ' + position + 'px)',
                    '-ms-transform': 'translate(0, ' + position + 'px)',
                    'transform': 'translate(0, ' + position + 'px)'
                });

                pageScrollCarriage.restoreCarriage(-position);
                e.preventDefault();
            });


            var buttonsSteps = $('.js-buttons-steps-line').on('carriage:move', function (e, args) {
                $('.js-buttons-steps-move').html(args.value);
            })
                .on('carriage:end', function (e, args) {
                    $('.js-buttons-steps-end').html(args.value);
                })
            var stepsCarriage = UICarriage.create(
                buttonsSteps,
                {
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
                }
            );

            $('.buttons-steps-less').click(function () {
                stepsCarriage.prev();
            });

            $('.buttons-steps-greater').click(function () {
                stepsCarriage.next();
            });


            var buttons = $('.js-buttons-line').on('carriage:move', function (e, args) {
                $('.js-buttons-move').html(args.value);
            })
                .on('carriage:end', function (e, args) {
                    $('.js-buttons-end').html(args.value);
                });
            var buttonsCarriage = UICarriage.create(
                buttons,
                {
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
                }
            );

            $('.buttons-less').click(function () {
                buttonsCarriage.prev();
            });

            $('.buttons-greater').click(function () {
                buttonsCarriage.next();
            });

        });
    }
);
