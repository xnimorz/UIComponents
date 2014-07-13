!function($) {
    'use strict';


    var defaults = {
        maxOffset: 100,
        carriageMoveEvent: null,
        carriageMoveEndEvent: null,
        segments: [],
        isHorizontal: true,
        isSteps: false,
        computedStepsCount: null,
        isCyclic: false
    };

    $.fn.carriage = function(settings) {
        var $this = $(this),
            options = $.extend({}, defaults, settings),
            $target = $this.children(),
            currentOffset = 0,
            lastClientCoordinate = 0,
            value = -1;

        $target.css({
            'position': 'relative'
        });

        //Автоподсчет шагов
        var computeSteps = function() {
            var max = options.maxOffset,
                min = 0,
                maxValue = max,
                minValue = min;

            if (options.segments && options.segments.length !== 1) {
                max = options.segments[options.segments.length - 1].offset;
                maxValue = options.segments[options.segments.length - 1].value;
                min = options.segments[0].offset;
                minValue = options.segments[0].value;
            }

            var step = (max - min) / options.computedStepsCount,
                stepValue = (maxValue - minValue) / options.computedStepsCount;
            options.segments = [];

            for (var i = 0; i < options.computedStepsCount; i++) {
                options.segments.push({
                    offset: min + i * step,
                    value: minValue + i * stepValue
                });
            }

            options.segments.push({
                offset: max,
                value: maxValue
            });
        };

        //Сортировка сегментов по возрастанию
        var segmentsSort = function(a,b) {
            if (a.offset > b.offset) {
                return 1;
            }
            if (a.offset < b.offset) {
                return -1;
            }
            return 0;
        };

        //Переключение позиции (между двумя последовательными) (получение нового offset)
        var switchSegmentPosition = function(segmentIndex, position) {
            var delta = options.segments[segmentIndex + 1].offset - options.segments[segmentIndex].offset;
            var posDelta = position - options.segments[segmentIndex].offset;
            if (posDelta < (delta / 2)) {
                return  options.segments[segmentIndex].offset;
            }
            return  options.segments[segmentIndex + 1].offset;
        };

        //Определение сегментов
        if (!options.segments || options.segments.length === 0) {
            options.segments = [{offset: 0, value: 0},
                                {offset: options.maxOffset, value: options.maxOffset}];
            value = 0;
        }
        //Сортировка сегментов
        options.segments.sort(segmentsSort);
        if (options.isSteps && options.computedStepsCount) {
            computeSteps();
        }

        //Если carriage работает в пошаговом режиме - переключение на следующий шаг
        var next = function() {
            var index = $this.getLeftSegment() + 1;

            if (index >= options.segments.length) {
                if (options.isCyclic) {
                    index = 0;
                } else {
                    return;
                }

            }
            currentOffset = options.segments[index].offset;
            changeCurrentOffset(true);
        };

        //Если carriage работает в пошаговом режиме - переключение на предыдущий шаг
        var prev = function() {
            var index = $this.getLeftSegment();
            if (currentOffset === options.segments[index].offset) {
                index--;
            }

            if (index < 0) {
                if (options.isCyclic) {
                    index = options.segments.length - 1;
                } else {
                    return;
                }
            }

            currentOffset = options.segments[index].offset;
            changeCurrentOffset(true);
        };

        //Получение новых сегментов
        $.fn.changeSegments = function(segments) {
            options.segments = segments;
            if (!options.segments || options.segments.length === 0) {
                options.segments = [{offset: 0, value: 0},
                    {offset: options.maxOffset, value: options.maxOffset}];
            }
            options.segments.sort(segmentsSort);
            if (options.isSteps && options.computedStepsCount) {
                computeSteps();
            }
            return $this;
        };

        //текущее значение
        $.fn.getCurrentValue = function() {
            return value;
        };

        $.fn.getCurrentOffset = function() {
            return currentOffset;
        };

        //Ближайший меньший или равный сегмент
        $.fn.getLeftSegment = function() {
            var i;
            for (i = 0; options.segments.length - 1 > i && options.segments[i].offset <= currentOffset; i++) {}
            if (options.segments[i].offset <= currentOffset) {
                return i;
            }
            return i - 1;
        };

        //Ближайший сегмент
        $.fn.getNearestSegment = function() {
            var i;
            for (i = 0; options.segments.length < i && options.segments[i].offset <= currentOffset; i++) {
            }
            if (options.segments[i].offset <= currentOffset) {
                return i;
            }
            if (currentOffset - options.segments[i - 1].offset > options.segments[i].offset - currentOffset) {
                return i;
            }
            return i - 1;
        };

        //По значению получение offset
        $.fn.restoreCarriage = function(newValue) {
            if (newValue) {
                value = newValue;
                var position = -1;

                if (value >= 0) {
                    for (var i = 0; i < options.segments.length - 1 && position < 0; i++) {
                        if (options.segments[i].value < value && options.segments[i + 1].value > value) {
                            position = options.segments[i].offset +
                                (value - options.segments[i].value) *
                                (options.segments[i + 1].offset - options.segments[i].offset) /
                                (options.segments[i + 1].value - options.segments[i].value);
                            if (options.isSteps) {
                                position = switchSegmentPosition(i, position);
                            }
                        }
                        if (options.segments[i].value === value) {
                            position = options.segments[i].offset;
                        }
                        if (options.segments[i + 1].value === value) {
                            position = options.segments[i + 1].offset;
                        }
                    }
                }
                if (position === -1) {
                    position = options.maxOffset;
                }
                currentOffset = position;

                if (options.isHorizontal) {
                    $target.css({
                        left: position + 'px'
                    });
                } else {
                    $target.css({
                        top: position + 'px'
                    });
                }
            }

            return $this;
        };

        $.fn.next = function() {
            next();
            return $this;
        };

        $.fn.prev = function() {
            prev();
            return $this;
        };

        //Движение каретки
        var changeCurrentOffset = function(isExit) {
            if (currentOffset < 0) {
                currentOffset = 0;
            }
            if (currentOffset > options.maxOffset) {
                currentOffset = options.maxOffset;
            }

            value = -1;

            for (var i = 0; i < options.segments.length - 1 && value < 0; i++) {
                if (options.segments[i].offset < currentOffset && options.segments[i + 1].offset > currentOffset) {
                    if (options.isSteps && isExit) {
                        currentOffset = switchSegmentPosition(i, currentOffset);
                    }
                    value = options.segments[i].value +
                        (currentOffset - options.segments[i].offset) *
                        (options.segments[i + 1].value - options.segments[i].value) /
                        (options.segments[i + 1].offset - options.segments[i].offset);
                }
                if (options.segments[i].offset === currentOffset) {
                    value = options.segments[i].value;
                }
                if (options.segments[i + 1].offset === currentOffset) {
                    value = options.segments[i + 1].value;
                }
            }

            if (options.isHorizontal) {
                $target.css({
                    left: currentOffset + 'px'
                });
            } else {
                $target.css({
                    top: currentOffset + 'px'
                });
            }

            if (options.carriageMoveEvent && !isExit) {
                $this.trigger(options.carriageMoveEvent, {
                    event: 'move',
                    carriageOffset: currentOffset,
                    segmentIndex: i,
                    value: value
                });
            }
            if (options.carriageMoveEndEvent && isExit) {
                $this.trigger(options.carriageMoveEndEvent, {
                    event: 'endMove',
                    carriageOffset: currentOffset,
                    segmentIndex: i,
                    value: value
                });
            }

        };

        var mouseEvent = function(e) {
            if (options.isHorizontal) {
                currentOffset = e.offsetX - $target.width() / 2;
                lastClientCoordinate = e.clientX;
            } else {
                currentOffset = e.offsetY - $target.height() / 2;
                lastClientCoordinate = e.clientY;
            }
            changeCurrentOffset();
        };


        var mouseMove = function(e) {
            if (options.isHorizontal) {
                currentOffset += e.clientX - lastClientCoordinate;
                lastClientCoordinate = e.clientX;
            } else {
                currentOffset += e.clientY - lastClientCoordinate;
                lastClientCoordinate = e.clientY;
            }
            changeCurrentOffset();
        };

        var touchStartEvent = function(e) {
            e = window.event || e.originalEvent;
            var lastClient = options.isHorizontal? e.touches[0].pageX : e.touches[0].pageY;
            $target.add($this).bind("touchmove", function(e) {
                e = window.event || e.originalEvent;
                var delta = (options.isHorizontal? e.touches[0].pageX : e.touches[0].pageY) - lastClient;
                lastClientCoordinate = options.isHorizontal? e.touches[0].pageX : e.touches[0].pageY;
                currentOffset += delta;
                changeCurrentOffset();
            });
        };

        $this.add($target).on('touchstart', touchStartEvent);

        $target.on('mousedown',  function(e) {
            if (options.isHorizontal) {
                lastClientCoordinate = e.clientX;
            } else {
                lastClientCoordinate = e.clientY;
            }
            $this.on('mousemove', mouseMove);
            e.stopPropagation();
        });

        $this.on('mousedown', function(e) {
            mouseEvent(e);
            $this.on('mousemove', mouseMove);
        });


        $target.on('mouseout', function(e) {
            if ($this.get(0) !== $(e.toElement).get(0)) {
                $this.off('mousemove', mouseMove);
                changeCurrentOffset(true);
            }
            e.stopPropagation();
        });

        $this.on('mouseout', function(e) {
            if ($(e.toElement).get(0) !== $target.get(0)) {
                $this.off('mousemove', mouseMove);
                changeCurrentOffset(true);
            }
        });

        $this.on('mouseup ', function() {
            $this.off('mousemove', mouseMove);
            changeCurrentOffset(true);
        });

        return $(this);
    };
}(jQuery);