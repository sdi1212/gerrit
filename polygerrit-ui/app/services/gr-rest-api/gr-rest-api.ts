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

import {HttpMethod} from '../../constants/constants';
import {
  AccountCapabilityInfo,
  AccountDetailInfo,
  AccountExternalIdInfo,
  AccountId,
  AccountInfo,
  ActionNameToActionInfoMap,
  Base64FileContent,
  BasePatchSetNum,
  BlameInfo,
  BranchInfo,
  BranchInput,
  BranchName,
  CapabilityInfoMap,
  ChangeId,
  ChangeInfo,
  ChangeMessageId,
  CommentInfo,
  CommentInput,
  CommitInfo,
  ConfigInfo,
  ConfigInput,
  ContributorAgreementInfo,
  ContributorAgreementInput,
  DashboardId,
  DashboardInfo,
  DiffPreferenceInput,
  DocResult,
  EditInfo,
  EditPreferencesInfo,
  EmailAddress,
  EmailInfo,
  EncodedGroupId,
  FileNameToFileInfoMap,
  FilePathToDiffInfoMap,
  FixId,
  GitRef,
  GpgKeyId,
  GpgKeyInfo,
  GpgKeysInput,
  GroupAuditEventInfo,
  GroupId,
  GroupInfo,
  GroupInput,
  GroupName,
  GroupNameToGroupInfoMap,
  GroupOptionsInput,
  Hashtag,
  HashtagsInput,
  ImagesForDiff,
  IncludedInInfo,
  MergeableInfo,
  NameToProjectInfoMap,
  NumericChangeId,
  ParsedJSON,
  Password,
  PatchRange,
  PatchSetNum,
  PathToCommentsInfoMap,
  PathToRobotCommentsInfoMap,
  PluginInfo,
  PreferencesInfo,
  PreferencesInput,
  ProjectAccessInfo,
  ProjectAccessInfoMap,
  ProjectAccessInput,
  ProjectInfo,
  ProjectInfoWithName,
  ProjectInput,
  ProjectWatchInfo,
  RelatedChangesInfo,
  RepoName,
  RequestPayload,
  ReviewInput,
  RevisionId,
  RobotCommentInfo,
  ServerInfo,
  SshKeyInfo,
  SubmittedTogetherInfo,
  SuggestedReviewerInfo,
  TagInfo,
  TagInput,
  TopMenuEntryInfo,
  UrlEncodedCommentId,
} from '../../types/common';
import {
  DiffInfo,
  DiffPreferencesInfo,
  IgnoreWhitespaceType,
} from '../../types/diff';
import {ParsedChangeInfo} from '../../types/types';
import {ErrorCallback} from '../../api/rest';

export type CancelConditionCallback = () => boolean;

// TODO(TS): remove when GrReplyDialog converted to typescript
export interface GrReplyDialog {
  getLabelValue(label: string): string;
  setLabelValue(label: string, value: string): void;
  send(includeComments?: boolean, startReview?: boolean): Promise<unknown>;
  setPluginMessage(message: string): void;
}

export interface GetDiffCommentsOutput {
  baseComments: CommentInfo[];
  comments: CommentInfo[];
}

export interface GetDiffRobotCommentsOutput {
  baseComments: RobotCommentInfo[];
  comments: RobotCommentInfo[];
}

export interface RestApiService {
  getConfig(noCache?: boolean): Promise<ServerInfo | undefined>;
  getLoggedIn(): Promise<boolean>;
  getPreferences(): Promise<PreferencesInfo | undefined>;
  getVersion(): Promise<string | undefined>;
  getAccount(): Promise<AccountDetailInfo | undefined>;
  getAccountCapabilities(
    params?: string[]
  ): Promise<AccountCapabilityInfo | undefined>;
  getExternalIds(): Promise<AccountExternalIdInfo[] | undefined>;
  deleteAccountIdentity(id: string[]): Promise<unknown>;
  getRepos(
    filter: string | undefined,
    reposPerPage: number,
    offset?: number
  ): Promise<ProjectInfoWithName[] | undefined>;

