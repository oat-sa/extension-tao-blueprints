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

use oat\generis\model\fileReference\FileReferenceSerializer;
use oat\generis\model\OntologyAwareTrait;
use oat\oatbox\filesystem\Directory;
use oat\oatbox\filesystem\FileSystemService;
use oat\oatbox\service\ConfigurableService;

/**
 * Class FileStorage
 *
 * @author Camille Moyon
 * @package oat\taoBlueprints\model\storage
 */
abstract class FileStorage extends ConfigurableService implements Storage
{
    use OntologyAwareTrait;

    /**
     * Blueprint directory
     *
     * @var Directory
     */
    protected $storage;

    /**
     * Service to serialize ontology file
     *
     * @var FileReferenceSerializer
     */
    protected $fileSerializer;

    /**
     * FileStorage constructor.
     * Check if filesystem option exists
     *
     * @param array $options
     * @throws \common_Exception
     */
    public function __construct(array $options)
    {
        parent::__construct($options);
        if (! $this->hasOption(self::OPTION_FILESYSTEM)) {
            throw new \common_Exception('Blue prints storage is not correctly configured. Missing filesystem key.');
        }
    }

    /**
     * Create an empty content for a given blueprint
     * Set content property of blueprint
     *
     * @param \core_kernel_classes_Resource $blueprint
     * @return bool
     */
    public function createEmptyContent(\core_kernel_classes_Resource $blueprint)
    {
        $file = $this->getFile($blueprint);
        $blueprint->setPropertyValue(
            $this->getProperty('http://www.taotesting.com/ontologies/blueprint.rdf#content'),
            $this->getFileSerializer()->serialize($file)
        );
        return $file->write($this->getDefaultContent());
    }

    /**
     * Get a blueprint file content
     *
     * @param \core_kernel_classes_Resource $blueprint
     * @return array
     * @throws \common_exception_NotFound
     */
    public function getContent(\core_kernel_classes_Resource $blueprint)
    {
        $file = $this->getFile($blueprint);
        if (! $file->exists()) {
            \common_Logger::i(__('Unable to find associate content for this blueprint.'));
            return [];
        }
        return $file->read();
    }

    /**
     * Delete a blueprint content by removing file & ontology reference
     *
     * @param \core_kernel_classes_Resource $blueprint
     * @return bool
     */
    public function deleteContent(\core_kernel_classes_Resource $blueprint)
    {
        $file = $this->getFile($blueprint);
        $this->getFileSerializer()->cleanUp($this->getFileSerializer()->serialize($file));
        if ($file->exists()) {
            return $file->delete();
        }
        return true;
    }

    /**
     * Check if blueprint have an associated ontology content
     *
     * @param \core_kernel_classes_Resource $blueprint
     * @return bool
     */
    public function hasContent(\core_kernel_classes_Resource $blueprint)
    {
        $contentProperty = $this->getProperty('http://www.taotesting.com/ontologies/blueprint.rdf#content');
        try {
            $blueprint->getUniquePropertyValue($contentProperty);
            return true;
        } catch (\core_kernel_classes_EmptyProperty $e) {
            return false;
        }
    }

    /**
     * Get the file associated to a blueprint
     *
     * @param \core_kernel_classes_Resource $blueprint
     * @return \oat\oatbox\filesystem\File
     */
    protected function getFile(\core_kernel_classes_Resource $blueprint)
    {
        $contentProperty = $this->getProperty('http://www.taotesting.com/ontologies/blueprint.rdf#content');
        try {
            $contentSerial = $blueprint->getUniquePropertyValue($contentProperty)->getUri();
            return $this->getFileSerializer()->unserializeFile($contentSerial);
        } catch (\core_kernel_classes_EmptyProperty $e) {
            return $this->getStorage()->getFile($this->getDefaultFilePath($blueprint) . '/' . $this->getDefaultFileName());
        }
    }

    /**
     * Get the default file path for blueprint contents
     *
     * @param \core_kernel_classes_Resource $blueprint
     * @return string
     */
    protected function getDefaultFilePath(\core_kernel_classes_Resource $blueprint)
    {
        return \tao_helpers_Uri::getUniqueId($blueprint->getUri());
    }
    
    /**
     * Get the blueprint directory
     *
     * @return Directory
     */
    protected function getStorage()
    {
        if (! $this->storage) {
            $this->storage = $this->getServiceLocator()
                ->get(FileSystemService::SERVICE_ID)
                ->getDirectory(
                    $this->getOption(self::OPTION_FILESYSTEM)
                );
        }
        return $this->storage;
    }

    /**
     * Get the fileSerializer to store ontology file
     *
     * @return array|FileReferenceSerializer|object
     */
    protected function getFileSerializer()
    {
        if (! $this->fileSerializer) {
            $this->fileSerializer = $this->getServiceLocator()->get(FileReferenceSerializer::SERVICE_ID);
        }
        return $this->fileSerializer;
    }
}