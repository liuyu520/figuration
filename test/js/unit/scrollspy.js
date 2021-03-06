$(function() {
    'use strict';

    QUnit.module('CFW_Scrollspy', {
        beforeEach: function() {
            $(window).scrollTop(0);
        },
        afterEach: function() {
            $('#qunit-fixture').empty();
        }
    });

    QUnit.test('should be defined on jquery object', function(assert) {
        assert.expect(1);
        assert.ok($(document.body).CFW_Scrollspy, 'CFW_Scrollspy method is defined');
    });

    QUnit.test('should return jquery collection containing the element', function(assert) {
        assert.expect(2);
        var $el = $('<div></div>');
        var $col = $el.CFW_Scrollspy();
        assert.ok($col instanceof $, 'returns jquery collection');
        assert.strictEqual($col[0], $el[0], 'collection contains element');
    });

    QUnit.test('should only switch "active" class on current target', function(assert) {
        assert.expect(1);
        var done = assert.async();

        var sectionHTML = '<div id="root" class="active">' +
            '<div class="topbar">' +
            '<div class="topbar-inner">' +
            '<div class="container" id="ss-target">' +
            '<ul class="nav">' +
            '<li><a href="#masthead">Overview</a></li>' +
            '<li><a href="#detail">Detail</a></li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="scrollspy-example" style="height: 100px; overflow: auto;">' +
            '<div style="height: 200px;">' +
            '<h4 id="masthead">Overview</h4>' +
            '<p style="height: 200px">' +
            'Ad leggings keytar, brunch id art party dolor labore.' +
            '</p>' +
            '</div>' +
            '<div style="height: 200px;">' +
            '<h4 id="detail">Detail</h4>' +
            '<p style="height: 200px">' +
            'Veniam marfa mustache skateboard, adipisicing fugiat velit pitchfork beard.' +
            '</p>' +
            '</div>' +
            '</div>' +
            '</div>';
        var $section = $(sectionHTML).appendTo('#qunit-fixture');

        var $scrollspy = $section
            .show()
            .find('#scrollspy-example')
            .CFW_Scrollspy({
                target: '#ss-target',
                throttle: 0
            });

        $scrollspy.on('scroll.cfw.scrollspy', function() {
            assert.ok($section.hasClass('active'), '"active" class still on root node');
            done();
        });

        $scrollspy.scrollTop(350);
    });

    QUnit.test('should correctly select middle navigation option when large offset is used', function(assert) {
        assert.expect(3);
        var done = assert.async();

        var sectionHTML = '<div id="header" style="height: 500px;"></div>' +
            '<nav id="navigation" class="navbar">' +
            '<ul class="nav navbar-nav">' +
            '<li><a href="#div-1" id="a-1" class="active">One</a></li>' +
            '<li><a href="#div-2" id="a-2">Two</a></li>' +
            '<li><a href="#div-3" id="a-3">Three</a></li>' +
            '</ul>' +
            '</nav>' +
            '<div id="content" style="height: 200px; overflow-y: auto;">' +
            '<div id="div-1" style="height: 500px;"></div>' +
            '<div id="div-2" style="height: 300px;"></div>' +
            '<div id="div-3" style="height: 10px;"></div>' +
            '</div>';
        var $section = $(sectionHTML).appendTo('#qunit-fixture');
        var $scrollspy = $section
            .show()
            .filter('#content');

        $scrollspy.CFW_Scrollspy({
            target: '#navigation',
            offset: $scrollspy.position().top,
            throttle: 0
        });

        $scrollspy.on('scroll.cfw.scrollspy', function() {
            assert.ok(!$section.find('#a-1').hasClass('active'), '"active" class removed from first section');
            assert.ok($section.find('#a-2').hasClass('active'), '"active" class on middle section');
            assert.ok(!$section.find('#a-3').hasClass('active'), '"active" class not on last section');
            done();
        });

        $scrollspy.scrollTop(550);
    });

    QUnit.test('should add the active class to the correct element (ul markup)', function(assert) {
        assert.expect(2);
        var navbarHtml = '<ul>' +
            '<li><a href="#div-1" id="a-1">div 1</a></li>' +
            '<li><a href="#div-2" id="a-2">div 2</a></li>' +
            '</ul>';
        var contentHtml = '<div class="content" style="overflow: auto; height: 50px">' +
            '<div id="div-1" style="height: 100px; padding: 0; margin: 0">div 1</div>' +
            '<div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>' +
            '</div>';

        $(navbarHtml).appendTo('#qunit-fixture');
        var $content = $(contentHtml)
            .appendTo('#qunit-fixture')
            .CFW_Scrollspy({
                target: 'ul',
                offset: 0,
                throttle: 0
            });

        var testElementIsActiveAfterScroll = function(element, target) {
            var deferred = $.Deferred();
            var scrollHeight = Math.ceil($content.scrollTop() + $(target).position().top);
            $content.one('scroll', function() {
                assert.ok($(element).hasClass('active'), 'target:' + target + ', element' + element);
                deferred.resolve();
            });
            $content.scrollTop(scrollHeight);
            return deferred.promise();
        };

        var done = assert.async();
        $.when(testElementIsActiveAfterScroll('#a-1', '#div-1'))
            .then(function() { return testElementIsActiveAfterScroll('#a-2', '#div-2'); })
            .then(function() { done(); });
    });

    QUnit.test('should add the active class to the correct element (ol markup)', function(assert) {
        assert.expect(2);
        var navbarHtml = '<ol>' +
            '<li><a href="#div-1" id="a-1">div 1</a></li>' +
            '<li><a href="#div-2" id="a-2">div 2</a></li>' +
            '</ol>';
        var contentHtml = '<div class="content" style="overflow: auto; height: 50px">' +
            '<div id="div-1" style="height: 100px; padding: 0; margin: 0">div 1</div>' +
            '<div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>' +
            '</div>';

        $(navbarHtml).appendTo('#qunit-fixture');
        var $content = $(contentHtml)
            .appendTo('#qunit-fixture')
            .CFW_Scrollspy({
                target: 'ol',
                offset: 0,
                throttle: 0
            });

        var testElementIsActiveAfterScroll = function(element, target) {
            var deferred = $.Deferred();
            var scrollHeight = Math.ceil($content.scrollTop() + $(target).position().top);
            $content.one('scroll', function() {
                assert.ok($(element).hasClass('active'), 'target:' + target + ', element' + element);
                deferred.resolve();
            });
            $content.scrollTop(scrollHeight);
            return deferred.promise();
        };

        var done = assert.async();
        $.when(testElementIsActiveAfterScroll('#a-1', '#div-1'))
            .then(function() { return testElementIsActiveAfterScroll('#a-2', '#div-2'); })
            .then(function() { done(); });
    });

    QUnit.test('should add the active class to the correct element (nav markup)', function(assert) {
        assert.expect(2);
        var navbarHtml = '<nav>' +
            '<a href="#div-1" id="a-1">div 1</a>' +
            '<a href="#div-2" id="a-2">div 2</a>' +
            '</nav>';
        var contentHtml = '<div class="content" style="overflow: auto; height: 50px">' +
            '<div id="div-1" style="height: 100px; padding: 0; margin: 0">div 1</div>' +
            '<div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>' +
            '</div>';

        $(navbarHtml).appendTo('#qunit-fixture');
        var $content = $(contentHtml)
            .appendTo('#qunit-fixture')
            .CFW_Scrollspy({
                target: 'nav',
                offset: 0,
                throttle: 0
            });

        var testElementIsActiveAfterScroll = function(element, target) {
            var deferred = $.Deferred();
            var scrollHeight = Math.ceil($content.scrollTop() + $(target).position().top);
            $content.one('scroll', function() {
                assert.ok($(element).hasClass('active'), 'target:' + target + ', element' + element);
                deferred.resolve();
            });
            $content.scrollTop(scrollHeight);
            return deferred.promise();
        };

        var done = assert.async();
        $.when(testElementIsActiveAfterScroll('#a-1', '#div-1'))
            .then(function() { return testElementIsActiveAfterScroll('#a-2', '#div-2'); })
            .then(function() { done(); });
    });

    QUnit.test('should add the active class correctly when there are nested elements at 0 scroll offset', function(assert) {
        assert.expect(6);
        var times = 0;
        var done = assert.async();
        var navbarHtml = '<nav id="navigation" class="navbar">' +
            '<ul class="nav">' +
            '<li><a href="#div-1" id="a-1">div 1</a>' +
            '<ul>' +
            '<li><a href="#div-2" id="a-2">div 2</a></li>' +
            '</ul>' +
            '</li>' +
            '</ul>' +
            '</nav>';

        var contentHtml = '<div class="content" style="position: absolute; top: 0px; overflow: auto; height: 50px">' +
            '<div id="div-1" style="padding: 0; margin: 0">' +
            '<div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>' +
            '</div>' +
            '</div>';

        $(navbarHtml).appendTo('#qunit-fixture');

        var $content = $(contentHtml)
            .appendTo('#qunit-fixture')
            .CFW_Scrollspy({
                target: '#navigation',
                offset: 0,
                throttle: 0
            });

        function testActiveElements() {
            if (++times > 3) { return done(); }

            $content.one('scroll', function() {
                assert.ok($('#a-1').hasClass('active'), 'nav item for outer element has "active" class');
                assert.ok($('#a-2').hasClass('active'), 'nav item for inner element has "active" class');
                testActiveElements();
            });

            $content.scrollTop($content.scrollTop() + 10);
        }

        testActiveElements();
    });

    QUnit.test('should add the active class correctly when there are nested elements (list markup)', function(assert) {
        assert.expect(6);
        var times = 0;
        var done = assert.async();
        var navbarHtml = '<ul id="navigation">' +
            '<li>' +
            '<a id="a-1" class="nav-link" href="#div-1">div 1</a>' +
            '<ol class="nav">' +
            '<li>' +
            '<a id="a-2" class="nav-link" href="#div-2">div 2</a>' +
            '</li>' +
            '</ol>' +
            '</li>' +
            '</ul>';

        var contentHtml = '<div class="content" style="position: absolute; top: 0px; overflow: auto; height: 50px">' +
            '<div id="div-1" style="padding: 0; margin: 0">' +
            '<div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>' +
            '</div>' +
            '</div>';

        $(navbarHtml).appendTo('#qunit-fixture');

        var $content = $(contentHtml)
            .appendTo('#qunit-fixture')
            .CFW_Scrollspy({
                offset: 0,
                target: '#navigation'
            });

        function testActiveElements() {
            if (++times > 3) { return done(); }

            $content.one('scroll', function() {
                assert.ok($('#a-1').hasClass('active'), 'nav item for outer element has "active" class');
                assert.ok($('#a-2').hasClass('active'), 'nav item for inner element has "active" class');
                testActiveElements();
            });

            $content.scrollTop($content.scrollTop() + 10);
        }

        testActiveElements();
    });

    QUnit.test('should add the active class correctly when there are nested elements (nav markup)', function(assert) {
        assert.expect(6);
        var times = 0;
        var done = assert.async();
        var navbarHtml = '<nav id="navigation">' +
            '<nav>' +
            '<a id="a-1" class="nav-link" href="#div-1">div 1</a>' +
            '<nav>' +
            '<a id="a-2" class="nav-link" href="#div-2">div 2</a>' +
            '</nav>' +
            '</nav>' +
            '</nav>';

        var contentHtml = '<div class="content" style="position: absolute; top: 0px; overflow: auto; height: 50px">' +
            '<div id="div-1" style="padding: 0; margin: 0">' +
            '<div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>' +
            '</div>' +
            '</div>';

        $(navbarHtml).appendTo('#qunit-fixture');

        var $content = $(contentHtml)
            .appendTo('#qunit-fixture')
            .CFW_Scrollspy({
                offset: 0,
                target: '#navigation'
            });

        function testActiveElements() {
            if (++times > 3) { return done(); }

            $content.one('scroll', function() {
                assert.ok($('#a-1').hasClass('active'), 'nav item for outer element has "active" class');
                assert.ok($('#a-2').hasClass('active'), 'nav item for inner element has "active" class');
                testActiveElements();
            });

            $content.scrollTop($content.scrollTop() + 10);
        }

        testActiveElements();
    });

    QUnit.test('should clear selection if above the first section', function(assert) {
        assert.expect(3);
        var done = assert.async();

        var sectionHTML = '<div id="header" style="height: 500px;"></div>' +
            '<nav id="navigation" class="navbar">' +
            '<ul class="nav navbar-nav">' +
            '<li><a href="#div-1" id="a-1" class="active">One</a></li>' +
            '<li><a href="#div-2" id="a-2">Two</a></li>' +
            '<li><a href="#div-3" id="a-3">Three</a></li>' +
            '</ul>' +
            '</nav>';
        $(sectionHTML).appendTo('#qunit-fixture');

        var scrollspyHTML = '<div id="content" style="height: 200px; overflow-y: auto;">' +
            '<div id="spacer" style="height: 100px;"></div>' +
            '<div id="div-1" style="height: 100px;"></div>' +
            '<div id="div-2" style="height: 100px;"></div>' +
            '<div id="div-3" style="height: 100px;"></div>' +
            '<div id="spacer" style="height: 100px;"></div>' +
            '</div>';
        var $scrollspy = $(scrollspyHTML).appendTo('#qunit-fixture');

        $scrollspy
            .CFW_Scrollspy({
                target: '#navigation',
                offset: $scrollspy.position().top,
                throttle: 0
            })
            .one('scroll.cfw.scrollspy', function() {
                assert.strictEqual($('.active').length, 1, '"active" class on only one element present');
                assert.strictEqual($('.active').is($('#a-2')), true, '"active" class on second section');

                $scrollspy
                    .one('scroll.cfw.scrollspy', function() {
                        assert.strictEqual($('.active').length, 0, 'selection cleared');
                        done();
                    })
                    .scrollTop(0);
            })
            .scrollTop(201);
    });

    QUnit.test('should NOT clear selection if above the first section and first section is at the top', function(assert) {
        assert.expect(4);
        var done = assert.async();

        var sectionHTML = '<div id="header" style="height: 500px;"></div>' +
            '<nav id="navigation" class="navbar">' +
            '<ul class="nav navbar-nav">' +
            '<li><a href="#div-1" id="a-1" class="active">One</a></li>' +
            '<li><a href="#div-2" id="a-2">Two</a></li>' +
            '<li><a href="#div-3" id="a-3">Three</a></li>' +
            '</ul>' +
            '</nav>';
        $(sectionHTML).appendTo('#qunit-fixture');

        var negativeHeight = -10;
        var startOfSectionTwo = 101;

        var scrollspyHTML = '<div id="content" style="height: 200px; overflow-y: auto;">' +
            '<div id="div-1" style="height: 100px;"></div>' +
            '<div id="div-2" style="height: 100px;"></div>' +
            '<div id="div-3" style="height: 100px;"></div>' +
            '<div id="spacer" style="height: 100px;"></div>' +
            '</div>';
        var $scrollspy = $(scrollspyHTML).appendTo('#qunit-fixture');

        $scrollspy
            .CFW_Scrollspy({
                target: '#navigation',
                offset: $scrollspy.position().top,
                throttle: 0
            })
            .one('scroll.cfw.scrollspy', function() {
                assert.strictEqual($('.active').length, 1, '"active" class on only one element present');
                assert.strictEqual($('.active').is($('#a-2')), true, '"active" class on second section');
                $scrollspy
                    .one('scroll.cfw.scrollspy', function() {
                        assert.strictEqual($('.active').length, 1, '"active" class on only one element present');
                        assert.strictEqual($('.active').is($('#a-1')), true, '"active" class on first section');
                        done();
                    })
                    .scrollTop(negativeHeight);
            })
            .scrollTop(startOfSectionTwo);
    });

    QUnit.test('should correctly select navigation element on backward scrolling when each target section height is 100%', function(assert) {
        assert.expect(5);
        var navbarHtml = '<nav class="navbar">' +
            '<ul class="nav">' +
            '<li><a href="#div-1" id="a-1">div 1</a></li>' +
            '<li><a href="#div-2" id="a-2">div 2</a></li>' +
            '<li><a href="#div-3" id="a-3">div 3</a></li>' +
            '<li><a href="#div-4" id="a-4">div 4</a></li>' +
            '<li><a href="#div-5" id="a-5">div 5</a></li>' +
            '</ul>' +
            '</nav>';
        var contentHtml = '<div class="content" style="position: relative; overflow: auto; height: 100px">' +
            '<div id="div-1" style="position: relative; height: 100%; padding: 0; margin: 0">div 1</div>' +
            '<div id="div-2" style="position: relative; height: 100%; padding: 0; margin: 0">div 2</div>' +
            '<div id="div-3" style="position: relative; height: 100%; padding: 0; margin: 0">div 3</div>' +
            '<div id="div-4" style="position: relative; height: 100%; padding: 0; margin: 0">div 4</div>' +
            '<div id="div-5" style="position: relative; height: 100%; padding: 0; margin: 0">div 5</div>' +
            '</div>';

        $(navbarHtml).appendTo('#qunit-fixture');
        var $content = $(contentHtml)
            .appendTo('#qunit-fixture')
            .CFW_Scrollspy({
                target: '.navbar',
                offset: 0,
                throttle: 0
            });

        var testElementIsActiveAfterScroll = function(element, target) {
            var deferred = $.Deferred();
            var scrollHeight = Math.ceil($content.scrollTop() + $(target).position().top);
            $content.one('scroll', function() {
                assert.ok($(element).hasClass('active'), 'target:' + target + ', element: ' + element);
                deferred.resolve();
            });
            $content.scrollTop(scrollHeight);
            return deferred.promise();
        };

        var done = assert.async();
        $.when(testElementIsActiveAfterScroll('#a-5', '#div-5'))
            .then(function() { return testElementIsActiveAfterScroll('#a-4', '#div-4'); })
            .then(function() { return testElementIsActiveAfterScroll('#a-3', '#div-3'); })
            .then(function() { return testElementIsActiveAfterScroll('#a-2', '#div-2'); })
            .then(function() { return testElementIsActiveAfterScroll('#a-1', '#div-1'); })
            .then(function() { done(); });
    });
});
