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

namespace oat\taoBlueprints\controller;

use oat\taoBlueprints\model\Service;

/**
 * Blueprints manages blueprint's editor
 *
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 * @package taoBlueprints
 * @license GPL-2.0
 *
 */
class Editor extends \tao_actions_CommonModule
{
    protected $blueprintsService;

    /**
     * Set resource service
     */
    public function __construct()
    {
        $this->blueprintsService = Service::singleton();
        $this->getServiceManager()->propagate($this->blueprintsService);
    }

    /**
     * Get blueprint's data
     */
    public function get()
    {
        if($this->hasRequestParameter('uri')) {
            $uri = $this->getRequestParameter('uri');

            if (! empty($uri)){
                $blueprintData = [
                    'property' => false
                ];

                $property = $this->blueprintsService->getBlueprintTargetProperty($uri);
                if(!is_null($property) ){
                    $blueprintData['propery'] = [
                        'label' => $property->getLabel(),
                        'uri'   => $property->getUri()
                    ];
                }
                $blueprintData['selection'] = $this->blueprintsService->getBlueprintMatrix($uri);
                $blueprintData['availableProperties'] = $this->blueprintsService->getNonLiteralItemProperties();

                return $this->returnSuccess($blueprintData);
            }
        }
        return $this->returnFailure(__('A blueprint need to be selected first'), 412);
    }

    /**
     * Get a selection from a property URI
     */
    public function getSelection()
    {
        if($this->hasRequestParameter('uri')) {
            $uri = $this->getRequestParameter('uri');

            if (! empty($uri)){

                try {
                    $matrix = $this->blueprintsService->getTargetPropertyMatrix($uri);
                    return $this->returnSuccess($matrix);
                } catch(\common_exception_NotFound $nfe) {
                    $this->returnEmpty();
                }
            }
        }
        return $this->returnFailure(__('The property is not found or inacurrate'), 412);
    }

    /**
     * Save the blueprint's data
     */
    public function save()
    {
        if($this->hasRequestParameter('uri') && $this->hasRequestParameter('values')) {
            $uri = $this->getRequestParameter('uri');
            $values = $this->getRequestParameter('values');
            if(isset($values['selection']) && isset($values['property'])){

                $matrix = [];
                foreach($values['selection'] as $uri => $value){
                    $matrix[$uri] = $value['value'];
                }

                $report = $this->blueprintsService->saveBlueprintsMatrix($uri, $matrix);
                if($report->getType() != \common_report_Report::TYPE_SUCCESS){
                    return $this->returnFailure($report->getMessage(), 412);
                }
                return $this->returnSuccess(true);
            }
            return $this->returnFailure(__('A blueprint need values'), 412);
        }
        return $this->returnFailure(__('A blueprint need to be selected first'), 412);
    }

    /**
     * Convenience method to create a formated success response
     * @param mixed $data - any serializable data
     */
    private function returnSuccess($data){
        return $this->returnJson([
            'success' => true,
            'data'    => $data
        ], 200);
    }

    /**
     * Convenience method to create a formated empty response
     */
    private function returnEmpty()
    {
        return $this->returnJson([
            'success' => true,
            'data'    => null
        ], 204);
    }

    /**
     * Convenience method to create a formated error response
     * @param string $message the error message (for the user)
     * @param int    $code    the error code (for the devs)
     */
    protected function returnFailure($message, $code)
    {
        return $this->returnJson([
            'success' => false,
            'errorCode' => $code,
            'errorMsg' => $message
        ], $code);
    }
}
