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

namespace oat\taoBlueprints\model;

use oat\generis\model\kernel\persistence\smoothsql\search\ComplexSearchService;
use oat\generis\model\OntologyAwareTrait;
use oat\taoBlueprints\model\storage\Storage;
use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceLocatorAwareTrait;

/**
 * Class Service
 * 
 * A Service implementation dedicated to manage blueprints across the extension.
 *
 * @author Camille Moyon
 * @package oat\taoBlueprints\model
 */
class Service extends \tao_models_classes_ClassService implements ServiceLocatorAwareInterface
{
    use OntologyAwareTrait;
    use ServiceLocatorAwareTrait;

    const PROPERTY_BLUEPRINT_IDENTIFIER = "http://www.taotesting.com/ontologies/blueprint.rdf#identifier";


    /**
     * Service to handle blueprint files storage
     *
     * @var Storage
     */
    protected $fileStorage;
    /**
     * Service to handle ontology list
     *
     * @var \tao_models_classes_ListService
     */
    protected $listService;

    /**
     * Properties to exclude from the selection
     *
     * @var string[] 
     */
    private static $excludedProperties = [
        'http://www.tao.lu/Ontologies/TAOItem.rdf#ItemContent',
        'http://www.tao.lu/Ontologies/TAOItem.rdf#ItemModel'
    ];

    /**
     * Get blueprint root class
     *
     * @return \core_kernel_classes_Class
     */
    public function getRootClass()
    {
        return $this->getClass('http://www.taotesting.com/ontologies/blueprint.rdf#Blueprint');
    }

    /**
     * Create an instance for blueprint & set default content file
     *
     * @param \core_kernel_classes_Class $clazz
     * @param string $label
     * @return \core_kernel_classes_Resource
     */
    public function createInstance(\core_kernel_classes_Class $clazz, $label = '')
    {
        $instance = parent::createInstance($clazz, $label);
        if (! $this->getFileStorage()->hasContent($instance)) {
            $this->getFileStorage()->createEmptyContent($instance);
        }
        return $instance;
    }

