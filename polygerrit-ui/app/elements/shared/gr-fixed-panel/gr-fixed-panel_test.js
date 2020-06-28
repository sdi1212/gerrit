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

import '../../../test/common-test-setup-karma.js';
import './gr-fixed-panel.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';

const basicFixture = fixtureFromTemplate(html`
<gr-fixed-panel>
      <div style="height: 100px"></div>
    </gr-fixed-panel>
`);

suite('gr-fixed-panel', () => {
  let element;

  setup(() => {
    element = basicFixture.instantiate();
    element.readyForMeasure = true;
  });

  test('can be disabled with floatingDisabled', () => {
    element.floatingDisabled = true;
    sinon.stub(element, '_reposition');
    window.dispatchEvent(new CustomEvent('resize'));
    element.flushDebouncer('update');
    assert.isFalse(element._reposition.called);
  });

  test('header is the height of the content', () => {
    assert.equal(element.getBoundingClientRect().height, 100);
  });

  test('scroll triggers _reposition', () => {
    sinon.stub(element, '_reposition');
    window.dispatchEvent(new CustomEvent('scroll'));
    element.flushDebouncer('update');
    assert.isTrue(element._reposition.called);
  });

  suite('_reposition', () => {
    const getHeaderTop = function() {
      return element.$.header.style.top;
    };

    const emulateScrollY = function(distance) {
      element._getElementTop.returns(element._headerTopInitial - distance);
      element._updateDebounced();
      element.flushDebouncer('scroll');
    };

    setup(() => {
      element._headerTopInitial = 10;
      sinon.stub(element, '_getElementTop')
          .returns(element._headerTopInitial);
    });

    test('scrolls header along with document', () => {
      emulateScrollY(20);
      // No top property is set when !_headerFloating.
      assert.equal(getHeaderTop(), '');
    });

    test('does not stick to the top by default', () => {
      emulateScrollY(150);
      // No top property is set when !_headerFloating.
      assert.equal(getHeaderTop(), '');
    });

    test('sticks to the top if enabled', () => {
      element.keepOnScroll = true;
      emulateScrollY(120);
      assert.equal(getHeaderTop(), '0px');
    });

    test('drops a shadow when fixed to the top', () => {
      element.keepOnScroll = true;
      emulateScrollY(5);
      assert.isFalse(element.$.header.classList.contains('fixedAtTop'));
      emulateScrollY(120);
      assert.isTrue(element.$.header.classList.contains('fixedAtTop'));
    });
  });
});

