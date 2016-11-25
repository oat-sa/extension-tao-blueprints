module.exports = function(grunt) {
    'use strict';

    var root = grunt.option('root') + '/taoBlueprints/views/';

    grunt.config.merge({
        sass: {
            taoblueprints: {
                files: [{
                    src: root + 'scss/editor.scss',
                    dest: root + 'css/editor.css'
                }, {
                    src: root + 'scss/distributor.scss',
                    dest: root + 'css/distributor.css'
                }]
            }
        },

        watch: {
            taoblueprintssass: {
                files: [root + 'scss/**/*.scss'],
                tasks: ['sass:taoblueprints', 'notify:taoblueprintssass'],
                options: {
                    debounceDelay: 1000
                }
            }
        },

        notify: {
            taoblueprintssass: {
                options: {
                    title: 'Grunt SASS',
                    message: 'SASS files compiled to CSS'
                }
            }
        }
    });

    //register an alias for main build
    grunt.registerTask('taoblueprintssass', ['sass:taoblueprints']);
};
