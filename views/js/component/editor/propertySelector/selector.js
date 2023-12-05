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
 * This component let's you select a propery in a list.
 *
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
define([
    'jquery',
    'lodash',
    'ui/component',
    'tpl!taoBlueprints/component/editor/propertySelector/selector',
    'tpl!taoBlueprints/component/editor/propertySelector/listItem',
    'css!taoBlueprintsCss/property-selector.css'
], function ($, _, component, selectorTpl, listItemTpl) {
    'use strict';

    /**
     * Build the selection list/tree
     * @param {Object[]} data - as { uri, label, children } where children contains the same structure
     * @returns {String} the selection as HTML
     */
    var buildTree = function buildTree(data){
        var nodeToListItem = function nodeToListItem(acc , node){
            var item = _.pickBy(node, ['uri', 'label']);
            if(node.children && node.children.length){
                item.childList = _.reduce(node.children, nodeToListItem, '');
            }
            acc += listItemTpl(item);
            return acc;
        };

        return _.reduce(data, nodeToListItem, '');
    };

    /**
     * Build a new component
     *
     * @param {jQueryElement} $container - where to append the component
     * @param {Object} [config] - set the configuration
     * @param {String} [config.uri] - set the URI of the selected property
     * @param {String} [config.label] - set the label of the selected property
     * @param {Object} [config.data] - the selection data as [{uri, label, children}]
     *
     * @returns {propertySelectorComponent} the component
     */
    return function classesSelectorFactory($container, config){

        /**
         * @typedef {propertySelectorComponent} The component itself
         */
        var propertySelector = component({

            /**
             * Get the selected values
             * @returns {Object} that contains the URI and the label of the selected property
             */
            getSelected : function getSelected(){
                var $component = this.getElement();
                var $selected  = $('.selected', $component);
                if($selected.length && !$selected.hasClass('empty')){
                    return {
                        label : $selected.text(),
                        uri   : $selected.data('uri')
                    };
                }
                return false;
            }
        }, {});

        propertySelector
            .setTemplate(selectorTpl)
            .on('init', function(){
                this.render($container);
            })
            .on('render', function(){
                var self = this;
                var $component = this.getElement();
                var $selected  = $('.selected', $component);
                var $options   = $('.options', $component);

                $selected.on('click', function(e){
                    e.preventDefault();
                    $options.toggleClass('folded');
                });

                $options.on('click', 'a', function(e){
                    var $target = $(this);
                    var label = $target.text();
                    var uri = $target.data('uri');

                    e.preventDefault();

                    $selected.text(label)
                            .data('uri', uri);
                    $options.toggleClass('folded');

                    /**
                     * @event propertySelectorComponent#change the selected value has changed
                     * @param {String} uri - the new property URI
                     * @param {String} label - the new property label
                     */
                    self.trigger('change', uri, label);
                });
            });

        //defer the init so the consumer can listen for the events
        _.defer(function(){
            if(config.data && _.size(config.data) > 0){
                config.tree = buildTree(config.data);
            }
            propertySelector.init(config);
        });

        return propertySelector;

    };
});
