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
use oat\generis\model\OntologyAwareTrait;
use oat\taoBlueprints\model\Service;

/**
 * Blueprints controller
 *
 * @author Open Assessment Technologies SA
 * @package taoBlueprints
 * @license GPL-2.0
 *
 */
class Blueprints extends \tao_actions_RdfController
{
    use OntologyAwareTrait;

    /**
     * Blueprints constructor.
     * Set resource service
     */
    public function __construct()
    {
        $this->service = Service::singleton();
        $this->getServiceManager()->propagate($this->service);
    }

    /**
     * Get the root class of blueprints
     *
     * @return \core_kernel_classes_Class
     */
    protected function getRootClass()
    {
        return $this->getClassService()->getRootClass();
    }

    /**
     * Create a new instance of blueprints class with unique label
     *
     * @throws \Exception
     */
    public function create()
    {
        if(! \tao_helpers_Request::isAjax()){
            throw new \Exception(__("Wrong request mode"));
        }

        $resource = $this->getResource($this->getRequestParameter('id'));
        if ($resource->isClass()) {
            $clazz = $this->getClass($resource->getUri());
        } else {
            $clazz = reset($resource->getTypes());
        }

        $label = $this->getClassService()->createUniqueLabel($clazz);
        $item = $this->getClassService()->createInstance($clazz, $label);

        if(! is_null($item)){
            $response = array(
                'label'	=> $item->getLabel(),
                'uri' 	=> $item->getUri()
            );
        } else {
            $response = false;
        }

        $this->returnJson($response);
    }

    /**
     * Edit a blueprints class
     * - Return form if form is not submitted
     * - Valid & Create instance if form is submitted
     */
    public function editBlueprintsClass()
    {
        $clazz = $this->getClass($this->getRequestParameter('id'));

        if($this->hasRequestParameter('property_mode')){
            $this->setSessionAttribute('property_mode', $this->getRequestParameter('property_mode'));
        }

        $myForm = $this->getClassForm($clazz, $this->getClassService()->getRootClass());

        if ($this->hasWriteAccess($clazz->getUri())) {
            if($myForm->isSubmited()){
                if($myForm->isValid()){
                    if($clazz instanceof \core_kernel_classes_Resource){
                        $this->setData("selectNode", \tao_helpers_Uri::encode($clazz->getUri()));
                    }
                    $this->setData('message', __('Class saved'));
                    $this->setData('reload', true);
                }
            }
        } else {
            $myForm->setActions(array());
        }
        $this->setData('formTitle', __('Edit blueprints class'));
        $this->setData('myForm', $myForm->render());
        $this->setView('form.tpl', 'tao');
    }

    /**
     * A possible entry point to tao
     */
    public function index()
    {
        $properties = $this->getBlueprintsService()->getNonLiteralItemProperties();

        foreach ($properties as $uri => $label) {
            $matrixByProperty[] = $this->getBlueprintsService()->getMatrixByProperty($uri);
        }

        echo '<pre>';
        var_dump($matrixByProperty);
        echo '</pre>';

        $this->setData('blueprintsProperties', $properties);
        $this->setData('message', 'Extension to manage tao blue prints');
        $this->setView('taoBlueprints/templateExample.tpl');
    }

    public function getBlueprintsValuesByProperty()
    {

    }

    protected function getBlueprintsService()
    {
        if (! $this->service) {
            $this->service = Service::singleton();
            $this->getServiceManager()->propagate($this->service);
        }
        return $this->service;
    }

}