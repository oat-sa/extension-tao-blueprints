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
 * Copyright (c) 2016 (original work) Open Assessment Technologies SA;
 */

/**
 * This component let's you edit a test blueprint.
 *
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
define([
    'jquery',
    'lodash',
    'i18n',
    'ui/component',
    'taoBlueprints/component/editor/distributor/distributor',
    'taoBlueprints/component/editor/propertySelector/selector',
    'tpl!taoBlueprints/component/editor/editor',
    'css!taoBlueprintsCss/editor.css'
], function($, _, __, component, distributorComponent, propertySelectorComponent, editorTpl){
    'use strict';

    /**
     * The default config
     */
    var defaultConfig = {
        width:  500,
        height: 430,
        data : {
            property: false,
            availableProperties : {},
            selecttion : {}
        }
    };

    /**
     * Build a brand new editor component
     *
     * @param {jQueryElement} $container - where to append the component
     * @param {Object} [config] - set the configuration
     * @param {Object} [config.data] - set the component data
     * @param {Object} [config.data.property] - set the component data
     * @param {Object} [config.data.availableProperties] - set the component data
     * @param {Object} [config.data.selection] - set the component data
     * @param {String|Number} [config.width] - the component width
     * @param {String|Number} [config.height] - the component height
     *
     * @returns {editorComponent} the component
     */
    return function editorFactory($container, config){

        var $distributorContainer;
        var $propertySelectorContainer;
        var distributor;
        var selector;

        /**
         * @typedef {editorComponent} The component itself
         */
        var editor = component({

            /**
             * Refresh the editor content, usually when a new target property is selected.
             * It's not done "on change" by default to separate data access to display,
             * especially since the new selection has to be loaded somewhere else.
             * @param {String} uri - the new property URI
             * @param {String} label - the new property label
             * @param {Object} selection - the new selection conten
             * @returns {editorComponent} chains
             * @fires editorComponent#refresh
             */
            refresh : function refresh(uri, label, selection){
                var self       = this;

                if( this.is('rendered') ) {
                    this.disable();

                    if (distributor){
                        distributor.destroy();
                    }
                    this.config.data.property = {
                        uri : uri,
                        label : label
                    };
                    this.config.data.selection = selection;

                    distributor = distributorComponent($distributorContainer, _.pick(this.config, ['data']))
                    .on('render', function(){
                        self.enable();

                        /**
                         * @event editorComponent#refresh a new selection has been loaded
                         */
                        self.trigger('refresh');
                    });
                }

                return this;
            },

            /**
             * Get the editor's values
             * @returns {Object} the values with the selected property and the selection.
             */
            getValues : function getValues() {
                var values = _.pick(this.config.data, ['selection', 'property']);
                if(distributor){
                    values.selection = distributor.getValues();
                }
                return values;
            }

        }, defaultConfig);

        editor
            .on('init', function(){
                this.render($container);
            })
            .on('render', function(){
                var self       = this;
                var $component = this.getElement();

                $distributorContainer      = $('.distributor-container', $component);
                $propertySelectorContainer = $('.property-selector-container', $component);

                distributor = distributorComponent($distributorContainer, _.pick(config, 'data'));
                selector = propertySelectorComponent($propertySelectorContainer, {
                    uri:   config.data.property.uri,
                    label: config.data.property.label,
                    data:  config.data.availableProperties || {}
                })
                .on('change', function(uri, label){

                    /**
                     * @event editorComponent#propertyChange a new property is selected
                     * @param {String} uri - the new propery URI
                     * @param {String} label - the new property label
                     */
                    self.trigger('propertyChange', uri, label);
                });

                $('.saver', $component).on('click', function(e){
                    e.preventDefault();

                    if (!self.is('disabled')){
                        /**
                        * @event editorComponent#save the editor asks you to save it's content
                        * @param {Object} values - with the selected property and the selection.
                        */
                        self.trigger('save', self.getValues());
                    }
                });
            })
            .on('disable', function(){
                if(distributor) {
                    distributor.disable();
                }
                if(selector){
                    selector.disable();
                }
            })
            .on('enable', function(){
                if(distributor) {
                    distributor.enable();
                }
                if(selector){
                    selector.enable();
                }
            });

        //defer the init so the consumer can listen for the events
        _.defer(function(){
            editor
                .setTemplate(editorTpl)
                .init(config);
        });

        return editor;
    };
});