  send(
    method: HttpMethod,
    url: string,
    body?: RequestPayload,
    errFn?: null | undefined,
    contentType?: string,
    headers?: Record<string, string>
  ): Promise<Response>;

  send(
    method: HttpMethod,
    url: string,
    body?: RequestPayload,
    errFn?: ErrorCallback,
    contentType?: string,
    headers?: Record<string, string>
  ): Promise<Response | void>;

  getResponseObject(response: Response): Promise<ParsedJSON>;

  getChangeSuggestedReviewers(
    changeNum: NumericChangeId,
    input: string
  ): Promise<SuggestedReviewerInfo[] | undefined>;
  getChangeSuggestedCCs(
    changeNum: NumericChangeId,
    input: string
  ): Promise<SuggestedReviewerInfo[] | undefined>;
  getSuggestedAccounts(
    input: string,
    n?: number
  ): Promise<AccountInfo[] | undefined>;
  getSuggestedGroups(
    input: string,
    n?: number
  ): Promise<GroupNameToGroupInfoMap | undefined>;
  executeChangeAction(
    changeNum: NumericChangeId,
    method: HttpMethod | undefined,
    endpoint: string,
    patchNum?: PatchSetNum,
    payload?: RequestPayload,
    errFn?: ErrorCallback
  ): Promise<Response | undefined>;
  getRepoBranches(
    filter: string,
    repo: RepoName,
    reposBranchesPerPage: number,
    offset?: number,
    errFn?: ErrorCallback
  ): Promise<BranchInfo[] | undefined>;

  getChangeDetail(
    changeNum: number | string,
    opt_errFn?: ErrorCallback,
    opt_cancelCondition?: Function
  ): Promise<ParsedChangeInfo | null | undefined>;

  getChange(
    changeNum: ChangeId | NumericChangeId,
    errFn: ErrorCallback
  ): Promise<ChangeInfo | null>;

  savePreferences(prefs: PreferencesInput): Promise<Response>;

  getDiffPreferences(): Promise<DiffPreferencesInfo | undefined>;

  saveDiffPreferences(prefs: DiffPreferenceInput): Promise<Response>;

  getEditPreferences(): Promise<EditPreferencesInfo | undefined>;

  saveEditPreferences(prefs: EditPreferencesInfo): Promise<Response>;

  getAccountEmails(): Promise<EmailInfo[] | undefined>;
  deleteAccountEmail(email: string): Promise<Response>;
  setPreferredAccountEmail(email: string): Promise<void>;

  getAccountSSHKeys(): Promise<SshKeyInfo[] | undefined>;
  deleteAccountSSHKey(key: string): void;
  addAccountSSHKey(key: string): Promise<SshKeyInfo>;

  createRepoBranch(
    name: RepoName,
    branch: BranchName,
    revision: BranchInput
  ): Promise<Response>;

  createRepoTag(
    name: RepoName,
    tag: string,
    revision: TagInput
  ): Promise<Response>;
  addAccountGPGKey(key: GpgKeysInput): Promise<Record<string, GpgKeyInfo>>;
  deleteAccountGPGKey(id: GpgKeyId): Promise<Response>;
  getAccountGPGKeys(): Promise<Record<string, GpgKeyInfo>>;
  probePath(path: string): Promise<boolean>;

  saveFileUploadChangeEdit(
    changeNum: NumericChangeId,
    path: string,
    content: string
  ): Promise<Response | undefined>;

  deleteFileInChangeEdit(
    changeNum: NumericChangeId,
    path: string
  ): Promise<Response | undefined>;

  restoreFileInChangeEdit(
    changeNum: NumericChangeId,
    restore_path: string
  ): Promise<Response | undefined>;

  renameFileInChangeEdit(
    changeNum: NumericChangeId,
    old_path: string,
    new_path: string
  ): Promise<Response | undefined>;

  queryChangeFiles(
    changeNum: NumericChangeId,
    patchNum: PatchSetNum,
    query: string
  ): Promise<string[] | undefined>;

