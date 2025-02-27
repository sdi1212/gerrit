/**
 * @license
 * Copyright (C) 2020 The Android Open Source Project
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
import {html} from '@polymer/polymer/lib/utils/html-tag';

export const htmlTemplate = html`
  <style include="shared-styles">
    :host {
      display: block;
      overflow: hidden;
    }
    .container {
      align-items: center;
      background-color: var(--background-color-primary);
      /** round */
      border-radius: var(--account-chip-border-radius, 20px);
      border: 1px solid var(--border-color);
      display: inline-flex;
      padding: 0 1px;

      --account-label-padding-horizontal: 6px;
      --gr-account-label-text-style: {
        color: var(--deemphasized-text-color);
      }
    }
    :host([show-avatar]) .container {
    }
    :host([removable]) .container {
    }
    gr-button.remove {
      --gr-remove-button-style: {
        border-top-width: 0;
        border-right-width: 0;
        border-bottom-width: 0;
        border-left-width: 0;
        color: var(--deemphasized-text-color);
        font-weight: var(--font-weight-normal);
        height: 0.6em;
        line-height: 10px;
        /* This cancels most of the --account-label-padding-horizontal. */
        margin-left: -4px;
        padding: 0 2px 0 0;
        text-decoration: none;
      }
    }

    gr-button.remove:hover,
    gr-button.remove:focus {
      --gr-button: {
        @apply --gr-remove-button-style;
      }
    }
    gr-button.remove {
      --gr-button: {
        @apply --gr-remove-button-style;
      }
    }
    :host:focus {
      border-color: transparent;
      box-shadow: none;
      outline: none;
    }
    :host:focus .container,
    :host:focus gr-button {
      background: #ccc;
    }
    .transparentBackground,
    gr-button.transparentBackground {
      background-color: transparent;
    }
    :host([disabled]) {
      opacity: 0.6;
      pointer-events: none;
    }
    iron-icon {
      height: 1.2rem;
      width: 1.2rem;
    }
  </style>
  <div class$="container [[_getBackgroundClass(transparentBackground)]]">
    <gr-account-link
      account="[[account]]"
      change="[[change]]"
      force-attention="[[forceAttention]]"
      highlight-attention="[[highlightAttention]]"
      voteable-text="[[voteableText]]"
    >
    </gr-account-link>
    <gr-button
      id="remove"
      link=""
      hidden$="[[!removable]]"
      hidden=""
      aria-label="Remove"
      class$="remove [[_getBackgroundClass(transparentBackground)]]"
      on-click="_handleRemoveTap"
    >
      <iron-icon icon="gr-icons:close"></iron-icon>
    </gr-button>
  </div>
`;
