/**
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2016 (original work) Open Assessment Technologies SA ;
 */

/**
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
define([

    'jquery',
    'taoBlueprints/component/editor/propertySelector/selector',
    'json!taoBlueprints/test/component/editor/propertySelector/data.json'
], function($, propertySelectorComponent, samples) {
    'use strict';

    var config = {
        uri: 'http://taotesting.com/foo#Level',
        label: 'Level',
        data: samples
    };

    QUnit.module('API');

    QUnit.test('module', function(assert) {
        assert.expect(3);

        assert.equal(typeof propertySelectorComponent, 'function', 'The propertySelectorComponent module exposes a function');
        assert.equal(typeof propertySelectorComponent(null, config), 'object', 'The propertySelectorComponent factory produces an object');
        assert.notStrictEqual(propertySelectorComponent(null, config), propertySelectorComponent(null, config), 'The propertySelectorComponent factory provides a different object on each call');
    });

    QUnit.cases.init([
        {name: 'init', title: 'init'},
        {name: 'destroy', title: 'destroy'},
        {name: 'render', title: 'render'},
        {name: 'show', title: 'show'},
        {name: 'hide', title: 'hide'},
        {name: 'enable', title: 'enable'},
        {name: 'disable', title: 'disable'},
        {name: 'is', title: 'is'},
        {name: 'setState', title: 'setState'},
        {name: 'getContainer', title: 'getContainer'},
        {name: 'getElement', title: 'getElement'},
        {name: 'getTemplate', title: 'getTemplate'},
        {name: 'setTemplate', title: 'setTemplate'}
    ])
    .test('component ', function(data, assert) {
        var instance = propertySelectorComponent(null, config);
        assert.equal(typeof instance[data.name], 'function', 'The propertySelectorComponent instance exposes a "' + data.title + '" function');
    });

    QUnit.cases.init([
        {name: 'on', title: 'on'},
        {name: 'off', title: 'off'},
        {name: 'trigger', title: 'trigger'}
    ])
    .test('eventifier ', function(data, assert) {
        var instance = propertySelectorComponent(null, config);
        assert.equal(typeof instance[data.name], 'function', 'The propertySelectorComponent instance exposes a "' + data.title + '" function');
    });

    QUnit.cases.init([
        {name: 'getSelected', title: 'getSelected'}
    ])
    .test('spec ', function(data, assert) {
        var instance = propertySelectorComponent(null, config);
        assert.equal(typeof instance[data.name], 'function', 'The propertySelectorComponent instance exposes a "' + data.title + '" function');
    });

    QUnit.module('Behavior');

    QUnit.test('DOM rendering', function(assert) {
        var ready = assert.async();
        var $container = $('#qunit-fixture');

        assert.expect(13);

        propertySelectorComponent($container, config)
            .on('render', function() {
                var $element = $('.property-selector ', $container);

                assert.equal($element.length, 1, 'The container has the component root element');
                assert.ok($element.hasClass('rendered'), 1, 'The component root element has the rendered class');

                assert.equal($element.children('a').length, 1, 'The component has an anchor element');
                assert.ok($element.children('a').hasClass('selected'), 'The anchor is the selected element');
                assert.equal($element.children('a').data('uri'), 'http://taotesting.com/foo#Level', 'The anchor is the selected element');

                assert.equal($element.children('div').length, 1, 'The component has an div child element');
                assert.ok($element.children('div').hasClass('options'), 'The div child is the selected element');

                assert.equal($('.options ul li', $element).length, 6, 'The component has the correct number of items');

                assert.equal($('.options ul li:first-child a', $element).data('uri'), 'http://taotesting.com/foo#Identifier', 'The item has the correct URI');
                assert.equal($('.options ul li:first-child a', $element).text(), 'Identifier', 'The item has the correct label');

                assert.equal($('.options ul li:last-child a', $element).data('uri'), 'http://taotesting.com/foo#Target', 'The item has the correct URI');
                assert.equal($('.options ul li:last-child a', $element).text(), 'Target', 'The item has the correct label');

                assert.deepEqual($element[0], this.getElement()[0], 'The element is the one bound to the component');

                ready();
            });
    });

    QUnit.test('mounting lifecycle', function(assert) {
        var ready = assert.async();
        var $container = $('#qunit-fixture');

        assert.expect(4);

        propertySelectorComponent($container, config)
            .on('init', function() {
                assert.ok(!this.is('rendered'), 'The component is not yet rendered');
                assert.equal($('.property-selector', $container).length, 0, 'The component is not yet appended');
            })
            .on('render', function() {

                assert.ok(this.is('rendered'), 'The component is rendered');
                assert.equal($('.property-selector', $container).length, 1, 'The component is  appended');

                this.destroy();
            })
            .on('destroy', function() {
                ready();
            });
    });

    QUnit.test('start empty', function(assert) {
        var ready = assert.async();
        var $container = $('#qunit-fixture');

        assert.expect(6);

        propertySelectorComponent($container, {data: samples})
            .on('render', function() {
                var $element = $('.property-selector ', $container);
                var $selected = $('.selected', $element);

                assert.equal($element.length, 1, 'The container has the component root element');
                assert.ok($element.hasClass('rendered'), 1, 'The component root element has the rendered class');

                assert.equal($selected.length, 1, 'The selected element exists');
                assert.ok($selected.hasClass('empty'), 'The selected element is empty');
                assert.equal($selected.data('uri'), null, 'The selected element as no URI');
                assert.equal($selected.text().trim(), 'Please select a property', 'The default empty text is correct');

                ready();
            });
    });

    QUnit.test('select a value', function(assert) {
        var ready = assert.async();
        var $container = $('#qunit-fixture');

        assert.expect(7);

        propertySelectorComponent($container, config)
            .on('render', function() {
                var $element = $('.property-selector ', $container);
                var $selected = $('.selected', $element);
                var $options = $('.options', $element);

                assert.equal($element.length, 1, 'The container has the component root element');
                assert.ok($element.hasClass('rendered'), 'The component root element has the rendered class');
                assert.equal($selected.data('uri'), 'http://taotesting.com/foo#Level', 'The anchor is the selected element');

                assert.ok($options.hasClass('folded'), 'The options element starts folded');

                $selected.click();

                setTimeout(function() {
                    assert.ok(!$options.hasClass('folded'), 'The options element is shown');

                    $('li:first-child a', $options).click();

                }, 500);

            })
            .on('change', function(uri, label) {

                assert.equal(uri, 'http://taotesting.com/foo#Identifier', 'The selected URI is correct');
                assert.equal(label, 'Identifier', 'The selected label is correct');
                ready();
            });
    });

    QUnit.test('get selected', function(assert) {
        var ready = assert.async();
        var $container = $('#qunit-fixture');

        assert.expect(11);

        propertySelectorComponent($container, config)
            .on('render', function() {
                var $element = $('.property-selector ', $container);
                var $selected = $('.selected', $element);
                var $options = $('.options', $element);
                var selectedValues = this.getSelected();

                assert.equal($element.length, 1, 'The container has the component root element');
                assert.ok($element.hasClass('rendered'), 'The component root element has the rendered class');
                assert.equal($selected.data('uri'), 'http://taotesting.com/foo#Level', 'The anchor is the selected element');

                assert.equal(typeof selectedValues, 'object', 'The selected values is an object');
                assert.equal(selectedValues.uri, 'http://taotesting.com/foo#Level', 'The selected URI is correct');
                assert.equal(selectedValues.label, 'Level', 'The selected label is correct');

                $selected.click();

                setTimeout(function() {
                    $('li:first-child a', $options).click();
                }, 500);
            })
            .on('change', function(uri, label) {
                var selectedValues = this.getSelected();
                assert.equal(uri, 'http://taotesting.com/foo#Identifier', 'The selected URI is correct');
                assert.equal(label, 'Identifier', 'The selected label is correct');
                assert.equal(typeof selectedValues, 'object', 'The selected values is an object');
                assert.equal(selectedValues.uri, uri, 'The selected URI is correct');
                assert.equal(selectedValues.label, label, 'The selected label is correct');
                ready();
            });
    });

    QUnit.module('Visual');

    QUnit.test('playground', function(assert) {
        var ready = assert.async();
        var container = document.getElementById('visual');

        assert.expect(1);

        propertySelectorComponent(container, config)
            .on('render', function() {
                assert.ok(true);
                ready();
            });
    });

});
