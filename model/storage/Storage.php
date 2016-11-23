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

use oat\oatbox\service\ConfigurableService;

abstract class Storage extends ConfigurableService
{
    const SERVICE_ID = 'taoBlueprints/storage';

    const OPTION_FILESYSTEM = 'filesystem';

    protected $storage;

    public function __construct(array $options)
    {
        parent::__construct($options);
        if (! $this->hasOption(self::OPTION_FILESYSTEM)) {
            throw new \common_Exception('Blue prints storage is not correctly configured. Missing filesystem key.');
        }
    }

    protected function getStorage()
    {
        if (! $this->storage) {
            $this->storage = $this->getServiceManager()
                ->get(self::SERVICE_ID)
                ->getOption(self::OPTION_FILESYSTEM);
        }
        return $this->storage;
    }
}