/**
 * @license
 * Copyright (C) 2016 The Android Open Source Project
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
import './gr-download-dialog.js';
import {dom} from '@polymer/polymer/lib/legacy/polymer.dom.js';

const basicFixture = fixtureFromElement('gr-download-dialog');

function getChangeObject() {
  return {
    current_revision: '34685798fe548b6d17d1e8e5edc43a26d055cc72',
    revisions: {
      '34685798fe548b6d17d1e8e5edc43a26d055cc72': {
        _number: 1,
        commit: {
          parents: [],
        },
        fetch: {
          repo: {
            commands: {
              repo: 'repo download test-project 5/1',
            },
          },
          ssh: {
            commands: {
              'Checkout':
                'git fetch ' +
                'ssh://andybons@localhost:29418/test-project ' +
                'refs/changes/05/5/1 && git checkout FETCH_HEAD',
              'Cherry Pick':
                'git fetch ' +
                'ssh://andybons@localhost:29418/test-project ' +
                'refs/changes/05/5/1 && git cherry-pick FETCH_HEAD',
              'Format Patch':
                'git fetch ' +
                'ssh://andybons@localhost:29418/test-project ' +
                'refs/changes/05/5/1 ' +
                '&& git format-patch -1 --stdout FETCH_HEAD',
              'Pull':
                'git pull ' +
                'ssh://andybons@localhost:29418/test-project ' +
                'refs/changes/05/5/1',
            },
          },
          http: {
            commands: {
              'Checkout':
                'git fetch ' +
                'http://andybons@localhost:8080/a/test-project ' +
                'refs/changes/05/5/1 && git checkout FETCH_HEAD',
              'Cherry Pick':
                'git fetch ' +
                'http://andybons@localhost:8080/a/test-project ' +
                'refs/changes/05/5/1 && git cherry-pick FETCH_HEAD',
              'Format Patch':
                'git fetch ' +
                'http://andybons@localhost:8080/a/test-project ' +
                'refs/changes/05/5/1 && ' +
                'git format-patch -1 --stdout FETCH_HEAD',
              'Pull':
                'git pull ' +
                'http://andybons@localhost:8080/a/test-project ' +
                'refs/changes/05/5/1',
            },
          },
        },
      },
    },
  };
}

function getChangeObjectNoFetch() {
  return {
    current_revision: '34685798fe548b6d17d1e8e5edc43a26d055cc72',
    revisions: {
      '34685798fe548b6d17d1e8e5edc43a26d055cc72': {
        _number: 1,
        commit: {
          parents: [],
        },
        fetch: {},
      },
    },
  };
}

suite('gr-download-dialog', () => {
  let element;

  setup(() => {
    element = basicFixture.instantiate();
    element.patchNum = '1';
    element.config = {
      schemes: {
        'anonymous http': {},
        'http': {},
        'repo': {},
        'ssh': {},
      },
      archives: ['tgz', 'tar', 'tbz2', 'txz'],
    };

    flushAsynchronousOperations();
  });

  test('anchors use download attribute', () => {
    const anchors = Array.from(
        dom(element.root).querySelectorAll('a'));
    assert.isTrue(!anchors.some(a => !a.hasAttribute('download')));
  });

  suite('gr-download-dialog tests with no fetch options', () => {
    setup(() => {
      element.change = getChangeObjectNoFetch();
      flushAsynchronousOperations();
    });

    test('focuses on first download link if no copy links', () => {
      const focusStub = sinon.stub(element.$.download, 'focus');
      element.focus();
      assert.isTrue(focusStub.called);
      focusStub.restore();
    });
  });

  suite('gr-download-dialog with fetch options', () => {
    setup(() => {
      element.change = getChangeObject();
      flushAsynchronousOperations();
    });

    test('focuses on first copy link', () => {
      const focusStub = sinon.stub(element.$.downloadCommands, 'focusOnCopy');
      element.focus();
      flushAsynchronousOperations();
      assert.isTrue(focusStub.called);
      focusStub.restore();
    });

    test('computed fields', () => {
      assert.equal(element._computeArchiveDownloadLink(
          {project: 'test/project', _number: 123}, 2, 'tgz'),
      '/changes/test%2Fproject~123/revisions/2/archive?format=tgz');
    });

    test('close event', done => {
      element.addEventListener('close', () => {
        done();
      });
      MockInteractions.tap(element.shadowRoot
          .querySelector('.closeButtonContainer gr-button'));
    });
  });

  test('_computeShowDownloadCommands', () => {
    assert.equal(element._computeShowDownloadCommands([]), 'hidden');
    assert.equal(element._computeShowDownloadCommands(['test']), '');
  });

  test('_computeHidePatchFile', () => {
    const patchNum = '1';

    const change1 = {
      revisions: {
        r1: {_number: 1, commit: {parents: []}},
      },
    };
    assert.isTrue(element._computeHidePatchFile(change1, patchNum));

    const change2 = {
      revisions: {
        r1: {_number: 1, commit: {parents: [
          {commit: 'p1'},
        ]}},
      },
    };
    assert.isFalse(element._computeHidePatchFile(change2, patchNum));
  });
});

