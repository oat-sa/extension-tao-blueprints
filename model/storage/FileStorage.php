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
     * Blueprints directory
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
     * Create an empty content for a given blueprints
     * Set content proerty of blueprints
     *
     * @param \core_kernel_classes_Resource $blueprints
     * @return bool
     */
    public function createEmptyContent(\core_kernel_classes_Resource $blueprints)
    {
        $file = $this->getFile($blueprints);
        $blueprints->setPropertyValue(
            $this->getProperty('http://www.taotesting.com/ontologies/blueprints.rdf#content'),
            $this->getFileSerializer()->serialize($file)
        );
        return $file->write($this->getDefaultContent());
    }

    /**
     * Get a blueprints file content
     *
     * @param \core_kernel_classes_Resource $blueprints
     * @return array
     * @throws \common_exception_NotFound
     */
    public function getContent(\core_kernel_classes_Resource $blueprints)
    {
        $file = $this->getFile($blueprints);
        if (! $file->exists()) {
            \common_Logger::i(__('Unable to find associate content for this blueprints.'));
            return [];
        }
        return $file->read();
    }

    /**
     * Delete a blueprints content by removing file & ontology reference
     *
     * @param \core_kernel_classes_Resource $blueprints
     * @return bool
     */
    public function deleteContent(\core_kernel_classes_Resource $blueprints)
    {
        $file = $this->getFile($blueprints);
        $this->getFileSerializer()->cleanUp($this->getFileSerializer()->serialize($file));
        if ($file->exists()) {
            return $file->delete();
        }
        return true;
    }

    /**
     * Get the file associated to a blueprints
     *
     * @param \core_kernel_classes_Resource $blueprints
     * @return \oat\oatbox\filesystem\File
     */
    protected function getFile(\core_kernel_classes_Resource $blueprints)
    {
        $contentProperty = $this->getProperty('http://www.taotesting.com/ontologies/blueprints.rdf#content');
        try {
            $contentSerial = $blueprints->getUniquePropertyValue($contentProperty)->getUri();
            return $this->getFileSerializer()->unserializeFile($contentSerial);
        } catch (\common_exception_EmptyProperty $e) {
            return $this->getStorage()->getFile($this->getDefaultFilePath($blueprints) . '/' . $this->getDefaultFileName());
        }
    }

    /**
     * Get the default file path for blueprints contents
     *
     * @param \core_kernel_classes_Resource $blueprints
     * @return string
     */
    protected function getDefaultFilePath(\core_kernel_classes_Resource $blueprints)
    {
        return \tao_helpers_Uri::getUniqueId($blueprints->getUri());
    }
    
    /**
     * Get the blueprints directory
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