(function($) {
    var template = {
        tooltip: '<div class="tooltip"></div>'
    };

    /**
     * UITooltip принимает следующие параметры
     * {String} content - контент тултипа
     * {Number} timeout - задержка до появления тултипа
     */
    var options = {
        content: "",
        timeout: 100
    };

    var TOOLTIP_TOP_OFFSET = 14;

    function UITooltip(element, settings) {
        this.$element = $(element);
        this.options = $.extend({}, options, settings);

        this.$tooltip = $(template.tooltip);
        this.$element.parent().append(this.$tooltip);
        this.$tooltip.html(this.options.content).hide();
        this.handle = 0;

        this.$element.on('mouseenter', function(){
            this.handle = setTimeout(function() {
                this.$tooltip.show();
                setTimeout(function(){
                    this.$tooltip.css({
                        left: function() {
                            var elementMiddle = this.$element.outerWidth() / 2;
                            return elementMiddle - this.$tooltip.outerWidth() / 2;
                        }.bind(this),
                        top: this.$element.position().top + this.$element.height() + TOOLTIP_TOP_OFFSET
                    });
                }.bind(this), 0);
             }.bind(this), this.options.timeout);
        }.bind(this));

        this.$element.on('mouseleave', function(){
            clearTimeout(this.handle);
            this.$tooltip.hide();
        }.bind(this));
    }

    (function(UITooltip) {
        if (typeof define === 'function' && define.amd) {
            //AMD. Анонимный модуль
            define(UITooltip);
        } else if (typeof exports === 'object') {
            //CommonJS
            module.exports = UITooltip;
        } else {
            //Глобальный scope
            window.UITooltip = UITooltip;
        }
    })(UITooltip);

    $(function() {
        $('[data-tooltip]').each(function() {
            new UITooltip(this, {content: $(this).attr('data-tooltip')});
        });
    });

})(jQuery);