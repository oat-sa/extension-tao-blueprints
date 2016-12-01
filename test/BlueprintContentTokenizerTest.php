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

use oat\tao\test\TaoPhpUnitTestRunner;
use oat\taoBlueprints\model\search\BlueprintContentTokenizer;
use oat\taoBlueprints\model\storage\implementation\JsonStorage;

class BlueprintContentTokenizerTest extends TaoPhpUnitTestRunner
{
    public function testGetStrings()
    {
        $fileStorageMock = $this->getMock(JsonStorage::class, ['getContent'], [], '', false);
        $fileStorageMock->expects($this->once())
            ->method('getContent')
            ->willReturn(
                [
                    'property' => 'aaa',
                    'selection' => ['test1', 'test2']
                ]
            );

        $targetPropertyMock = $this->getMock(\core_kernel_classes_Resource::class, ['getLabel'], [], '', false);
        $targetPropertyMock->expects($this->once())->method('getLabel')->willReturn('label-property');

        $resourceMock1 = $this->getMock(\core_kernel_classes_Resource::class, ['getLabel'], [], '', false);
        $resourceMock1->expects($this->once())->method('getLabel')->willReturn('label1');

        $resourceMock2 = $this->getMock(\core_kernel_classes_Resource::class, ['getLabel'], [], '', false);
        $resourceMock2->expects($this->once())->method('getLabel')->willReturn('label2');

        $tokenizerMock = $this->getMock(BlueprintContentTokenizer::class, ['getFileStorage', 'getResource']);
        $tokenizerMock->expects($this->once())
            ->method('getFileStorage')
            ->willReturn($fileStorageMock);
        $tokenizerMock->expects($this->exactly(3))
            ->method('getResource')
            ->willReturnOnConsecutiveCalls($targetPropertyMock, $resourceMock1, $resourceMock2);

        $this->assertEquals(
            ['label-property', 'label1', 'label2'],
            $tokenizerMock->getStrings(new \core_kernel_classes_Resource('unit-resource'))
        );
    }

    public function testGetStringsWithnoContent()
    {
        $fileStorageMock = $this->getMock(JsonStorage::class, ['getContent'], [], '', false);
        $fileStorageMock->expects($this->once())
            ->method('getContent')
            ->willReturn([]);

        $tokenizerMock = $this->getMock(BlueprintContentTokenizer::class, ['getFileStorage']);
        $tokenizerMock->expects($this->once())
            ->method('getFileStorage')
            ->willReturn($fileStorageMock);

        $this->assertEquals([], $tokenizerMock->getStrings(new \core_kernel_classes_Resource('unit-resource')));
    }
}