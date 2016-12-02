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
use oat\taoBlueprints\model\TestSectionLinkService;

/**
 * Blueprints controller
 *
 * @author Camille Moyon
 * @package taoBlueprints
 * @license GPL-2.0
 *
 */
class Blueprints extends \tao_actions_RdfController
{
    use OntologyAwareTrait;

    /** @var TestSectionLinkService  $testSectionLinkService */
    private $testSectionLinkService = null;

    /**
     * Blueprints constructor.
     * Set resource service
     */
    public function __construct()
    {
        $this->service = Service::singleton();
        $this->testSectionLinkService = $this->getServiceManager()->get(TestSectionLinkService::SERVICE_ID);
        $this->getServiceManager()->propagate($this->service);
    }

    /**
     * Get the root class of blueprint
     *
     * @return \core_kernel_classes_Class
     */
    protected function getRootClass()
    {
        return $this->getClassService()->getRootClass();
    }

    /**
     * Create a new instance of blueprint class with unique label
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
     * Edit a blueprint instance
     */
    public function editInstance()
    {
        $clazz = $this->getCurrentClass();
        $instance = $this->getCurrentInstance();
        $myFormContainer = new \tao_actions_form_Instance($clazz, $instance);

        $myForm = $myFormContainer->getForm();
        if($myForm->isSubmited()){
            if($myForm->isValid()){

                $values = $myForm->getValues();
                // save properties
                $binder = new \tao_models_classes_dataBinding_GenerisFormDataBinder($instance);
                $instance = $binder->bind($values);
                $message = __('Blueprint saved');

                $this->setData('message',$message);
                $this->setData('reload', true);
            }
        }

        $this->setData('formTitle', __('Edit Blueprint'));
        $this->setData('myForm', $myForm->render());
        $this->setData('uri', $instance->getUri());
        $this->setView('form_blueprints.tpl', 'taoBlueprints');
    }

    /**
     * Edit a blueprint class
     * - Return form if form is not submitted
     * - Valid & Create instance if form is submitted
     */
    public function editBlueprintClass()
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
        $this->setData('formTitle', __('Edit blueprint class'));
        $this->setData('myForm', $myForm->render());
        $this->setView('form.tpl', 'tao');
    }

    /**
     * Get all blueprint by identifier
     */
    public function getBlueprintsByIdentifier()
    {
        if (!\tao_helpers_Request::isAjax()) {
            throw new \common_exception_IsAjaxAction(__FUNCTION__);
        }

        if(!$this->hasRequestParameter('identifier')){
            throw new \common_exception_MissingParameter('identifier');
        }

        $blueprints = $this->getClassService()->getBlueprintsByIdentifier($this->getRequestParameter('identifier'));

        $returnValue['results'] = [];
        foreach($blueprints as $blueprint){
            $returnValue['results'][] = ['text' => $blueprint->getLabel(), 'id' => $blueprint->getUri()];
        }

        $this->returnJson($returnValue);
    }

    /**
     * Get Blueprint for one section in one test
     */
    public function getBlueprintsByTestSection()
    {
        $returnValue = [];
        if (!\tao_helpers_Request::isAjax()) {
            throw new \common_exception_IsAjaxAction(__FUNCTION__);
        }

        if(!$this->hasRequestParameter('test')){
            throw new \common_exception_MissingParameter('test');
        }

        if(!$this->hasRequestParameter('section')){
            throw new \common_exception_MissingParameter('section');
        }

        $blueprint = $this->testSectionLinkService->getBlueprintByTestSection($this->getRequestParameter('test'), $this->getRequestParameter('section'));

        if(!empty($blueprint)){
            $returnValue = ['text' => $blueprint->getLabel(), 'uri' => $blueprint->getUri()];
        }
        $this->returnJson($returnValue);
    }

}