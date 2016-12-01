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
], function($, propertySelectorComponent, sample) {
    'use strict';

    var config = {
        uri  : 'http://taotesting.com/foo#Level',
        label: 'Level',
        data : sample
    };

    QUnit.module('API');

    QUnit.test('module', function(assert) {
        QUnit.expect(3);

        assert.equal(typeof propertySelectorComponent, 'function', "The propertySelectorComponent module exposes a function");
        assert.equal(typeof propertySelectorComponent(null, config), 'object', "The propertySelectorComponent factory produces an object");
        assert.notStrictEqual(propertySelectorComponent(null, config), propertySelectorComponent(null, config), "The propertySelectorComponent factory provides a different object on each call");
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
        var instance = propertySelectorComponent(null, config);
        assert.equal(typeof instance[data.name], 'function', 'The propertySelectorComponent instance exposes a "' + data.title + '" function');
    });

    QUnit.cases([
        { name : 'on',      title : 'on' },
        { name : 'off',     title : 'off' },
        { name : 'trigger', title : 'trigger' }
    ])
    .test('eventifier ', function(data, assert) {
        var instance = propertySelectorComponent(null, config);
        assert.equal(typeof instance[data.name], 'function', 'The propertySelectorComponent instance exposes a "' + data.title + '" function');
    });

    QUnit.cases([
    ])
    .test('spec ', function(data, assert) {
        var instance = propertySelectorComponent(null, config);
        assert.equal(typeof instance[data.name], 'function', 'The propertySelectorComponent instance exposes a "' + data.title + '" function');
    });

    QUnit.module('Visual');

    QUnit.asyncTest('playground', function(assert) {
        var container = document.getElementById('visual');

        QUnit.expect(1);

        propertySelectorComponent( container, config)
            .on('render', function(){
                assert.ok(true);
                QUnit.start();
            });
    });

});
