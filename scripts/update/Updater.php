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

namespace oat\taoBlueprints\scripts\update;

use oat\tao\scripts\update\OntologyUpdater;
use oat\taoBlueprints\model\TestSectionLinkService;
use oat\taoBlueprints\scripts\install\InitBlueprintFilesystem;
use oat\taoBlueprints\scripts\install\InitTestSectionLink;

class Updater extends \common_ext_ExtensionUpdater
{
    public function update($initialVersion)
    {
        $this->setVersion('0.1.0');

        if ($this->isVersion('0.1.0')) {

            OntologyUpdater::syncModels();

            $initBlueprintFilesystem = new InitBlueprintFilesystem();
            $initBlueprintFilesystem->setServiceLocator($this->getServiceManager());
            $initBlueprintFilesystem([]);

            $this->setVersion('0.2.0');
        }

        $this->skip('0.2.0', '0.3.0');

        if ($this->isVersion('0.3.0')) {

            OntologyUpdater::syncModels();

            $script = new InitTestSectionLink();
            $script->setServiceLocator($this->getServiceManager());
            $script([]);

            $this->setVersion('0.4.0');
        }

        $this->skip('0.4.0', '2.2.0');
    }
}
