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
use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceLocatorAwareTrait;

class Service extends \tao_models_classes_ClassService implements ServiceLocatorAwareInterface
{
    use OntologyAwareTrait;
    use ServiceLocatorAwareTrait;

    protected $listService;

    public function getRootClass()
    {
        return $this->getClass('http://www.tao.lu/Ontologies/TAOBlueprints.rdf#Blueprints');
    }

    /**
     * Search all properties with item domain and not literal
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
            $properties[$raw->getUri()] = $raw->getLabel();
        }

        return $properties;
    }

    public function getMatrixByProperty($uri)
    {
        // get blueprint content property
        // get file associated to blueprint content
        // get json content

        $matrix = [];

        $property = $this->getProperty($uri);
        if (! $property->exists()) {
            throw new \common_exception_NotFound(__('Requested property does not exists.'));
        }

        $listClass = $this->getClass($property->getRange()->getUri());
        $list = $this->getListService()->getListElements($listClass);

        foreach ($list as $raw) {
            $matrix[$raw->getUri()]['label'] = $raw->getLabel();
            $matrix[$raw->getUri()]['blueprints-value'] = $this->getBlueprintsValue($raw->getUri());
        }

        return $matrix;
    }

    protected function getBlueprintsValue($uri)
    {
        try {
            $blueprintsValue = $this->getResource($uri)->getUniquePropertyValue(
                $this->getProperty('http://www.tao.lu/Ontologies/TAOBlueprints.rdf#BlueprintsValue')
            );
        } catch (\common_exception_EmptyProperty $e) {
            return 0;
        }

        return (int) $blueprintsValue->literal;
    }

    protected function getListService()
    {
        if (! $this->listService) {
            $this->listService = \tao_models_classes_ListService::singleton();
        }
        return $this->listService;
    }
}