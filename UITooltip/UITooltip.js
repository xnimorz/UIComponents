$(function(){
    window.UITooltip = UITooltip;

    var templates = {
        tooltip: '<div class="UITooltip"></div>'
    };

    var options = {
        content: "",
        timeout: 0
    };

    function UITooltip(element, settings) {
        this.$element = $(element);
        this.options = $.extend({}, options, settings);

        this.$tooltip = $(templates.tooltip);
        this.$element.parent().append(this.$tooltip);
        this.$tooltip.html(this.options.content).hide();
        this.handle = 0;

        this.$element.on('mouseenter', function(){
            this.handle = setTimeout(function() {
                this.$tooltip.show();
                setTimeout(function(){
                    this.$tooltip.css({
                        left: function() {
                            var limit = $(window).width();
                            if (this.$tooltip.width() >= limit) {
                                this.$tooltip.css({width: this.$element.width()});
                            }

                            if (this.$element.width() >= this.$tooltip.width()) {
                                return this.$element.position().left + (this.$element.width() - this.$tooltip.width()) / 2;
                            }
                            else {
                                var left = this.$element.offset().left;
                                var offset = (this.$tooltip.width() - this.$element.width()) / 2;
                                if (offset < left && left - offset + this.$tooltip.width() < limit) {
                                    return left - offset + (this.$tooltip.width() / 2);
                                }
                                else {
                                    console.log('Unsupported');
                                }
                            }
                        }.bind(this),
                        top: this.$element.position().top + this.$element.height() + 14
                    });
                    console.log(this.$tooltip.position());
                }.bind(this), 0);
             }.bind(this), this.options.timeout);
        }.bind(this));

        this.$element.on('mouseleave', function(){
            clearTimeout(this.handle);
            this.$tooltip.hide();
        }.bind(this));
    }

    $('[data-tooltip]').each(function() {
        new UITooltip(this, {content: $(this).attr('data-tooltip')});
    });

//    var $tooltip = $('[data-tooltip]');
//    $tooltip.hover(function(){
//        var $tooltip = $(this).append(templates.tooltip).children('.UITooltip');
//        $tooltip.html($(this).attr('data-tooltip')).css({
//            left: (Math.abs(($(this).width() - $tooltip.width())) / 2) + 'px',
//            top: '14px'
//        });
//    }, function(){
//        $('.UITooltip', this).remove();
//    });

});