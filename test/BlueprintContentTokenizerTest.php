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

namespace oat\taoBlueprints\test;

use core_kernel_classes_Resource;
use oat\tao\test\TaoPhpUnitTestRunner;
use oat\taoBlueprints\model\search\BlueprintContentTokenizer;
use oat\taoBlueprints\model\storage\implementation\JsonStorage;

class BlueprintContentTokenizerTest extends TaoPhpUnitTestRunner
{
    public function testGetStrings()
    {
        $fileStorageMock = $this->getMockBuilder(JsonStorage::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['getContent'])
            ->disableOriginalClone()
            ->disableArgumentCloning()
            ->getMock();
        $fileStorageMock->expects($this->once())
            ->method('getContent')
            ->willReturn(
                [
                    'property'  => 'aaa',
                    'selection' => [
                        'uri1' => 'test1',
                        'uri2' => 'test2'
                    ]
                ]
            );


        $targetPropertyMock = $this->getResourceMock();
        $targetPropertyMock->expects($this->once())->method('getLabel')->willReturn('label-property');

        $resourceMock1 = $this->getResourceMock();
        $resourceMock1->expects($this->once())->method('getLabel')->willReturn('label1');

        $resourceMock2 = $this->getResourceMock();
        $resourceMock2->expects($this->once())->method('getLabel')->willReturn('label2');


        $tokenizerMock = $this->getMockBuilder(BlueprintContentTokenizer::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['getFileStorage', 'getResource'])
            ->disableOriginalClone()
            ->disableArgumentCloning()
            ->getMock();
        $tokenizerMock->expects($this->once())
            ->method('getFileStorage')
            ->willReturn($fileStorageMock);
        $tokenizerMock->expects($this->exactly(3))
            ->method('getResource')
            ->willReturnOnConsecutiveCalls($targetPropertyMock, $resourceMock1, $resourceMock2);

        $this->assertEquals(
            ['label-property', 'label1', 'label2'],
            $tokenizerMock->getStrings(new core_kernel_classes_Resource('unit-resource'))
        );
    }

    public function testGetStringsWithnoContent()
    {

        $fileStorageMock = $this->getMockBuilder(JsonStorage::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['getContent'])
            ->disableOriginalClone()
            ->disableArgumentCloning()
            ->getMock();
        $fileStorageMock->expects($this->once())
            ->method('getContent')
            ->willReturn([]);

        $tokenizerMock = $this->getMockBuilder(BlueprintContentTokenizer::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['getFileStorage'])
            ->disableOriginalClone()
            ->disableArgumentCloning()
            ->getMock();
        $tokenizerMock->expects($this->once())
            ->method('getFileStorage')
            ->willReturn($fileStorageMock);

        $this->assertEquals([], $tokenizerMock->getStrings(new core_kernel_classes_Resource('unit-resource')));
    }

    private function getResourceMock()
    {
        return $this->getMockBuilder(core_kernel_classes_Resource::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['getLabel'])
            ->disableOriginalClone()
            ->disableArgumentCloning()
            ->getMock();
    }
}