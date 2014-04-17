!function($) {
    'use strict';


    var defaults = {
        maxOffset: 100,
        carriageMoveEvent: null,
        carriageMoveEndEvent: null,
        segments: [],
        isHorizontal: true
    };

    $.fn.carriage = function(settings) {
        var $this = $(this),
            options = $.extend({}, defaults, settings),
            $target = $this.children(),
            currentOffset = 0,
            lastClientCoordinate = 0;

        var segmentsSort = function(a,b) {
            if (a.offset > b.offset) {
                return 1;
            }
            if (a.offset < b.offset) {
                return -1;
            }
            return 0;
        };

        options.segments.sort(segmentsSort);

        $.fn.changeSegments = function(segments) {
            options.segments = segments;
            options.segments.sort(segmentsSort);
            return $this;
        };

        $.fn.restoreCarriage = function(newValue) {
            if (newValue) {
                var value = newValue;
                var position = -1;

                if (value >= 0) {
                    for (var i = 0; i < options.segments.length - 1 && position < 0; i++) {
                        if (options.segments[i].value < value && options.segments[i + 1].value > value) {
                            position = options.segments[i].offset +
                                (value - options.segments[i].value) *
                                (options.segments[i + 1].offset - options.segments[i].offset) /
                                (options.segments[i + 1].value - options.segments[i].value);

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
                        left: $.toRem(position) + 'rem'
                    });
                } else {
                    $target.css({
                        top: $.toRem(position) + 'rem'
                    });
                }
            }

            return $this;
        };

        var changeCurrentOffset = function() {
            if (currentOffset < 0) {
                currentOffset = 0;
            }
            if (currentOffset > options.maxOffset) {
                currentOffset = options.maxOffset;
            }

            if (options.isHorizontal) {
                $target.css({
                    left: $.toRem(currentOffset) + 'rem'
                });
            } else {
                $target.css({
                    top: $.toRem(currentOffset) + 'rem'
                });
            }

            var value = -1;
            for (var i = 0; i < options.segments.length - 1 && value < 0; i++) {
                if (options.segments[i].offset < currentOffset && options.segments[i + 1].offset > currentOffset) {
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

            if (options.carriageMoveEvent) {
                $this.trigger(options.carriageMoveEvent, {
                    event: 'move',
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
            if (e.fromElement &&
                e.fromElement.className &&
                $(e.fromElement).get(0) === $target.get(0) &&
                $this.get(0) !== $(e.toElement).get(0)) {
                    options.$carriage.off('mousemove', mouseMove);
                    if (options.carriageMoveEndEvent) {
                        $this(options.carriageMoveEndEvent);
                }
            }
            e.stopPropagation();
        });

        $this.on('mouseout', function(e) {
            if (e.fromElement &&
                e.fromElement.className &&
                $(e.fromElement).get(0) === $this.get(0) &&
                $(e.toElement).get(0) !== $target.get(0)) {
                    options.$carriage.off('mousemove', mouseMove);
                    if (options.carriageMoveEndEvent) {
                        $this(options.carriageMoveEndEvent);
                }
            }
        });

        $this.on('mouseup ', function() {
            $this.off('mousemove', mouseMove);
            if (options.carriageMoveEndEvent) {
                $this.trigger(options.carriageMoveEndEvent);
            }
        });

        return $(this);
    };
}(jQuery);