  getRepoAccessRights(
    repoName: RepoName,
    errFn?: ErrorCallback
  ): Promise<ProjectAccessInfo | undefined>;

  createRepo(config: ProjectInput & {name: RepoName}): Promise<Response>;

  getRepo(
    repo: RepoName,
    errFn?: ErrorCallback
  ): Promise<ProjectInfo | undefined>;

  getRepoDashboards(
    repo: RepoName,
    errFn?: ErrorCallback
  ): Promise<DashboardInfo[] | undefined>;

  getRepoAccess(repo: RepoName): Promise<ProjectAccessInfoMap | undefined>;

  getProjectConfig(
    repo: RepoName,
    errFn?: ErrorCallback
  ): Promise<ConfigInfo | undefined>;

  getCapabilities(
    errFn?: ErrorCallback
  ): Promise<CapabilityInfoMap | undefined>;

  setRepoAccessRights(
    repoName: RepoName,
    repoInfo: ProjectAccessInput
  ): Promise<Response>;

  setRepoAccessRightsForReview(
    projectName: RepoName,
    projectInfo: ProjectAccessInput
  ): Promise<ChangeInfo>;

  getGroups(
    filter: string,
    groupsPerPage: number,
    offset?: number
  ): Promise<GroupNameToGroupInfoMap | undefined>;

  getGroupConfig(
    group: GroupId | GroupName,
    errFn?: ErrorCallback
  ): Promise<GroupInfo | undefined>;

  getIsAdmin(): Promise<boolean | undefined>;

  getIsGroupOwner(groupName: GroupName): Promise<boolean>;

  saveGroupName(
    groupId: GroupId | GroupName,
    name: GroupName
  ): Promise<Response>;

  saveGroupOwner(
    groupId: GroupId | GroupName,
    ownerId: string
  ): Promise<Response>;

  saveGroupDescription(
    groupId: GroupId,
    description: string
  ): Promise<Response>;

  saveGroupOptions(
    groupId: GroupId,
    options: GroupOptionsInput
  ): Promise<Response>;

  saveChangeReview(
    changeNum: ChangeId | NumericChangeId,
    patchNum: RevisionId,
    review: ReviewInput
  ): Promise<Response>;
  saveChangeReview(
    changeNum: ChangeId | NumericChangeId,
    patchNum: RevisionId,
    review: ReviewInput,
    errFn: ErrorCallback
  ): Promise<Response | undefined>;
  saveChangeReview(
    changeNum: ChangeId | NumericChangeId,
    patchNum: RevisionId,
    review: ReviewInput,
    errFn?: ErrorCallback
  ): Promise<Response>;

  getChangeEdit(
    changeNum: NumericChangeId,
    downloadCommands?: boolean
  ): Promise<false | EditInfo | undefined>;

  getChangeActionURL(
    changeNum: NumericChangeId,
    patchNum: PatchSetNum | undefined,
    endpoint: string
  ): Promise<string>;

  createChange(
    project: RepoName,
    branch: BranchName,
    subject: string,
    topic?: string,
    isPrivate?: boolean,
    workInProgress?: boolean,
    baseChange?: ChangeId,
    baseCommit?: string
  ): Promise<ChangeInfo | undefined>;

  getChangeIncludedIn(
    changeNum: NumericChangeId
  ): Promise<IncludedInInfo | undefined>;

  getFromProjectLookup(
    changeNum: NumericChangeId
  ): Promise<RepoName | undefined>;

  saveDiffDraft(
    changeNum: NumericChangeId,
    patchNum: PatchSetNum,
    draft: CommentInput
  ): Promise<Response>;

  getDiffChangeDetail(
    changeNum: NumericChangeId
  ): Promise<ChangeInfo | undefined | null>;

  getPortedComments(
    changeNum: NumericChangeId,
    revision: RevisionId
  ): Promise<PathToCommentsInfoMap | undefined>;

