!function($) {
    'use strict';


    var defaults = {
        maxOffset: 100,
        carriageMoveEvent: null,
        carriageMoveEndEvent: null,
        segments: [],
        isHorizontal: true,
        isSteps: false,
        computedStepsCount: null
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

        var segmentsSort = function(a,b) {
            if (a.offset > b.offset) {
                return 1;
            }
            if (a.offset < b.offset) {
                return -1;
            }
            return 0;
        };

        var switchSegmentPosition = function(segmentIndex, position) {
            var delta = options.segments[segmentIndex + 1].offset - options.segments[segmentIndex].offset;
            var posDelta = position - options.segments[segmentIndex].offset;
            if (posDelta < (delta / 2)) {
                return  options.segments[segmentIndex].offset;
            }
            return  options.segments[segmentIndex + 1].offset;
        };

        if (!options.segments || options.segments.length === 0) {
            options.segments = [{offset: 0, value: 0},
                                {offset: options.maxOffset, value: options.maxOffset}];
            value = 0;
        }
        options.segments.sort(segmentsSort);
        if (options.isSteps && options.computedStepsCount) {
            computeSteps();
        }

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

        $.fn.getCurrentValue = function() {
            return value;
        };

        $.fn.getCurrentOffset = function() {
            return currentOffset;
        };


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