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
import '../../../styles/shared-styles';
import '../../diff/gr-diff-mode-selector/gr-diff-mode-selector';
import '../../diff/gr-patch-range-select/gr-patch-range-select';
import '../../edit/gr-edit-controls/gr-edit-controls';
import '../../shared/gr-editable-label/gr-editable-label';
import '../../shared/gr-linked-chip/gr-linked-chip';
import '../../shared/gr-select/gr-select';
import '../../shared/gr-button/gr-button';
import '../../shared/gr-icons/gr-icons';
import '../gr-commit-info/gr-commit-info';
import {dom, EventApi} from '@polymer/polymer/lib/legacy/polymer.dom';
import {PolymerElement} from '@polymer/polymer/polymer-element';
import {htmlTemplate} from './gr-file-list-header_html';
import {KeyboardShortcutMixin} from '../../../mixins/keyboard-shortcut-mixin/keyboard-shortcut-mixin';
import {FilesExpandedState} from '../gr-file-list-constants';
import {GerritNav} from '../../core/gr-navigation/gr-navigation';
import {
  computeLatestPatchNum,
  getRevisionByPatchNum,
  PatchSet,
} from '../../../utils/patch-set-util';
import {property, computed, observe, customElement} from '@polymer/decorators';
import {
  AccountInfo,
  ChangeInfo,
  PatchSetNum,
  CommitInfo,
  ServerInfo,
  RevisionInfo,
  NumericChangeId,
  BasePatchSetNum,
} from '../../../types/common';
import {DiffPreferencesInfo} from '../../../types/diff';
import {ChangeComments} from '../../diff/gr-comment-api/gr-comment-api';
import {GrDiffModeSelector} from '../../diff/gr-diff-mode-selector/gr-diff-mode-selector';
import {DiffViewMode} from '../../../constants/constants';
import {GrButton} from '../../shared/gr-button/gr-button';
import {appContext} from '../../../services/app-context';
import {fireEvent} from '../../../utils/event-util';

// Maximum length for patch set descriptions.
const PATCH_DESC_MAX_LENGTH = 500;
const MERGED_STATUS = 'MERGED';

declare global {
  interface HTMLElementTagNameMap {
    'gr-file-list-header': GrFileListHeader;
  }
}

export interface GrFileListHeader {
  $: {
    modeSelect: GrDiffModeSelector;
    expandBtn: GrButton;
    collapseBtn: GrButton;
  };
}

@customElement('gr-file-list-header')
export class GrFileListHeader extends KeyboardShortcutMixin(PolymerElement) {
  static get template() {
    return htmlTemplate;
  }

  /**
   * @event expand-diffs
   */

  /**
   * @event collapse-diffs
   */

  /**
   * @event open-diff-prefs
   */

  /**
   * @event open-included-in-dialog
   */

  /**
   * @event open-download-dialog
   */

  @property({type: Object})
  account: AccountInfo | undefined;

  @property({type: Array})
  allPatchSets?: PatchSet[];

  @property({type: Object})
  change: ChangeInfo | undefined;

  @property({type: String})
  changeNum?: NumericChangeId;

  @property({type: String})
  changeUrl?: string;

  @property({type: Object})
  changeComments?: ChangeComments;

  @property({type: Object})
  commitInfo?: CommitInfo;

  @property({type: Boolean})
  editMode?: boolean;

  @property({type: Boolean})
  loggedIn: boolean | undefined;

  @property({type: Object})
  serverConfig?: ServerInfo;

  @property({type: Number})
  shownFileCount?: number;

  @property({type: Object})
  diffPrefs?: DiffPreferencesInfo;

  @property({type: Boolean})
  diffPrefsDisabled?: boolean;

  @property({type: String, notify: true})
  diffViewMode?: DiffViewMode;

  @property({type: String})
  patchNum?: PatchSetNum;

  @property({type: String})
  basePatchNum?: BasePatchSetNum;

  @property({type: String})
  filesExpanded?: FilesExpandedState;

  // Caps the number of files that can be shown and have the 'show diffs' /
  // 'hide diffs' buttons still be functional.
  @property({type: Number})
  readonly _maxFilesForBulkActions = 225;

  @property({type: String})
  _patchsetDescription = '';

  @property({type: Object})
  revisionInfo?: RevisionInfo;

  private readonly restApiService = appContext.restApiService;

  @computed('loggedIn', 'change', 'account')
  get _descriptionReadOnly(): boolean {
    if (
      this.loggedIn === undefined ||
      this.change === undefined ||
      this.account === undefined
    ) {
      return true;
    }

    return !(
      this.loggedIn &&
      this.account._account_id === this.change.owner._account_id
    );
  }

