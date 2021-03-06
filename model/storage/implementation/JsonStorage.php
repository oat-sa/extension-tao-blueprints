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

namespace oat\taoBlueprints\model\storage\implementation;

use oat\taoBlueprints\model\storage\FileStorage;

/**
 * Class JsonStorage
 *
 * @author Camille Moyon
 * @package oat\taoBlueprints\model\storage\implementation
 */
class JsonStorage extends FileStorage
{
    /**
     * Read file & json decode content
     *
     * @param \core_kernel_classes_Resource $blueprint
     * @return mixed
     */
    public function getContent(\core_kernel_classes_Resource $blueprint)
    {
        $content = parent::getContent($blueprint);
        return json_decode($content, true);
    }

    /**
     * Save a json_encoded content for a given blueprint
     *
     * @param \core_kernel_classes_Resource $blueprint
     * @param $content
     * @return boolean
     */
    public function setContent(\core_kernel_classes_Resource $blueprint, $content)
    {
        $content = json_encode($content, JSON_PRETTY_PRINT);
        return parent::setContent($blueprint, $content);
    }

    /**
     * Get the default content for a blueprint file
     *
     * @return string
     */
    public function getDefaultContent()
    {
        return json_encode(
            array(
                'version' => '0.1.0',
                'property' => '',
                'selection' => []
            ),
            JSON_PRETTY_PRINT
        );
    }

    /**
     * Get default blueprint filename
     *
     * @return string
     */
    public function getDefaultFileName()
    {
        return 'blueprint.json';
    }
}