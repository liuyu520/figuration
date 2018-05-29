$(function() {
    'use strict';

    QUnit.module('CFW_Modal', {
        before: function() {
            // Simulate scrollbars in PhantomJS
            $('html').css('padding-right', '16px');
        },
        afterEach: function() {
            $('#modal, .modal-backdrop').remove();
            $(document.body)
                .removeAttr('style')
                .removeClass('modal-open');
        },
        after: function() {
            $('html').removeAttr('style');
        }
    });

    QUnit.test('should be defined on jquery object', function(assert) {
        assert.expect(1);
        assert.ok($(document.body).CFW_Modal, 'CFW_Modal method is defined');
    });

    QUnit.test('should return jquery collection containing the element', function(assert) {
        assert.expect(2);
        var $el = $('<div/>');
        var $col = $el.CFW_Modal();
        assert.ok($col instanceof $, 'returns jquery collection');
        assert.strictEqual($col[0], $el[0], 'collection contains element');
    });

    QUnit.test('should fire beforeShow event when show is called', function(assert) {
        assert.expect(1);
        var done = assert.async();

        var $trigger = $('<button type="button" class="btn" data-cfw="modal" data-cfw-modal-target="#modal">Modal</button>').appendTo('#qunit-fixture');
        var $target = $('<div class="modal" id="modal" />').appendTo('#qunit-fixture');

        $target.on('beforeShow.cfw.modal', function() {
            assert.ok(true, 'show event fired');
            done();
        });
        $trigger.CFW_Modal();
        $trigger.CFW_Modal('show');
    });

    QUnit.test('should not fire afterShow when beforeShow is prevented', function(assert) {
        assert.expect(1);
        var done = assert.async();

        var $trigger = $('<button type="button" class="btn" data-cfw="modal" data-cfw-modal-target="#modal">Modal</button>').appendTo('#qunit-fixture');
        var $target = $('<div class="modal" id="modal" />').appendTo('#qunit-fixture');

        $target
            .on('beforeShow.cfw.modal', function(e) {
                e.preventDefault();
                assert.ok(true, 'beforeShow event fired');
                done();
            })
            .on('afterShow.cfw.modal', function() {
                assert.ok(false, 'afterShow event fired');
            });

        $trigger.CFW_Modal();
        $trigger.CFW_Modal('show');
    });

    QUnit.test('should show modal when show is called (no transition)', function(assert) {
        assert.expect(1);
        var done = assert.async();

        var $trigger = $('<button type="button" class="btn" data-cfw="modal" data-cfw-modal-target="#modal">Modal</button>').appendTo('#qunit-fixture');
        var $target = $('<div class="modal" id="modal" />').css('transition', 'none').appendTo('#qunit-fixture');

        $target
            .on('afterShow.cfw.modal', function() {
                assert.ok($target.is(':visible'), 'modal visible');
                done();
            });
        $trigger.CFW_Modal();
        $trigger.CFW_Modal('show');
    });

    QUnit.test('should show modal when show is called (with transition)', function(assert) {
        assert.expect(1);
        var done = assert.async();

        var $trigger = $('<button type="button" class="btn" data-cfw="modal" data-cfw-modal-target="#modal">Modal</button>').appendTo('#qunit-fixture');
        var $target = $('<div class="modal" id="modal" />').css('transition', '.05s').appendTo('#qunit-fixture');

        $target
            .on('afterShow.cfw.modal', function() {
                assert.ok($target.is(':visible'), 'modal visible');
                done();
            });
        $trigger.CFW_Modal();
        $trigger.CFW_Modal('show');
    });

    QUnit.test('should hide modal when hide is called (no transition)', function(assert) {
        assert.expect(2);
        var done = assert.async();

        var $trigger = $('<button type="button" class="btn" data-cfw="modal" data-cfw-modal-target="#modal">Modal</button>').appendTo('#qunit-fixture');
        var $target = $('<div class="modal" id="modal" />').css('transition', 'none').appendTo('#qunit-fixture');

        $target
            .on('afterShow.cfw.modal', function() {
                assert.ok($target.is(':visible'), 'modal visible');
                $trigger.CFW_Modal('hide');
            })
            .on('afterHide.cfw.modal', function() {
                assert.ok(!$target.is(':visible'), 'modal hidden');
                done();
            });
        $trigger.CFW_Modal();
        $trigger.CFW_Modal('show');
    });

    QUnit.test('should hide modal when hide is called (with transition)', function(assert) {
        assert.expect(2);
        var done = assert.async();

        var $trigger = $('<button type="button" class="btn" data-cfw="modal" data-cfw-modal-target="#modal">Modal</button>').appendTo('#qunit-fixture');
        var $target = $('<div class="modal" id="modal" />').css('transition', '.05s').appendTo('#qunit-fixture');

        $target
            .on('afterShow.cfw.modal', function() {
                assert.ok($target.is(':visible'), 'modal visible');
                $trigger.CFW_Modal('hide');
            })
            .on('afterHide.cfw.modal', function() {
                assert.ok(!$target.is(':visible'), 'modal hidden');
                done();
            });
        $trigger.CFW_Modal();
        $trigger.CFW_Modal('show');
    });

    QUnit.test('should toggle when toggle is called', function(assert) {
        assert.expect(2);
        var done = assert.async();

        var $trigger = $('<button type="button" class="btn" data-cfw="modal" data-cfw-modal-target="#modal">Modal</button>').appendTo('#qunit-fixture');
        var $target = $('<div class="modal" id="modal" />').appendTo('#qunit-fixture');

        $target
            .on('afterShow.cfw.modal', function() {
                assert.ok($target.is(':visible'), 'modal visible');
                $trigger.CFW_Modal('toggle');
            })
            .on('afterHide.cfw.modal', function() {
                assert.ok(!$target.is(':visible'), 'modal hidden');
                done();
            });
        $trigger.CFW_Modal();
        $trigger.CFW_Modal('toggle');
    });

    QUnit.test('should hide modal when click [data-cfw-dismiss="modal"]', function(assert) {
        assert.expect(2);
        var done = assert.async();

        var $trigger = $('<button type="button" class="btn" data-cfw="modal" data-cfw-modal-target="#modal">Modal</button>').appendTo('#qunit-fixture');
        var $target = $('<div class="modal" id="modal"><span class="close" data-cfw-dismiss="modal" /></div>').appendTo('#qunit-fixture');

        $target
            .on('afterShow.cfw.modal', function() {
                assert.ok($target.is(':visible'), 'modal visible');
                $(this).find('.close').trigger('click');
            })
            .on('afterHide.cfw.modal', function() {
                assert.ok(!$target.is(':visible'), 'modal hidden');
                done();
            });

        $trigger.CFW_Modal();
        $trigger.CFW_Modal('show');
    });

    QUnit.test('should allow modal close with "backdrop:false"', function(assert) {
        assert.expect(2);
        var done = assert.async();

        var $trigger = $('<button type="button" class="btn" data-cfw="modal" data-cfw-modal-target="#modal" data-cfw-modal-backdrop="false">Modal</button>').appendTo('#qunit-fixture');
        var $target = $('<div class="modal" id="modal" />').appendTo('#qunit-fixture');

        $target
            .on('afterShow.cfw.modal', function() {
                assert.ok($target.is(':visible'), 'modal visible');
                $trigger.CFW_Modal('hide');
            })
            .on('afterHide.cfw.modal', function() {
                assert.ok(!$target.is(':visible'), 'modal hidden');
                done();
            });

        $trigger.CFW_Modal();
        $trigger.CFW_Modal('show');
    });

    QUnit.test('should close modal when escape key is pressed via keydown', function(assert) {
        assert.expect(2);
        var done = assert.async();

        var $trigger = $('<button type="button" class="btn" data-cfw="modal" data-cfw-modal-target="#modal">Modal</button>').appendTo('#qunit-fixture');
        var $target = $('<div class="modal" id="modal" />').appendTo('#qunit-fixture');

        $target
            .on('afterShow.cfw.modal', function() {
                assert.ok($target.is(':visible'), 'modal visible');
                $target.trigger($.Event('keydown', {
                    which: 27 // Esc
                }));

                setTimeout(function() {
                    assert.ok(!$target.is(':visible'), 'modal hidden');
                    done();
                }, 0);
            });

        $trigger.CFW_Modal();
        $trigger.CFW_Modal('show');
    });

    QUnit.test('should not close modal when escape key is pressed via keyup', function(assert) {
        assert.expect(2);
        var done = assert.async();

        var $trigger = $('<button type="button" class="btn" data-cfw="modal" data-cfw-modal-target="#modal">Modal</button>').appendTo('#qunit-fixture');
        var $target = $('<div class="modal" id="modal" />').appendTo('#qunit-fixture');

        $target
            .on('afterShow.cfw.modal', function() {
                assert.ok($target.is(':visible'), 'modal visible');
                $target.trigger($.Event('keyup', {
                    which: 27 // Esc
                }));

                setTimeout(function() {
                    assert.ok($target.is(':visible'), 'modal still visible');
                    done();
                }, 0);
            });

        $trigger.CFW_Modal();
        $trigger.CFW_Modal('show');
    });

    QUnit.test('should not close modal when clicking outside of modal-content with "backdrop:static"', function(assert) {
        assert.expect(1);
        var done = assert.async();

        var $trigger = $('<button type="button" class="btn" data-cfw="modal" data-cfw-modal-target="#modal" data-cfw-modal-backdrop="static">Modal</button>').appendTo('#qunit-fixture');
        var $target = $('<div class="modal" id="modal" />').appendTo('#qunit-fixture');

        $target
            .on('afterShow.cfw.modal', function() {
                $target.trigger('click');
                assert.ok($target.is(':visible'), 'modal still visible');
                done();
            });

        $trigger.CFW_Modal();
        $trigger.CFW_Modal('show');
    });

    QUnit.test('should not close modal when clicking outside of modal-content with "backdrop:false"', function(assert) {
        assert.expect(1);
        var done = assert.async();

        var $trigger = $('<button type="button" class="btn" data-cfw="modal" data-cfw-modal-target="#modal" data-cfw-modal-backdrop="false">Modal</button>').appendTo('#qunit-fixture');
        var $target = $('<div class="modal" id="modal" />').appendTo('#qunit-fixture');

        $target
            .on('afterShow.cfw.modal', function() {
                $target.trigger('click');
                assert.ok($target.is(':visible'), 'modal still visible');
                done();
            });

        $trigger.CFW_Modal();
        $trigger.CFW_Modal('show');
    });

    QUnit.test('should close modal when clicking outside of modal-content', function(assert) {
        assert.expect(2);
        var done = assert.async();

        var $trigger = $('<button type="button" class="btn" data-cfw="modal" data-cfw-modal-target="#modal">Modal</button>').appendTo('#qunit-fixture');
        var $target = $('<div class="modal" id="modal"><div class="contents"></div>').appendTo('#qunit-fixture');

        $target
            .on('afterShow.cfw.modal', function() {
                $('.contents').trigger('click');
                assert.ok($target.is(':visible'), 'modal visible');
                $target.trigger('click');
            })
            .on('afterHide.cfw.modal', function() {
                assert.ok(!$target.is(':visible'), 'modal hidden');
                done();
            });

        $trigger.CFW_Modal();
        $trigger.CFW_Modal('show');
    });

    QUnit.test('should trigger hide event once when clicking outside of modal-content', function(assert) {
        assert.expect(1);
        var done = assert.async();

        var triggered;

        var $trigger = $('<button type="button" class="btn" data-cfw="modal" data-cfw-modal-target="#modal">Modal</button>').appendTo('#qunit-fixture');
        var $target = $('<div class="modal" id="modal" />').appendTo('#qunit-fixture');

        $target
            .on('afterShow.cfw.modal', function() {
                triggered = 0;
                $target.trigger('click');
            })
            .on('afterHide.cfw.modal', function() {
                triggered += 1;
                assert.strictEqual(triggered, 1, 'modal hide triggered once');
                done();
            });

        $trigger.CFW_Modal();
        $trigger.CFW_Modal('show');
    });

    QUnit.test('should close reopened modal with [data-cfw-dismiss="modal"] click', function(assert) {
        assert.expect(2);
        var done = assert.async();

        var $trigger = $('<button type="button" class="btn" data-cfw="modal" data-cfw-modal-target="#modal">Modal</button>').appendTo('#qunit-fixture');
        var $target = $('<div class="modal" id="modal"><span class="close" data-cfw-dismiss="modal" /></div>').appendTo('#qunit-fixture');

        $target
            .one('afterShow.cfw.modal', function() {
                $(this).find('.close').trigger('click');
            })
            .one('afterHide.cfw.modal', function() {
                // after one open-close cycle
                assert.ok(!$target.is(':visible'), 'modal hidden');
                $(this)
                    .one('afterShow.cfw.modal', function() {
                        $(this).find('.close').trigger('click');
                    })
                    .one('afterHide.cfw.modal', function() {
                        assert.ok(!$target.is(':visible'), 'modal hidden');
                        done();
                    });
                $trigger.CFW_Modal('show');
            });

        $trigger.CFW_Modal();
        $trigger.CFW_Modal('show');
    });

    QUnit.test('should restore focus to trigger element when modal is hidden', function(assert) {
        assert.expect(1);
        var done = assert.async();

        var $trigger = $('<button type="button" class="btn" data-cfw="modal" data-cfw-modal-target="#modal">Modal</button>').appendTo('#qunit-fixture');
        var $target = $('<div class="modal" id="modal" />').appendTo('#qunit-fixture');

        $target
            .on('afterShow.cfw.modal', function() {
                $trigger.CFW_Modal('hide');
            })
            .on('afterHide.cfw.modal', function() {
                setTimeout(function() {
                    assert.ok($(document.activeElement).is($trigger), 'trigger element is once again focused');
                    done();
                }, 0);
            });

        $trigger.CFW_Modal();
        $trigger.CFW_Modal('show');
    });

    QUnit.test('should store original body padding in data-cfw.padding-dim before showing', function(assert) {
        assert.expect(2);
        var done = assert.async();
        var originalPadding = '';
        var $body = $(document.body);

        $body.css('padding-right', originalPadding);

        var $trigger = $('<button type="button" class="btn" data-cfw="modal" data-cfw-modal-target="#modal">Modal</button>').appendTo('#qunit-fixture');
        var $target = $('<div class="modal" id="modal" />').appendTo('#qunit-fixture');

        $target
            .on('afterShow.cfw.modal', function() {
                assert.strictEqual($body.data('cfw.padding-dim'), originalPadding, 'stored original body padding in data attribute');
                $trigger.CFW_Modal('hide');
            })
            .on('afterHide.cfw.modal', function() {
                assert.strictEqual(typeof $body.data('cfw.padding-dim'), 'undefined', 'padding in data attribute has been cleared');
                $body.removeAttr('style');
                done();
            });

        $trigger.CFW_Modal();
        $trigger.CFW_Modal('show');
    });

    QUnit.test('should restore inline body padding after closing', function(assert) {
        assert.expect(2);
        var done = assert.async();
        var originalBodyPad = 0;
        var $body = $(document.body);

        $body.css('padding-right', originalBodyPad);

        var $trigger = $('<button type="button" class="btn" data-cfw="modal" data-cfw-modal-target="#modal">Modal</button>').appendTo('#qunit-fixture');
        var $target = $('<div class="modal" id="modal" />').appendTo('#qunit-fixture');

        $target
            .on('afterShow.cfw.modal', function() {
                $(this).CFW_Modal('hide');
            })
            .on('afterHide.cfw.modal', function() {
                var currentBodyPad = parseInt($body.css('padding-right'), 10);
                assert.notStrictEqual($body.attr('style'), '', 'body has non-empty style attribute');
                assert.strictEqual(currentBodyPad, originalBodyPad, 'original body padding was not changed');
                $body.removeAttr('style');
                done();
            });

        $trigger.CFW_Modal();
        $trigger.CFW_Modal('show');
    });

    QUnit.test('should ignore values set via CSS when trying to restore body padding after closing', function(assert) {
        assert.expect(1);
        var done = assert.async();
        var $body = $(document.body);
        var $style = $('<style>body { padding-right: 42px; }</style>').appendTo('head');

        var $trigger = $('<button type="button" class="btn" data-cfw="modal" data-cfw-modal-target="#modal">Modal</button>').appendTo('#qunit-fixture');
        var $target = $('<div class="modal" id="modal" />').appendTo('#qunit-fixture');

        $target
            .on('afterShow.cfw.modal', function() {
                $trigger.CFW_Modal('hide');
            })
            .on('afterHide.cfw.modal', function() {
                assert.strictEqual($body[0].style.paddingRight, '', 'body does not have inline padding set');
                $style.remove();
                done();
            });

        $trigger.CFW_Modal();
        $trigger.CFW_Modal('show');
    });

    QUnit.test('should adjust the inline padding of fixed elements when opening and restore when closing', function(assert) {
        assert.expect(2);
        var done = assert.async();
        var $element = $('<div class="fixed-top"></div>').appendTo('#qunit-fixture');
        var originalPadding = $element.css('padding-right');

        var $trigger = $('<button type="button" class="btn" data-cfw="modal" data-cfw-modal-target="#modal">Modal</button>').appendTo('#qunit-fixture');
        var $target = $('<div class="modal" id="modal" />').appendTo('#qunit-fixture');

        $target
            .on('afterShow.cfw.modal', function() {
                var expectedPadding = parseFloat(originalPadding) + $.CFW_measureScrollbar() + 'px';
                var currentPadding = $element.css('padding-right');
                assert.strictEqual(currentPadding, expectedPadding, 'fixed element padding should be adjusted while opening');
                $trigger.CFW_Modal('hide');
            })
            .on('afterHide.cfw.modal', function() {
                var currentPadding = $element.css('padding-right');
                assert.strictEqual(currentPadding, originalPadding, 'fixed element padding should be reset after closing');
                $element.remove();
                done();
            });

        $trigger.CFW_Modal();
        $trigger.CFW_Modal('show');
    });


    QUnit.test('should store inline padding of fixed elements in data-cfw.padding-dim before showing', function(assert) {
        assert.expect(2);
        var done = assert.async();
        var originalPadding = '0px';
        var $element = $('<div class="fixed-top"></div>').appendTo('#qunit-fixture');

        $element.css('padding-right', originalPadding);

        var $trigger = $('<button type="button" class="btn" data-cfw="modal" data-cfw-modal-target="#modal">Modal</button>').appendTo('#qunit-fixture');
        var $target = $('<div class="modal" id="modal" />').appendTo('#qunit-fixture');

        $target
            .on('afterShow.cfw.modal', function() {
                assert.strictEqual($element.data('cfw.padding-dim'), originalPadding, 'stored original fixed element padding in data attribute');
                $trigger.CFW_Modal('hide');
            })
            .on('afterHide.cfw.modal', function() {
                assert.strictEqual(typeof $element.data('cfw.padding-dim'), 'undefined', 'padding in data attribute has been cleared');
                $element.removeAttr('style');
                done();
            });

        $trigger.CFW_Modal();
        $trigger.CFW_Modal('show');
    });

    QUnit.test('should adjust the inline margin of sticky elements when opening and restore when closing', function(assert) {
        assert.expect(2);
        var done = assert.async();
        var $element = $('<div class="sticky-top"></div>').appendTo('#qunit-fixture');
        var originalMargin = $element.css('margin-right');

        var $trigger = $('<button type="button" class="btn" data-cfw="modal" data-cfw-modal-target="#modal">Modal</button>').appendTo('#qunit-fixture');
        var $target = $('<div class="modal" id="modal" />').appendTo('#qunit-fixture');

        $target
            .on('afterShow.cfw.modal', function() {
                var expectedMargin = parseFloat(originalMargin) - $.CFW_measureScrollbar() + 'px';
                var currentMargin = $element.css('margin-right');
                assert.strictEqual(currentMargin, expectedMargin, 'sticky element margin should be adjusted while opening');
                $trigger.CFW_Modal('hide');
            })
            .on('afterHide.cfw.modal', function() {
                var currentMargin = $element.css('margin-right');
                assert.strictEqual(currentMargin, originalMargin, 'sticky element margin should be reset after closing');
                $element.remove();
                done();
            });

        $trigger.CFW_Modal();
        $trigger.CFW_Modal('show');
    });

    QUnit.test('should store inline margin of sticky elements in data-cfw.margin-dim before showing', function(assert) {
        assert.expect(2);
        var done = assert.async();
        var originalMargin = '0px';
        var $element = $('<div class="sticky-top"></div>').appendTo('#qunit-fixture');

        $element.css('margin-right', originalMargin);

        var $trigger = $('<button type="button" class="btn" data-cfw="modal" data-cfw-modal-target="#modal">Modal</button>').appendTo('#qunit-fixture');
        var $target = $('<div class="modal" id="modal" />').appendTo('#qunit-fixture');

        $target
            .on('afterShow.cfw.modal', function() {
                assert.strictEqual($element.data('cfw.margin-dim'), originalMargin, 'stored original sticky element margin in data attribute');
                $trigger.CFW_Modal('hide');
            })
            .on('afterHide.cfw.modal', function() {
                assert.strictEqual(typeof $element.data('cfw.margin-dim'), 'undefined', 'margin in data attribute has been cleared');
                $element.removeAttr('style');
                done();
            });

        $trigger.CFW_Modal();
        $trigger.CFW_Modal('show');
    });

    QUnit.test('should ignore other inline styles when trying to restore body padding after closing', function(assert) {
        assert.expect(2);
        var done = assert.async();
        var $body = $(document.body);
        var $style = $('<style>body { padding-right: 42px; }</style>').appendTo('head');

        $body.css('color', 'red');

        var $trigger = $('<button type="button" class="btn" data-cfw="modal" data-cfw-modal-target="#modal">Modal</button>').appendTo('#qunit-fixture');
        var $target = $('<div class="modal" id="modal" />').appendTo('#qunit-fixture');

        $target
            .on('afterShow.cfw.modal', function() {
                $trigger.CFW_Modal('hide');
            })
            .on('afterHide.cfw.modal', function() {
                assert.strictEqual($body[0].style.paddingRight, '', 'body does not have inline padding set');
                assert.strictEqual($body[0].style.color, 'red', 'body still has other inline styles set');
                $body.removeAttr('style');
                $style.remove();
                done();
            });

        $trigger.CFW_Modal();
        $trigger.CFW_Modal('show');
    });

    QUnit.test('should properly restore non-pixel inline body padding after closing', function(assert) {
        assert.expect(1);
        var done = assert.async();
        var $body = $(document.body);

        $body.css('padding-right', '5%');

        var $trigger = $('<button type="button" class="btn" data-cfw="modal" data-cfw-modal-target="#modal">Modal</button>').appendTo('#qunit-fixture');
        var $target = $('<div class="modal" id="modal" />').appendTo('#qunit-fixture');

        $target
            .on('afterShow.cfw.modal', function() {
                $(this).CFW_Modal('hide');
            })
            .on('afterHide.cfw.modal', function() {
                assert.strictEqual($body[0].style.paddingRight, '5%', 'body does not have inline padding set');
                $body.removeAttr('style');
                done();
            });

        $trigger.CFW_Modal();
        $trigger.CFW_Modal('show');
    });

    QUnit.test('should not adjust the inline body padding when it does not overflow', function(assert) {
        assert.expect(1);
        var done = assert.async();
        var $body = $(document.body);
        var originalPadding = $body.css('padding-right');

        // Hide scrollbars to prevent the body overflowing
        $body.css('overflow', 'hidden');        // real scrollbar (for in-browser testing)
        $('html').css('padding-right', '0px');  // simulated scrollbar (for PhantomJS)

        var $trigger = $('<button type="button" class="btn" data-cfw="modal" data-cfw-modal-target="#modal">Modal</button>').appendTo('#qunit-fixture');
        var $target = $('<div class="modal" id="modal" />').appendTo('#qunit-fixture');

        $target
            .on('afterShow.cfw.modal', function() {
                var currentPadding = $body.css('padding-right');
                assert.strictEqual(currentPadding, originalPadding, 'body padding should not be adjusted');
                $(this).CFW_Modal('hide');

                // restore scrollbars
                $body
                    .css('overflow', '')
                    .removeAttr('style');
                $('html').css('padding-right', '16px');
                done();
            });

        $trigger.CFW_Modal();
        $trigger.CFW_Modal('show');
    });

    QUnit.test('should not parse target as html', function(assert) {
        assert.expect(1);
        var done = assert.async();

        var $toggleBtn = $('<button data-cfw="modal" data-cfw-modal-target="&lt;div id=&quot;modal&quot;&gt;&lt;div class=&quot;contents&quot;&lt;div&lt;div id=&quot;close&quot; data-cfw-dismiss=&quot;modal&quot;/&gt;&lt;/div&gt;&lt;/div&gt;"/>')
            .appendTo('#qunit-fixture');

        $toggleBtn
            .CFW_Modal()
            .trigger('click');

        setTimeout(function() {
            assert.strictEqual($('#modal').length, 0, 'target has not been parsed and added to the document');
            done();
        }, 1);
    });

    QUnit.test('should not execute js from target', function(assert) {
        assert.expect(0);
        var done = assert.async();

        // This toggle button contains XSS payload in its data-target
        // Note: it uses the onerror handler of an img element to execute the js, because a simple script element does not work here
        //       a script element works in manual tests though, so here it is likely blocked by the qunit framework
        var $toggleBtn = $('<button data-cfw="modal" data-cfw-modal-target="&lt;div&gt;&lt;image src=&quot;missing.png&quot; onerror=&quot;$(&apos;#qunit-fixture button.control&apos;).trigger(&apos;click&apos;)&quot;&gt;&lt;/div&gt;"/>')
            .appendTo('#qunit-fixture');

        // The XSS payload above does not have a closure over this function and cannot access the assert object directly
        // However, it can send a click event to the following control button, which will then fail the assert
        $('<button>')
            .addClass('control')
            .on('click', function() {
                assert.notOk(true, 'XSS payload is not executed as js');
            })
            .appendTo('#qunit-fixture');

        $toggleBtn
            .CFW_Modal()
            .trigger('click');

        setTimeout(done, 500);
    });
});
