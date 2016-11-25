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
 *
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
define([
    'jquery',
    'lodash',
    'i18n',
    'ui/component',
    'ui/incrementer',
    'tpl!taoBlueprints/component/editor/distributor/distributor',
    'css!taoBlueprintsCss/distributor.css'
], function($, _, __, component, incrementer, template){
    'use strict';

    var defaultConfig = {
        width: 'auto',
        height: 200,
        min : 0,
        max : 99
    };

    /**
     * Build a brand new search component
     *
     * @param {jQueryElement} $container - where to append the component
     * @param {Object[]} ids - contains the list of search types, each describes an ID.
     * @returns {searchComponent} the component
     * @throws {TypeError} if the ids aren't defined
     */
    return function distributorFactory($container, config){

        /**
         * @typedef {searchComponent} The component itself
         */
        var distributor = component({
            getValues : function getValues(){
                var $component;
                var values = {};
                if(this.is('rendered')) {
                    $component = this.getElement();

                    $('.row', $component).each(function(){
                        var $elt   = $(this);
                        var $input = $(':text', $elt);
                        var uri    = $elt.data('uri');
                        if(uri && $input.length === 1){
                            values[uri] =  $input.val();
                        }
                    });
                }
            }
        }, defaultConfig);

        distributor
            .on('init', function(){
                this.render($container);
            })
            .on('render', function(){
                var self       = this;
                var $component = this.getElement();

                $component.on('change', function(){
                    self.trigger('change', self.getValues());
                });

                incrementer($component);
            })
            .on('disable', function(){
                if(this.is('rendered')){
                    $(':text[data-increment]', this.getElement()).trigger('disable.incrementer');
                }
            })
            .on('enable', function(){
                if(this.is('rendered')){
                    $(':text[data-increment]', this.getElement()).trigger('enable.incrementer');
                }
            });

        //defer the init so the consumer can listen for the events
        _.defer(function(){
            distributor
                .setTemplate(template)
                .init(config);
        });

        return distributor;
    };
});
