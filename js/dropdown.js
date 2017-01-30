/**
 * --------------------------------------------------------------------------
 * Figuration (v2.0.0): dropdown.js
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function($) {
    'use strict';

    // Includes touch recognition fix for IE11
    // Partially from: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/touchevents.js
    /* global DocumentTouch */
    var $msTouch = window.navigator.msMaxTouchPoints === undefined ? false : window.navigator.msMaxTouchPoints;
    var $isTouch = (('ontouchstart' in window) || $msTouch || window.DocumentTouch && document instanceof DocumentTouch) ? true : false;

    var CFW_Widget_Dropdown = function(element, options) {
        this.$element = $(element);
        this.$target = null;

        this.timerHide = null;

        var parsedData = this.$element.CFW_parseData('dropdown', CFW_Widget_Dropdown.DEFAULTS);
        this.settings = $.extend({}, CFW_Widget_Dropdown.DEFAULTS, parsedData, options);
        this.settings.isTouch = $isTouch;   // Touch enabled-browser flag - override not allowed

        this.c = CFW_Widget_Dropdown.CLASSES;

        this._init();
    };

    CFW_Widget_Dropdown.CLASSES = {
        // Class names
        isMenu      : 'dropdown-menu',
        hasSubMenu  : 'dropdown-submenu',
        showSubMenu : 'show-menu',
        backdrop    : 'dropdown-backdrop',
        backLink    : 'dropdown-back',
        hover       : 'dropdown-hover'
    };

    CFW_Widget_Dropdown.DEFAULTS = {
        toggle   : null,
        delay    : 350,     // Delay for hiding menu (milliseconds)
        hover    : false,   // Enable hover style navigation
        backlink : false,   // Insert back links into submenus
        backtop  : false,   // Should back links start at top level
        backtext : 'Back'   // Text for back links
    };

    function getParent($node) {
        var $parent;
        var selector = $node.attr('data-cfw-dropdown-target');
        if (selector) {
            $parent = $(selector);
        }
        if ($parent && $parent.length) {
            return $parent;
        } else {
            return $node.parent();
        }
    }

    function clearMenus(e) {
        // Ignore right-click
        if (e && e.which === 3) { return; }
        // Find currently open menu root
        $('[data-cfw="dropdown"]').each(function() {
            var $parent = getParent($(this));
            if (!$parent.hasClass('open')) { return; }
            $(this).CFW_Dropdown('hideRev');
        });
    }

    CFW_Widget_Dropdown.prototype = {
        _init : function() {
            var $selfRef = this;

            // Get target menu
            var menuID = this.settings.toggle;
            // if ((menuID === undefined) || (menuID.length <= 0)) { return false; }

            // Find target by id/css selector
            var $target = $(this.settings.toggle);
            if (menuID !== undefined && !$target.length) {
                $target = $('[data-cfw-dropdown-target="' + menuID + '"]');
            }
            // Target by href selector
            if (!$target.length) {
                var selector = this.$element.attr('href');
                selector = selector && /#[]A-Za-z]/.test(selector);
                if (selector) {
                    $target = $(selector);
                }
                // $target = $(this.$element.attr('href'));
            }
            // Target by sibling class
            if (!$target.length) {
                $target = $(this.$element.siblings('.dropdown-menu')[0]);
            }
            if (!$target.length) { return false; }
            this.$target = $target;

            this.$element.attr('data-cfw', 'dropdown');

            // Check for presence of trigger id - set if not present
            var triggerID = this.$element.CFW_getID('cfw-dropdown');

            // Top Level: add ARIA/roles and define all sub-menu links as menuitem (unless 'disabled')
            // Set tabindex=-1 so that sub-menu links can't receive keyboard focus from tabbing

            // Check for id on top level menu - set if not present
            menuID = this.$target.CFW_getID('cfw-dropdown');
            this.$target.attr({
                'aria-hidden': 'true',
                'aria-labelledby': triggerID
            })
            .addClass(this.c.isMenu);
            $('a', this.$target).attr('tabIndex', -1).not('.disabled, :disabled');

            // Set ARIA on trigger
            this.$element.attr({
                'aria-haspopup': 'true',
                'aria-expanded': 'false'
            });

            if (this.settings.backlink && this.settings.backtop) {
                var $backTop = $('<li class="' + this.c.backLink + '"><a href="#">' + this.settings.backtext + '</a></li>')
                    .prependTo(this.$target);
                if (this.$target.hasClass('dropdown-menu-left')) {
                    $backTop.addClass('dropdown-back-left');
                }
            }

            // Check for sub menu items and add indicator, id, and direction as needed
            this.$target.find('ul').each(function() {
                var $subMenu = $(this);
                var $subLink = $subMenu.closest('li').find('a').eq(0);
                var subLinkID = $subLink.CFW_getID('cfw-dropdown');
                // var subMenuID = $subMenu.CFW_getID('cfw-dropdown');

                var $dirNode = $subMenu.closest('.dropdown-menu-left, .dropdown-menu-right');
                if ($dirNode.hasClass('dropdown-menu-left')) {
                    $subMenu.closest('li').addClass('dropdown-subalign-left');
                } else {
                    $subMenu.closest('li').addClass('dropdown-subalign-right');
                }

                if ($selfRef.settings.backlink) {
                    var $backElm = $('<li class="' + $selfRef.c.backLink + '"><a href="#">' + $selfRef.settings.backtext + '</a></li>')
                        .prependTo($subMenu);
                    if ($dirNode.hasClass('dropdown-menu-left')) {
                        $backElm.addClass('dropdown-back-left');
                    }
                }

                $subMenu.attr({
                    // 'role': 'menu',
                    'aria-hidden': 'true',
                    'aria-labelledby': subLinkID
                })
                .addClass($selfRef.c.isMenu)
                .closest('li').addClass($selfRef.c.hasSubMenu);

                $subLink.attr({
                    'aria-haspopup': 'true',
                    'aria-expanded': 'false'
                });
            });

            // Set role on dividers
            $('.dropdown-divider', this.$target).attr('role', 'separator');

            // Touch OFF - Hover mode
            if (!this.settings.isTouch && this.settings.hover) {
                this.navEnableHover();
            }

            // Default Mode - Click mode
            // Touch ON - handle click/tap style navigation
            this.navEnableClick();

            // Always on - Keyboard navigation
            this.navEnableKeyboard();

            // Loss of focus
            /*
             ** Causing issues with nested dropdowns on touchscreen **
             *
            $(this.$element).add(this.$target).on('focusout.cfw.dropdown', function(e) {
                // Need slight delay or <body> will always be reported
                setTimeout(function() {
                    if (!$.contains($selfRef.$target[0], document.activeElement)
                        && $selfRef.$element[0] != document.activeElement) {
                        $selfRef.hideRev();
                    }
                }, 150);
            });
            */

            this.$element.CFW_trigger('init.cfw.dropdown');
        },

        navEnableClick : function() {
            var $selfRef = this;
            // Trigger
            this.$element.on('click.cfw.dropdown.modeClick', function(e) {
                $selfRef.toggleMenu(e, $selfRef.$element, $selfRef.$target);
            });
            // Sub menu
            var $subelement = this.$target.find('ul').closest('li').find('a:eq(0)');
            if ($subelement.length) {
                $subelement.on('click.cfw.dropdown.modeClick', function(e) {
                    var $subMenuElm = $(this).parent().find('ul').eq(0);
                    $selfRef.toggleMenu(e, $(this), $subMenuElm);
                });
            }
            // Back link
            var $backLinkElm = this.$target.find('.' + this.c.backLink);
            if ($backLinkElm.length) {
                $backLinkElm.on('click.cfw.dropdown.modeClick', function(e) {
                    if (e) {
                        e.stopPropagation();
                        e.preventDefault();
                    }

                    if ($selfRef.settings.backtop && ($(this).closest('ul')[0] == $selfRef.$target[0])) {
                        $selfRef.closeUp($(this).closest('li'));
                    } else {
                        $selfRef.closeUp($(this).closest('.' + $selfRef.c.hasSubMenu));
                    }
                });
            }
        },

        navEnableHover : function() {
            var $selfRef = this;
            if (!this.settings.isTouch) {
                $.each([this.$element, this.$target, this.$target.find('.' + this.c.hasSubMenu)], function() {
                    $(this).on('mouseenter.cfw.dropdown.modeHover', function(e) {
                        $selfRef._actionsHoverEnter(e, this);
                    });
                    $(this).on('mouseleave.cfw.dropdown.modeHover', function(e) {
                        $selfRef._actionsHoverLeave(e, this);
                    });
                });
            }
        },

        navDisableHover : function() {
            this.$element.off('.cfw.dropdown.modeHover');
            this.$target.find('.' + this.c.hasSubMenu).off('.cfw.dropdown.modeHover');
        },

        navEnableKeyboard : function() {
            var $selfRef = this;

            // Auto-closing of inactive sub menus
            this.$target.find('a').on('focus.cfw.dropdown', function() {
                var $node = $(this);
                $selfRef.$target.find('.' + $selfRef.c.hasSubMenu + '.open').each(function() {
                    // Ignore parents of item being focused - needed for nesting
                    if (!$(this).find($node).length) {
                        var $snode = $(this).children('a');
                        var $ssubNode = $node.parent().find('ul').eq(0);
                        $selfRef.hideMenu(null, $snode, $ssubNode);
                    }
                });
            });

            // Key handling
            $.each([this.$element, this.$target, this.$target.find('.' + this.c.hasSubMenu)], function() {
                $(this).on('keydown.cfw.dropdown', function(e) {
                    $selfRef._actionsKeydown(e, this);
                });
            });
        },

        toggleMenu : function(e, $trigger, $menu) {
            if ($trigger.add().parent().is('.disabled, :disabled')) { return; }

            var $parent  = getParent($trigger);
            var showing = $parent.hasClass('open');

            // Check to see if link should be followed (sub-menu open and link is not '#')
            var nodeHref = $trigger.attr('href');
            if (nodeHref && !(/^#$/.test(nodeHref)) && showing) {
                clearMenus();
                return;
            }

            if (e) e.stopPropagation();

            if (!showing) {
                this.showMenu(e, $trigger, $menu);
            } else {
                this.hideMenu(e, $trigger, $menu);
            }

            $trigger.trigger('focus');
        },

        showMenu : function(e, $trigger, $menu) {
            var $selfRef = this;

            if (e) e.preventDefault();

            var $parent  = getParent($trigger);
            var showing = $parent.hasClass('open');
            if (showing) { return; }

            if (!$trigger.CFW_trigger('beforeShow.cfw.dropdown')) {
                return;
            }

            if ($trigger.is(this.$element)) {
                if (this.settings.isTouch) {
                    $('.' + this.c.backdrop).remove();
                    $(document.createElement('div'))
                        .addClass(this.c.backdrop)
                        .insertAfter(this.$target)
                        .on('click.cfw.dropdown', clearMenus);
                }
                clearMenus();
                if (!$parent.hasClass(this.c.hover)) {
                    $trigger.trigger('focus');
                }
            }

            // Find other open sub menus and close them
            this.$target.find('.' + this.c.hasSubMenu + '.open').each(function() {
                // Ignore parents of item to be shown - needed for nesting
                if (!$(this).find($trigger).length) {
                    var $snode = $(this).children('a');
                    var $ssubNode = $trigger.parent().find('ul').eq(0);
                    $selfRef.hideMenu(null, $snode, $ssubNode);
                }
            });

            $parent.addClass('open');
            $trigger.attr('aria-expanded', 'true');
            $menu.removeAttr('aria-hidden');
            //  .children('li').not('.disabled, :disabled');
            //  .children('a').attr('tabIndex', 0);
            this.$target.find('li').redraw();

            $trigger.CFW_trigger('afterShow.cfw.dropdown');
        },

        hideMenu : function(e, $trigger, $menu) {
            if (e) e.preventDefault();

            var $parent  = getParent($trigger);
            var showing = $parent.hasClass('open');
            if (!showing) { return; }

            if (!$trigger.CFW_trigger('beforeHide.cfw.dropdown')) {
                return;
            }

            if ($trigger.is(this.$element)) {
                $('.' + this.c.backdrop).remove();
            }

            // Find open sub menus
            var openSubMenus = $menu.find('.' + this.c.hasSubMenu + '.open');
            if (openSubMenus.length) {
                var openSubMenusRev = openSubMenus.toArray().reverse();
                for (var i = 0; i < openSubMenusRev.length; i++) {
                    var $node = $(openSubMenusRev[i]).children('a');
                    var $subNode = $node.parent().find('ul').eq(0);
                    this.hideMenu(null, $node, $subNode);
                }
            }

            $parent.removeClass('open');
            $trigger.attr('aria-expanded', 'false');
            $menu.attr('aria-hidden', 'true')
                .find('a').attr('tabIndex', -1);
            if (!$parent.hasClass(this.c.hover)) {
                $trigger.trigger('focus');
            }
            $parent.removeClass(this.c.hover);
            $trigger.CFW_trigger('afterHide.cfw.dropdown');
        },

        toggle : function() {
            this.toggleMenu(null, this.$element, this.$target);
        },

        show : function() {
            this.showMenu(null, this.$element, this.$target);
        },

        hide : function() {
            this.hideMenu(null, this.$element, this.$target);
        },

        hideRev : function() {
            this.hideMenu(null, this.$element, this.$target);
        },

        closeUp : function($node) {
            var $subNode;
            if ($node.hasClass('open')) {
                $node = $node.find('a').eq(0);
            } else {
                $node = $node.closest('.open').find('[data-cfw="dropdown"], a').eq(0);
            }

            $subNode = $node.find('ul').eq(0);
            this.hideMenu(null, $node, $subNode);

            var $parent = getParent($node);
            if (!$parent.hasClass(this.c.hover)) {
                $node.trigger('focus');
            }
            $parent.removeClass(this.c.hover);
        },

        _actionsKeydown : function(e, node) {
            // 37-left, 38-up, 39-right, 40-down, 27-esc, 32-space, 9-tab
            if (!/(37|38|39|40|27|32|9)/.test(e.which)) { return; }

            var $node = $(node);
            var $items = null;

            // Close menu when tab pressed, move to next item
            if (e.which == 9) {
                clearMenus();
                return;
            }

            e.stopPropagation();
            e.preventDefault();

            // Close current focused menu with ESC
            if (e.which == 27) {
                if ($node.is(this.$element) || $node.is(this.$target)) {
                    this.hideMenu(null, this.$element, this.$target);
                    return;
                }
                if ($node.hasClass(this.c.hasSubMenu)) {
                    this.closeUp($node);
                    return;
                }
            }

            // Arrow key navigation
            var $eTarget = $(e.target);
            var $parent = null;

            // Find parent menu
            if ($node.is(this.$element) || $node.is(this.$target)) {
                $parent = this.$target;
            } else {
                $parent = $eTarget.closest('.dropdown-menu');
            }

            $parent.removeClass(this.c.hover);

            // Up/Down
            if (e.which == 38 || e.which == 40) {
                if ($parent.is(':hidden')) {
                    this.showMenu(null, $node, $parent);
                    return;
                }

                $items = $parent.children('li').children('a:not(.disabled):visible');
                if (!$items.length) { return; }

                // Find current focused menu item
                var index = $items.index(e.target);

                if (e.which == 38 && index > 0)                 { index--;   } // up
                if (e.which == 40 && index < $items.length - 1) { index++;   } // down
                if (!~index)                                    { index = 0; } // force first item

                $items.eq(index).trigger('focus');
            } // END - Up/Down

            // Left/Right
            if (e.which == 37 || e.which == 39) {
                // Only for children of menu
                if (!$.contains(this.$target[0], $eTarget[0])) { return; }
                // Only if has submenu class
                if (!$eTarget.closest('li.dropdown-submenu')) { return; }

                // Open/close sub-menu as needed
                var $subMenuElm = $eTarget.parent().find('ul').eq(0);
                var $parMenuElm = $eTarget.closest('li.dropdown-submenu').parent('ul.dropdown-menu');
                var subHidden = $subMenuElm.is(':hidden');
                var parHidden = $parMenuElm.is(':hidden');

                if (e.which == 39 && subHidden) {
                    this.showMenu(null, $eTarget, $subMenuElm);
                    $items = $subMenuElm.children('li').children('a:not(.disabled):visible');
                    $items.eq(0).trigger('focus');
                    return;
                }

                if (e.which == 37 && !parHidden) {
                    this.closeUp($node);
                    return;
                }
            } // END - Left/Right
        },

        _actionsHoverEnter : function(e, node) {
            var $node = $(node);

            clearTimeout(this.timerHide);
            if ($node.is(this.$element)) {
                getParent($node).addClass(this.c.hover);
                this.showMenu(null, this.$element, this.$target);
                return;
            }
            if ($node.hasClass(this.c.hasSubMenu)) {
                $node = $node.find('a').eq(0);
                var $subNode = $node.parent().find('ul').eq(0);
                getParent($node).addClass(this.c.hover);
                this.showMenu(null, $node, $subNode);
                return;
            }
        },

        _actionsHoverLeave : function(e, node) {
            var $selfRef = this;
            var $node = $(node);

            clearTimeout(this.timerHide);
            if ($node.is(this.$element) || $node.is(this.$target)) {
                this.timerHide = setTimeout(function() {
                    $selfRef.timerHide = null;
                    $selfRef.hideMenu(null, $selfRef.$element, $selfRef.$target);
                }, this.settings.delay);
                return;
            }
            if ($node.hasClass(this.c.hasSubMenu)) {
                $node = $node.find('a').eq(0);
                var $subNode = $node.find('ul').eq(0);

                this.timerHide = setTimeout(function() {
                    $selfRef.timerHide = null;
                    $selfRef.hideMenu(null, $node, $subNode);
                }, $selfRef.settings.delay);
                return;
            }
        },

        dispose : function() {
            this.$element.CFW_Dropdown('hideRev');
            this.$target.find('.' + this.c.backLink).remove();
            this.$target.find('.' + this.c.hasSubMenu).off('.cfw.dropdown');
            this.$target.find('a').off('.cfw.dropdown');
            this.$target.off('.cfw.dropdown');
            this.$element
                .off('.cfw.dropdown')
                .removeData('cfw.dropdown');

            this.$element = null;
            this.$target = null;
            this.timerHide = null;
            this.settings = null;
        }
    };

    /*
    $.fn.redraw = function(){
        $(this).each(function(){
            var redraw = this.offsetHeight;
        });
    };
    */
    // Force [lte IE 10] to redraw to correct layout
    // Also force Edge reflow - using bad UA test and method
    // TODO: Need to revisit this to find better options
    // Note: Parent element must be visible in order to redraw
    $.fn.redraw = function() {
        // if ((document.documentMode || 100) <= 10) {
        if (document.documentMode !== undefined){
            return this.hide(0, function() {$(this).show(); $(this).css('display', ''); });
        } else if (/Edge\/\d+/.test(navigator.userAgent)) {
            $(this).css('list-style', 'none').css('list-style', '');
        }
    };

    function Plugin(option) {
        var args = [].splice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('cfw.dropdown');
            var options = typeof option === 'object' && option;

            if (!data) {
                $this.data('cfw.dropdown', (data = new CFW_Widget_Dropdown(this, options)));
            }
            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    }

    $.fn.CFW_Dropdown = Plugin;
    $.fn.CFW_Dropdown.Constructor = CFW_Widget_Dropdown;

    // Handle closing menu when clicked outside of menu area
    $(window).ready(function() {
        $(document).on('click', clearMenus);
    });

})(jQuery);
