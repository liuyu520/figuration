/**
 * --------------------------------------------------------------------------
 * Figuration (v3.0.0-alpha.2): popover.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    if ($.fn.CFW_Tooltip === undefined) throw new Error('CFW_Popover requires CFW_Tooltip');

    var CFW_Widget_Popover = function(element, options) {
        this.dragAdded = false;
        this.docAdded = false;
        this.keyTimer = null;
        this.keyDelay = 750;
        this.flags = {
            keyShift: false,
            keyTab : false
        };

        this._init('popover', element, options);
    };

    CFW_Widget_Popover.DEFAULTS = $.extend({}, $.fn.CFW_Tooltip.Constructor.DEFAULTS, {
        placement   : 'top',        // Where to locate popover (top/bottom/left/right/auto)
        trigger     : 'click',      // How popover is triggered (click/hover/focus/manual)
        content     : '',           // Content text/html to be inserted
        drag        : false,        // If the popover should be draggable
        dragtext    : '<span aria-hidden="true">+</span>', // Text for drag handle
        dragsrtext  : 'Drag',       // Screen reader text for drag handle
        dragstep     : 10,          // 'Drag' increment for keyboard
        template    : '<div class="popover"><h3 class="popover-header"></h3><div class="popover-body"></div><div class="popover-arrow"></div></div>'
    });

    CFW_Widget_Popover.prototype = $.extend({}, $.fn.CFW_Tooltip.Constructor.prototype);

    CFW_Widget_Popover.prototype.constructor = CFW_Widget_Popover;

    CFW_Widget_Popover.prototype.getDefaults = function() {
        return CFW_Widget_Popover.DEFAULTS;
    };

    CFW_Widget_Popover.prototype.createTip = function() {
        var $tip = $(this.settings.template);
        return $tip;
    };

    CFW_Widget_Popover.prototype.setContent = function() {
        var $tip = this.$target;
        var $title = $tip.find('.popover-header');
        var $content = $tip.find('.popover-body');

        if (this.dynamicTip) {
            var title = this.getTitle();
            var content = this.getContent();

            if (this.settings.html) {
                $title.html(title);
                if (typeof content == 'string') {
                    $content.html(content);
                } else {
                    $content.empty().append(content); // Use append for objects to keep js events
                }
            } else {
                $title.text(title);
                $content.text(content);
            }
        }

        // Use '.popover-header' for labelledby
        if ($title.length) {
            var labelledby = $title.eq(0).CFW_getID('cfw-popover');
            this.$target.attr('aria-labelledby', labelledby);
        }

        if (this.settings.drag && !this.dragAdded) {
            if (this.$target.find('[data-cfw-drag="' + this.type + '"]').length <= 0) {
                var $drag = $('<span role="button" tabindex="0" class="drag" data-cfw-drag="' + this.type +  '" aria-label="' + this.settings.dragsrtext + '">' + this.settings.dragtext + '</span>');
                $drag.insertAfter(this.$target.find('.close').eq(0));
                this.dragAdded = true;
            }
        }

        if (this.$target.find('[data-cfw-drag="' + this.type + '"]').length) {
            this.$target.addClass('draggable');
            // Force settings
            this.settings.trigger = 'click';
            this.settings.container = 'body';
            // Enable drag handlers
            this.enableDrag();
        }

        $tip.removeClass('fade in top bottom left right');

        if (!$title.html()) { $title.hide(); }

        if (this.isDialog && !this.docAdded) {
            // Inject a role="document" container
            var $children = this.$target.children().not(this.$arrow);
            var docDiv = document.createElement('div');
            docDiv.setAttribute('role', 'document');
            $children.wrapAll(docDiv);
            // Make sure arrow is at end of popover for roles to work properly with screen readers
            this._arrow();
            this.$arrow.appendTo(this.$target);
            this.docAdded = true;
        }
    };

    CFW_Widget_Popover.prototype.getContent = function() {
        var content;
        var $e = this.$element;
        var s = this.settings;

        content = (typeof s.content == 'function' ? s.content.call($e[0]) :  s.content);

        return content;
    };

    CFW_Widget_Popover.prototype.enableDrag = function() {
        var $selfRef = this;
        var limit = {};

        var dragOpt = { handle: '[data-cfw-drag="' + this.type + '"]' };

        // Unset any previous drag events
        this.$target.off('.cfw.drag');

        this.$target.on('dragStart.cfw.drag', function() {
            var $viewport = $selfRef.$viewport;

            limit = $viewport.offset();
            limit.bottom = limit.top + $viewport.outerHeight() - $(this).outerHeight();
            limit.right = limit.left + $viewport.outerWidth() - $(this).outerWidth();

            $selfRef._updateZ();
            $selfRef.$element.CFW_trigger('dragStart.cfw.' + $selfRef.type);
        })
        .on('drag.cfw.drag', function(e) {
            var viewportPadding = $selfRef.settings.padding;

            $(this).css({
                top: Math.min((limit.bottom - viewportPadding), Math.max((limit.top + viewportPadding), e.offsetY)),
                left: Math.min((limit.right - viewportPadding), Math.max((limit.left + viewportPadding), e.offsetX))
            });
        })
        .on('dragEnd.cfw.drag', function() {
            $selfRef.$element.CFW_trigger('dragEnd.cfw.' + $selfRef.type);
        })
        .on('keydown.cfw.drag', '[data-cfw-drag="' + this.type + '"]', function(e) {
            if (/(37|38|39|40)/.test(e.which)) {
                if (e) { e.stopPropagation(); }

                if (!$selfRef.keyTimer) {
                    $selfRef.$element.CFW_trigger('dragStart.cfw.' + $selfRef.type);
                }

                clearTimeout($selfRef.keyTimer);

                var $viewport = $selfRef.$viewport;
                var viewportPadding = $selfRef.settings.padding;

                var $node = $selfRef.$target;
                var step = $selfRef.settings.dragstep;
                limit = $viewport.offset();
                limit.bottom = limit.top + $viewport.outerHeight() - $node.outerHeight();
                limit.right = limit.left + $viewport.outerWidth() - $node.outerWidth();
                var nodeOffset = $node.offset();
                // Mitigate most of 'slippage' by rounding offsets
                var offsetY = Math.round(nodeOffset.top);
                var offsetX = Math.round(nodeOffset.left);

                // Revise offset
                switch (e.which) {
                    /* Left  */ case 37: { offsetX = offsetX - step; break; }
                    /* Up    */ case 38: { offsetY = offsetY - step; break; }
                    /* Right */ case 39: { offsetX = offsetX + step; break; }
                    /* Down  */ case 40: { offsetY = offsetY + step; break; }
                }

                // Move it
                $node.css({
                    top: Math.min((limit.bottom - viewportPadding), Math.max((limit.top + viewportPadding), offsetY)),
                    left: Math.min((limit.right - viewportPadding), Math.max((limit.left + viewportPadding), offsetX))
                });

                $selfRef.keyTimer = setTimeout(function() {
                    $selfRef.$element.CFW_trigger('dragEnd.cfw.' + $selfRef.type);
                    $selfRef.keyTimer = null;
                }, $selfRef.keyDelay);

                // Stop browser from scrolling
                return false;
            }
        });

        this.$target.CFW_Drag(dragOpt);
    };

    CFW_Widget_Popover.prototype.hide = function(force) {
        // Fire key drag end if needed
        if (this.keyTimer) {
            this.$element.CFW_trigger('dragEnd.cfw.' + this.type);
            clearTimeout(this.keyTimer);
        }
        // Call tooltip hide
        $.fn.CFW_Tooltip.Constructor.prototype.hide.call(this, force);
    };

    CFW_Widget_Popover.prototype._removeDynamicTip = function() {
        this.$target.detach();
        this.dynamicTip = false;
        this.closeAdded = false;
        this.dragAdded = false;
        this.docAdded = false;
        this.$arrow = false;
        this.$target = null;
    };

    CFW_Widget_Popover.prototype._updateZ = function() {
        // Find highest z-indexed visible popover
        var zMax = 0;
        var $zObj = null;
        $('.popover:visible').each(function() {
            var zCurr = parseInt($(this).css('z-index'), 10);
            if (zCurr > zMax) {
                zMax = zCurr;
                $zObj = $(this);
            }
        });
        // Only increase if highest is not current popover
        if (this.$target[0] !== $zObj[0]) {
            this.$target.css('z-index', ++zMax);
        }
    };

    CFW_Widget_Popover.prototype._arrow = function() {
        if (!this.$arrow) {
            this.$arrow = this.$target.find('.arrow, .popover-arrow');
        }
        return this.$arrow;
    };

    CFW_Widget_Popover.prototype._unlinkCompleteExt = function() {
        this.dragAdded = null;
        this.docAdded = null;
        this.keyTimer = null;
        this.keyDelay = null;
    };

    function Plugin(option) {
        var args = [].splice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.popover');
            var options = typeof option === 'object' && option;

            if (!data && /unlink|dispose|hide/.test(option)) {
                return false;
            }
            if (!data) {
                $this.data('cfw.popover', (data = new CFW_Widget_Popover(this, options)));
            }
            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    }

    $.fn.CFW_Popover = Plugin;
    $.fn.CFW_Popover.Constructor = CFW_Widget_Popover;

})(jQuery);
