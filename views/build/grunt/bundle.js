module.exports = function(grunt) {
    'use strict';

    var root        = grunt.option('root');
    var libs        = grunt.option('mainlibs');
    var ext         = require(root + '/tao/views/build/tasks/helpers/extensions')(grunt, root);
    var out         = 'output';

    grunt.config.merge({
        clean: {
            taoblueprintsbundle : [out],
        },
        requirejs : {
            taoblueprintsbundle : {
                options: {
                    baseUrl : '../js',
                    dir : out,
                    mainConfigFile : './config/requirejs.build.js',
                    paths : {
                        'taoBlueprints' : root + '/taoBlueprints/views/js',
                        'taoBlueprintsCss' : root + '/taoBlueprints/views/css'
                    },
                    modules : [{
                        name: 'taoBlueprints/controller/routes',
                        include : ext.getExtensionsControllers(['taoBlueprints']),
                        exclude : ['mathJax'].concat(libs)
                    }]
                }
            }
        },
        copy : {
            taoblueprintsbundle : {
                files: [
                    { src: [out + '/taoBlueprints/controller/routes.js'],            dest: root + '/taoBlueprints/views/js/controllers.min.js' },
                    { src: [out + '/taoBlueprints/controller/routes.js.map'],        dest: root + '/taoBlueprints/views/js/controllers.min.js.map' }
                ]
            }
        }
    });

    // bundle task
    grunt.registerTask('taoblueprintsbundle', ['clean:taoblueprintsbundle', 'requirejs:taoblueprintsbundle', 'copy:taoblueprintsbundle']);
};

