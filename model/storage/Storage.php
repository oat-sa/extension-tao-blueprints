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

namespace oat\taoBlueprints\model\storage;

/**
 * Interface Storage
 *
 * @author Camille Moyon
 * @package oat\taoBlueprints\model\storage
 */
interface Storage
{
    const SERVICE_ID = 'taoBlueprints/storage';

    const OPTION_FILESYSTEM = 'filesystem';

    /**
     * Create a blueprint file with default content
     *
     * @param \core_kernel_classes_Resource $blueprint
     * @return mixed
     */
    public function createEmptyContent(\core_kernel_classes_Resource $blueprint);

    /**
     * Return the content associated to the given blueprint
     * Should return a php array
     *
     * @param \core_kernel_classes_Resource $blueprint
     * @return array
     */
    public function getContent(\core_kernel_classes_Resource $blueprint);

    /**
     * Delete a content for a given blueprint
     *
     * @param \core_kernel_classes_Resource $blueprint
     * @return mixed
     */
    public function deleteContent(\core_kernel_classes_Resource $blueprint);

    /**
     * Return the default filename (with extension)
     *
     * @return string
     */
    public function getDefaultFileName();

    /**
     * Get default content for a blueprint file
     *
     * @return string
     */
    public function getDefaultContent();
}