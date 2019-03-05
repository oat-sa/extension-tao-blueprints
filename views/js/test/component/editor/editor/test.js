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
 * Test the Blueprint Edito\'s editor component
 *
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
define( [
    
    'jquery',
    'taoBlueprints/component/editor/editor',
    'json!taoBlueprints/test/component/editor/editor/data.json',
    'json!taoBlueprints/test/component/editor/editor/selection.json'
], function(  $, editorComponent, samples, selection ) {
    'use strict';

    var config = {
        data: samples
    };

    QUnit.module( 'API' );

    QUnit.test( 'module', function( assert ) {
        assert.expect( 3 );

        assert.equal( typeof editorComponent, 'function', 'The editorComponent module exposes a function' );
        assert.equal( typeof editorComponent( null, config ), 'object', 'The editorComponent factory produces an object' );
        assert.notStrictEqual( editorComponent( null, config ), editorComponent( null, config ), 'The editorComponent factory provides a different object on each call' );
    } );

    QUnit.cases.init( [
        { name: 'init',         title: 'init' },
        { name: 'destroy',      title: 'destroy' },
        { name: 'render',       title: 'render' },
        { name: 'show',         title: 'show' },
        { name: 'hide',         title: 'hide' },
        { name: 'enable',       title: 'enable' },
        { name: 'disable',      title: 'disable' },
        { name: 'is',           title: 'is' },
        { name: 'setState',     title: 'setState' },
        { name: 'getContainer', title: 'getContainer' },
        { name: 'getElement',   title: 'getElement' },
        { name: 'getTemplate',  title: 'getTemplate' },
        { name: 'setTemplate',  title: 'setTemplate' }
    ] )
    .test( 'component ', function( data, assert ) {
        var instance = editorComponent( null, config );
        assert.equal( typeof instance[ data.name ], 'function', 'The editorComponent instance exposes a "' + data.title + '" function' );
    } );

    QUnit.cases.init( [
        { name: 'on',      title: 'on' },
        { name: 'off',     title: 'off' },
        { name: 'trigger', title: 'trigger' }
    ] )
    .test( 'eventifier ', function( data, assert ) {
        var instance = editorComponent( null, config );
        assert.equal( typeof instance[ data.name ], 'function', 'The editorComponent instance exposes a "' + data.title + '" function' );
    } );

    QUnit.cases.init( [
        { name: 'refresh',   title: 'refresh' },
        { name: 'getValues', title: 'getValues' }
    ] )
    .test( 'spec ', function( data, assert ) {
        var instance = editorComponent( null, config );
        assert.equal( typeof instance[ data.name ], 'function', 'The editorComponent instance exposes a "' + data.title + '" function' );
    } );

    QUnit.module( 'Behavior' );

    QUnit.test( 'DOM rendering', function( assert ) {
        var ready = assert.async();
        var $container = $( '#qunit-fixture' );

        assert.expect( 7 );

        editorComponent( $container, config )
            .on( 'render', function() {
                var $element = $( '.blueprint-editor', $container );

                assert.equal( $element.length, 1, 'The container has the component root element' );
                assert.ok( $element.hasClass( 'rendered' ), 1, 'The component root element has the rendered class' );

                assert.equal( $( '.property-selector-container', $element ).length, 1, 'The component has property selector container element' );
                assert.equal( $( '.distributor-container', $element ).length, 1, 'The component has the distributor container element' );
                assert.equal( $( '.controls', $element ).length, 1, 'The component has the controls container element' );
                assert.equal( $( '.controls .saver', $element ).length, 1, 'The component has the saver element' );

                assert.deepEqual( $element[ 0 ], this.getElement()[ 0 ], 'The element is the one bound to the component' );

                ready();
            } );
    } );

    QUnit.test( 'mounting lifecycle', function( assert ) {
        var ready = assert.async();
        var $container = $( '#qunit-fixture' );

        assert.expect( 4 );

        editorComponent( $container, config )
            .on( 'init', function() {
                assert.ok( !this.is( 'rendered' ), 'The component is not yet rendered' );
                assert.equal( $( '.blueprint-editor', $container ).length, 0, 'The component is not yet appended' );
            } )
            .on( 'render', function() {

                assert.ok( this.is( 'rendered' ), 'The component is rendered' );
                assert.equal( $( '.blueprint-editor', $container ).length, 1, 'The component is  appended' );

                this.destroy();
            } )
            .on( 'destroy', function() {
                ready();
            } );
    } );

    QUnit.test( 'disabling', function( assert ) {
        var ready = assert.async();
        var $container = $( '#qunit-fixture' );

        assert.expect( 7 );

        editorComponent( $container, config )
            .on( 'render', function() {
                var $element = this.getElement();

                assert.ok( this.is( 'rendered' ), 'The component is rendered' );
                assert.ok( !this.is( 'disabled' ), 'The component starts enabled' );
                assert.ok( !$element.hasClass( 'disabled' ), 'The component starts enabled' );

                this.disable();
            } )
            .on( 'disable', function() {
                var self     = this;
                var $element = this.getElement();

                //Push the check after the other handlers exec
                setTimeout( function() {
                    assert.ok( self.is( 'disabled' ), 'The component is now disabled' );
                    assert.ok( $element.hasClass( 'disabled' ), 'The component is now disabled' );

                    self.enable();
                }, 1 );
            } )
            .after( 'enable', function() {
                var self     = this;
                var $element = this.getElement();

                //Push the check after the other handlers exec
                setTimeout( function() {
                    assert.ok( !self.is( 'disabled' ), 'The component is now enabled' );
                    assert.ok( !$element.hasClass( 'disabled' ), 'The component is now enabled' );
                    ready();
                }, 1 );
            } );
    } );

    QUnit.test( 'change values', function( assert ) {
        var ready = assert.async();
        var $container = $( '#qunit-fixture' );

        assert.expect( 9 );

        editorComponent( $container, config )
            .on( 'render', function() {
                var self = this;
                setTimeout( function() {
                    var $element  = self.getElement();
                    var $selector = $( '.property-selector', $element );
                    var values    = self.getValues();

                    assert.ok( self.is( 'rendered' ), 'The component is rendered' );
                    assert.equal( $selector.length, 1, 'The selecor exists' );

                    assert.deepEqual( values.property, samples.property, 'The property value matches the default config' );
                    assert.deepEqual( values.selection, samples.selection, 'The selection value matches the default config' );

                    $( '.selected', $selector ).click();

                    setTimeout( function() {
                        $( '.options li:first-child a', $selector ).click();
                    }, 500 );
                }, 50 );
            } )
            .on( 'propertyChange', function( uri, label ) {
                assert.equal( uri, 'http://taotesting.com/foo#Identifier', 'The selected URI is correct' );
                assert.equal( label, 'Identifier', 'The selected label is correct' );

                this.refresh( uri, label, selection );
            } )
            .on( 'refresh', function() {
                var values    = this.getValues();

                assert.equal( values.property.uri, 'http://taotesting.com/foo#Identifier', 'The selected URI is correct' );
                assert.equal( values.property.label, 'Identifier', 'The selected label is correct' );
                assert.deepEqual( values.selection, selection, 'The selection value matches the default config' );

                ready();
            } );
    } );

    QUnit.module( 'Visual' );

    QUnit.test( 'playground', function( assert ) {
        var ready = assert.async();
        var container = document.getElementById( 'visual' );

        assert.expect( 1 );

        editorComponent( container, { data: samples } )
            .on( 'render', function() {
                assert.ok( true );
                ready();
            } )
            .on( 'propertyChange', function( uri, label ) {
                var self = this;
                this.disable();
                this.off( 'resfresh' )
                    .on( 'refresh', function() {
                        this.enable();
                    } );
                setTimeout( function() {
                    self.refresh( uri, label, selection );
                }, 1500 );
            } );
    } );
} );
