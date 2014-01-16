/**
 * UIPageScrolling.js v0.8
 *
 * JQuery plugin
 *
 * by Nikita Mostovoy
 */

(function($) {

    /**
     * Стандарные настройки
     * section {String} - селектор элементов
     * easing {String} - transition-timing-function
     * time {Number} - время анимации
     * beforeMoveFunc {Function} - функция, выполняющаяся перед анимацией
     * afterMoveFunc {Function} - функция, выполняющаяся после анимации
     * isCyclic {Boolean} - циклическое переключение "слайдов"
     * isVertical {Boolean} - вертикальная прокрутка, false = горизонтальная
     * sectionsControl {String} - селектор на выбор секции
     * captureKeyboard {Boolean} - управление как мышкой, так и клавиатурой
     */
    var defaults = {
        sections : "section",
        easing : "ease",
        time : 1000,
        beforeMoveFunc : null,
        afterMoveFunc : null,
        isCyclic : false,
        isVertical : true,
        sectionsControl : null,
        captureKeyboard : false
    }

    /**
     * Создаем прокрутку по заданному div
     * @param settings - польховательские настройки
     * @returns {*|HTMLElement} JQuery object
     */
    $.fn.UIPageScrolling = function (settings) {
        var options = $.extend({}, defaults, settings),
            index = 0,
            current = $(this),
            maxIndex = 0,
            lockNext = false,
            lockPrev = false;

        /**
         * переход на слайд по заданному индексу
         * @param index
         */
        function moveTo(index) {
            current.transformPageTo(index * 100, options, index);
        }

        /**
         * Переход на следующий слайд
         */
        function moveNext() {
            if (lockNext) return;
            var lastIndex = $('.ui-page-scrolling-section_active').attr('data-index');
            lastIndex++;
            if (lastIndex > maxIndex && options.isCyclic) lastIndex = 0;
            if (lastIndex <= maxIndex) {
                lockNext = true;
                lockPrev = false;
                moveTo(lastIndex);
            }
        }

        /**
         * Переход на предыдущий слайд
         */
        function movePrevious() {
            if (lockPrev) return;
            var lastIndex = $('.ui-page-scrolling-section_active').attr('data-index');
            lastIndex--;
            if (lastIndex < 0 && options.isCyclic) lastIndex = maxIndex;
            if (lastIndex >= 0) {
                lockNext = false;
                lockPrev = true;
                moveTo(lastIndex);
            }
        }

        /**
         * Обработка нажатия клавиши
         * @param {Event} e
         */
        function processKeyEvent(e) {
            switch (e.keyCode) {
                case 38:
                case 37:
                case 33:
                    movePrevious();
                    break;
                case 40:
                case 39:
                case 34:
                    moveNext();
                    break;
            }

        }

        /**
         * Работа с колесом мышки
         * @param e
         */
        function processMouseWheel(e) {
              var event = window.event || e.originalEvent,
                  delta = event.wheelDelta || (-120) * event.detail,
                  topDelta = 200;

              if (event.wheelDelta) topDelta = 10;
              if (delta < -topDelta) moveNext();
              if (delta > topDelta) movePrevious()

        }

        //настройка слайдов (положение, data-аттрибуты)
        current.children(options.sections)
            .addClass("ui-page-scrolling-section").each(function () {
                if (options.isVertical) {
                    $(this).css({top: index * 100 + "%"});
                } else {
                    $(this).css({left: index * 100 + "%"});
                }
                $(this).attr('data-index',index++);
            })
          //  .bind("mousewheel", processMouseWheel);


        maxIndex = index-1;

        //Настройка переключателей (если есть)
        index = 0;
        if (options.sectionsControl) {
            $(options.sectionsControl)
                .addClass("ui-page-scrolling-control").each(function () {
                    $(this).attr('data-index', index++).bind("click keypress", function () {
                        moveTo($(this).attr('data-index'));
                    });
                });
        }

        /**
         * убирает блокировки на скроллинг
         */
        options.lockManager = function() {
            lockNext = false;
            lockPrev = false;
        }

        current.addClass('ui-page-scrolling-main')
            .transformPageTo(0, options, 0)
            .bind("mousewheel DOMMouseScroll", processMouseWheel);

        if (options.captureKeyboard) {
            $(window).bind("keydown", processKeyEvent);
        }


        return $(this);
    }

    /**
     * Перевод слайда к заданному
     * @param position - позиция (в процентах)
     * @param options - опции
     * @param index - индекс целевого слайда
     * @returns {*|HTMLElement}
     */
    $.fn.transformPageTo = function (position, options, index) {

        var positionX = 0,
            positionY = 0;

        $('.ui-page-scrolling-section_active').removeClass('ui-page-scrolling-section_active');
        $('.ui-page-scrolling-control_active').removeClass('ui-page-scrolling-control_active');

        $('.ui-page-scrolling-control[data-index=' + index + ']').addClass('ui-page-scrolling-control_active');
        $('.ui-page-scrolling-section[data-index=' + index + ']').addClass('ui-page-scrolling-section_active');
        if (options.beforeMoveFunc instanceof Function) options.beforeMoveFunc(index);

        if (position > 0) {
            position = -position;
        }

        if (options.isVertical) {
            positionY = position;
        } else {
            positionX = position;
        }

        $(this).css({
            "-webkit-transform": "translate3d(" + positionX + "%, " + positionY + "%, 0)",
            "-webkit-transition": "all " + options.time + "ms " + options.easing,
            "-moz-transform": "translate3d(" + positionX + "%, " + positionY + "%, 0)",
            "-moz-transition": "all " + options.time + "ms " + options.easing,
            "-ms-transform": "translate3d(" + positionX + "%, " + positionY + "%, 0)",
            "-ms-transition": "all " + options.time + "ms " + options.easing,
            "transform": "translate3d(" + positionX + "%, " + positionY + "%, 0)",
            "transition": "all " + options.time + "ms " + options.easing
            })
            .one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
                options.lockManager();
                if (options.afterMoveFunc instanceof Function) options.afterMoveFunc(index);
            });

        return $(this);
    }

})(window.jQuery)