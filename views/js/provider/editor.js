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
 * Provides blueprints editor data
 *
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
define([
    'lodash',
    'i18n',
    'util/url',
    'core/dataProvider/request',
    'core/promise'
], function( _, __, url, request, Promise){
    'use strict';

    /**
     * Per function requests configuration.
     */
    var defaultConfig = {
        get: {
            url : url.route('get', 'Editor', 'taoBlueprints')
        },
        save : {
            url : url.route('save', 'Editor', 'taoBlueprints')
        },
        getItemProperties : {
            url : url.route('getItemProperties', 'Editor', 'taoBlueprints')
        },
        getSelection : {
            url : url.route('getSelection', 'Editor', 'taoBlueprints')
        }
    };


    /**
     * Creates a configured editor provider
     *
     * @param {Object} [config] - to override the default config
     * @returns {editorProvider} the new provider
     */
    return function editorProviderFactory(config){

        config = _.defaults(config || {}, defaultConfig);

        /**
         * @typedef {editorProvider}
         */
        return {

            get: function get(){
            },

            save : function save(){
            },

            getItemProperties : function getItemProperties(){
            },

            getSelection : function getSelection(){

            }
        };
    };
});
