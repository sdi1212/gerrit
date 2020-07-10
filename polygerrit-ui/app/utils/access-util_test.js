/**
 * @license
 * Copyright (C) 2017 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import '../test/common-test-setup-karma.js';
import {toSortedPermissionsArray} from './access-util.js';

suite('gr-access-behavior tests', () => {
  test('toSortedPermissionsArray', () => {
    const rules = {
      'global:Project-Owners': {
        action: 'ALLOW', force: false,
      },
      '4c97682e6ce6b7247f3381b6f1789356666de7f': {
        action: 'ALLOW', force: false,
      },
    };
    const expectedResult = [
      {id: '4c97682e6ce6b7247f3381b6f1789356666de7f', value: {
        action: 'ALLOW', force: false,
      }},
      {id: 'global:Project-Owners', value: {
        action: 'ALLOW', force: false,
      }},
    ];
    assert.deepEqual(toSortedPermissionsArray(rules), expectedResult);
  });
});