  setDiffViewMode(mode: DiffViewMode) {
    this.$.modeSelect.setMode(mode);
  }

  _expandAllDiffs() {
    fireEvent(this, 'expand-diffs');
  }

  _collapseAllDiffs() {
    fireEvent(this, 'collapse-diffs');
  }

  _computeExpandedClass(filesExpanded: FilesExpandedState) {
    const classes = [];
    if (filesExpanded === FilesExpandedState.ALL) {
      classes.push('openFile');
      classes.push('allExpanded');
    } else if (filesExpanded === FilesExpandedState.SOME) {
      classes.push('openFile');
      classes.push('someExpanded');
    }
    return classes.join(' ');
  }

  _computeDescriptionPlaceholder(readOnly: boolean) {
    return (readOnly ? 'No' : 'Add') + ' patchset description';
  }

  @observe('change', 'patchNum')
  _computePatchSetDescription(change: ChangeInfo, patchNum: PatchSetNum) {
    // Polymer 2: check for undefined
    if (
      change === undefined ||
      change.revisions === undefined ||
      patchNum === undefined
    ) {
      return;
    }

    const rev = getRevisionByPatchNum(
      Object.values(change.revisions),
      patchNum
    );
    this._patchsetDescription = rev?.description
      ? rev.description.substring(0, PATCH_DESC_MAX_LENGTH)
      : '';
  }

  _handleDescriptionRemoved(e: CustomEvent) {
    return this._updateDescription('', e);
  }

  /**
   * @param revisions The revisions object keyed by revision hashes
   * @param patchSet A revision already fetched from {revisions}
   * @return the SHA hash corresponding to the revision.
   */
  _getPatchsetHash(
    revisions: {[revisionId: string]: RevisionInfo},
    patchSet: RevisionInfo
  ) {
    for (const sha of Object.keys(revisions)) {
      if (revisions[sha] === patchSet) {
        return sha;
      }
    }
    throw new Error('patchset hash not found');
  }

  _handleDescriptionChanged(e: CustomEvent) {
    const desc = e.detail.trim();
    this._updateDescription(desc, e);
  }

  /**
   * Update the patchset description with the rest API.
   */
  _updateDescription(desc: string, e: CustomEvent) {
    if (
      !this.change ||
      !this.change.revisions ||
      !this.patchNum ||
      !this.changeNum
    )
      return;
    // target can be either gr-editable-label or gr-linked-chip
    const target = (dom(e) as EventApi).rootTarget as HTMLElement & {
      disabled: boolean;
    };
    if (target) {
      target.disabled = true;
    }
    const rev = getRevisionByPatchNum(
      Object.values(this.change.revisions),
      this.patchNum
    )!;
    const sha = this._getPatchsetHash(this.change.revisions, rev);
    return this.restApiService
      .setDescription(this.changeNum, this.patchNum, desc)
      .then((res: Response) => {
        if (res.ok) {
          if (target) {
            target.disabled = false;
          }
          this.set(['change', 'revisions', sha, 'description'], desc);
          this._patchsetDescription = desc;
        }
      })
      .catch(() => {
        if (target) {
          target.disabled = false;
        }
        return;
      });
  }

  _computePrefsButtonHidden(
    prefs: DiffPreferencesInfo,
    diffPrefsDisabled: boolean
  ) {
    return diffPrefsDisabled || !prefs;
  }

  _fileListActionsVisible(
    shownFileCount: number,
    maxFilesForBulkActions: number
  ) {
    return shownFileCount <= maxFilesForBulkActions;
  }

  _handlePatchChange(e: CustomEvent) {
    const {basePatchNum, patchNum} = e.detail;
    if (
      (basePatchNum === this.basePatchNum && patchNum === this.patchNum) ||
      !this.change
    ) {
      return;
    }
    GerritNav.navigateToChange(this.change, patchNum, basePatchNum);
  }

  _handlePrefsTap(e: Event) {
    e.preventDefault();
    fireEvent(this, 'open-diff-prefs');
  }

  _handleIncludedInTap(e: Event) {
    e.preventDefault();
    fireEvent(this, 'open-included-in-dialog');
  }

  _handleDownloadTap(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent('open-download-dialog', {bubbles: false})
    );
  }

  _computeEditModeClass(editMode?: boolean) {
    return editMode ? 'editMode' : '';
  }

  _computePatchInfoClass(patchNum?: PatchSetNum, allPatchSets?: PatchSet[]) {
    const latestNum = computeLatestPatchNum(allPatchSets);
    if (patchNum === latestNum) {
      return '';
    }
    return 'patchInfoOldPatchSet';
  }

  _hideIncludedIn(change?: ChangeInfo) {
    return change?.status === MERGED_STATUS ? '' : 'hide';
  }
}