  getPortedDrafts(
    changeNum: NumericChangeId,
    revision: RevisionId
  ): Promise<PathToCommentsInfoMap | undefined>;

  getDiffComments(
    changeNum: NumericChangeId
  ): Promise<PathToCommentsInfoMap | undefined>;
  getDiffComments(
    changeNum: NumericChangeId,
    basePatchNum: PatchSetNum,
    patchNum: PatchSetNum,
    path: string
  ): Promise<GetDiffCommentsOutput>;
  getDiffComments(
    changeNum: NumericChangeId,
    basePatchNum?: BasePatchSetNum,
    patchNum?: PatchSetNum,
    path?: string
  ):
    | Promise<PathToCommentsInfoMap | undefined>
    | Promise<GetDiffCommentsOutput>;

  getDiffRobotComments(
    changeNum: NumericChangeId
  ): Promise<PathToRobotCommentsInfoMap | undefined>;
  getDiffRobotComments(
    changeNum: NumericChangeId,
    basePatchNum: PatchSetNum,
    patchNum: PatchSetNum,
    path: string
  ): Promise<GetDiffRobotCommentsOutput>;
  getDiffRobotComments(
    changeNum: NumericChangeId,
    basePatchNum?: BasePatchSetNum,
    patchNum?: PatchSetNum,
    path?: string
  ):
    | Promise<GetDiffRobotCommentsOutput>
    | Promise<PathToRobotCommentsInfoMap | undefined>;

  getDiffDrafts(
    changeNum: NumericChangeId
  ): Promise<PathToCommentsInfoMap | undefined>;
  getDiffDrafts(
    changeNum: NumericChangeId,
    basePatchNum: PatchSetNum,
    patchNum: PatchSetNum,
    path: string
  ): Promise<GetDiffCommentsOutput>;
  getDiffDrafts(
    changeNum: NumericChangeId,
    basePatchNum?: BasePatchSetNum,
    patchNum?: PatchSetNum,
    path?: string
  ):
    | Promise<GetDiffCommentsOutput>
    | Promise<PathToCommentsInfoMap | undefined>;

  createGroup(config: GroupInput & {name: string}): Promise<Response>;

  getPlugins(
    filter: string,
    pluginsPerPage: number,
    offset?: number,
    errFn?: ErrorCallback
  ): Promise<{[pluginName: string]: PluginInfo} | undefined>;

  getChanges(
    changesPerPage?: number,
    query?: string,
    offset?: 'n,z' | number,
    options?: string
  ): Promise<ChangeInfo[] | undefined>;
  getChanges(
    changesPerPage?: number,
    query?: string[],
    offset?: 'n,z' | number,
    options?: string
  ): Promise<ChangeInfo[][] | undefined>;
  /**
   * @return If opt_query is an
   * array, _fetchJSON will return an array of arrays of changeInfos. If it
   * is unspecified or a string, _fetchJSON will return an array of
   * changeInfos.
   */
  getChanges(
    changesPerPage?: number,
    query?: string | string[],
    offset?: 'n,z' | number,
    options?: string
  ): Promise<ChangeInfo[] | ChangeInfo[][] | undefined>;

  getDocumentationSearches(filter: string): Promise<DocResult[] | undefined>;

  getAccountAgreements(): Promise<ContributorAgreementInfo[] | undefined>;

  getAccountGroups(): Promise<GroupInfo[] | undefined>;

  getAccountDetails(userId: AccountId): Promise<AccountDetailInfo | undefined>;

  getAccountStatus(userId: AccountId): Promise<string | undefined>;

  saveAccountAgreement(name: ContributorAgreementInput): Promise<Response>;

  generateAccountHttpPassword(): Promise<Password>;

  setAccountName(name: string): Promise<void>;

  setAccountUsername(username: string): Promise<void>;

  getWatchedProjects(): Promise<ProjectWatchInfo[] | undefined>;

  saveWatchedProjects(
    projects: ProjectWatchInfo[]
  ): Promise<ProjectWatchInfo[]>;

