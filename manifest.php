<?php
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
 *
 *
 */

/**
 * Generated using taoDevTools 2.15.0
 */
return array(
    'name'        => 'taoBlueprints',
    'label'       => 'Blueprints Extension',
    'description' => 'Extension to manage Test Blueprints',
    'license'     => 'GPL-2.0',
    'version'     => '0.4.0',
    'author'      => 'Open Assessment Technologies SA',
    'requires' => [
        'tao' => '>=7.29.0'
    ],
    'managementRole' => 'http://www.tao.lu/Ontologies/generis.rdf#taoBlueprintsManager',
    'acl' => array(
        array('grant', 'http://www.tao.lu/Ontologies/generis.rdf#taoBlueprintsManager', array('ext'=>'taoBlueprints')),
    ),
    'install' => array(
        'rdf' => array(
            dirname(__FILE__) . '/install/ontology/blueprints.rdf',
            dirname(__FILE__) . '/install/ontology/indexation.rdf',
            dirname(__FILE__) . '/install/ontology/taotests.rdf',
        ),
        'php' => array(
            \oat\taoBlueprints\scripts\install\InitBlueprintFilesystem::class,
        )
    ),
    'uninstall' => array(
    ),
    'update' => \oat\taoBlueprints\scripts\update\Updater::class,
    'routes' => array(
        '/taoBlueprints' => 'oat\\taoBlueprints\\controller'
    ),
    'constants' => array(
        # views directory
        "DIR_VIEWS" => dirname(__FILE__).DIRECTORY_SEPARATOR."views".DIRECTORY_SEPARATOR,

        #BASE URL (usually the domain root)
        'BASE_URL' => ROOT_URL.'taoBlueprints/',

        #BASE WWW required by JS
        'BASE_WWW' => ROOT_URL.'taoBlueprints/views/'
    ),
    'extra' => array(
        'structures' => dirname(__FILE__).DIRECTORY_SEPARATOR.'controller'.DIRECTORY_SEPARATOR.'structures.xml',
    )
);