    /**
     * Search all properties with item domain and not literal
     *
     * @return \core_kernel_classes_Property[]
     */
    public function getNonLiteralItemProperties()
    {
        $properties = [];

        /** @var ComplexSearchService $search */
        $search = $this->getServiceLocator()->get(ComplexSearchService::SERVICE_ID);
        $queryBuilder = $search->query();

        $query = $search
            ->searchType($queryBuilder, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Property' , true)
            ->add('http://www.w3.org/2000/01/rdf-schema#domain')->equals('http://www.tao.lu/Ontologies/TAOItem.rdf#Item')
            ->add('http://www.w3.org/2000/01/rdf-schema#range')->notMatch('http://www.w3.org/2000/01/rdf-schema#Literal')
        ;

        $queryBuilder->setCriteria($query);
        $result = $search->getGateway()->search($queryBuilder);

        foreach ($result as $raw) {
            if(!in_array($raw->getUri(), self::$excludedProperties)){
                $properties[] = [
                    'uri' => $raw->getUri(),
                    'label' => $raw->getLabel()
                ];
            }
        }

        return $properties;
    }

    /**
     * Get selection matrix associated to a blueprint
     *
     * @param $uri
     * @return mixed
     */
    public function getBlueprintMatrix($uri)
    {
        $content = $this->getFileStorage()->getContent($this->getResource($uri));

        if (! array_key_exists('selection', $content)) {
            \common_Logger::i(__('Blueprint found, but it\'s not correctly formed. Selection key missing.'));
            return [];
        }

        if (empty($content['selection'])) {
            return [];
        }

        return $content['selection'];
    }

    /**
     * Get the target property associated to a blueprint
     *
     * @param $uri
     * @return \core_kernel_classes_Property
     */
    public function getBlueprintTargetProperty($uri)
    {
        $content = $this->getFileStorage()->getContent($this->getResource($uri));

        if (! array_key_exists('property', $content)) {
            \common_Logger::i(__('Blueprint found, but it\'s not correctly formed. Property key missing.'));
            return null;
        }

        if (empty($content['property'])) {
            return null;
        }

        return $this->getProperty($content['property']);
    }

    /**
     * Get the selection matrix associated to a target property
     *
     * @param string $uri
     * @return array
     * @throws \common_exception_NotFound
     */
    public function getTargetPropertyMatrix($uri)
    {
        $matrix = [];

        $property = $this->getProperty($uri);
        if (! $property->exists()) {
            throw new \common_exception_NotFound(__('Requested property does not exists.'));
        }

        $listClass = $this->getClass($property->getRange()->getUri());
        $list = $this->getListService()->getListElements($listClass);

        foreach ($list as $raw) {
            $matrix[$raw->getUri()]['label'] = $raw->getLabel();
            $matrix[$raw->getUri()]['value'] = $this->getSelectionValue($raw->getUri());
        }

        return $matrix;
    }

    /**
     * Delete a blueprint & associated storage
     * Throw an exception if blue print is in use
     *
     * @param \core_kernel_classes_Resource $resource
     * @return bool
     * @throws \common_Exception
     */
    public function deleteResource(\core_kernel_classes_Resource $resource)
    {
        if ($this->isIncludedInTestSection($resource)) {
            throw new \common_Exception(__('Impossible to delete a blueprint in use into test'));
        }
        $this->getFileStorage()->deleteContent($resource);
        return $resource->delete();
    }

    /**
     * Check if matrix is saved and store it to blueprint content
     *
     * @param $uri
     * @param array $matrix
     * @return \common_report_Report
     */
    public function saveBlueprintsMatrix($uri, array $matrix)
    {
        $blueprints = $this->getResource($uri);
        if (! $blueprints->exists()) {
            return \common_report_Report::createFailure(__('Unable to find blueprint to save matrix.'));
        }

        foreach ($matrix as $selection => &$value) {
            $value = (intval($value) > 0) ? intval($value) : 0;
            if (! $this->getResource($selection)->exists()) {
                return \common_report_Report::createFailure(__('Matrix is not correctly set.'));
            }
        }

        $content = $this->getFileStorage()->getContent($blueprints);
        $content['selection'] = $matrix;
        if ($this->getFileStorage()->setContent($blueprints, $content)) {
            return \common_report_Report::createSuccess(__('Blueprint successfully saved.'));
        }

        return \common_report_Report::createFailure(__('Error on saving blueprint content.'));
    }

    /**
     * Check if target property exists and save it into blueprints content
     *
     * @param string $uri
     * @param string $property
     * @return \common_report_Report
     */
    public function saveBlueprintTargetPorperty($uri, $property)
    {
        $blueprints = $this->getResource($uri);
        if (! $blueprints->exists()) {
            return \common_report_Report::createFailure(__('Unable to find blueprint to save matrix.'));
        }

        $targetProperty = $this->getResource($uri);
        if (! $targetProperty->exists()) {
            return \common_report_Report::createFailure(__('Unable to find target property.'));
        }

        $content = $this->getFileStorage()->getContent($blueprints);
        $content['property'] = $property;
        if ($this->getFileStorage()->setContent($blueprints, $content)) {
            return \common_report_Report::createSuccess(__('Blueprint target property successfully saved.'));
        }

        return \common_report_Report::createFailure(__('Error on saving blueprint content.'));
    }
    /**
     * Get the service to handle blueprint files
     *
     * @return Storage
     */
    public function getFileStorage()
    {
        if (! $this->fileStorage) {
            $this->fileStorage = $this->getServiceLocator()->get(Storage::SERVICE_ID);
        }
        return $this->fileStorage;
    }

    /**
     * @param $identifier
     * @param $limit
     * @return array
     */
    public function getBlueprintsByIdentifier($identifier, $limit = 20)
    {
        $blueprints = $this->getRootClass()->searchInstances(
            [
                self::PROPERTY_BLUEPRINT_IDENTIFIER => $identifier
            ],
            [
                'limit' => $limit
            ]
        );

        return $blueprints;
    }

    /**
     * Check if blueprint is in usage into a test section
     *
     * @param \core_kernel_classes_Resource $blueprint
     * @return bool
     */
    protected function isIncludedInTestSection(\core_kernel_classes_Resource $blueprint)
    {
        /** @var ComplexSearchService $search */
        $search = $this->getServiceLocator()->get(ComplexSearchService::SERVICE_ID);
        $queryBuilder = $search->query();

        $query = $search
            ->searchType($queryBuilder, TestSectionLinkService::CLASS_BLUEPRINT_SECTION_TEST , true)
            ->add(TestSectionLinkService::PROPERTY_SECTIONTEST_BLUEPRINT)->equals($blueprint->getUri());

        $queryBuilder->setCriteria($query);
        $results = $search->getGateway()->search($queryBuilder);

        return (bool) ($results->total() > 0);
    }

    /**
     * Get the value of an instance associated to a target property
     *
     * @param string $uri Uri of instance associated to a target property
     * @return int
     */
    protected function getSelectionValue($uri)
    {
        try {
            $blueprintValue = $this->getResource($uri)->getUniquePropertyValue(
                $this->getProperty('http://www.tao.lu/Ontologies/TAOBlueprint.rdf#BlueprintValue')
            );
        } catch (\core_kernel_classes_EmptyProperty $e) {
            return 0;
        }

        return (int) $blueprintValue->literal;
    }

    /**
     * Get the service to handle ontology list
     *
     * @return \tao_models_classes_ListService
     */
    protected function getListService()
    {
        if (! $this->listService) {
            $this->listService = \tao_models_classes_ListService::singleton();
        }
        return $this->listService;
    }
}
