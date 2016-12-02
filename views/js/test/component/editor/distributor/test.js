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
 * Test the Blueprint Editor's distributor component
 *
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
define([
    'jquery',
    'taoBlueprints/component/editor/distributor/distributor',
    'json!taoBlueprints/test/component/editor/distributor/data.json',
    'json!taoBlueprints/test/component/editor/distributor/empty.json'
], function($, distributorComponent, samples, emptySamples) {
    'use strict';

    QUnit.module('API');

    QUnit.test('module', function(assert) {
        QUnit.expect(3);

        assert.equal(typeof distributorComponent, 'function', "The distributorComponent module exposes a function");
        assert.equal(typeof distributorComponent(), 'object', "The distributorComponent factory produces an object");
        assert.notStrictEqual(distributorComponent(), distributorComponent(), "The distributorComponent factory provides a different object on each call");
    });

    QUnit.cases([
        { name : 'init',         title : 'init' },
        { name : 'destroy',      title : 'destroy' },
        { name : 'render',       title : 'render' },
        { name : 'show',         title : 'show' },
        { name : 'hide',         title : 'hide' },
        { name : 'enable',       title : 'enable' },
        { name : 'disable',      title : 'disable' },
        { name : 'is',           title : 'is' },
        { name : 'setState',     title : 'setState' },
        { name : 'getContainer', title : 'getContainer' },
        { name : 'getElement',   title : 'getElement' },
        { name : 'getTemplate',  title : 'getTemplate' },
        { name : 'setTemplate',  title : 'setTemplate' }
    ])
    .test('component ', function(data, assert) {
        var instance = distributorComponent();
        assert.equal(typeof instance[data.name], 'function', 'The distributorComponent instance exposes a "' + data.title + '" function');
    });

    QUnit.cases([
        { name : 'on',      title : 'on' },
        { name : 'off',     title : 'off' },
        { name : 'trigger', title : 'trigger' }
    ])
    .test('eventifier ', function(data, assert) {
        var instance = distributorComponent();
        assert.equal(typeof instance[data.name], 'function', 'The distributorComponent instance exposes a "' + data.title + '" function');
    });

    QUnit.cases([
        { name : 'getValues', title : 'getValues' }
    ])
    .test('spec ', function(data, assert) {
        var instance = distributorComponent();
        assert.equal(typeof instance[data.name], 'function', 'The distributorComponent instance exposes a "' + data.title + '" function');
    });


    QUnit.module('Behavior');

    QUnit.asyncTest('DOM rendering', function(assert) {
        var $container = $('#qunit-fixture');

        QUnit.expect(12);

        distributorComponent( $container, { data : samples } )
            .on('render', function(){
                var $element = $('.distributor', $container);

                assert.equal($element.length, 1, 'The container has the component root element');
                assert.ok($element.hasClass('rendered'), 1, 'The component root element has the rendered class');

                assert.equal($('header', $element).length, 1, 'The component has an header element');
                assert.equal($('ul', $element).length, 1, 'The component has an list element');
                assert.equal($('ul li', $element).length, 5, 'The component has the correct number of items');

                assert.equal($('ul li:first-child', $element).data('uri'),  'http://www.my-tao.com#federalStateRegulation', 'The item has the correct URI');
                assert.equal($('ul li:first-child .label', $element).length, 1, 'The item has a label element');
                assert.equal($('ul li:first-child .label', $element).text(), 'Federal & State Regulation', 'The item has the correct label');

                assert.equal($('ul li:first-child .count', $element).length, 1, 'The item has a count element');
                assert.equal($('ul li:first-child .count input', $element).length, 1, 'The item has an input element');
                assert.equal($('ul li:first-child .count input', $element).val(), '4', 'The item input has the correct value');

                assert.deepEqual($element[0], this.getElement()[0], 'The element is the one bound to the component');

                QUnit.start();
            });
    });

    QUnit.asyncTest('mounting lifecycle', function(assert) {
        var $container = $('#qunit-fixture');

        QUnit.expect(4);

        distributorComponent( $container, { data : samples } )
            .on('init', function(){
                assert.ok( ! this.is('rendered'), 'The component is not yet rendered');
                assert.equal($('.distributor', $container).length, 0, 'The component is not yet appended');
            })
            .on('render', function(){

                assert.ok(this.is('rendered'), 'The component is rendered');
                assert.equal($('.distributor', $container).length, 1, 'The component is  appended');

                this.destroy();
            })
            .on('destroy', function(){
                QUnit.start();
            });
    });

    QUnit.asyncTest('disabling', function(assert) {
        var $container = $('#qunit-fixture');

        QUnit.expect(10);

        distributorComponent( $container, { data : samples } )
            .on('render', function(){
                var $element = this.getElement();
                var $input   = $('li [data-increment]:last-child', $element);

                assert.ok(this.is('rendered'), 'The component is rendered');
                assert.ok( ! this.is('disabled'), 'The component starts enabled');
                assert.ok( ! $element.hasClass('disabled'), 'The component starts enabled');
                assert.ok( ! $input.hasClass('disabled'), 'The input starts enabled');

                this.disable();
            })
            .on('disable', function(){
                var self     = this;
                var $element = this.getElement();
                var $input   = $('li [data-increment]:last-child', $element);

                //push the check after the other handlers exec
                setTimeout(function(){
                    assert.ok(self.is('disabled'), 'The component is now disabled');
                    assert.ok($element.hasClass('disabled'), 'The component is now disabled');
                    assert.ok( ! $input.hasClass('disabled'), 'The input is now disabled');

                    self.enable();
                }, 1);
            })
            .after('enable', function(){
                var self     = this;
                var $element = this.getElement();
                var $input   = $('li [data-increment]:last-child', $element);

                //push the check after the other handlers exec
                setTimeout(function(){
                    assert.ok( ! self.is('disabled'), 'The component is now enabled');
                    assert.ok( ! $element.hasClass('disabled'), 'The component is now enabled');
                    assert.ok( ! $input.hasClass('disabled'), 'The input is now enabled');

                    QUnit.start();
                }, 1);
            });
    });

    QUnit.asyncTest('change values', function(assert) {
        var $container = $('#qunit-fixture');
        var uri = 'http://www.my-tao.com#principlesOfCraningOperations';

        QUnit.expect(11);

        distributorComponent( $container, { data : samples } )
            .on('render', function(){
                var $element = this.getElement();
                var $item    = $('ul li:nth-child(2)', $element);
                var $input   = $('[data-increment]', $item);
                var values   = this.getValues();

                assert.ok(this.is('rendered'), 'The component is rendered');
                assert.equal($item.length, 1, 'The item exists');
                assert.equal($item.data('uri'), uri, 'The item URI is correct');
                assert.equal($input.length, 1, 'The input exists');

                assert.equal($input.val(), '5', 'The input has the correct value');

                assert.equal(typeof values[uri], 'object', 'The values entry exists');
                assert.equal(values[uri].value, '5', 'The values matches');

                $input.val('7').trigger('change');
            })
            .on('change', function(values){
                var $element = this.getElement();
                var $item    = $('ul li:nth-child(2)', $element);
                var $input   = $('[data-increment]', $item);

                assert.equal($input.val(), '7', 'The input has changed value');
                assert.deepEqual(values, this.getValues(), 'The values given in parameter matches the component values');

                assert.equal(typeof values[uri], 'object', 'The values entry exists');
                assert.equal(values[uri].value, '7', 'The values matches');

                QUnit.start();
            });
    });

    QUnit.asyncTest('no property', function(assert) {
        var $container = $('#qunit-fixture');

        QUnit.expect(2);

        distributorComponent( $container, { data : { property : false }} )
            .on('render', function(){
                var $element = this.getElement();
                var $content = $('ul li', $element);

                assert.equal($content.length, 1, 'Only one element is there');
                assert.equal($content.text().trim(), 'No property defined, please select a property.', 'The message is correct');

                QUnit.start();
            });
    });

    QUnit.asyncTest('no values', function(assert) {
        var $container = $('#qunit-fixture');

        QUnit.expect(2);

        distributorComponent( $container, { data : emptySamples } )
            .on('render', function(){
                var $element = this.getElement();
                var $content = $('ul li', $element);

                assert.equal($content.length, 1, 'Only one element is there');
                assert.equal($content.text().trim(), 'Topic Area has no resources.', 'The message is correct');

                QUnit.start();
            });
    });

    QUnit.module('Visual');

    QUnit.asyncTest('playground', function(assert) {
        var container = document.getElementById('visual');

        QUnit.expect(1);

        distributorComponent( container, { data : samples })
            .on('render', function(){
                assert.ok(true);
                QUnit.start();
            });
    });
});
