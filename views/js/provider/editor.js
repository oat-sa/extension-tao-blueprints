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

            /**
             * Get blueprint's editor data
             * @param {String} uri - the blueprint URI
             * @returns {Promise} that resolves with the data
             */
            get: function get(uri){
                return new Promise(function(resolve, reject){

                    if(_.isEmpty(uri)){
                        return reject(new TypeError('The blueprint URI parameter must be provided'));
                    }

                    return resolve(request(config.get.url, { uri : uri }));
                });

            },

            /**
             * Save blueprint's editor data
             * @param {String} uri - the blueprint URI
             * @param {Object} values - the blueprint's data to save, we check only the selection member
             * @returns {Promise} that resolves if saved
             */
            save : function save(uri, values){
                return new Promise(function(resolve, reject){

                    if(_.isEmpty(uri)){
                        return reject(new TypeError('The blueprint URI parameter must be provided'));
                    }
                    if(!_.isPlainObject(values) || !values.selection){
                        return reject(new TypeError('The values parameter must be provided'));
                    }

                    return resolve(request(config.save.url, { uri : uri, values : values }));
                });
            },

            /**
             * Loads a selection for a particular property
             * @param {String} uri - the property URI
             * @returns {Promise} that resolves with the selection data
             */
            getSelection : function getSelection(uri){

                return new Promise(function(resolve, reject){

                    if(_.isEmpty(uri)){
                        return reject(new TypeError('The property URI parameter must be provided'));
                    }

                    return resolve(request(config.getSelection.url, { uri : uri }));
                });

            }
        };
    };
});
