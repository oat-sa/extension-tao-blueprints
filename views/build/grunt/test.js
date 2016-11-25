module.exports = function(grunt) {
    'use strict';

    var testUrl     = 'http://127.0.0.1:' + grunt.option('testPort');
    var root        = grunt.option('root');

    var testRunners = root + '/taoBlueprints/views/js/test/**/test.html';
    var testFiles   = root + '/taoBlueprints/views/js/test/**/test.js';

    //extract unit tests
    var extractTests = function extractTests(){
        return grunt.file.expand([testRunners]).map(function(path){
            return path.replace(root, testUrl);
        });
    };

    grunt.config.merge({
        qunit: {
            taoblueprints : {
                options: {
                    console : true,
                    urls : extractTests()
                }
            }
        },
        watch: {
            taonccereliverytest : {
                files : [testRunners, testFiles],
                tasks : ['qunit:taoblueprints'],
                options : {
                    debounceDelay : 10000
                }
            }
        }
    });

    // register main test task
    grunt.registerTask('taoblueprintstest', ['qunit:taoblueprints']);
};
