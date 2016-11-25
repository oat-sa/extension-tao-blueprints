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
 */

namespace oat\taoBlueprints\scripts\install;

use oat\oatbox\extension\InstallAction;
use oat\oatbox\filesystem\FileSystemService;
use oat\taoBlueprints\model\storage\implementation\JsonStorage;
use oat\taoBlueprints\model\storage\Storage;

class InitBlueprintFilesystem extends InstallAction
{
    function __invoke($params)
    {
        if ($this->getServiceLocator()->has(Storage::SERVICE_ID)) {
            return new \common_report_Report(\common_report_Report::TYPE_SUCCESS, 'Blueprint file storage already registered, skipped.');
        }

        $storageName = 'blueprintStorage';

        // Create filesystem
        $fsm = $this->getServiceLocator()->get(FileSystemService::SERVICE_ID);
        $fsm->createFileSystem($storageName);
        $this->getServiceLocator()->register(FileSystemService::SERVICE_ID, $fsm);

        // Create blueprint storage with blueprint filesystem
        $blueprintStorage = new JsonStorage(array(
            Storage::OPTION_FILESYSTEM => $storageName,
        ));
        $this->getServiceManager()->register(Storage::SERVICE_ID, $blueprintStorage);

        return new \common_report_Report(\common_report_Report::TYPE_SUCCESS, 'Blueprint file storage registered.');
    }

}