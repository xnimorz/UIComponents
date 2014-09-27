!function($) {
    'use strict';

    (function(Dropdown) {
        if (typeof define === 'function' && define.amd) {
            //AMD. Анонимный модуль
            define(Dropdown);
        } else if (typeof exports === 'object') {
            //CommonJS
            module.exports = Dropdown;
        } else {
            //Глобальный scope
            window.Dropdown = Dropdown;
        }
    })(Dropdown);

    /**
     * target - родительский элемент. Если определено null - dropdown будет находиться в том же блоке,
     *      что и активный элемент (вызывающий дропдаун)
     *
     * position - положение dropdown'a. Возможные значения:
     *      'top' - сверху
     *      'bottom' - снизу (по умолчанию)
     *      'left' - слева
     *      'right' - справа
     *
     * arrow - положение стрелки. возможные значения
     *      'start' - стрелка расположена ближе к началу дропдауна
     *      'middle' - стрелка расположена в середине дропдауна
     *      'end' - стрелка расположена ближе к концу дропдауна
     *      null -  не отображать стрелку (по умолчанию)
     *
     * size - задает размеры dropdown'а. по умолчанию auto - dropdown определяет свой размер автоматически.
     *      формат данных - структура {width: ширина в px, height: высота в px}
     *
     * content - контент дропдауна. Принимает html, которую dropdown будет использовать как контент.
     *      Если content не определен, контент будет определяться по data-dropdown-content аттрибуту у активного элемента
     *
     * close - закртие дропдауна.
     *      'auto' - закрытие дропдауна происходит при нажатии на любую область не принадлежащую дропдауну (по умолчанию)
     *      'manual' - закрытие дропдауна только при нажатии на активный элемент или с помощью другого скрипта
     */
    var defaults = {
        target: null,
        position: 'bottom',
        size: 'auto',
        content: null,
        arrow: null,
        close: 'auto'
    };

    var templates = {
        dropdown: '<div class="dropdown"/>',
        dropdownContent: '<div class="dropdown__content"/>',
        arrow: '<div class="dropdown__arrow"/>'
    };

    var constants = {
        dropdownOffset: 14,
        arrowOffset: 5
    };

    function Dropdown(el, options) {
        this.options = $.extend({}, defaults, options);
        this.$el = $(el);
        this.trigger = false;
        this.checkClose = this.checkClose.bind(this);

        this.$content = $(templates.dropdownContent);
        this.$content.html(this.options.content || this.$el.attr('data-dropdown-content'));

        this.$dropdown = $(templates.dropdown);

        if (this.options.arrow) {
            this.$arrow = $(templates.arrow);
            this.$dropdown.append(this.$arrow);
        } else {
            this.$arrow = null;
        }

        this.$dropdown.css('display', 'none').append(this.$content);

        this.$target = this.options.target ? $(this.options.target) : this.$el.parent();
        this.$target.append(this.$dropdown);

        this.$el.on('click', this.open.bind(this));
    }

    Dropdown.prototype = {
        checkClose: function(e) {
            if (this.$dropdown[0] !== e.target && e.target !== this.$el[0]) {
                this.close();
            }
        },

        open: function(e) {
            if (this.trigger) {
                this.close();
                return;
            }
            this.trigger = true;
            var size;
            if (typeof this.options.size === 'string') {
                this.$dropdown.css('display', 'block');
                size = {
                    width: parseInt(this.$dropdown.css('width'), 10),
                    height: parseInt(this.$dropdown.css('height'), 10)
                };
            } else {
                size = this.options.size;
                this.$dropdown.css({
                    width: size.width,
                    height: size.height
                });
            }

            this['show' + this.options.position[0].toUpperCase() + this.options.position.slice(1)](size);
            $('body').on('click', this.checkClose);
            this.$dropdown.on('click', function(e) {
                e.stopPropagation();
            });
        },

        showTop: function(size) {
            this.$dropdown.css({
                position: 'absolute',
                top: (!this.options.target ? this.$el.position().top : this.$el.offset().top) - size.height - constants.dropdownOffset,
                left: this.calculateLeft('bottom', size)
            });
        },

        showBottom: function(size) {
            this.$dropdown.css({
                position: 'absolute',
                top: (!this.options.target ? this.$el.position().top : this.$el.offset().top) + this.$el.height() + constants.dropdownOffset,
                left: this.calculateLeft('top', size)
            });
        },

        showRight: function(size) {
            this.$dropdown.css({
                position: 'absolute',
                left: (!this.options.target ? this.$el.position().left : this.$el.offset().left) + this.$el.width() + constants.dropdownOffset,
                top: this.calculateTop('left', size)
            });
        },

        showLeft: function(size) {
            this.$dropdown.css({
                position: 'absolute',
                left: (!this.options.target ? this.$el.position().left : this.$el.offset().left) - size.width - constants.dropdownOffset,
                top: this.calculateTop('right', size)
            });
        },

        calculateLeft: function(direction, size) {
            var position = this.options.arrow || 'middle';
            var arrowWidth = 0;
            if (this.$arrow) {
                this.$arrow.addClass('dropdown__arrow_direction_' + direction);
                this.$arrow.css({
                    top: direction === 'bottom' ? size.height : - this.$arrow.outerHeight(),
                    left: this.calculateVerticalArrow(position, size)
                });
                arrowWidth = this.$arrow.outerWidth();
            }
            if (position === 'start') {
                return (!this.options.target ? this.$el.position().left : this.$el.offset().left) - arrowWidth / 2;
            }
            var elWidth = parseInt(this.$el.css('width'), 10);
            if (position === 'middle') {
                var leftDelta = elWidth / 2;
                return (!this.options.target ? this.$el.position().left : this.$el.offset().left) + leftDelta - size.width / 2;
            }
            if (position === 'end') {
                return (!this.options.target ? this.$el.position().left : this.$el.offset().left) + elWidth - size.width + arrowWidth / 2;
            }
        },

        calculateTop: function(direction, size) {
            var position = this.options.arrow || 'middle';
            var arrowHeight = 0;
            if (this.$arrow) {
                this.$arrow.addClass('dropdown__arrow_direction_' + direction);
                this.$arrow.css({
                    left: direction === 'right' ? size.width - 1 : - this.$arrow.outerWidth(),
                    top: this.calculateHorizontalArrow(position, size)
                });
                arrowHeight = this.$arrow.outerHeight();
            }
            if (position === 'start') {
                return (!this.options.target ? this.$el.position().top : this.$el.offset().top) - arrowHeight / 2;
            }
            var elHeight = parseInt(this.$el.css('height'), 10);
            if (position === 'middle') {
                var topDelta = elHeight / 2;
                return (!this.options.target ? this.$el.position().top : this.$el.offset().top) + topDelta - size.height / 2;
            }
            if (position === 'end') {
                return (!this.options.target ? this.$el.position().top : this.$el.offset().top) + elHeight - size.height + arrowHeight /2;
            }
        },

        close: function() {
            this.$dropdown.hide();
            this.trigger = false;
            $('body').off('click', this.checkClose);
        },

        changeContent: function(e, content) {
            this.$content.html(content || e);
        },

        calculateVerticalArrow: function(direction, size) {
            if (direction === 'start') {
                return constants.arrowOffset;
            }
            if (direction === 'end') {
                return size.width - constants.arrowOffset - this.$arrow.outerWidth();
            }
            return (size.width - this.$arrow.outerWidth()) / 2;
        },

        calculateHorizontalArrow: function(direction, size) {
            if (direction === 'start') {
                return constants.arrowOffset;
            }
            if (direction === 'end') {
                return size.height - constants.arrowOffset - this.$arrow.outerHeight();
            }
            return (size.height - this.$arrow.outerHeight()) / 2;
        },

        bindFunctions: function() {
            var open = this.open.bind(this);
            this.$el.on('click', open);
            this.$el.on('open:dropdown', open);
            this.$el.on('close:dropdown', this.close.bind(this));
            this.$el.on('change:dropdown', this.changeContent.bind(this));
        },

        constructor: Dropdown
    };


}(jQuery);