  deleteWatchedProjects(projects: ProjectWatchInfo[]): Promise<Response>;

  getSuggestedProjects(
    inputVal: string,
    n?: number
  ): Promise<NameToProjectInfoMap | undefined>;

  invalidateGroupsCache(): void;
  invalidateReposCache(): void;
  invalidateAccountsCache(): void;
  removeFromAttentionSet(
    changeNum: NumericChangeId,
    user: AccountId,
    reason: string
  ): Promise<Response>;
  addToAttentionSet(
    changeNum: NumericChangeId,
    user: AccountId | undefined | null,
    reason: string
  ): Promise<Response>;
  setAccountDisplayName(displayName: string): Promise<void>;
  setAccountStatus(status: string): Promise<void>;
  getAvatarChangeUrl(): Promise<string | undefined>;
  setDescription(
    changeNum: NumericChangeId,
    patchNum: PatchSetNum,
    desc: string
  ): Promise<Response>;
  deleteVote(
    changeNum: NumericChangeId,
    account: AccountId,
    label: string
  ): Promise<Response>;

  deleteComment(
    changeNum: NumericChangeId,
    patchNum: PatchSetNum,
    commentID: UrlEncodedCommentId,
    reason: string
  ): Promise<CommentInfo>;
  deleteDiffDraft(
    changeNum: NumericChangeId,
    patchNum: PatchSetNum,
    draft: {id: UrlEncodedCommentId}
  ): Promise<Response>;

  deleteChangeCommitMessage(
    changeNum: NumericChangeId,
    messageId: ChangeMessageId
  ): Promise<Response>;

  removeChangeReviewer(
    changeNum: NumericChangeId,
    reviewerID: AccountId | EmailAddress | GroupId
  ): Promise<Response | undefined>;

  getGroupAuditLog(
    group: EncodedGroupId,
    errFn?: ErrorCallback
  ): Promise<GroupAuditEventInfo[] | undefined>;

  getGroupMembers(groupName: GroupId | GroupName): Promise<AccountInfo[]>;

  getIncludedGroup(
    groupName: GroupId | GroupName
  ): Promise<GroupInfo[] | undefined>;

  saveGroupMember(
    groupName: GroupId | GroupName,
    groupMember: AccountId
  ): Promise<AccountInfo>;

  saveIncludedGroup(
    groupName: GroupId | GroupName,
    includedGroup: GroupId,
    errFn?: ErrorCallback
  ): Promise<GroupInfo | undefined>;

  deleteGroupMember(
    groupName: GroupId | GroupName,
    groupMember: AccountId
  ): Promise<Response>;

  deleteIncludedGroup(
    groupName: GroupId | GroupName,
    includedGroup: GroupId
  ): Promise<Response>;

  runRepoGC(repo: RepoName): Promise<Response>;
  getFileContent(
    changeNum: NumericChangeId,
    path: string,
    patchNum: PatchSetNum
  ): Promise<Response | Base64FileContent | undefined>;

  saveChangeEdit(
    changeNum: NumericChangeId,
    path: string,
    contents: string
  ): Promise<Response>;
  getRepoTags(
    filter: string,
    repo: RepoName,
    reposTagsPerPage: number,
    offset?: number,
    errFn?: ErrorCallback
  ): Promise<TagInfo[]>;

  setRepoHead(repo: RepoName, ref: GitRef): Promise<Response>;
  deleteRepoTags(repo: RepoName, ref: GitRef): Promise<Response>;
  deleteRepoBranches(repo: RepoName, ref: GitRef): Promise<Response>;
  saveRepoConfig(repo: RepoName, config: ConfigInput): Promise<Response>;

  getRelatedChanges(
    changeNum: NumericChangeId,
    patchNum: PatchSetNum
  ): Promise<RelatedChangesInfo | undefined>;

  getChangesSubmittedTogether(
    changeNum: NumericChangeId
  ): Promise<SubmittedTogetherInfo | undefined>;

  getChangeConflicts(
    changeNum: NumericChangeId
  ): Promise<ChangeInfo[] | undefined>;

