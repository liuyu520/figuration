$(function() {
    'use strict';

    QUnit.module('CFW_Dropdown', {
        beforeEach: function() {
            $(window).scrollTop(0);
        },
        afterEach: function() {
            $('#qunit-fixture').empty();
        }
    });

    QUnit.test('should be defined on jquery object', function(assert) {
        assert.expect(1);
        assert.ok($(document.body).CFW_Dropdown, 'CFW_Dropdown method is defined');
    });

    QUnit.test('should return jquery collection containing the element', function(assert) {
        assert.expect(2);
        var $el = $('<div></div>');
        var $col = $el.CFW_Dropdown();
        assert.ok($col instanceof $, 'returns jquery collection');
        assert.strictEqual($col[0], $el[0], 'collection contains element');
    });

    QUnit.test('should not open dropdown if trigger is disabled via attribute', function(assert) {
        assert.expect(2);

        var dropdownHTML = '<div class="dropdown">' +
            '<button id="dropdown-trigger" type="button" class="btn" data-cfw="dropdown" disabled>Dropdown</button>' +
            '<ul id="dropdown-menu" class="dropdown-menu">' +
            '<li><a href="#">Menu link</a></li>' +
            '</ul>' +
            '</div>';
        var $dropdown = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-cfw="dropdown"]');
        $dropdown.CFW_Dropdown();
        $dropdown.trigger('click');

        assert.ok(!$('#dropdown-trigger').hasClass('open'), '"open" class not added to trigger on click');
        assert.ok(!$('#dropdown-menu').hasClass('open'), '"open" class not added to target on click');
    });

    QUnit.test('should not open dropdown if trigger is disabled via "disabled" class', function(assert) {
        assert.expect(2);

        var dropdownHTML = '<div class="dropdown">' +
            '<a id="dropdown-trigger" href="#" role="button" class="btn disabled" data-cfw="dropdown">Dropdown</a>' +
            '<ul id="dropdown-menu" class="dropdown-menu">' +
            '<li><a href="#">Menu link</a></li>' +
            '</ul>' +
            '</div>';
        var $dropdown = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-cfw="dropdown"]');
        $dropdown.CFW_Dropdown();
        $dropdown.trigger('click');

        assert.ok(!$('#dropdown-trigger').hasClass('open'), '"open" class not added to trigger on click');
        assert.ok(!$('#dropdown-menu').hasClass('open'), '"open" class not added to target on click');
    });

    QUnit.test('should set aria-expanded="true" on trigger when dropdown menu is shown', function(assert) {
        assert.expect(1);

        var dropdownHTML = '<div class="dropdown">' +
            '<button type="button" class="btn" data-cfw="dropdown">Dropdown</button>' +
            '<ul class="dropdown-menu">' +
            '<li><a href="#">Menu link</a></li>' +
            '</ul>' +
            '</div>';
        var $dropdown = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-cfw="dropdown"]');
        $dropdown.CFW_Dropdown();
        $dropdown.trigger('click');

        assert.strictEqual($dropdown.attr('aria-expanded'), 'true', 'aria-expanded is set to string "true" on click');
    });

    QUnit.test('should set aria-expanded="false" on trigger when dropdown menu is hidden', function(assert) {
        assert.expect(1);
        var done = assert.async();
        var dropdownHTML = '<div class="dropdown">' +
            '<button type="button" class="btn" data-cfw="dropdown">Dropdown</button>' +
            '<ul class="dropdown-menu">' +
            '<li><a href="#">Menu link</a></li>' +
            '</ul>' +
            '</div>';
        var $dropdown = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-cfw="dropdown"]');
        $dropdown.CFW_Dropdown();
        $dropdown.trigger('click');

        $dropdown
            .on('afterHide.cfw.dropdown', function() {
                assert.strictEqual($dropdown.attr('aria-expanded'), 'false', 'aria-expanded is set to string "false" on hide');
                done();
            });

        $dropdown.trigger('click');
        $(document.body).trigger('click');
    });

    QUnit.test('should add "open" class to menu if clicked', function(assert) {
        assert.expect(2);
        var dropdownHTML = '<div class="dropdown">' +
            '<button id="dropdown-trigger" type="button" class="btn" data-cfw="dropdown">Dropdown</button>' +
            '<ul id="dropdown-menu" class="dropdown-menu">' +
            '<li><a href="#">Menu link</a></li>' +
            '</ul>' +
            '</div>';
        var $dropdown = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-cfw="dropdown"]');
        $dropdown.CFW_Dropdown();
        $dropdown.trigger('click');

        assert.ok($('#dropdown-trigger').hasClass('open'), '"open" class added to trigger on click');
        assert.ok($('#dropdown-menu').hasClass('open'), '"open" class added to menu on click');
    });

    QUnit.test('should test if element has a # before assuming it\'s a selector', function(assert) {
        assert.expect(1);
        var dropdownHTML = '<div class="dropdown">' +
            '<a id="dropdown-trigger" href="/foo/" role="button" class="btn" data-cfw="dropdown">Dropdown</a>' +
            '<ul id="dropdown-menu" class="dropdown-menu">' +
            '<li><a href="#">Menu link</a></li>' +
            '</ul>' +
            '</div>';
        var $dropdown = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-cfw="dropdown"]');
        $dropdown.CFW_Dropdown();
        $dropdown.trigger('click');

        assert.ok($('#dropdown-menu').hasClass('open'), '"open" class added on click');
    });

    QUnit.test('should remove "open" class if body is clicked', function(assert) {
        assert.expect(4);
        var dropdownHTML = '<div class="dropdown">' +
            '<button id="dropdown-trigger" type="button" class="btn" data-cfw="dropdown">Dropdown</button>' +
            '<ul id="dropdown-menu" class="dropdown-menu">' +
            '<li><a href="#">Menu link</a></li>' +
            '</ul>' +
            '</div>';
        var $dropdown = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-cfw="dropdown"]');
        $dropdown.CFW_Dropdown();
        $dropdown.trigger('click');

        assert.ok($('#dropdown-trigger').hasClass('open'), '"open" class added to trigger on click');
        assert.ok($('#dropdown-menu').hasClass('open'), '"open" class added to menu on click');
        $(document.body).trigger('click');
        assert.ok(!$('#dropdown-trigger').hasClass('open'), '"open" class removed from trigger');
        assert.ok(!$('#dropdown-menu').hasClass('open'), '"open" class removed from menu');
    });

    QUnit.test('should remove "open" class if body is focused', function(assert) {
        assert.expect(4);
        var dropdownHTML = '<div class="dropdown">' +
            '<button id="dropdown-trigger" type="button" class="btn" data-cfw="dropdown">Dropdown</button>' +
            '<ul id="dropdown-menu" class="dropdown-menu">' +
            '<li><a href="#">Menu link</a></li>' +
            '</ul>' +
            '</div>';
        var $dropdown = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-cfw="dropdown"]');
        $dropdown.CFW_Dropdown();
        $dropdown.trigger('click');

        assert.ok($('#dropdown-trigger').hasClass('open'), '"open" class added to trigger on click');
        assert.ok($('#dropdown-menu').hasClass('open'), '"open" class added to menu on click');
        $(document.body).trigger('focusin');
        assert.ok(!$('#dropdown-trigger').hasClass('open'), '"open" class removed from trigger');
        assert.ok(!$('#dropdown-menu').hasClass('open'), '"open" class removed from menu');
    });

    // Cannot reliably emulate spacebar press on true buttons since browsers can use a 'stack' of events
    // Spacebar on a button event order could be: `keydown, kepress, keyup, click`
    // this may not be the correct order for all browsers

    QUnit.test('should toggle "open" class if spacebar used on role="button"', function(assert) {
        assert.expect(4);
        var done = assert.async();
        var dropdownHTML = '<div class="dropdown">' +
            '<a id="dropdown-trigger" role="button" class="btn" data-cfw="dropdown">Dropdown</a>' +
            '<ul id="dropdown-menu" class="dropdown-menu">' +
            '<li><a href="#">Menu link</a></li>' +
            '</ul>' +
            '</div>';
        var $dropdown = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-cfw="dropdown"]');
        var eventSpace = $.Event('keydown', {
            which: 32
        });
        $dropdown.CFW_Dropdown();

        $dropdown
            .on('afterShow.cfw.dropdown', function() {
                assert.ok($('#dropdown-trigger').hasClass('open'), '"open" class added to trigger on spacebar');
                assert.ok($('#dropdown-menu').hasClass('open'), '"open" class added to menu on spacebar');
                // Need new event
                var eventSpace = $.Event('keydown', {
                    which: 32
                });
                $dropdown.trigger(eventSpace);
            })
            .on('afterHide.cfw.dropdown', function() {
                assert.ok(!$('#dropdown-trigger').hasClass('open'), '"open" class on trigger removed');
                assert.ok(!$('#dropdown-menu').hasClass('open'), '"open" class on menu removed');
                done();
            })
            .trigger(eventSpace);
    });

    QUnit.test('should not remove "open" class if tabbing from trigger', function(assert) {
        assert.expect(4);
        var done = assert.async();
        var dropdownHTML = '<div class="dropdown">' +
            '<button id="dropdown-trigger" type="button" class="btn" data-cfw="dropdown">Dropdown</button>' +
            '<ul id="dropdown-menu" class="dropdown-menu">' +
            '<li><a href="#">Menu link</a></li>' +
            '</ul>' +
            '</div>';
        var $dropdown = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-cfw="dropdown"]');
        $dropdown.CFW_Dropdown();

        $dropdown
            .on('afterShow.cfw.dropdown', function() {
                assert.ok($('#dropdown-menu').hasClass('open'), '"open" class added to trigger on click');
                assert.ok($('#dropdown-trigger').hasClass('open'), '"open" class added to menu on click');
                var e = $.Event('keydown', {
                    which: 9 // Tab
                });
                $dropdown.trigger(e);
            })
            .on('keydown', function() {
                assert.ok($('#dropdown-menu').hasClass('open'), '"open" class added to trigger on click');
                assert.ok($('#dropdown-trigger').hasClass('open'), '"open" class added to menu on click');
                done();
            })
            .trigger('click');
    });

    // Currently disabled since this key command is not captured by the
    // dropdown widget, so it does not work in an automated manner
    //    QUnit.test('should remove "open" class if tabbing from last menu item', function(assert) {
    //        assert.expect(6);
    //        var done = assert.async();
    //        var dropdownHTML = '<div class="dropdown">' +
    //            '<button id="dropdown-trigger" type="button" class="btn" data-cfw="dropdown">Dropdown</button>' +
    //            '<ul id="dropdown-menu" class="dropdown-menu">' +
    //            '<li><button id="menu-item" class="dropdown-item" type="button">Action</button></li>' +
    //            '</ul>' +
    //            '</div>' +
    //            '<a id="post-link" href="#">Post link</a>';
    //        var $dropdown = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-cfw="dropdown"]');
    //        $dropdown.CFW_Dropdown();
    //
    //        $dropdown
    //            .on('afterShow.cfw.dropdown', function() {
    //                assert.ok($('#dropdown-trigger').hasClass('open'), '"open" class added to trigger on click');
    //                assert.ok($('#dropdown-menu').hasClass('open'), '"open" class added to menu on click');
    //                var $menuItem = $('#menu-item');
    //                $menuItem.trigger('focus');
    //                assert.ok($(document.activeElement).is($menuItem), 'menu item is focused');
    //                var e = $.Event('keydown', {
    //                    which: 9  //Tab
    //                });
    //                $menuItem.trigger(e);
    //            })
    //            .on('afterHide.cfw.dropdown', function() {
    //                var $postLink = $('#post-link');
    //                assert.ok($(document.activeElement).is($postLink), 'post menu link is focused');
    //                assert.ok(!$('#dropdown-trigger').hasClass('open'), '"open" class removed from trigger');
    //                assert.ok(!$('#dropdown-menu').hasClass('open'), '"open" class removed from menu');
    //                done();
    //            })
    //            .trigger('click');
    //    });

    QUnit.test('should remove "open" class if body is clicked, with multiple dropdowns', function(assert) {
        assert.expect(7);
        var dropdownHTML = '<div class="dropdown">' +
            '<button type="button" class="btn" data-cfw="dropdown">Dropdown</button>' +
            '<ul class="dropdown-menu">' +
            '<li><a href="#">Menu link</a></li>' +
            '</ul>' +
            '</div>';
        $(dropdownHTML).appendTo('#qunit-fixture');
        $(dropdownHTML).appendTo('#qunit-fixture');

        var $dropdowns = $('#qunit-fixture').find('[data-cfw="dropdown"]').CFW_Dropdown();
        var $first = $dropdowns.first();
        var $last = $dropdowns.last();

        assert.strictEqual($dropdowns.length, 2, 'two dropdowns');
        $first.trigger('click');
        assert.strictEqual($first.hasClass('open'), true, '"open" class added on click');
        assert.strictEqual($('#qunit-fixture .dropdown-menu.open').length, 1, 'only one dropdown is open');
        $(document.body).trigger('click');
        assert.strictEqual($('#qunit-fixture .dropdown-menu.open').length, 0, '"open" class removed');

        $last.trigger('click');
        assert.strictEqual($last.hasClass('open'), true, '"open" class added on click');
        assert.strictEqual($('#qunit-fixture .dropdown-menu.open').length, 1, 'only one dropdown is open');
        $(document.body).trigger('click');
        assert.strictEqual($('#qunit-fixture .dropdown-menu.open').length, 0, '"open" class removed');
    });

    QUnit.test('should remove "open" class if body is focused, with multiple dropdowns', function(assert) {
        assert.expect(7);
        var dropdownHTML = '<div class="dropdown">' +
            '<button type="button" class="btn" data-cfw="dropdown">Dropdown</button>' +
            '<ul class="dropdown-menu">' +
            '<li><a href="#">Menu link</a></li>' +
            '</ul>' +
            '</div>';
        $(dropdownHTML).appendTo('#qunit-fixture');
        $(dropdownHTML).appendTo('#qunit-fixture');

        var $dropdowns = $('#qunit-fixture').find('[data-cfw="dropdown"]').CFW_Dropdown();
        var $first = $dropdowns.first();
        var $last = $dropdowns.last();

        assert.strictEqual($dropdowns.length, 2, 'two dropdowns');

        $first.trigger('click');
        assert.strictEqual($first.hasClass('open'), true, '"open" class added on click');
        assert.strictEqual($('#qunit-fixture .dropdown-menu.open').length, 1, 'only one dropdown is open');
        $(document.body).trigger('focusin');
        assert.strictEqual($('#qunit-fixture .dropdown-menu.open').length, 0, '"open" class removed');

        $last.trigger('click');
        assert.strictEqual($last.hasClass('open'), true, '"open" class added on click');
        assert.strictEqual($('#qunit-fixture .dropdown-menu.open').length, 1, 'only one dropdown is open');
        $(document.body).trigger('focusin');
        assert.strictEqual($('#qunit-fixture .dropdown-menu.open').length, 0, '"open" class removed');
    });

    QUnit.test('should fire beforeShow and beforeHide events', function(assert) {
        assert.expect(2);
        var done = assert.async();
        var dropdownHTML = '<div class="dropdown">' +
            '<button type="button" class="btn" data-cfw="dropdown">Dropdown</button>' +
            '<ul class="dropdown-menu">' +
            '<li><a href="#">Menu link</a></li>' +
            '</ul>' +
            '</div>';
        var $dropdown = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-cfw="dropdown"]');
        $dropdown.CFW_Dropdown();

        $dropdown
            .on('beforeShow.cfw.dropdown', function() {
                assert.ok(true, 'beforeShow was fired');
            })
            .on('beforeHide.cfw.dropdown', function() {
                assert.ok(true, 'beforeHide was fired');
                done();
            });

        $dropdown.trigger('click');
        $(document.body).trigger('click');
    });

    QUnit.test('should fire afterShow and afterhide events', function(assert) {
        assert.expect(2);
        var done = assert.async();
        var dropdownHTML = '<div class="dropdown">' +
            '<button type="button" class="btn" data-cfw="dropdown">Dropdown</button>' +
            '<ul class="dropdown-menu">' +
            '<li><a href="#">Menu link</a></li>' +
            '</ul>' +
            '</div>';
        var $dropdown = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-cfw="dropdown"]');
        $dropdown.CFW_Dropdown();

        $dropdown
            .on('afterShow.cfw.dropdown', function() {
                assert.ok(true, 'afterShow was fired');
            })
            .on('afterHide.cfw.dropdown', function() {
                assert.ok(true, 'afterHide was fired');
                done();
            });

        $dropdown.trigger('click');
        $(document.body).trigger('click');
    });

    QUnit.test('should skip disabled element when using keyboard navigation', function(assert) {
        assert.expect(2);
        var dropdownHTML = '<div class="dropdown">' +
            '<button type="button" class="btn" data-cfw="dropdown">Dropdown</button>' +
            '<ul class="dropdown-menu">' +
            '<li><a href="#" class="disabled">Disabled link</a></li>' +
            '<li><a href="#" id="focusable">Menu link</a></li>' +
            '</ul>' +
            '</div>';
        var $dropdown = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-cfw="dropdown"]');
        $dropdown.CFW_Dropdown();
        $dropdown.trigger('click');

        $dropdown.trigger($.Event('keydown', {
            which: 40 // Down
        }));

        assert.ok(!$(document.activeElement).is('.disabled'), '.disabled is not focused');
        assert.ok($(document.activeElement).is('#focusable'), '#focusable is focused');
    });

    QUnit.test('should not focus trigger when click occurs outside menu', function(assert) {
        assert.expect(4);
        var done = assert.async();

        var dropdownHTML = '<div class="dropdown">' +
            '<button type="button" class="btn" data-cfw="dropdown">Dropdown</button>' +
            '<ul class="dropdown-menu">' +
            '<li><a href="#">Menu link</a></li>' +
            '</ul>' +
            '</div>';
        var $dropdown = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-cfw="dropdown"]');
        var $target = $('<a href="#">Target link</a>').appendTo('#qunit-fixture');

        $dropdown
            .on('afterShow.cfw.dropdown', function() {
                assert.strictEqual($dropdown.hasClass('open'), true, 'menu is open');
                assert.strictEqual($dropdown[0], document.activeElement, 'trigger is focused');
                $target.trigger('focus');
                $target.trigger('click');
            })
            .on('afterHide.cfw.dropdown', function() {
                assert.strictEqual($dropdown.hasClass('open'), false, 'menu is closed');
                assert.notStrictEqual($dropdown[0], document.activeElement, 'trigger is not focused');
                done();
            })
            .CFW_Dropdown()
            .trigger('focus')
            .trigger('click');
    });

    QUnit.test('should ignore keyboard events in <input> and <textarea>', function(assert) {
        assert.expect(5);
        var done = assert.async();
        var dropdownHTML = '<div class="dropdown">' +
            '<button type="button" class="btn" data-cfw="dropdown">Dropdown</button>' +
            '<ul class="dropdown-menu">' +
            '<li><input id="input"></li>' +
            '<li><textarea id="textarea"></textarea></a></li>' +
            '</ul>' +
            '</div>';
        var $dropdown = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-cfw="dropdown"]');
        $dropdown.CFW_Dropdown();

        var $input = $('#input');
        var $textarea = $('#textarea');

        $dropdown
            .on('afterShow.cfw.dropdown', function() {
                assert.ok(true, 'menu opened');
                $input.trigger('focus');
                assert.ok($(document.activeElement).is($input), 'input focused');
                $input.trigger($.Event('keydown', {
                    which: 40 // Down
                }));
                assert.ok($(document.activeElement).is($input), 'input still focused');
                $textarea.trigger('focus');
                assert.ok($(document.activeElement).is($textarea), 'textarea focused');
                $textarea.trigger($.Event('keydown', {
                    which: 38 // Up
                }));
                assert.ok($(document.activeElement).is($textarea), 'textarea still focused');
                done();
            });
        $dropdown.trigger('click');
    });

    QUnit.test('should not close menu if clicking on <label>, <input type="text">, or <textarea>', function(assert) {
        assert.expect(4);
        var done = assert.async();
        var dropdownHTML = '<div class="dropdown">' +
            '<button type="button" class="btn" data-cfw="dropdown">Dropdown</button>' +
            '<ul class="dropdown-menu">' +
            '<li><label id="label" for="input"><input id="input"></label></li>' +
            '<li><textarea id="textarea"></textarea></a></li>' +
            '</ul>' +
            '</div>';
        var $dropdown = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-cfw="dropdown"]');
        $dropdown.CFW_Dropdown();

        var $label = $('#label');
        var $input = $('#input');
        var $textarea = $('#textarea');

        $dropdown
            .on('afterShow.cfw.dropdown', function() {
                assert.ok(true, 'menu opened');
                $label.trigger('click');
                assert.ok($dropdown.hasClass('open'), 'menu still open');
                $input.trigger('click');
                assert.ok($dropdown.hasClass('open'), 'menu still open');
                $textarea.trigger('click');
                assert.ok($dropdown.hasClass('open'), 'menu still open');
                done();
            });
        $dropdown.trigger('click');
    });

    QUnit.test('ESC should not propagate when menu is open', function(assert) {
        assert.expect(1);
        var done = assert.async();
        var dropdownHTML = '<div class="dropdown">' +
            '<button type="button" class="btn" data-cfw="dropdown">Dropdown</button>' +
            '<ul class="dropdown-menu">' +
            '<li><a href="#" id="focusable">Menu link</a></li>' +
            '</ul>' +
            '</div>';
        var $dropdown = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-cfw="dropdown"]');
        $dropdown.CFW_Dropdown();
        $dropdown
            .trigger('focus')
            .trigger('click');

        $(document.body).on('keydown.dropEsc', function(e) {
            $(document.body).off('keydown.dropEsc');
            assert.notEqual(e.which, 27, 'ESC keypress was propagated');
            done();
        });

        $dropdown.trigger($.Event('keydown', {
            which: 27 // Esc
        }));
        $dropdown.trigger($.Event('keydown', {
            which: 97 // a
        }));
    });

    QUnit.test('ESC should propagate when menu is closed', function(assert) {
        assert.expect(1);
        var done = assert.async();
        var dropdownHTML = '<div class="dropdown">' +
            '<button type="button" class="btn" data-cfw="dropdown">Dropdown</button>' +
            '<ul class="dropdown-menu">' +
            '<li><a href="#" id="focusable">Menu link</a></li>' +
            '</ul>' +
            '</div>';
        var $dropdown = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-cfw="dropdown"]');
        $dropdown.CFW_Dropdown();
        $dropdown.trigger('focus');

        $(document.body).on('keydown.dropEsc', function(e) {
            $(document.body).off('keydown.dropEsc');
            assert.equal(e.which, 27, 'ESC keypress was propagated');
            done();
        });

        $dropdown.trigger($.Event('keydown', {
            which: 27 // Esc
        }));
    });

    QUnit.test('should fire afterShow and afterHidden events with a relatedTarget', function(assert) {
        assert.expect(2);
        var done = assert.async();
        var dropdownHTML = '<div class="dropdown">' +
            '<button type="button" class="btn" data-cfw="dropdown">Dropdown</button>' +
            '<ul class="dropdown-menu">' +
            '<li><a href="#" id="focusable">Menu link</a></li>' +
            '</ul>' +
            '</div>';
        var $dropdown = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-cfw="dropdown"]');
        $dropdown.CFW_Dropdown();

        $dropdown
            .on('afterShow.cfw.dropdown', function(e) {
                assert.strictEqual(e.relatedTarget, $dropdown[0]);
                $(document.body).trigger('click');
            })
            .on('afterHide.cfw.dropdown', function(e) {
                assert.strictEqual(e.relatedTarget, $dropdown[0]);
                done();
            });

        $dropdown.trigger('click');
    });

    QUnit.test('submenu toggles should also fire afterShow and afterHidden events with a relatedTarget independent of main toggle', function(assert) {
        assert.expect(4);
        var done = assert.async();
        var dropdownHTML = '<div class="dropdown">' +
            '<button type="button" class="btn" data-cfw="dropdown">Dropdown</button>' +
            '<ul class="dropdown-menu">' +
            '<li>' +
            '<a href="#" id="subtoggle">Menu link</a>' +
            '<ul>' +
            '<li><a href="#">Sub-menu link</a></li>' +
            '</ul>' +
            '</li>' +
            '</ul>' +
            '</div>';
        var $dropdown = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-cfw="dropdown"]');
        $dropdown.CFW_Dropdown();
        var $subtoggle = $('#subtoggle');

        $dropdown
            .on('afterShow.cfw.dropdown', function(e) {
                assert.strictEqual(e.relatedTarget, $dropdown[0], 'mainToggle show with relatedTarget');
                $subtoggle
                    .on('afterShow.cfw.dropdown', function(e) {
                        e.stopPropagation();
                        assert.strictEqual(e.relatedTarget, $subtoggle[0], 'subToggle show with relatedTarget');
                        $(document.body).trigger('click');
                    })
                    .on('afterHide.cfw.dropdown', function(e) {
                        e.stopPropagation();
                        assert.strictEqual(e.relatedTarget, $subtoggle[0], 'subToggle hide with relatedTarget');
                    });
                $subtoggle.trigger('click');
            })
            .on('afterHide.cfw.dropdown', function(e) {
                assert.strictEqual(e.relatedTarget, $dropdown[0], 'mainToggle hide with relatedTarget');
                done();
            });

        $dropdown.trigger('click');
    });

    QUnit.test('should fire beforeHide and afterHide events with a clickEvent if event type is click', function(assert) {
        assert.expect(3);
        var done = assert.async();
        var dropdownHTML = '<div class="dropdown">' +
            '<button type="button" class="btn" data-cfw="dropdown">Dropdown</button>' +
            '<ul class="dropdown-menu">' +
            '<li><a href="#" id="focusable">Menu link</a></li>' +
            '</ul>' +
            '</div>';
        var $dropdown = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-cfw="dropdown"]');
        $dropdown.CFW_Dropdown();

        $dropdown
            .on('afterShow.cfw.dropdown', function() {
                assert.ok(true, 'afterShow was fired');
                $(document.body).trigger('click');
            })
            .on('beforeHide.cfw.dropdown', function(e) {
                assert.ok(e.clickEvent);
            })
            .on('afterHide.cfw.dropdown', function(e) {
                assert.ok(e.clickEvent);
                done();
            });

        $dropdown.trigger('click');
    });

    QUnit.test('should fire beforeHide and afterHide event without a clickEvent if event type is not click', function(assert) {
        assert.expect(3);
        var done = assert.async();
        var dropdownHTML = '<div class="dropdown">' +
            '<button type="button" class="btn" data-cfw="dropdown">Dropdown</button>' +
            '<ul class="dropdown-menu">' +
            '<li><a href="#" id="focusable">Menu link</a></li>' +
            '</ul>' +
            '</div>';
        var $dropdown = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-cfw="dropdown"]');
        $dropdown.CFW_Dropdown();

        $dropdown
            .on('afterShow.cfw.dropdown', function() {
                assert.ok(true, 'shown was fired');
                $dropdown.trigger($.Event('keydown', {
                    which: 27 // Esc
                }));
            })
            .on('beforeHide.cfw.dropdown', function(e) {
                assert.notOk(e.clickEvent);
            })
            .on('afterHide.cfw.dropdown', function(e) {
                assert.notOk(e.clickEvent);
                done();
            });

        $dropdown.trigger('click');
    });

    QUnit.test('should allow passing of config to popper.js using popperConfig', function(assert) {
        assert.expect(1);
        var done = assert.async();
        var dropdownHTML = '<div class="dropdown">' +
            '<button type="button" class="btn" data-cfw="dropdown">Dropdown</button>' +
            '<ul class="dropdown-menu" style="position: absolute;">' +
            '<li><a href="#" id="focusable">Menu link</a></li>' +
            '</ul>' +
            '</div>';
        var $dropdown = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-cfw="dropdown"]');
        $dropdown.CFW_Dropdown({
            popperConfig: {
                placement: 'left'
            }
        });

        $dropdown
            .on('afterShow.cfw.dropdown', function() {
                assert.strictEqual($('.dropdown-menu').attr('x-placement'), 'left');
                done();
            });

        $dropdown.trigger('click');
    });
});
