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
class TestSectionLinkService extends \tao_models_classes_ClassService implements ServiceLocatorAwareInterface
{
    use OntologyAwareTrait;
    use ServiceLocatorAwareTrait;


    const CLASS_BLUEPRINT_SECTION_TEST = "http://www.taotesting.com/ontologies/blueprint.rdf#TestSectionLink";

    const PROPERTY_SECTIONTEST_SECTION = "http://www.taotesting.com/ontologies/blueprint.rdf#AssociatedSection";

    const PROPERTY_SECTIONTEST_TEST = "http://www.taotesting.com/ontologies/blueprint.rdf#AssociatedTest";

    const PROPERTY_SECTIONTEST_BLUEPRINT = "http://www.taotesting.com/ontologies/blueprint.rdf#AssociatedBlueprint";


    /**
     * Get blueprint root class
     *
     * @return \core_kernel_classes_Class
     */
    public function getRootClass()
    {
        return $this->getClass(self::CLASS_BLUEPRINT_SECTION_TEST);
    }


    /**
     * @param $test
     * @param $section
     * @return \core_kernel_classes_Resource|null
     */
    public function getBlueprintByTestSection($test, $section)
    {

        $blueprint = null;

        $blueprintsLinks = $this->getRootClass()->searchInstances(
            [
                self::PROPERTY_SECTIONTEST_SECTION => $section,
                self::PROPERTY_SECTIONTEST_TEST => $test
            ]
        );

        if(!empty($blueprintsLinks)){
            /** @var \core_kernel_classes_Resource $blueprintsLink */
            $blueprintsLink = array_shift($blueprintsLinks);
            $blueprint = $blueprintsLink->getUniquePropertyValue(new \core_kernel_classes_Property(self::PROPERTY_SECTIONTEST_BLUEPRINT));
        }

        return $blueprint;
    }



    public function setBlueprintForTestSection($test, $section, $blueprint)
    {

        /** @var ComplexSearchService $search */
        $search = $this->getServiceLocator()->get(ComplexSearchService::SERVICE_ID);
        $queryBuilder = $search->query();

        $query = $search
            ->searchType($queryBuilder, self::CLASS_BLUEPRINT_SECTION_TEST , true)
            ->add(self::PROPERTY_SECTIONTEST_SECTION)->equals($section)
            ->add(self::PROPERTY_SECTIONTEST_TEST)->equals($test->getUri())
            ->add(self::PROPERTY_SECTIONTEST_BLUEPRINT)->notMatch($blueprint);

        $queryBuilder->setCriteria($query);
        $results = $search->getGateway()->search($queryBuilder);

        if($results->total() > 0){
            /** @var \core_kernel_classes_Resource $result */
            foreach($results as $result){
                $result->editPropertyValues(new \core_kernel_classes_Property(self::PROPERTY_SECTIONTEST_BLUEPRINT), $blueprint);
            }
        } else {
            $this->getRootClass()->createInstanceWithProperties(
                [
                    self::PROPERTY_SECTIONTEST_BLUEPRINT => $blueprint,
                    self::PROPERTY_SECTIONTEST_TEST => $test,
                    self::PROPERTY_SECTIONTEST_SECTION => $section,
                ]
            );
        }
        return true;

    }

    public function removeBlueprintForTestSection($test, $section)
    {

        /** @var ComplexSearchService $search */
        $search = $this->getServiceLocator()->get(ComplexSearchService::SERVICE_ID);
        $queryBuilder = $search->query();

        $query = $search
            ->searchType($queryBuilder, self::CLASS_BLUEPRINT_SECTION_TEST , true)
            ->add(self::PROPERTY_SECTIONTEST_SECTION)->equals($section)
            ->add(self::PROPERTY_SECTIONTEST_TEST)->equals($test->getUri());

        $queryBuilder->setCriteria($query);
        $results = $search->getGateway()->search($queryBuilder);

        if($results->total() > 0){
            /** @var \core_kernel_classes_Resource $result */
            foreach($results as $result){
                $result->delete(true);
            }
        }

        return true;

    }

}
