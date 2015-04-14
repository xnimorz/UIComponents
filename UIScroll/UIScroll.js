define(
    'UIComponents/UIScroll',
    [
        'jquery',
        'UIComponents/UICarriage'
    ],
    function($, UICarriage) {
        'use strict';

        var scrollDefaults = {
            hideOnLeave: true,
            scrollEndEvent: 'scroll:stop',
            scrollEvent: 'scroll:move',
            isHorizontal: false,
            $target: null,
            minSize: 30,
            preventScroll: true
        };

        function UIScroll(el, settings) {
            var $this = $(el),
                $carriage = $this.children().eq(0),
                options = $.extend({}, scrollDefaults, settings),
                $target = options.$target,
                $content = $target.children().eq(0),
                uiCarriage = UICarriage.create(el, {
                    carriageMoveEvent: options.scrollEvent || scrollDefaults.scrollEvent,
                    carriageMoveEndEvent: options.scrollEvent || scrollDefaults.scrollEndEvent,
                    isHorizontal: options.isHorizontal
                }),
                isHidden = false,
                maxValue = 0;

            if (options.hideOnLeave) {
                $target.on('mouseleave', function () {
                    !isHidden && $this.hide();
                });
                $target.on('mouseenter', function () {
                    !isHidden && $this.show();
                });
                $this.on('mouseenter', function () {
                    !isHidden && $this.show();
                });
                $this.on('mouseleave', function () {
                    !isHidden && $this.hide();
                });
            }

            $content.on('mousewheel DOMMouseScroll', function (e) {
                var event = window.event || e.originalEvent,
                    delta = event.wheelDelta || (-120) * event.detail;
                var position = -uiCarriage.getCurrentValue() + delta;

                //Проверки, чтобы не вышли за пределы
                if (position > 0) {
                    position = 0;
                }
                if (position < -maxValue) {
                    position = -maxValue;
                }

                $(this).css({
                    '-webkit-transform': 'translate(0, ' + position + 'px)',
                    '-moz-transform': 'translate(0, ' + position + 'px)',
                    '-ms-transform': 'translate(0, ' + position + 'px)',
                    'transform': 'translate(0, ' + position + 'px)'
                });

                uiCarriage.restoreCarriage(-position);
                if (options.preventScroll) {
                    e.preventDefault();
                }
            });

            $this.on(options.scrollEvent, function (e, args) {
                $($content).css({
                    '-webkit-transform': 'translate(0, ' + -args.value + 'px)',
                    '-moz-transform': 'translate(0, ' + -args.value + 'px)',
                    '-ms-transform': 'translate(0, ' + -args.value + 'px)',
                    'transform': 'translate(0, ' + -args.value + 'px)'
                });
            });

            this.resize = function (newSize) {
                newSize = newSize || options.isHorizontal ? $content.width() : $content.height();

                var targetSize = options.isHorizontal ? $target.width() : $target.height();
                var multiplier = newSize > targetSize ? newSize / targetSize : 1;
                var carriageSize = targetSize / multiplier;
                var delta = (newSize - targetSize) - (targetSize - carriageSize);

                if (delta < 0) {
                    delta = 0;
                }

                if (delta < carriageSize) {
                    if (delta < carriageSize * 0.2) {
                        carriageSize -= delta;
                    } else {
                        carriageSize = carriageSize * (1 - delta / carriageSize);
                    }
                }

                if (options.minSize > carriageSize) {
                    carriageSize = options.minSize;
                }

                var distance = targetSize - carriageSize;
                maxValue = newSize - targetSize;

                if (options.isHorizontal) {
                    $carriage.css('width', carriageSize);
                } else {
                    $carriage.css('height', carriageSize);
                }

                if (maxValue > 0) {
                    uiCarriage.changeSegments([
                        {
                            offset: 0,
                            value: 0
                        },
                        {
                            offset: distance,
                            value: maxValue
                        }
                    ]);
                    isHidden = false;
                    $this.show();
                } else {
                    maxValue = 0;
                    isHidden = true;
                    $this.hide();
                }
            };

            this.resize();
        }

        UIScroll.create = function(el, options) {
            return new UIScroll(el, options);
        };

        return UIScroll;
    }
);