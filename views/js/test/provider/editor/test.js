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

    'taoBlueprints/provider/editor',
    'core/promise',
    'json!taoBlueprints/test/provider/editor/saveSample.json'
], function(editorProvider, Promise, saveSample) {
    'use strict';

    var testConfig = {
        get: {
            url: '/taoBlueprints/views/js/test/provider/editor/get.json'
        },
        save: {
            url: '/taoBlueprints/views/js/test/provider/editor/save.json'
        },
        getSelection: {
            url: '/taoBlueprints/views/js/test/provider/editor/getSelection.json'
        }
    };

    QUnit.module('API');

    QUnit.test('module', function(assert) {
        assert.expect(3);

        assert.equal(typeof editorProvider, 'function', 'The editorProvider module exposes a function');
        assert.equal(typeof editorProvider(), 'object', 'The editorProvider factory produces an object');
        assert.notStrictEqual(editorProvider(), editorProvider(), 'The editorProvider factory provides a different object on each call');
    });

    QUnit.test('methods', function(assert) {
        var provider = editorProvider();

        assert.expect(4);

        assert.equal(typeof provider, 'object', 'The editorProvider factory produces an object');
        assert.equal(typeof provider.get, 'function', 'The provider exposes the get method');
        assert.equal(typeof provider.save, 'function', 'The provider exposes the save method');
        assert.equal(typeof provider.getSelection, 'function', 'The provider exposes the getSelection method');
    });

    QUnit.module('get');

    QUnit.test('success', function(assert) {
        var ready = assert.async();
        var p;
        var provider = editorProvider(testConfig);

        assert.expect(3);

        p = provider.get('http://www.my-tao.com#blueprint1');

        assert.ok(p instanceof Promise, 'The method returns a Promise');

        p.then(function(data) {
            assert.equal(typeof data, 'object', 'The method resolve with an object');
            assert.equal(data.property.uri, 'http://www.my-tao.com#topicArea', 'The method resolve with the correct object');
            ready();
        }).catch(function(err) {
            assert.ok(false, 'The method should not reject : ' + err.message);
            ready();
        });
    });

    QUnit.test('no uri', function(assert) {
        var ready = assert.async();
        var provider;

        assert.expect(2);

        provider = editorProvider(testConfig);

        provider.get().then(function() {
            assert.ok(false, 'The method must not resolve');
            ready();
        }).catch(function(err) {
            assert.ok(err instanceof TypeError, 'The method rejects');
            assert.equal(err.message, 'The blueprint URI parameter must be provided', 'The method rejects with the correct message');
            ready();
        });
    });

    QUnit.test('empty', function(assert) {
        var ready = assert.async();

        var provider = editorProvider({
            get: {
                url: '/taoBlueprints/views/js/test/provider/editor/empty.json'
            }
        });

        assert.expect(1);

        provider.get('http://www.my-tao.com#blueprint1').then(function(data) {
            assert.equal(typeof data, 'undefined', 'The method resolve without content');
            ready();
        }).catch(function(err) {
            assert.ok(false, 'The method should not reject : ' + err.message);
            ready();
        });
    });

    QUnit.module('save');

    QUnit.test('success', function(assert) {
        var ready = assert.async();
        var p, provider;

        assert.expect(2);

        provider = editorProvider(testConfig);
        p = provider.save('http://www.my-tao.com#blueprint1', saveSample);

        assert.ok(p instanceof Promise, 'The method returns a Promise');

        p.then(function(success) {

            assert.ok(success, 'The save method succeed');

            ready();
        }).catch(function(err) {
            assert.ok(false, 'The method should not reject : ' + err.message);
            ready();
        });
    });

    QUnit.test('no uri', function(assert) {
        var ready = assert.async();
        var provider;

        assert.expect(2);

        provider = editorProvider(testConfig);

        provider.save().then(function() {
            assert.ok(false, 'The method must not resolve');
            ready();
        }).catch(function(err) {
            assert.ok(err instanceof TypeError, 'The method rejects');
            assert.equal(err.message, 'The blueprint URI parameter must be provided', 'The method rejects with the correct message');
            ready();
        });
    });

    QUnit.test('wrong values', function(assert) {
        var ready = assert.async();
        var provider;

        assert.expect(2);

        provider = editorProvider(testConfig);

        provider.save('http://www.my-tao.com#blueprint1', {foo: true}).then(function() {
            assert.ok(false, 'The method must not resolve');
            ready();
        }).catch(function(err) {
            assert.ok(err instanceof TypeError, 'The method rejects');
            assert.equal(err.message, 'The values parameter must be provided', 'The method rejects with the correct message');
            ready();
        });
    });

    QUnit.module('getSelection');

    QUnit.test('success', function(assert) {
        var ready = assert.async();
        var p;
        var provider = editorProvider(testConfig);

        assert.expect(4);

        p = provider.getSelection('http://www.my-tao.com#target-lang');

        assert.ok(p instanceof Promise, 'The method returns a Promise');

        p.then(function(data) {
            var testUri = 'http://www.tao.lu/Ontologies/TAO.rdf#Langde-DE';
            assert.equal(typeof data, 'object', 'The method resolve with an object');
            assert.equal(typeof data[testUri], 'object', 'The expected entry exists');
            assert.equal(data[testUri].label, 'German', 'The expected entry has the correct label');
            ready();
        }).catch(function(err) {
            assert.ok(false, 'The method should not reject : ' + err.message);
            ready();
        });
    });

    QUnit.test('no uri', function(assert) {
        var ready = assert.async();
        var provider;

        assert.expect(2);

        provider = editorProvider(testConfig);

        provider.getSelection().then(function() {
            assert.ok(false, 'The method must not resolve');
            ready();
        }).catch(function(err) {
            assert.ok(err instanceof TypeError, 'The method rejects');
            assert.equal(err.message, 'The property URI parameter must be provided', 'The method rejects with the correct message');
            ready();
        });
    });

});
