define(
    'UIComponents/UIHint',
    ['jquery'],
    function($) {
        'use strict';

        var template = {
            hint: '<div class="hint"></div>'
        };

        /**
         * UITooltip принимает следующие параметры
         * {String} content - контент тултипа
         * {Number} timeout - задержка до появления тултипа
         */
        var options = {
            content: '',
            timeout: 100
        };

        var HINT_TOP_OFFSET = 14;

        function UIHint(element, settings) {
            this.$element = $(element);
            this.options = $.extend({}, options, settings);

            this.$hint = $(template.hint);
            this.$element.parent().append(this.$hint);
            this.$hint.html(this.options.content).hide();
            this.handle = 0;

            this.$element.on('mouseenter', function(){
                this.handle = setTimeout(function() {
                    this.$hint
                        .show()
                        .css({
                            left: function() {
                                var elementMiddle = this.$element.outerWidth() / 2;
                                return elementMiddle - this.$hint.outerWidth() / 2;
                            }.bind(this),
                            top: this.$element.position().top + this.$element.height() + HINT_TOP_OFFSET
                        });
                }.bind(this), this.options.timeout);
            }.bind(this));

            this.$element.on('mouseleave', function(){
                clearTimeout(this.handle);
                this.$hint.hide();
            }.bind(this));
        }

        UIHint.create = function(el, options) {
            return new UIHint(el, options);
        };

        $(function() {
            $('[data-hint]').each(function() {
                UIHint.create(this, {content: $(this).attr('data-hint')});
            });
        });

        return UIHint;
    }
);