  getChangeCherryPicks(
    project: RepoName,
    changeID: ChangeId,
    changeNum: NumericChangeId
  ): Promise<ChangeInfo[] | undefined>;

  getChangesWithSameTopic(
    topic: string,
    changeNum: NumericChangeId
  ): Promise<ChangeInfo[] | undefined>;
  getChangesWithSimilarTopic(topic: string): Promise<ChangeInfo[] | undefined>;

  hasPendingDiffDrafts(): number;
  awaitPendingDiffDrafts(): Promise<void>;

  getRobotCommentFixPreview(
    changeNum: NumericChangeId,
    patchNum: PatchSetNum,
    fixId: FixId
  ): Promise<FilePathToDiffInfoMap | undefined>;

  applyFixSuggestion(
    changeNum: NumericChangeId,
    patchNum: PatchSetNum,
    fixId: string
  ): Promise<Response>;

  getDiff(
    changeNum: NumericChangeId,
    basePatchNum: PatchSetNum,
    patchNum: PatchSetNum,
    path: string,
    whitespace?: IgnoreWhitespaceType,
    errFn?: ErrorCallback
  ): Promise<DiffInfo | undefined>;

  getBlame(
    changeNum: NumericChangeId,
    patchNum: PatchSetNum,
    path: string,
    base?: boolean
  ): Promise<BlameInfo[] | undefined>;

  getImagesForDiff(
    changeNum: NumericChangeId,
    diff: DiffInfo,
    patchRange: PatchRange
  ): Promise<ImagesForDiff>;

  getChangeRevisionActions(
    changeNum: NumericChangeId,
    patchNum: PatchSetNum
  ): Promise<ActionNameToActionInfoMap | undefined>;

  confirmEmail(token: string): Promise<string | null>;

  getDefaultPreferences(): Promise<PreferencesInfo | undefined>;

  addAccountEmail(email: string): Promise<Response>;

  saveChangeReviewed(
    changeNum: NumericChangeId,
    reviewed: boolean
  ): Promise<Response | undefined>;

  saveChangeStarred(
    changeNum: NumericChangeId,
    starred: boolean
  ): Promise<Response>;

  getDashboard(
    project: RepoName,
    dashboard: DashboardId,
    errFn?: ErrorCallback
  ): Promise<DashboardInfo | undefined>;

  deleteDraftComments(query: string): Promise<Response>;

  setAssignee(
    changeNum: NumericChangeId,
    assignee: AccountId
  ): Promise<Response>;

  deleteAssignee(changeNum: NumericChangeId): Promise<Response>;

  setChangeHashtag(
    changeNum: NumericChangeId,
    hashtag: HashtagsInput
  ): Promise<Hashtag[]>;

  setChangeTopic(changeNum: NumericChangeId, topic?: string): Promise<string>;

  getChangeFiles(
    changeNum: NumericChangeId,
    patchRange: PatchRange
  ): Promise<FileNameToFileInfoMap | undefined>;

  getChangeOrEditFiles(
    changeNum: NumericChangeId,
    patchRange: PatchRange
  ): Promise<FileNameToFileInfoMap | undefined>;

  getReviewedFiles(
    changeNum: NumericChangeId,
    patchNum: PatchSetNum
  ): Promise<string[] | undefined>;

  saveFileReviewed(
    changeNum: NumericChangeId,
    patchNum: PatchSetNum,
    path: string,
    reviewed: boolean
  ): Promise<Response>;

  getTopMenus(): Promise<TopMenuEntryInfo[] | undefined>;

  setInProjectLookup(changeNum: NumericChangeId, project: RepoName): void;
  getMergeable(changeNum: NumericChangeId): Promise<MergeableInfo | undefined>;

  putChangeCommitMessage(
    changeNum: NumericChangeId,
    message: string
  ): Promise<Response>;

  getChangeCommitInfo(
    changeNum: NumericChangeId,
    patchNum: PatchSetNum
  ): Promise<CommitInfo | undefined>;
}
