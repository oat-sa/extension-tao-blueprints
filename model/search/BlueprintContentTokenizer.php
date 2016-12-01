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
 * Copyright (c) 2016 (original work) Open Assessment Technologies SA (under the project TAO-PRODUCT);
 *
 */

namespace oat\taoBlueprints\model\search;

use oat\generis\model\OntologyAwareTrait;
use oat\oatbox\service\ServiceManager;
use oat\tao\model\search\tokenizer\ResourceTokenizer;
use oat\taoBlueprints\model\Service;
use oat\taoBlueprints\model\storage\Storage;

/**
 * Class BlueprintContentTokenizer
 *
 * @author Camille Moyon
 * @package oat\taoBlueprints\model\search
 */
class BlueprintContentTokenizer implements ResourceTokenizer
{
    use OntologyAwareTrait;

    /**
     * Get tokens as string[] extracted from a Blueprints file
     * Content file  is parsed and all text is tokenized
     *
     * @param \core_kernel_classes_Resource $resource
     * @return array
     */
    public function getStrings(\core_kernel_classes_Resource $resource)
    {
        $content = $this->getFileStorage()->getContent($resource);
        if (empty($content)) {
            return [];
        }

        $contentStrings = [];

        if (isset($content['property']) && ! empty($content['property'])) {
            $contentStrings[] = $this->getResource($content['property'])->getLabel();
        }

        foreach(array_keys($content['selection']) as $property) {
            if (! empty($property)) {
                $contentStrings[] = $this->getResource($property)->getLabel();
            }
        }

        return $contentStrings;
    }

    /**
     * @return Storage
     */
    public function getFileStorage()
    {
        $service = Service::singleton();
        ServiceManager::getServiceManager()->propagate($service);
        return $service->getFileStorage();
    }
}