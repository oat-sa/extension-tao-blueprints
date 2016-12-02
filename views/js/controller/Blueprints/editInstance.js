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
 * This controller set up the blueprint editor component and manages
 * the data handling through the provider.
 *
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
define([
    'jquery',
    'i18n',
    'layout/loading-bar',
    'ui/feedback',
    'taoBlueprints/provider/editor',
    'taoBlueprints/component/editor/editor'
], function($, __, loadingBar, feedback, editorProvider, editorComponent){
    'use strict';

    /**
     * Instantiate the editor provider, once.
     */
    var provider = editorProvider();

    /**
     * Display error message
     * @param {Error} err - the calling error
     */
    var onError = function onError(err){
        feedback().error(err.message);
        loadingBar.stop();
    };

    /**
     * The controller
     */
    return {

        /**
         * Ususal controller entrypoint
         */
        start : function start(){

            var $editorContainer = $('.blueprint-editor-container');
            var uri = $editorContainer.data('uri');
            if($editorContainer.length && uri) {

                loadingBar.start();

                provider
                    .get(uri)
                    .then(function(data){

                        editorComponent($editorContainer, {
                            data: data
                        })
                        .on('render', function(){
                            loadingBar.stop();
                        })
                        .on('propertyChange', function(propUri, propLabel){
                            var self = this;

                            provider
                                .getSelection(propUri)
                                .then(function(selection){
                                    self.refresh(propUri, propLabel, selection);
                                })
                                .catch(onError);
                        })
                        .on('save', function(values){

                            provider
                                .save(uri, values)
                                .then(function(){
                                    feedback().success(__('Blueprint saved'));
                                })
                                .catch(onError);
                        });
                    })
                    .catch(onError);
            }
        }
    };

});
