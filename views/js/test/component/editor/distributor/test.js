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
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
define([
    'jquery',
    'taoBlueprints/component/editor/distributor/distributor',
    'json!taoBlueprints/test/component/editor/distributor/data.json'
], function($, distributorComponent, samples) {
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
    ])
    .test('spec ', function(data, assert) {
        var instance = distributorComponent();
        assert.equal(typeof instance[data.name], 'function', 'The distributorComponent instance exposes a "' + data.title + '" function');
    });

    /*
    QUnit.test('Missing parameters', function(assert){
        QUnit.expect(1);

        assert.throws(distributorComponent, TypeError, 'Ids must be defined');
    });

    QUnit.module('Behavior');


    QUnit.asyncTest('DOM rendering', function(assert) {
        var $container = $('#qunit-fixture');

        QUnit.expect(6);

        distributorComponent( $container, ids )
            .on('render', function(){

                assert.equal($('.search', $container).length, 1, 'The container has the component root element');
                assert.ok($('.search', $container).hasClass('rendered'), 1, 'The component root element has the rendered class');
                assert.equal($('.search select', $container).length, 1, 'The component has a select element');
                assert.equal($('.search input[type=search]', $container).length, 1, 'The component has a search input element');
                assert.equal($('.search button', $container).length, 1, 'The component has a button');

                assert.deepEqual($('.search', $container)[0], this.getElement()[0], 'The component element is correct');

                QUnit.start();
            });
    });


    QUnit.asyncTest('mounting lifecycle', function(assert) {
        var $container = $('#qunit-fixture');

        QUnit.expect(4);

        distributorComponent( $container, ids )
            .on('init', function(){
                assert.ok( ! this.is('rendered'), 'The component is not yet rendered');
                assert.equal($('.search', $container).length, 0, 'The component is not yet appended');
            })
            .on('render', function(){

                assert.ok(this.is('rendered'), 'The component is rendered');
                assert.equal($('.search', $container).length, 1, 'The component is  appended');

                this.destroy();
            })
            .on('destroy', function(){
                QUnit.start();
            });
    });

    QUnit.asyncTest('basic input', function(assert) {
        var $container = $('#qunit-fixture');

        QUnit.expect(4);

        distributorComponent( $container, ids )
            .on('render', function(){

                var $component = this.getElement();
                var $input = $('input[type=search]', $component);
                var $button = $('button', $component);

                assert.equal($input.length, 1, 'The search field exists');
                assert.equal($button.length, 1, 'The button field exists');

                $input
                    .val('12345678')
                    .trigger('change');
                $button.trigger('click');

            })
            .on('search', function(type, value){

                assert.equal(type, 'NccerCardNumber', 'The search type is correct');
                assert.equal(value, '12345678', 'The search value is correct');
                QUnit.start();
            });
    });

    QUnit.asyncTest('select type and input', function(assert) {
        var $container = $('#qunit-fixture');

        QUnit.expect(7);

        distributorComponent( $container, ids )
            .on('render', function(){

                var $component = this.getElement();
                var $selector = $('select', $component);

                assert.equal($selector.length, 1, 'The selector field exists');

                $selector.select2('val', 'USSSN').trigger('change');

            })
            .on('typechange', function(type){
                var $component = this.getElement();

                var $input = $('input[type=search]', $component);
                var $button = $('button', $component);


                assert.equal(type, 'USSSN', 'The type given by the event is correct');

                assert.equal($input.length, 1, 'The search field exists');
                assert.equal($button.length, 1, 'The button field exists');

                assert.equal($input.attr('placeholder'), 'AAA-GG-SSSS', 'The placeholder has been modified');

                $input
                    .val('111-22-3333')
                    .trigger('change');
                $button.trigger('click');

            })
            .on('search', function(type, value){

                assert.equal(type, 'USSSN', 'The search type is correct');
                assert.equal(value, '111223333', 'The search value is correct');
                QUnit.start();
            });
    });

    QUnit.asyncTest('detect input type and enter', function(assert) {
        var $container = $('#qunit-fixture');

        QUnit.expect(3);

        distributorComponent( $container, ids )
            .on('render', function(){

                var $component = this.getElement();
                var $input = $('input[type=search]', $component);
                var event  = $.Event('keydown');
                event.which = 13;
                event.keyCode = 13;

                assert.equal($input.length, 1, 'The search field exists');

                $input
                    .val('111-33-4444')
                    .trigger('change')
                    .trigger(event);

            })
            .on('search', function(type, value){

                assert.equal(type, 'USSSN', 'The search type has been detected');
                assert.equal(value, '111334444', 'The search value is correct');
                QUnit.start();
            });
    });

    QUnit.asyncTest('disabled on loading', function(assert) {
        var $container = $('#qunit-fixture');

        QUnit.expect(14);

        distributorComponent( $container, ids )
            .on('render', function(){
                var $component = this.getElement();
                var $input = $('input[type=search]', $component);
                var $button = $('button', $component);

                assert.equal($component.hasClass('disabled'), false, 'The component has not the disabled class');
                assert.equal(this.is('disabled'), false, 'The component is not in disabled state');
                assert.equal($input.length, 1, 'The search field exists');
                assert.equal($input.prop('disabled'), false, 'The field is not disabled');
                assert.equal($button.length, 1, 'The button field exists');
                assert.equal($button.prop('disabled'), false, 'The button is not disabled');

                this.trigger('loading');
            })
            .on('loading', function(){
                var $component = this.getElement();
                var $input = $('input[type=search]', $component);
                var $button = $('button', $component);

                assert.ok($component.hasClass('disabled'), 'The component has the disabled class');
                assert.ok(this.is('disabled'), 'The component is in disabled state');
                assert.ok($input.prop('disabled'), 'The field is disabled');
                assert.ok($button.prop('disabled'), 'The button is disabled');

                this.trigger('loaded');
            })
            .on('loaded', function(){
                var $component = this.getElement();
                var $input = $('input[type=search]', $component);
                var $button = $('button', $component);

                assert.equal($component.hasClass('disabled'), false, 'The component has not the disabled class');
                assert.equal(this.is('disabled'), false, 'The component is not in disabled state');
                assert.equal($input.prop('disabled'), false, 'The field is not disabled');
                assert.equal($button.prop('disabled'), false, 'The button is not disabled');

                QUnit.start();
            });
    });

    QUnit.asyncTest('reset', function(assert) {
        var $container = $('#qunit-fixture');

        QUnit.expect(6);

        distributorComponent( $container, ids )
            .on('render', function(){

                var $component = this.getElement();
                var $input = $('input[type=search]', $component);
                var $button = $('button', $component);

                assert.equal($input.length, 1, 'The search field exists');
                assert.equal($button.length, 1, 'The button field exists');

                $input
                    .val('12345678')
                    .trigger('change');
                $button.trigger('click');

            })
            .on('search', function(type, value){

                assert.equal(type, 'NccerCardNumber', 'The search type is correct');
                assert.equal(value, '12345678', 'The search value is correct');
                assert.equal(this.getValue(), value, 'The current value is correct');

                this.reset();

            })
            .on('reset', function(){

                assert.equal(this.getValue(), '', 'The current value is empty');
                QUnit.start();
            });
    });

    QUnit.asyncTest('set value', function(assert) {
        var $container = $('#qunit-fixture');

        QUnit.expect(5);

        distributorComponent( $container, ids )
            .on('render', function(){

                var $component = this.getElement();
                var $input = $('input[type=search]', $component);

                assert.equal($input.length, 1, 'The search field exists');
                assert.equal($input.val(), '', 'The search field is empty');

                this.setValue('87654321', 'NccerCardNumber');

                assert.equal($input.val(), '87654321', 'The search field contains the new value');

                this.search();

            })
            .on('search', function(type, value){

                assert.equal(type, 'NccerCardNumber', 'The search type is correct');
                assert.equal(value, '87654321', 'The search value is correct');

                QUnit.start();
            });
    });

    QUnit.asyncTest('invalid', function(assert) {
        var $container = $('#qunit-fixture');

        QUnit.expect(1);

        distributorComponent( $container, ids )
            .on('render', function(){
                this.setValue('abc', 'NccerCardNumber')
                    .search();
            })
            .on('search', function(){
                assert.ok(false, 'The search event should not be triggered');
            })
            .on('invalid', function(){
                assert.ok(true, 'The current value is not valid');
                QUnit.start();
            });
    });
*/

    QUnit.module('Visual');

    QUnit.asyncTest('playground', function(assert) {
        var container = document.getElementById('visual');

        QUnit.expect(1);

        distributorComponent( container, { data : samples })
            .on('render', function(){
                var self = this;
                setTimeout(function(){
                    self.disable();
                    assert.ok(true);
                    QUnit.start();
                }, 2000);
            });
    });
});
