import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
const defaultOptions = {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /**
   * The `Date` scalar type represents a Date
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  Date: any
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: any
  /**
   * The `Time` scalar type represents a Time value as
   * specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  Time: any
  /**
   * Create scalar that ignores normal serialization/deserialization, since
   * that will be handled by the multipart request spec
   */
  Upload: any
}

export type AdmissionNode = Node & {
  __typename?: 'AdmissionNode'
  applicants: ApplicantNodeConnection
  date?: Maybe<Scalars['Date']>
  /** The ID of the object. */
  id: Scalars['ID']
  semester?: Maybe<Scalars['String']>
  status: AdmissionStatus
}

export type AdmissionNodeApplicantsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type AdmissionNodeConnection = {
  __typename?: 'AdmissionNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AdmissionNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `AdmissionNode` and its cursor. */
export type AdmissionNodeEdge = {
  __typename?: 'AdmissionNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<AdmissionNode>
}

/** An enumeration. */
export enum AdmissionStatus {
  /** Closed */
  Closed = 'CLOSED',
  /** In session */
  InSession = 'IN_SESSION',
  /** Open */
  Open = 'OPEN',
}

export type ApplicantNode = Node & {
  __typename?: 'ApplicantNode'
  admission: AdmissionNode
  dateOfBirth: Scalars['Date']
  email: Scalars['String']
  firstName: Scalars['String']
  homeAddress: Scalars['String']
  /** The ID of the object. */
  id: Scalars['ID']
  image?: Maybe<Scalars['String']>
  lastName: Scalars['String']
  phone?: Maybe<Scalars['String']>
  status: ApplicantStatus
  study: Scalars['String']
  townAddress: Scalars['String']
}

export type ApplicantNodeConnection = {
  __typename?: 'ApplicantNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ApplicantNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `ApplicantNode` and its cursor. */
export type ApplicantNodeEdge = {
  __typename?: 'ApplicantNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<ApplicantNode>
}

/** An enumeration. */
export enum ApplicantStatus {
  /** Active */
  Active = 'ACTIVE',
  /** Retracted */
  Retracted = 'RETRACTED',
}

export type BankAccountActivity = {
  __typename?: 'BankAccountActivity'
  amount?: Maybe<Scalars['Int']>
  name?: Maybe<Scalars['String']>
  quantity?: Maybe<Scalars['Int']>
  timestamp?: Maybe<Scalars['DateTime']>
}

export type CommissionMembershipNode = Node & {
  __typename?: 'CommissionMembershipNode'
  commission: CommissionNode
  dateEnded?: Maybe<Scalars['Date']>
  dateStarted: Scalars['Date']
  /** The ID of the object. */
  id: Scalars['ID']
  user: UserNode
}

export type CommissionMembershipNodeConnection = {
  __typename?: 'CommissionMembershipNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<CommissionMembershipNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `CommissionMembershipNode` and its cursor. */
export type CommissionMembershipNodeEdge = {
  __typename?: 'CommissionMembershipNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<CommissionMembershipNode>
}

export type CommissionNode = Node & {
  __typename?: 'CommissionNode'
  committees: CommitteeNodeConnection
  holders: UserNodeConnection
  /** The ID of the object. */
  id: Scalars['ID']
  memberships: CommissionMembershipNodeConnection
  name: Scalars['String']
}

export type CommissionNodeCommitteesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type CommissionNodeHoldersArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type CommissionNodeMembershipsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type CommissionNodeConnection = {
  __typename?: 'CommissionNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<CommissionNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `CommissionNode` and its cursor. */
export type CommissionNodeEdge = {
  __typename?: 'CommissionNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<CommissionNode>
}

export type CommitteeNode = Node & {
  __typename?: 'CommitteeNode'
  /** The ID of the object. */
  id: Scalars['ID']
  members: CommissionNodeConnection
}

export type CommitteeNodeMembersArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type CommitteeNodeConnection = {
  __typename?: 'CommitteeNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<CommitteeNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `CommitteeNode` and its cursor. */
export type CommitteeNodeEdge = {
  __typename?: 'CommitteeNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<CommitteeNode>
}

export type CreateAdmissionInput = {
  applicants?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  date?: InputMaybe<Scalars['Date']>
  status?: InputMaybe<AdmissionStatus>
}

export type CreateAdmissionMutation = {
  __typename?: 'CreateAdmissionMutation'
  admission?: Maybe<AdmissionNode>
}

export type CreateApplicantInput = {
  admission: Scalars['ID']
  dateOfBirth: Scalars['Date']
  email: Scalars['String']
  firstName: Scalars['String']
  homeAddress?: InputMaybe<Scalars['String']>
  image?: InputMaybe<Scalars['Upload']>
  lastName: Scalars['String']
  phone?: InputMaybe<Scalars['String']>
  priorities?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  status?: InputMaybe<ApplicantStatus>
  study?: InputMaybe<Scalars['String']>
  townAddress?: InputMaybe<Scalars['String']>
}

export type CreateApplicantMutation = {
  __typename?: 'CreateApplicantMutation'
  applicant?: Maybe<ApplicantNode>
}

export type CreateCommissionInput = {
  committees?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  holders: Array<InputMaybe<Scalars['ID']>>
  memberships?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  name: Scalars['String']
}

export type CreateCommissionMembershipInput = {
  commission: Scalars['ID']
  dateEnded?: InputMaybe<Scalars['Date']>
  user: Scalars['ID']
}

export type CreateCommissionMembershipMutation = {
  __typename?: 'CreateCommissionMembershipMutation'
  commissionMembership?: Maybe<CommissionMembershipNode>
}

export type CreateCommissionMutation = {
  __typename?: 'CreateCommissionMutation'
  commission?: Maybe<CommissionNode>
}

export type CreateCommitteeInput = {
  members: Array<InputMaybe<Scalars['ID']>>
}

export type CreateCommitteeMutation = {
  __typename?: 'CreateCommitteeMutation'
  committee?: Maybe<CommitteeNode>
}

export type CreateInternalGroupInput = {
  applicationPriorities?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  description?: InputMaybe<Scalars['String']>
  groupImage?: InputMaybe<Scalars['Upload']>
  name: Scalars['String']
  positions?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  scheduleslottypeSet?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  type: InternalGroupType
}

export type CreateInternalGroupMutation = {
  __typename?: 'CreateInternalGroupMutation'
  internalGroup?: Maybe<InternalGroupNode>
}

export type CreateInternalGroupPositionInput = {
  description?: InputMaybe<Scalars['String']>
  holders: Array<InputMaybe<Scalars['ID']>>
  internalGroup: Scalars['ID']
  memberships?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  name: Scalars['String']
  type: InternalGroupPositionType
}

export type CreateInternalGroupPositionMembershipInput = {
  dateEnded?: InputMaybe<Scalars['Date']>
  dateJoined?: InputMaybe<Scalars['Date']>
  position: Scalars['ID']
  user: Scalars['ID']
}

export type CreateInternalGroupPositionMembershipMutation = {
  __typename?: 'CreateInternalGroupPositionMembershipMutation'
  internalGroupPositionMembership?: Maybe<InternalGroupPositionMembershipNode>
}

export type CreateInternalGroupPositionMutation = {
  __typename?: 'CreateInternalGroupPositionMutation'
  internalGroupPosition?: Maybe<InternalGroupPositionNode>
}

export type CreateProductOrderInput = {
  orderSize?: InputMaybe<Scalars['Int']>
  product: Scalars['ID']
  session?: InputMaybe<Scalars['ID']>
  source: Scalars['ID']
}

export type CreateProductOrderMutation = {
  __typename?: 'CreateProductOrderMutation'
  productOrder?: Maybe<ProductOrderNode>
}

export type CreateQuoteInput = {
  context?: InputMaybe<Scalars['String']>
  reportedBy: Scalars['ID']
  tagged?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  text: Scalars['String']
  verifiedBy?: InputMaybe<Scalars['ID']>
  votes?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
}

export type CreateQuoteMutation = {
  __typename?: 'CreateQuoteMutation'
  quote?: Maybe<QuoteNode>
}

export type CreateQuoteVoteInput = {
  caster: Scalars['ID']
  quote: Scalars['ID']
  value: Scalars['Int']
}

export type CreateQuoteVoteMutation = {
  __typename?: 'CreateQuoteVoteMutation'
  quoteVote?: Maybe<QuoteVoteNode>
}

export type CreateScheduleInput = {
  name: Scalars['String']
  scheduleslottypeSet?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  scheduletemplateSet?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  shiftslotgroupSet?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
}

export type CreateScheduleMutation = {
  __typename?: 'CreateScheduleMutation'
  schedule?: Maybe<ScheduleNode>
}

export type CreateScheduleSlotTypeInput = {
  name: Scalars['String']
  role: ScheduleSlotTypeRole
  schedule: Scalars['ID']
  shiftslotSet?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  shiftslottemplateSet?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  standardGroups?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
}

export type CreateScheduleSlotTypeMutation = {
  __typename?: 'CreateScheduleSlotTypeMutation'
  scheduleSlotType?: Maybe<ScheduleSlotTypeNode>
}

export type CreateScheduleTemplateInput = {
  name: Scalars['String']
  schedule: Scalars['ID']
  shiftslotgrouptemplateSet?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
}

export type CreateScheduleTemplateMutation = {
  __typename?: 'CreateScheduleTemplateMutation'
  scheduleTemplate?: Maybe<ScheduleTemplateNode>
}

export type CreateSensorMeasurementInput = {
  createdAt?: InputMaybe<Scalars['DateTime']>
  type: SensorMeasurementType
  value: Scalars['Float']
}

export type CreateSensorMeasurementMutation = {
  __typename?: 'CreateSensorMeasurementMutation'
  sensorMeasurement?: Maybe<SensorMeasurementNode>
}

export type CreateShiftInput = {
  offeredInTrades?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  offeredToShifts?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  slot: Scalars['ID']
  takenInTrades?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  user: Scalars['ID']
}

export type CreateShiftMutation = {
  __typename?: 'CreateShiftMutation'
  shift?: Maybe<ShiftNode>
}

export type CreateShiftSlotGroupDayRuleInput = {
  rule?: InputMaybe<ShiftSlotGroupDayRuleRule>
  shiftSlotGroupTemplate: Scalars['ID']
}

export type CreateShiftSlotGroupDayRuleMutation = {
  __typename?: 'CreateShiftSlotGroupDayRuleMutation'
  shiftSlotGroupDayRule?: Maybe<ShiftSlotGroupDayRuleNode>
}

export type CreateShiftSlotGroupInput = {
  interests?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  meetTime: Scalars['DateTime']
  name: Scalars['String']
  schedule: Scalars['ID']
  shiftSlots?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  startTime: Scalars['DateTime']
}

export type CreateShiftSlotGroupInterestInput = {
  shiftGroup: Scalars['ID']
  user: Scalars['ID']
}

export type CreateShiftSlotGroupInterestMutation = {
  __typename?: 'CreateShiftSlotGroupInterestMutation'
  shiftSlotGroupInterest?: Maybe<ShiftSlotGroupInterestNode>
}

export type CreateShiftSlotGroupMutation = {
  __typename?: 'CreateShiftSlotGroupMutation'
  shiftSlotGroup?: Maybe<ShiftSlotGroupNode>
}

export type CreateShiftSlotGroupTemplateInput = {
  dayRules?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  meetTime: Scalars['Time']
  name: Scalars['String']
  scheduleTemplate: Scalars['ID']
  shiftslottemplateSet?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  startTime: Scalars['Time']
}

export type CreateShiftSlotGroupTemplateMutation = {
  __typename?: 'CreateShiftSlotGroupTemplateMutation'
  shiftSlotGroupTemplate?: Maybe<ShiftSlotGroupTemplateNode>
}

export type CreateShiftSlotInput = {
  end: Scalars['Time']
  filledShift?: InputMaybe<Scalars['ID']>
  group: Scalars['ID']
  start: Scalars['Time']
  type: Scalars['ID']
}

export type CreateShiftSlotMutation = {
  __typename?: 'CreateShiftSlotMutation'
  shiftSlot?: Maybe<ShiftSlotNode>
}

export type CreateShiftSlotTemplateInput = {
  end: Scalars['Time']
  group: Scalars['ID']
  start: Scalars['Time']
  type: Scalars['ID']
}

export type CreateShiftSlotTemplateMutation = {
  __typename?: 'CreateShiftSlotTemplateMutation'
  shiftSlotTemplate?: Maybe<ShiftSlotTemplateNode>
}

export type CreateShiftTradeInput = {
  counterOffers?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  offeror: Scalars['ID']
  shiftOffer: Scalars['ID']
  shiftTaker?: InputMaybe<Scalars['ID']>
  signedOffBy?: InputMaybe<Scalars['ID']>
  taker?: InputMaybe<Scalars['ID']>
}

export type CreateShiftTradeMutation = {
  __typename?: 'CreateShiftTradeMutation'
  shiftTrade?: Maybe<ShiftTradeNode>
}

export type CreateShiftTradeOfferInput = {
  accepted?: InputMaybe<Scalars['Boolean']>
  offeror: Scalars['ID']
  shiftOffer: Scalars['ID']
  shiftTrade: Scalars['ID']
}

export type CreateShiftTradeOfferMutation = {
  __typename?: 'CreateShiftTradeOfferMutation'
  shiftTradeOffer?: Maybe<ShiftTradeOfferNode>
}

export type CreateSociBankAccountInput = {
  balance?: InputMaybe<Scalars['Int']>
  cardUuid?: InputMaybe<Scalars['String']>
  deposits?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  destinationTransfers?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  productOrders?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  sourceTransfers?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  user: Scalars['ID']
}

export type CreateSociBankAccountMutation = {
  __typename?: 'CreateSociBankAccountMutation'
  sociBankAccount?: Maybe<SociBankAccountNode>
}

export type CreateSociProductInput = {
  description?: InputMaybe<Scalars['String']>
  end?: InputMaybe<Scalars['DateTime']>
  icon?: InputMaybe<Scalars['String']>
  name: Scalars['String']
  price: Scalars['Int']
  productorderSet?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  skuNumber: Scalars['String']
  start?: InputMaybe<Scalars['DateTime']>
}

export type CreateSociProductMutation = {
  __typename?: 'CreateSociProductMutation'
  sociProduct?: Maybe<SociProductNode>
}

export type CreateSociSessionMutation = {
  __typename?: 'CreateSociSessionMutation'
  deletedId?: Maybe<Scalars['ID']>
  deletedInputId?: Maybe<Scalars['ID']>
  deletedRawId?: Maybe<Scalars['ID']>
  found?: Maybe<Scalars['Boolean']>
}

export type CreateSummaryInput = {
  contents: Scalars['String']
  date: Scalars['DateTime']
  participants?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  reporter: Scalars['ID']
  summaryType?: InputMaybe<SummarySummaryType>
}

export type CreateSummaryMutation = {
  __typename?: 'CreateSummaryMutation'
  summary?: Maybe<SummaryNode>
}

export type CreateUserInput = {
  allDepositComments?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  allergies?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  anonymizeInMadeOutMap?: InputMaybe<Scalars['Boolean']>
  authToken?: InputMaybe<Scalars['ID']>
  bankAccount?: InputMaybe<Scalars['ID']>
  biography?: InputMaybe<Scalars['String']>
  comissions?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  commissionHistory?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  dateJoined?: InputMaybe<Scalars['DateTime']>
  dateOfBirth?: InputMaybe<Scalars['Date']>
  email: Scalars['String']
  firstName: Scalars['String']
  /** The groups this user belongs to. A user will get all permissions granted to each of their groups. */
  groups?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  haveMadeOutWith: Array<InputMaybe<Scalars['ID']>>
  homeAddress?: InputMaybe<Scalars['String']>
  inRelationship?: InputMaybe<Scalars['Boolean']>
  internalGroupPositionHistory?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  /** Designates whether this user should be treated as active. Unselect this instead of deleting accounts. */
  isActive?: InputMaybe<Scalars['Boolean']>
  /** Designates whether the user can log into this admin site. */
  isStaff?: InputMaybe<Scalars['Boolean']>
  /** Designates that this user has all permissions without explicitly assigning them. */
  isSuperuser?: InputMaybe<Scalars['Boolean']>
  lastLogin?: InputMaybe<Scalars['DateTime']>
  lastName: Scalars['String']
  logentrySet?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  madeOutWithLeftSide?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  madeOutWithRightSide?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  password: Scalars['String']
  phone?: InputMaybe<Scalars['String']>
  positions?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  profileImage?: InputMaybe<Scalars['Upload']>
  quotes?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  quotevoteSet?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  reportedQuotes?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  reportedSummaries?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  shiftOffers?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  shiftSet?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  shiftTradesSignedOff?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  shiftsInterests?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  shiftsOffered?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  shiftsTaken?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  socisessionSet?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  study?: InputMaybe<Scalars['String']>
  studyAddress?: InputMaybe<Scalars['String']>
  summaries?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  /** Specific permissions for this user. */
  userPermissions?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars['String']
  users?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  verifiedDeposits?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  verifiedQuotes?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
}

export type CreateUserMutation = {
  __typename?: 'CreateUserMutation'
  user?: Maybe<UserNode>
}

export type DashboardData = {
  __typename?: 'DashboardData'
  lastQuotes?: Maybe<Array<Maybe<QuoteNode>>>
  lastSummaries?: Maybe<Array<Maybe<SummaryNode>>>
  wantedList?: Maybe<Array<Maybe<UserNode>>>
}

export type DeleteAdmissionMutation = {
  __typename?: 'DeleteAdmissionMutation'
  deletedId?: Maybe<Scalars['ID']>
  deletedInputId?: Maybe<Scalars['ID']>
  deletedRawId?: Maybe<Scalars['ID']>
  found?: Maybe<Scalars['Boolean']>
}

export type DeleteApplicantMutation = {
  __typename?: 'DeleteApplicantMutation'
  deletedId?: Maybe<Scalars['ID']>
  deletedInputId?: Maybe<Scalars['ID']>
  deletedRawId?: Maybe<Scalars['ID']>
  found?: Maybe<Scalars['Boolean']>
}

export type DeleteCommissionMembership = {
  __typename?: 'DeleteCommissionMembership'
  deletedId?: Maybe<Scalars['ID']>
  deletedInputId?: Maybe<Scalars['ID']>
  deletedRawId?: Maybe<Scalars['ID']>
  found?: Maybe<Scalars['Boolean']>
}

export type DeleteCommissionMutation = {
  __typename?: 'DeleteCommissionMutation'
  deletedId?: Maybe<Scalars['ID']>
  deletedInputId?: Maybe<Scalars['ID']>
  deletedRawId?: Maybe<Scalars['ID']>
  found?: Maybe<Scalars['Boolean']>
}

export type DeleteCommitteeMutation = {
  __typename?: 'DeleteCommitteeMutation'
  deletedId?: Maybe<Scalars['ID']>
  deletedInputId?: Maybe<Scalars['ID']>
  deletedRawId?: Maybe<Scalars['ID']>
  found?: Maybe<Scalars['Boolean']>
}

export type DeleteInternalGroupMutation = {
  __typename?: 'DeleteInternalGroupMutation'
  deletedId?: Maybe<Scalars['ID']>
  deletedInputId?: Maybe<Scalars['ID']>
  deletedRawId?: Maybe<Scalars['ID']>
  found?: Maybe<Scalars['Boolean']>
}

export type DeleteInternalGroupPosition = {
  __typename?: 'DeleteInternalGroupPosition'
  deletedId?: Maybe<Scalars['ID']>
  deletedInputId?: Maybe<Scalars['ID']>
  deletedRawId?: Maybe<Scalars['ID']>
  found?: Maybe<Scalars['Boolean']>
}

export type DeleteInternalGroupPositionMembership = {
  __typename?: 'DeleteInternalGroupPositionMembership'
  deletedId?: Maybe<Scalars['ID']>
  deletedInputId?: Maybe<Scalars['ID']>
  deletedRawId?: Maybe<Scalars['ID']>
  found?: Maybe<Scalars['Boolean']>
}

export type DeleteProductOrderMutation = {
  __typename?: 'DeleteProductOrderMutation'
  deletedId?: Maybe<Scalars['ID']>
  deletedInputId?: Maybe<Scalars['ID']>
  deletedRawId?: Maybe<Scalars['ID']>
  found?: Maybe<Scalars['Boolean']>
}

export type DeleteQuoteMutation = {
  __typename?: 'DeleteQuoteMutation'
  deletedId?: Maybe<Scalars['ID']>
  deletedInputId?: Maybe<Scalars['ID']>
  deletedRawId?: Maybe<Scalars['ID']>
  found?: Maybe<Scalars['Boolean']>
}

export type DeleteScheduleMutation = {
  __typename?: 'DeleteScheduleMutation'
  deletedId?: Maybe<Scalars['ID']>
  deletedInputId?: Maybe<Scalars['ID']>
  deletedRawId?: Maybe<Scalars['ID']>
  found?: Maybe<Scalars['Boolean']>
}

export type DeleteScheduleSlotTypeMutation = {
  __typename?: 'DeleteScheduleSlotTypeMutation'
  deletedId?: Maybe<Scalars['ID']>
  deletedInputId?: Maybe<Scalars['ID']>
  deletedRawId?: Maybe<Scalars['ID']>
  found?: Maybe<Scalars['Boolean']>
}

export type DeleteScheduleTemplateMutation = {
  __typename?: 'DeleteScheduleTemplateMutation'
  deletedId?: Maybe<Scalars['ID']>
  deletedInputId?: Maybe<Scalars['ID']>
  deletedRawId?: Maybe<Scalars['ID']>
  found?: Maybe<Scalars['Boolean']>
}

export type DeleteSensorMeasurementMutation = {
  __typename?: 'DeleteSensorMeasurementMutation'
  deletedId?: Maybe<Scalars['ID']>
  deletedInputId?: Maybe<Scalars['ID']>
  deletedRawId?: Maybe<Scalars['ID']>
  found?: Maybe<Scalars['Boolean']>
}

export type DeleteShiftMutation = {
  __typename?: 'DeleteShiftMutation'
  deletedId?: Maybe<Scalars['ID']>
  deletedInputId?: Maybe<Scalars['ID']>
  deletedRawId?: Maybe<Scalars['ID']>
  found?: Maybe<Scalars['Boolean']>
}

export type DeleteShiftSlotGroupDayRuleMutation = {
  __typename?: 'DeleteShiftSlotGroupDayRuleMutation'
  deletedId?: Maybe<Scalars['ID']>
  deletedInputId?: Maybe<Scalars['ID']>
  deletedRawId?: Maybe<Scalars['ID']>
  found?: Maybe<Scalars['Boolean']>
}

export type DeleteShiftSlotGroupInterestMutation = {
  __typename?: 'DeleteShiftSlotGroupInterestMutation'
  deletedId?: Maybe<Scalars['ID']>
  deletedInputId?: Maybe<Scalars['ID']>
  deletedRawId?: Maybe<Scalars['ID']>
  found?: Maybe<Scalars['Boolean']>
}

export type DeleteShiftSlotGroupMutation = {
  __typename?: 'DeleteShiftSlotGroupMutation'
  deletedId?: Maybe<Scalars['ID']>
  deletedInputId?: Maybe<Scalars['ID']>
  deletedRawId?: Maybe<Scalars['ID']>
  found?: Maybe<Scalars['Boolean']>
}

export type DeleteShiftSlotGroupTemplateMutation = {
  __typename?: 'DeleteShiftSlotGroupTemplateMutation'
  deletedId?: Maybe<Scalars['ID']>
  deletedInputId?: Maybe<Scalars['ID']>
  deletedRawId?: Maybe<Scalars['ID']>
  found?: Maybe<Scalars['Boolean']>
}

export type DeleteShiftSlotMutation = {
  __typename?: 'DeleteShiftSlotMutation'
  deletedId?: Maybe<Scalars['ID']>
  deletedInputId?: Maybe<Scalars['ID']>
  deletedRawId?: Maybe<Scalars['ID']>
  found?: Maybe<Scalars['Boolean']>
}

export type DeleteShiftSlotTemplateMutation = {
  __typename?: 'DeleteShiftSlotTemplateMutation'
  deletedId?: Maybe<Scalars['ID']>
  deletedInputId?: Maybe<Scalars['ID']>
  deletedRawId?: Maybe<Scalars['ID']>
  found?: Maybe<Scalars['Boolean']>
}

export type DeleteShiftTradeMutation = {
  __typename?: 'DeleteShiftTradeMutation'
  deletedId?: Maybe<Scalars['ID']>
  deletedInputId?: Maybe<Scalars['ID']>
  deletedRawId?: Maybe<Scalars['ID']>
  found?: Maybe<Scalars['Boolean']>
}

export type DeleteShiftTradeOfferMutation = {
  __typename?: 'DeleteShiftTradeOfferMutation'
  deletedId?: Maybe<Scalars['ID']>
  deletedInputId?: Maybe<Scalars['ID']>
  deletedRawId?: Maybe<Scalars['ID']>
  found?: Maybe<Scalars['Boolean']>
}

export type DeleteSociProductMutation = {
  __typename?: 'DeleteSociProductMutation'
  deletedId?: Maybe<Scalars['ID']>
  deletedInputId?: Maybe<Scalars['ID']>
  deletedRawId?: Maybe<Scalars['ID']>
  found?: Maybe<Scalars['Boolean']>
}

export type DeleteSociSessionMutation = {
  __typename?: 'DeleteSociSessionMutation'
  deletedId?: Maybe<Scalars['ID']>
  deletedInputId?: Maybe<Scalars['ID']>
  deletedRawId?: Maybe<Scalars['ID']>
  found?: Maybe<Scalars['Boolean']>
}

export type DeleteSummaryMutation = {
  __typename?: 'DeleteSummaryMutation'
  deletedId?: Maybe<Scalars['ID']>
  deletedInputId?: Maybe<Scalars['ID']>
  deletedRawId?: Maybe<Scalars['ID']>
  found?: Maybe<Scalars['Boolean']>
}

export type DeleteUserMutation = {
  __typename?: 'DeleteUserMutation'
  deletedId?: Maybe<Scalars['ID']>
  deletedInputId?: Maybe<Scalars['ID']>
  deletedRawId?: Maybe<Scalars['ID']>
  found?: Maybe<Scalars['Boolean']>
}

export type DepositNode = Node & {
  __typename?: 'DepositNode'
  account?: Maybe<SociBankAccountNode>
  amount: Scalars['Int']
  created: Scalars['DateTime']
  description: Scalars['String']
  /** The ID of the object. */
  id: Scalars['ID']
  modified: Scalars['DateTime']
  receipt?: Maybe<Scalars['String']>
  signedOffBy?: Maybe<UserNode>
  signedOffTime?: Maybe<Scalars['DateTime']>
}

export type DepositNodeConnection = {
  __typename?: 'DepositNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<DepositNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `DepositNode` and its cursor. */
export type DepositNodeEdge = {
  __typename?: 'DepositNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<DepositNode>
}

export type InternalGroupNode = Node & {
  __typename?: 'InternalGroupNode'
  description?: Maybe<Scalars['String']>
  groupImage?: Maybe<Scalars['String']>
  /** The ID of the object. */
  id: Scalars['ID']
  name: Scalars['String']
  positions: InternalGroupPositionNodeConnection
  scheduleslottypeSet: ScheduleSlotTypeNodeConnection
  type: InternalGroupType
}

export type InternalGroupNodePositionsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type InternalGroupNodeScheduleslottypeSetArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type InternalGroupNodeConnection = {
  __typename?: 'InternalGroupNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<InternalGroupNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `InternalGroupNode` and its cursor. */
export type InternalGroupNodeEdge = {
  __typename?: 'InternalGroupNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<InternalGroupNode>
}

export type InternalGroupPositionMembershipNode = Node & {
  __typename?: 'InternalGroupPositionMembershipNode'
  dateEnded?: Maybe<Scalars['Date']>
  dateJoined: Scalars['Date']
  /** The ID of the object. */
  id: Scalars['ID']
  position: InternalGroupPositionNode
  user: UserNode
}

export type InternalGroupPositionMembershipNodeConnection = {
  __typename?: 'InternalGroupPositionMembershipNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<InternalGroupPositionMembershipNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `InternalGroupPositionMembershipNode` and its cursor. */
export type InternalGroupPositionMembershipNodeEdge = {
  __typename?: 'InternalGroupPositionMembershipNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<InternalGroupPositionMembershipNode>
}

export type InternalGroupPositionNode = Node & {
  __typename?: 'InternalGroupPositionNode'
  description?: Maybe<Scalars['String']>
  holders: UserNodeConnection
  /** The ID of the object. */
  id: Scalars['ID']
  internalGroup: InternalGroupNode
  memberships: InternalGroupPositionMembershipNodeConnection
  name: Scalars['String']
  type: InternalGroupPositionType
}

export type InternalGroupPositionNodeHoldersArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type InternalGroupPositionNodeMembershipsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type InternalGroupPositionNodeConnection = {
  __typename?: 'InternalGroupPositionNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<InternalGroupPositionNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `InternalGroupPositionNode` and its cursor. */
export type InternalGroupPositionNodeEdge = {
  __typename?: 'InternalGroupPositionNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<InternalGroupPositionNode>
}

/** An enumeration. */
export enum InternalGroupPositionType {
  /** Active functionary pang */
  ActiveFunctionaryPang = 'ACTIVE_FUNCTIONARY_PANG',
  /** Active gang member pang */
  ActiveGangMemberPang = 'ACTIVE_GANG_MEMBER_PANG',
  /** Functionary */
  Functionary = 'FUNCTIONARY',
  /** Gang member */
  GangMember = 'GANG_MEMBER',
  /** Hangaround */
  Hangaround = 'HANGAROUND',
  /** Interest group member */
  InterestGroupMember = 'INTEREST_GROUP_MEMBER',
  /** Old functionary pang */
  OldFunctionaryPang = 'OLD_FUNCTIONARY_PANG',
  /** Old gang member pang */
  OldGangMemberPang = 'OLD_GANG_MEMBER_PANG',
  /** Temporary leave */
  TemporaryLeave = 'TEMPORARY_LEAVE',
}

/** An enumeration. */
export enum InternalGroupType {
  /** Interest group */
  InterestGroup = 'INTEREST_GROUP',
  /** Internal group */
  InternalGroup = 'INTERNAL_GROUP',
}

export type LoginMutation = {
  __typename?: 'LoginMutation'
  ok: Scalars['Boolean']
  token?: Maybe<Scalars['String']>
  user?: Maybe<UserNode>
}

export type Mutation = {
  __typename?: 'Mutation'
  createAdmission?: Maybe<CreateAdmissionMutation>
  createApplicant?: Maybe<CreateApplicantMutation>
  createCommission?: Maybe<CreateCommissionMutation>
  createCommissionMembership?: Maybe<CreateCommissionMembershipMutation>
  createCommittee?: Maybe<CreateCommitteeMutation>
  createInternalGroup?: Maybe<CreateInternalGroupMutation>
  createInternalGroupPosition?: Maybe<CreateInternalGroupPositionMutation>
  createInternalGroupPositionMembership?: Maybe<CreateInternalGroupPositionMembershipMutation>
  createProductOrder?: Maybe<CreateProductOrderMutation>
  createQuote?: Maybe<CreateQuoteMutation>
  createQuoteVote?: Maybe<CreateQuoteVoteMutation>
  createSchedule?: Maybe<CreateScheduleMutation>
  createScheduleSlotType?: Maybe<CreateScheduleSlotTypeMutation>
  createScheduleTemplate?: Maybe<CreateScheduleTemplateMutation>
  createSensorMeasurement?: Maybe<CreateSensorMeasurementMutation>
  createShift?: Maybe<CreateShiftMutation>
  createShiftSlot?: Maybe<CreateShiftSlotMutation>
  createShiftSlotGroup?: Maybe<CreateShiftSlotGroupMutation>
  createShiftSlotGroupDayRule?: Maybe<CreateShiftSlotGroupDayRuleMutation>
  createShiftSlotGroupInterest?: Maybe<CreateShiftSlotGroupInterestMutation>
  createShiftSlotGroupTemplate?: Maybe<CreateShiftSlotGroupTemplateMutation>
  createShiftSlotTemplate?: Maybe<CreateShiftSlotTemplateMutation>
  createShiftTrade?: Maybe<CreateShiftTradeMutation>
  createShiftTradeOffer?: Maybe<CreateShiftTradeOfferMutation>
  createSociBankAccount?: Maybe<CreateSociBankAccountMutation>
  createSociProduct?: Maybe<CreateSociProductMutation>
  createSociSession?: Maybe<CreateSociSessionMutation>
  createSummary?: Maybe<CreateSummaryMutation>
  createUser?: Maybe<CreateUserMutation>
  deleteAdmission?: Maybe<DeleteAdmissionMutation>
  deleteApplicant?: Maybe<DeleteApplicantMutation>
  deleteCommission?: Maybe<DeleteCommissionMutation>
  deleteCommissionMembership?: Maybe<DeleteCommissionMembership>
  deleteCommittee?: Maybe<DeleteCommitteeMutation>
  deleteInternalGroup?: Maybe<DeleteInternalGroupMutation>
  deleteInternalGroupPosition?: Maybe<DeleteInternalGroupPosition>
  deleteInternalGroupPositionMembership?: Maybe<DeleteInternalGroupPositionMembership>
  deleteProductOrder?: Maybe<DeleteProductOrderMutation>
  deleteQuote?: Maybe<DeleteQuoteMutation>
  deleteQuoteVote?: Maybe<DeleteQuoteMutation>
  deleteSchedule?: Maybe<DeleteScheduleMutation>
  deleteScheduleSlotType?: Maybe<DeleteScheduleSlotTypeMutation>
  deleteScheduleTemplate?: Maybe<DeleteScheduleTemplateMutation>
  deleteSensorMeasurement?: Maybe<DeleteSensorMeasurementMutation>
  deleteShift?: Maybe<DeleteShiftMutation>
  deleteShiftSlot?: Maybe<DeleteShiftSlotMutation>
  deleteShiftSlotGroup?: Maybe<DeleteShiftSlotGroupMutation>
  deleteShiftSlotGroupDayRule?: Maybe<DeleteShiftSlotGroupDayRuleMutation>
  deleteShiftSlotGroupInterest?: Maybe<DeleteShiftSlotGroupInterestMutation>
  deleteShiftSlotGroupTemplate?: Maybe<DeleteShiftSlotGroupTemplateMutation>
  deleteShiftSlotTemplate?: Maybe<DeleteShiftSlotTemplateMutation>
  deleteShiftTrade?: Maybe<DeleteShiftTradeMutation>
  deleteShiftTradeOffer?: Maybe<DeleteShiftTradeOfferMutation>
  deleteSociProduct?: Maybe<DeleteSociProductMutation>
  deleteSociSession?: Maybe<DeleteSociSessionMutation>
  deleteSummary?: Maybe<DeleteSummaryMutation>
  deleteUser?: Maybe<DeleteUserMutation>
  login?: Maybe<LoginMutation>
  patchAdmission?: Maybe<PatchAdmissionMutation>
  patchApplicant?: Maybe<PatchApplicantMutation>
  patchCommission?: Maybe<PatchCommissionMutation>
  patchCommissionMembership?: Maybe<PatchCommissionMembershipMutation>
  patchCommittee?: Maybe<PatchCommitteeMutation>
  patchInternalGroup?: Maybe<PatchInternalGroupMutation>
  patchInternalGroupPosition?: Maybe<PatchInternalGroupPositionMutation>
  patchInternalGroupPositionMembership?: Maybe<PatchInternalGroupPositionMembershipMutation>
  patchProductOrder?: Maybe<PatchProductOrderMutation>
  patchQuote?: Maybe<PatchQuoteMutation>
  patchQuoteVote?: Maybe<PatchQuoteMutation>
  patchSchedule?: Maybe<PatchScheduleMutation>
  patchScheduleSlotType?: Maybe<PatchScheduleSlotTypeMutation>
  patchScheduleTemplate?: Maybe<PatchScheduleTemplateMutation>
  patchSensorMeasurement?: Maybe<PatchSensorMeasurementMutation>
  patchShift?: Maybe<PatchShiftMutation>
  patchShiftSlot?: Maybe<PatchShiftSlotMutation>
  patchShiftSlotGroup?: Maybe<PatchShiftSlotGroupMutation>
  patchShiftSlotGroupDayRule?: Maybe<PatchShiftSlotGroupDayRuleMutation>
  patchShiftSlotGroupInterest?: Maybe<PatchShiftSlotGroupInterestMutation>
  patchShiftSlotGroupTemplate?: Maybe<PatchShiftSlotGroupTemplateMutation>
  patchShiftSlotTemplate?: Maybe<PatchShiftSlotTemplateMutation>
  patchShiftTrade?: Maybe<PatchShiftTradeMutation>
  patchShiftTradeOffer?: Maybe<PatchShiftTradeOfferMutation>
  patchSociBankAccount?: Maybe<PatchSociBankAccountMutation>
  patchSociProduct?: Maybe<PatchSociProductMutation>
  patchSociSession?: Maybe<PatchSociSessionMutation>
  patchSummary?: Maybe<PatchSummaryMutation>
  patchUser?: Maybe<PatchUserMutation>
}

export type MutationCreateAdmissionArgs = {
  input: CreateAdmissionInput
}

export type MutationCreateApplicantArgs = {
  input: CreateApplicantInput
}

export type MutationCreateCommissionArgs = {
  input: CreateCommissionInput
}

export type MutationCreateCommissionMembershipArgs = {
  input: CreateCommissionMembershipInput
}

export type MutationCreateCommitteeArgs = {
  input: CreateCommitteeInput
}

export type MutationCreateInternalGroupArgs = {
  input: CreateInternalGroupInput
}

export type MutationCreateInternalGroupPositionArgs = {
  input: CreateInternalGroupPositionInput
}

export type MutationCreateInternalGroupPositionMembershipArgs = {
  input: CreateInternalGroupPositionMembershipInput
}

export type MutationCreateProductOrderArgs = {
  input: CreateProductOrderInput
}

export type MutationCreateQuoteArgs = {
  input: CreateQuoteInput
}

export type MutationCreateQuoteVoteArgs = {
  input: CreateQuoteVoteInput
}

export type MutationCreateScheduleArgs = {
  input: CreateScheduleInput
}

export type MutationCreateScheduleSlotTypeArgs = {
  input: CreateScheduleSlotTypeInput
}

export type MutationCreateScheduleTemplateArgs = {
  input: CreateScheduleTemplateInput
}

export type MutationCreateSensorMeasurementArgs = {
  input: CreateSensorMeasurementInput
}

export type MutationCreateShiftArgs = {
  input: CreateShiftInput
}

export type MutationCreateShiftSlotArgs = {
  input: CreateShiftSlotInput
}

export type MutationCreateShiftSlotGroupArgs = {
  input: CreateShiftSlotGroupInput
}

export type MutationCreateShiftSlotGroupDayRuleArgs = {
  input: CreateShiftSlotGroupDayRuleInput
}

export type MutationCreateShiftSlotGroupInterestArgs = {
  input: CreateShiftSlotGroupInterestInput
}

export type MutationCreateShiftSlotGroupTemplateArgs = {
  input: CreateShiftSlotGroupTemplateInput
}

export type MutationCreateShiftSlotTemplateArgs = {
  input: CreateShiftSlotTemplateInput
}

export type MutationCreateShiftTradeArgs = {
  input: CreateShiftTradeInput
}

export type MutationCreateShiftTradeOfferArgs = {
  input: CreateShiftTradeOfferInput
}

export type MutationCreateSociBankAccountArgs = {
  input: CreateSociBankAccountInput
}

export type MutationCreateSociProductArgs = {
  input: CreateSociProductInput
}

export type MutationCreateSociSessionArgs = {
  id: Scalars['ID']
}

export type MutationCreateSummaryArgs = {
  input: CreateSummaryInput
}

export type MutationCreateUserArgs = {
  input: CreateUserInput
}

export type MutationDeleteAdmissionArgs = {
  id: Scalars['ID']
}

export type MutationDeleteApplicantArgs = {
  id: Scalars['ID']
}

export type MutationDeleteCommissionArgs = {
  id: Scalars['ID']
}

export type MutationDeleteCommissionMembershipArgs = {
  id: Scalars['ID']
}

export type MutationDeleteCommitteeArgs = {
  id: Scalars['ID']
}

export type MutationDeleteInternalGroupArgs = {
  id: Scalars['ID']
}

export type MutationDeleteInternalGroupPositionArgs = {
  id: Scalars['ID']
}

export type MutationDeleteInternalGroupPositionMembershipArgs = {
  id: Scalars['ID']
}

export type MutationDeleteProductOrderArgs = {
  id: Scalars['ID']
}

export type MutationDeleteQuoteArgs = {
  id: Scalars['ID']
}

export type MutationDeleteQuoteVoteArgs = {
  id: Scalars['ID']
}

export type MutationDeleteScheduleArgs = {
  id: Scalars['ID']
}

export type MutationDeleteScheduleSlotTypeArgs = {
  id: Scalars['ID']
}

export type MutationDeleteScheduleTemplateArgs = {
  id: Scalars['ID']
}

export type MutationDeleteSensorMeasurementArgs = {
  id: Scalars['ID']
}

export type MutationDeleteShiftArgs = {
  id: Scalars['ID']
}

export type MutationDeleteShiftSlotArgs = {
  id: Scalars['ID']
}

export type MutationDeleteShiftSlotGroupArgs = {
  id: Scalars['ID']
}

export type MutationDeleteShiftSlotGroupDayRuleArgs = {
  id: Scalars['ID']
}

export type MutationDeleteShiftSlotGroupInterestArgs = {
  id: Scalars['ID']
}

export type MutationDeleteShiftSlotGroupTemplateArgs = {
  id: Scalars['ID']
}

export type MutationDeleteShiftSlotTemplateArgs = {
  id: Scalars['ID']
}

export type MutationDeleteShiftTradeArgs = {
  id: Scalars['ID']
}

export type MutationDeleteShiftTradeOfferArgs = {
  id: Scalars['ID']
}

export type MutationDeleteSociProductArgs = {
  id: Scalars['ID']
}

export type MutationDeleteSociSessionArgs = {
  id: Scalars['ID']
}

export type MutationDeleteSummaryArgs = {
  id: Scalars['ID']
}

export type MutationDeleteUserArgs = {
  id: Scalars['ID']
}

export type MutationLoginArgs = {
  password: Scalars['String']
  username: Scalars['String']
}

export type MutationPatchAdmissionArgs = {
  id: Scalars['ID']
  input: PatchAdmissionInput
}

export type MutationPatchApplicantArgs = {
  id: Scalars['ID']
  input: PatchApplicantInput
}

export type MutationPatchCommissionArgs = {
  id: Scalars['ID']
  input: PatchCommissionInput
}

export type MutationPatchCommissionMembershipArgs = {
  id: Scalars['ID']
  input: PatchCommissionMembershipInput
}

export type MutationPatchCommitteeArgs = {
  id: Scalars['ID']
  input: PatchCommitteeInput
}

export type MutationPatchInternalGroupArgs = {
  id: Scalars['ID']
  input: PatchInternalGroupInput
}

export type MutationPatchInternalGroupPositionArgs = {
  id: Scalars['ID']
  input: PatchInternalGroupPositionInput
}

export type MutationPatchInternalGroupPositionMembershipArgs = {
  id: Scalars['ID']
  input: PatchInternalGroupPositionMembershipInput
}

export type MutationPatchProductOrderArgs = {
  id: Scalars['ID']
  input: PatchProductOrderInput
}

export type MutationPatchQuoteArgs = {
  id: Scalars['ID']
  input: PatchQuoteInput
}

export type MutationPatchQuoteVoteArgs = {
  id: Scalars['ID']
  input: PatchQuoteInput
}

export type MutationPatchScheduleArgs = {
  id: Scalars['ID']
  input: PatchScheduleInput
}

export type MutationPatchScheduleSlotTypeArgs = {
  id: Scalars['ID']
  input: PatchScheduleSlotTypeInput
}

export type MutationPatchScheduleTemplateArgs = {
  id: Scalars['ID']
  input: PatchScheduleTemplateInput
}

export type MutationPatchSensorMeasurementArgs = {
  id: Scalars['ID']
  input: PatchSensorMeasurementInput
}

export type MutationPatchShiftArgs = {
  id: Scalars['ID']
  input: PatchShiftInput
}

export type MutationPatchShiftSlotArgs = {
  id: Scalars['ID']
  input: PatchShiftSlotInput
}

export type MutationPatchShiftSlotGroupArgs = {
  id: Scalars['ID']
  input: PatchShiftSlotGroupInput
}

export type MutationPatchShiftSlotGroupDayRuleArgs = {
  id: Scalars['ID']
  input: PatchShiftSlotGroupDayRuleInput
}

export type MutationPatchShiftSlotGroupInterestArgs = {
  id: Scalars['ID']
  input: PatchShiftSlotGroupInterestInput
}

export type MutationPatchShiftSlotGroupTemplateArgs = {
  id: Scalars['ID']
  input: PatchShiftSlotGroupTemplateInput
}

export type MutationPatchShiftSlotTemplateArgs = {
  id: Scalars['ID']
  input: PatchShiftSlotTemplateInput
}

export type MutationPatchShiftTradeArgs = {
  id: Scalars['ID']
  input: PatchShiftTradeInput
}

export type MutationPatchShiftTradeOfferArgs = {
  id: Scalars['ID']
  input: PatchShiftTradeOfferInput
}

export type MutationPatchSociBankAccountArgs = {
  id: Scalars['ID']
  input: PatchSociBankAccountInput
}

export type MutationPatchSociProductArgs = {
  id: Scalars['ID']
  input: PatchSociProductInput
}

export type MutationPatchSociSessionArgs = {
  id: Scalars['ID']
  input: PatchSociSessionInput
}

export type MutationPatchSummaryArgs = {
  id: Scalars['ID']
  input: PatchSummaryInput
}

export type MutationPatchUserArgs = {
  id: Scalars['ID']
  input: PatchUserInput
}

/** An object with an ID */
export type Node = {
  /** The ID of the object. */
  id: Scalars['ID']
}

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type PageInfo = {
  __typename?: 'PageInfo'
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>
}

export type PatchAdmissionInput = {
  applicants?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  date?: InputMaybe<Scalars['Date']>
  status?: InputMaybe<AdmissionStatus>
}

export type PatchAdmissionMutation = {
  __typename?: 'PatchAdmissionMutation'
  admission?: Maybe<AdmissionNode>
}

export type PatchApplicantInput = {
  admission?: InputMaybe<Scalars['ID']>
  dateOfBirth?: InputMaybe<Scalars['Date']>
  email?: InputMaybe<Scalars['String']>
  firstName?: InputMaybe<Scalars['String']>
  homeAddress?: InputMaybe<Scalars['String']>
  image?: InputMaybe<Scalars['Upload']>
  lastName?: InputMaybe<Scalars['String']>
  phone?: InputMaybe<Scalars['String']>
  priorities?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  status?: InputMaybe<ApplicantStatus>
  study?: InputMaybe<Scalars['String']>
  townAddress?: InputMaybe<Scalars['String']>
}

export type PatchApplicantMutation = {
  __typename?: 'PatchApplicantMutation'
  applicant?: Maybe<ApplicantNode>
}

export type PatchCommissionInput = {
  committees?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  holders?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  memberships?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  name?: InputMaybe<Scalars['String']>
}

export type PatchCommissionMembershipInput = {
  commission?: InputMaybe<Scalars['ID']>
  dateEnded?: InputMaybe<Scalars['Date']>
  dateStarted?: InputMaybe<Scalars['Date']>
  user?: InputMaybe<Scalars['ID']>
}

export type PatchCommissionMembershipMutation = {
  __typename?: 'PatchCommissionMembershipMutation'
  commissionMembership?: Maybe<CommissionMembershipNode>
}

export type PatchCommissionMutation = {
  __typename?: 'PatchCommissionMutation'
  commission?: Maybe<CommissionNode>
}

export type PatchCommitteeInput = {
  members?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
}

export type PatchCommitteeMutation = {
  __typename?: 'PatchCommitteeMutation'
  committee?: Maybe<CommitteeNode>
}

export type PatchInternalGroupInput = {
  applicationPriorities?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  description?: InputMaybe<Scalars['String']>
  groupImage?: InputMaybe<Scalars['Upload']>
  name?: InputMaybe<Scalars['String']>
  positions?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  scheduleslottypeSet?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  type?: InputMaybe<InternalGroupType>
}

export type PatchInternalGroupMutation = {
  __typename?: 'PatchInternalGroupMutation'
  internalGroup?: Maybe<InternalGroupNode>
}

export type PatchInternalGroupPositionInput = {
  description?: InputMaybe<Scalars['String']>
  holders?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  internalGroup?: InputMaybe<Scalars['ID']>
  memberships?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  name?: InputMaybe<Scalars['String']>
  type?: InputMaybe<InternalGroupPositionType>
}

export type PatchInternalGroupPositionMembershipInput = {
  dateEnded?: InputMaybe<Scalars['Date']>
  dateJoined?: InputMaybe<Scalars['Date']>
  position?: InputMaybe<Scalars['ID']>
  user?: InputMaybe<Scalars['ID']>
}

export type PatchInternalGroupPositionMembershipMutation = {
  __typename?: 'PatchInternalGroupPositionMembershipMutation'
  internalGroupPositionMembership?: Maybe<InternalGroupPositionMembershipNode>
}

export type PatchInternalGroupPositionMutation = {
  __typename?: 'PatchInternalGroupPositionMutation'
  internalGroupPosition?: Maybe<InternalGroupPositionNode>
}

export type PatchProductOrderInput = {
  orderSize?: InputMaybe<Scalars['Int']>
  product?: InputMaybe<Scalars['ID']>
  purchasedAt?: InputMaybe<Scalars['DateTime']>
  session?: InputMaybe<Scalars['ID']>
  source?: InputMaybe<Scalars['ID']>
}

export type PatchProductOrderMutation = {
  __typename?: 'PatchProductOrderMutation'
  productOrder?: Maybe<ProductOrderNode>
}

export type PatchQuoteInput = {
  context?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['DateTime']>
  reportedBy?: InputMaybe<Scalars['ID']>
  tagged?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  text?: InputMaybe<Scalars['String']>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  verifiedBy?: InputMaybe<Scalars['ID']>
  votes?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
}

export type PatchQuoteMutation = {
  __typename?: 'PatchQuoteMutation'
  quote?: Maybe<QuoteNode>
}

export type PatchScheduleInput = {
  name?: InputMaybe<Scalars['String']>
  scheduleslottypeSet?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  scheduletemplateSet?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  shiftslotgroupSet?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
}

export type PatchScheduleMutation = {
  __typename?: 'PatchScheduleMutation'
  schedule?: Maybe<ScheduleNode>
}

export type PatchScheduleSlotTypeInput = {
  name?: InputMaybe<Scalars['String']>
  role?: InputMaybe<ScheduleSlotTypeRole>
  schedule?: InputMaybe<Scalars['ID']>
  shiftslotSet?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  shiftslottemplateSet?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  standardGroups?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
}

export type PatchScheduleSlotTypeMutation = {
  __typename?: 'PatchScheduleSlotTypeMutation'
  scheduleSlotType?: Maybe<ScheduleSlotTypeNode>
}

export type PatchScheduleTemplateInput = {
  name?: InputMaybe<Scalars['String']>
  schedule?: InputMaybe<Scalars['ID']>
  shiftslotgrouptemplateSet?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
}

export type PatchScheduleTemplateMutation = {
  __typename?: 'PatchScheduleTemplateMutation'
  scheduleTemplate?: Maybe<ScheduleTemplateNode>
}

export type PatchSensorMeasurementInput = {
  createdAt?: InputMaybe<Scalars['DateTime']>
  type?: InputMaybe<SensorMeasurementType>
  value?: InputMaybe<Scalars['Float']>
}

export type PatchSensorMeasurementMutation = {
  __typename?: 'PatchSensorMeasurementMutation'
  sensorMeasurement?: Maybe<SensorMeasurementNode>
}

export type PatchShiftInput = {
  offeredInTrades?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  offeredToShifts?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  slot?: InputMaybe<Scalars['ID']>
  takenInTrades?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  user?: InputMaybe<Scalars['ID']>
}

export type PatchShiftMutation = {
  __typename?: 'PatchShiftMutation'
  shift?: Maybe<ShiftNode>
}

export type PatchShiftSlotGroupDayRuleInput = {
  rule?: InputMaybe<ShiftSlotGroupDayRuleRule>
  shiftSlotGroupTemplate?: InputMaybe<Scalars['ID']>
}

export type PatchShiftSlotGroupDayRuleMutation = {
  __typename?: 'PatchShiftSlotGroupDayRuleMutation'
  shiftSlotGroupDayRule?: Maybe<ShiftSlotGroupDayRuleNode>
}

export type PatchShiftSlotGroupInput = {
  interests?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  meetTime?: InputMaybe<Scalars['DateTime']>
  name?: InputMaybe<Scalars['String']>
  schedule?: InputMaybe<Scalars['ID']>
  shiftSlots?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  startTime?: InputMaybe<Scalars['DateTime']>
}

export type PatchShiftSlotGroupInterestInput = {
  shiftGroup?: InputMaybe<Scalars['ID']>
  user?: InputMaybe<Scalars['ID']>
}

export type PatchShiftSlotGroupInterestMutation = {
  __typename?: 'PatchShiftSlotGroupInterestMutation'
  shiftSlotGroupInterest?: Maybe<ShiftSlotGroupInterestNode>
}

export type PatchShiftSlotGroupMutation = {
  __typename?: 'PatchShiftSlotGroupMutation'
  shiftSlotGroup?: Maybe<ShiftSlotGroupNode>
}

export type PatchShiftSlotGroupTemplateInput = {
  dayRules?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  meetTime?: InputMaybe<Scalars['Time']>
  name?: InputMaybe<Scalars['String']>
  scheduleTemplate?: InputMaybe<Scalars['ID']>
  shiftslottemplateSet?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  startTime?: InputMaybe<Scalars['Time']>
}

export type PatchShiftSlotGroupTemplateMutation = {
  __typename?: 'PatchShiftSlotGroupTemplateMutation'
  shiftSlotGroupTemplate?: Maybe<ShiftSlotGroupTemplateNode>
}

export type PatchShiftSlotInput = {
  end?: InputMaybe<Scalars['Time']>
  filledShift?: InputMaybe<Scalars['ID']>
  group?: InputMaybe<Scalars['ID']>
  start?: InputMaybe<Scalars['Time']>
  type?: InputMaybe<Scalars['ID']>
}

export type PatchShiftSlotMutation = {
  __typename?: 'PatchShiftSlotMutation'
  shiftSlot?: Maybe<ShiftSlotNode>
}

export type PatchShiftSlotTemplateInput = {
  end?: InputMaybe<Scalars['Time']>
  group?: InputMaybe<Scalars['ID']>
  start?: InputMaybe<Scalars['Time']>
  type?: InputMaybe<Scalars['ID']>
}

export type PatchShiftSlotTemplateMutation = {
  __typename?: 'PatchShiftSlotTemplateMutation'
  shiftSlotTemplate?: Maybe<ShiftSlotTemplateNode>
}

export type PatchShiftTradeInput = {
  counterOffers?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  offeror?: InputMaybe<Scalars['ID']>
  shiftOffer?: InputMaybe<Scalars['ID']>
  shiftTaker?: InputMaybe<Scalars['ID']>
  signedOffBy?: InputMaybe<Scalars['ID']>
  taker?: InputMaybe<Scalars['ID']>
}

export type PatchShiftTradeMutation = {
  __typename?: 'PatchShiftTradeMutation'
  shiftTrade?: Maybe<ShiftTradeNode>
}

export type PatchShiftTradeOfferInput = {
  accepted?: InputMaybe<Scalars['Boolean']>
  offeror?: InputMaybe<Scalars['ID']>
  shiftOffer?: InputMaybe<Scalars['ID']>
  shiftTrade?: InputMaybe<Scalars['ID']>
}

export type PatchShiftTradeOfferMutation = {
  __typename?: 'PatchShiftTradeOfferMutation'
  shiftTradeOffer?: Maybe<ShiftTradeOfferNode>
}

export type PatchSociBankAccountInput = {
  balance?: InputMaybe<Scalars['Int']>
  cardUuid?: InputMaybe<Scalars['String']>
  deposits?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  destinationTransfers?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  productOrders?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  sourceTransfers?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  user?: InputMaybe<Scalars['ID']>
}

export type PatchSociBankAccountMutation = {
  __typename?: 'PatchSociBankAccountMutation'
  sociBankAccount?: Maybe<SociBankAccountNode>
}

export type PatchSociProductInput = {
  description?: InputMaybe<Scalars['String']>
  end?: InputMaybe<Scalars['DateTime']>
  icon?: InputMaybe<Scalars['String']>
  name?: InputMaybe<Scalars['String']>
  price?: InputMaybe<Scalars['Int']>
  productorderSet?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  skuNumber?: InputMaybe<Scalars['String']>
  start?: InputMaybe<Scalars['DateTime']>
}

export type PatchSociProductMutation = {
  __typename?: 'PatchSociProductMutation'
  sociProduct?: Maybe<SociProductNode>
}

export type PatchSociSessionInput = {
  closed?: InputMaybe<Scalars['Boolean']>
  end?: InputMaybe<Scalars['DateTime']>
  name?: InputMaybe<Scalars['String']>
  productOrders?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  signedOffBy?: InputMaybe<Scalars['ID']>
  start?: InputMaybe<Scalars['DateTime']>
  type?: InputMaybe<SociSessionType>
}

export type PatchSociSessionMutation = {
  __typename?: 'PatchSociSessionMutation'
  sociSession?: Maybe<SociSessionNode>
}

export type PatchSummaryInput = {
  contents?: InputMaybe<Scalars['String']>
  date?: InputMaybe<Scalars['DateTime']>
  participants?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  reporter?: InputMaybe<Scalars['ID']>
  summaryType?: InputMaybe<SummarySummaryType>
  updatedAt?: InputMaybe<Scalars['DateTime']>
}

export type PatchSummaryMutation = {
  __typename?: 'PatchSummaryMutation'
  summary?: Maybe<SummaryNode>
}

export type PatchUserInput = {
  allDepositComments?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  allergies?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  anonymizeInMadeOutMap?: InputMaybe<Scalars['Boolean']>
  authToken?: InputMaybe<Scalars['ID']>
  bankAccount?: InputMaybe<Scalars['ID']>
  biography?: InputMaybe<Scalars['String']>
  comissions?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  commissionHistory?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  dateJoined?: InputMaybe<Scalars['DateTime']>
  dateOfBirth?: InputMaybe<Scalars['Date']>
  email?: InputMaybe<Scalars['String']>
  firstName?: InputMaybe<Scalars['String']>
  /** The groups this user belongs to. A user will get all permissions granted to each of their groups. */
  groups?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  haveMadeOutWith?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  homeAddress?: InputMaybe<Scalars['String']>
  inRelationship?: InputMaybe<Scalars['Boolean']>
  internalGroupPositionHistory?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  /** Designates whether this user should be treated as active. Unselect this instead of deleting accounts. */
  isActive?: InputMaybe<Scalars['Boolean']>
  /** Designates whether the user can log into this admin site. */
  isStaff?: InputMaybe<Scalars['Boolean']>
  /** Designates that this user has all permissions without explicitly assigning them. */
  isSuperuser?: InputMaybe<Scalars['Boolean']>
  lastLogin?: InputMaybe<Scalars['DateTime']>
  lastName?: InputMaybe<Scalars['String']>
  logentrySet?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  madeOutWithLeftSide?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  madeOutWithRightSide?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  phone?: InputMaybe<Scalars['String']>
  positions?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  profileImage?: InputMaybe<Scalars['Upload']>
  quotes?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  quotevoteSet?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  reportedQuotes?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  reportedSummaries?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  shiftOffers?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  shiftSet?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  shiftTradesSignedOff?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  shiftsInterests?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  shiftsOffered?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  shiftsTaken?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  socisessionSet?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  startKsg?: InputMaybe<Scalars['Date']>
  study?: InputMaybe<Scalars['String']>
  studyAddress?: InputMaybe<Scalars['String']>
  summaries?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  /** Specific permissions for this user. */
  userPermissions?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username?: InputMaybe<Scalars['String']>
  users?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  verifiedDeposits?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  verifiedQuotes?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
}

export type PatchUserMutation = {
  __typename?: 'PatchUserMutation'
  user?: Maybe<UserNode>
}

export type ProductOrderNode = Node & {
  __typename?: 'ProductOrderNode'
  /** The ID of the object. */
  id: Scalars['ID']
  orderSize: Scalars['Int']
  product: SociProductNode
  purchasedAt: Scalars['DateTime']
  session: SociSessionNode
  source: SociBankAccountNode
}

export type ProductOrderNodeConnection = {
  __typename?: 'ProductOrderNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ProductOrderNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `ProductOrderNode` and its cursor. */
export type ProductOrderNodeEdge = {
  __typename?: 'ProductOrderNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<ProductOrderNode>
}

export type Query = {
  __typename?: 'Query'
  admission?: Maybe<AdmissionNode>
  allActiveInternalGroupPositionMemberships?: Maybe<InternalGroupPositionMembershipNodeConnection>
  allActiveSociProducts?: Maybe<SociProductNodeConnection>
  allAdmissions?: Maybe<AdmissionNodeConnection>
  allApplicants?: Maybe<ApplicantNodeConnection>
  allCommissionMemberships?: Maybe<CommissionMembershipNodeConnection>
  allCommissions?: Maybe<CommissionNodeConnection>
  allCommittees?: Maybe<CommitteeNodeConnection>
  allInternalGroupPositionMembership?: Maybe<InternalGroupPositionMembershipNodeConnection>
  allInternalGroupPositions?: Maybe<InternalGroupPositionNodeConnection>
  allInternalGroups?: Maybe<InternalGroupNodeConnection>
  allProductOrders?: Maybe<ProductOrderNodeConnection>
  allQuotes?: Maybe<QuoteNodeConnection>
  allScheduleSlotTypes?: Maybe<ScheduleSlotTypeNodeConnection>
  allScheduleTemplate?: Maybe<ScheduleTemplateNodeConnection>
  allSchedules?: Maybe<ScheduleNodeConnection>
  allSensorMeasurements?: Maybe<SensorMeasurementNodeConnection>
  allShiftSlotGroupDayRules?: Maybe<ShiftSlotGroupDayRuleNodeConnection>
  allShiftSlotGroupInterests?: Maybe<ShiftSlotGroupInterestNodeConnection>
  allShiftSlotGroupTemplates?: Maybe<ShiftSlotGroupTemplateNodeConnection>
  allShiftSlotGroups?: Maybe<ShiftSlotGroupNodeConnection>
  allShiftSlotTemplates?: Maybe<ShiftSlotTemplateNodeConnection>
  allShiftSlots?: Maybe<ShiftSlotNodeConnection>
  allShiftTradeOffers?: Maybe<ShiftTradeOfferNodeConnection>
  allShiftTrades?: Maybe<ShiftTradeNodeConnection>
  allShifts?: Maybe<ShiftNodeConnection>
  allSociBankAccounts?: Maybe<SociBankAccountNodeConnection>
  allSociProducts?: Maybe<SociProductNodeConnection>
  allSociSessions?: Maybe<SociSessionNodeConnection>
  allSummaries?: Maybe<SummaryNodeConnection>
  allUsers?: Maybe<UserNodeConnection>
  applicant?: Maybe<ApplicantNode>
  approvedQuotes?: Maybe<QuoteNodeConnection>
  commission?: Maybe<CommissionNode>
  commissionMembership?: Maybe<CommissionMembershipNode>
  committee?: Maybe<CommitteeNode>
  dashboardData?: Maybe<DashboardData>
  internalGroup?: Maybe<InternalGroupNode>
  internalGroupPosition?: Maybe<InternalGroupPositionNode>
  internalGroupPositionMembership?: Maybe<InternalGroupPositionMembershipNode>
  isLoggedIn?: Maybe<Scalars['Boolean']>
  me?: Maybe<UserNode>
  pendingQuotes?: Maybe<Array<Maybe<QuoteNode>>>
  productOrder?: Maybe<ProductOrderNode>
  quote?: Maybe<QuoteNode>
  schedule?: Maybe<ScheduleNode>
  scheduleSlotType?: Maybe<ScheduleSlotTypeNode>
  scheduleTemplate?: Maybe<ScheduleTemplateNode>
  sensorMeasurement?: Maybe<SensorMeasurementNode>
  shift?: Maybe<ShiftNode>
  shiftSlot?: Maybe<ShiftSlotNode>
  shiftSlotGroup?: Maybe<ShiftSlotGroupNode>
  shiftSlotGroupDayRule?: Maybe<ShiftSlotGroupDayRuleNode>
  shiftSlotGroupInterest?: Maybe<ShiftSlotGroupInterestNode>
  shiftSlotGroupTemplate?: Maybe<ShiftSlotGroupTemplateNode>
  shiftSlotTemplate?: Maybe<ShiftSlotTemplateNode>
  shiftTrade?: Maybe<ShiftTradeNode>
  shiftTradeOffer?: Maybe<ShiftTradeOfferNode>
  sidebarData?: Maybe<SidebarData>
  sociBankAccount?: Maybe<SociBankAccountNode>
  sociProduct?: Maybe<SociProductNode>
  sociSession?: Maybe<SociSessionNode>
  summary?: Maybe<SummaryNode>
  user?: Maybe<UserNode>
  verifyResetPasswordToken?: Maybe<VerifyResetPasswordTokenNode>
}

export type QueryAdmissionArgs = {
  id: Scalars['ID']
}

export type QueryAllActiveInternalGroupPositionMembershipsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryAllActiveSociProductsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryAllAdmissionsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  date?: InputMaybe<Scalars['Date']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryAllApplicantsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  firstName?: InputMaybe<Scalars['String']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryAllCommissionMembershipsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryAllCommissionsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryAllCommitteesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryAllInternalGroupPositionMembershipArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryAllInternalGroupPositionsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryAllInternalGroupsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryAllProductOrdersArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryAllQuotesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryAllScheduleSlotTypesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryAllScheduleTemplateArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryAllSchedulesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryAllSensorMeasurementsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryAllShiftSlotGroupDayRulesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryAllShiftSlotGroupInterestsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryAllShiftSlotGroupTemplatesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryAllShiftSlotGroupsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryAllShiftSlotTemplatesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryAllShiftSlotsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryAllShiftTradeOffersArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryAllShiftTradesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryAllShiftsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryAllSociBankAccountsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryAllSociProductsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryAllSociSessionsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryAllSummariesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  q?: InputMaybe<Scalars['String']>
}

export type QueryAllUsersArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryApplicantArgs = {
  id: Scalars['ID']
}

export type QueryApprovedQuotesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  q?: InputMaybe<Scalars['String']>
}

export type QueryCommissionArgs = {
  id: Scalars['ID']
}

export type QueryCommissionMembershipArgs = {
  id: Scalars['ID']
}

export type QueryCommitteeArgs = {
  id: Scalars['ID']
}

export type QueryInternalGroupArgs = {
  id: Scalars['ID']
}

export type QueryInternalGroupPositionArgs = {
  id: Scalars['ID']
}

export type QueryInternalGroupPositionMembershipArgs = {
  id: Scalars['ID']
}

export type QueryProductOrderArgs = {
  id: Scalars['ID']
}

export type QueryQuoteArgs = {
  id: Scalars['ID']
}

export type QueryScheduleArgs = {
  id: Scalars['ID']
}

export type QueryScheduleSlotTypeArgs = {
  id: Scalars['ID']
}

export type QueryScheduleTemplateArgs = {
  id: Scalars['ID']
}

export type QuerySensorMeasurementArgs = {
  id: Scalars['ID']
}

export type QueryShiftArgs = {
  id: Scalars['ID']
}

export type QueryShiftSlotArgs = {
  id: Scalars['ID']
}

export type QueryShiftSlotGroupArgs = {
  id: Scalars['ID']
}

export type QueryShiftSlotGroupDayRuleArgs = {
  id: Scalars['ID']
}

export type QueryShiftSlotGroupInterestArgs = {
  id: Scalars['ID']
}

export type QueryShiftSlotGroupTemplateArgs = {
  id: Scalars['ID']
}

export type QueryShiftSlotTemplateArgs = {
  id: Scalars['ID']
}

export type QueryShiftTradeArgs = {
  id: Scalars['ID']
}

export type QueryShiftTradeOfferArgs = {
  id: Scalars['ID']
}

export type QuerySociBankAccountArgs = {
  id: Scalars['ID']
}

export type QuerySociProductArgs = {
  id: Scalars['ID']
}

export type QuerySociSessionArgs = {
  id: Scalars['ID']
}

export type QuerySummaryArgs = {
  id: Scalars['ID']
}

export type QueryUserArgs = {
  id: Scalars['ID']
}

export type QueryVerifyResetPasswordTokenArgs = {
  token?: InputMaybe<Scalars['String']>
}

export type QuoteNode = Node & {
  __typename?: 'QuoteNode'
  context?: Maybe<Scalars['String']>
  createdAt: Scalars['DateTime']
  /** The ID of the object. */
  id: Scalars['ID']
  reportedBy: UserNode
  semester?: Maybe<Scalars['String']>
  sum?: Maybe<Scalars['Int']>
  tagged?: Maybe<Array<Maybe<UserNode>>>
  text: Scalars['String']
  updatedAt: Scalars['DateTime']
  verifiedBy?: Maybe<UserNode>
  votes: QuoteVoteNodeConnection
}

export type QuoteNodeVotesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QuoteNodeConnection = {
  __typename?: 'QuoteNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<QuoteNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `QuoteNode` and its cursor. */
export type QuoteNodeEdge = {
  __typename?: 'QuoteNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<QuoteNode>
}

export type QuoteVoteNode = Node & {
  __typename?: 'QuoteVoteNode'
  caster: UserNode
  /** The ID of the object. */
  id: Scalars['ID']
  quote: QuoteNode
  value: Scalars['Int']
}

export type QuoteVoteNodeConnection = {
  __typename?: 'QuoteVoteNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<QuoteVoteNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `QuoteVoteNode` and its cursor. */
export type QuoteVoteNodeEdge = {
  __typename?: 'QuoteVoteNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<QuoteVoteNode>
}

export type ScheduleNode = Node & {
  __typename?: 'ScheduleNode'
  /** The ID of the object. */
  id: Scalars['ID']
  name: Scalars['String']
  scheduleslottypeSet: ScheduleSlotTypeNodeConnection
  scheduletemplateSet: ScheduleTemplateNodeConnection
  shiftslotgroupSet: ShiftSlotGroupNodeConnection
}

export type ScheduleNodeScheduleslottypeSetArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type ScheduleNodeScheduletemplateSetArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type ScheduleNodeShiftslotgroupSetArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type ScheduleNodeConnection = {
  __typename?: 'ScheduleNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ScheduleNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `ScheduleNode` and its cursor. */
export type ScheduleNodeEdge = {
  __typename?: 'ScheduleNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<ScheduleNode>
}

export type ScheduleSlotTypeNode = Node & {
  __typename?: 'ScheduleSlotTypeNode'
  /** The ID of the object. */
  id: Scalars['ID']
  name: Scalars['String']
  role: ScheduleSlotTypeRole
  schedule: ScheduleNode
  shiftslotSet: ShiftSlotNodeConnection
  shiftslottemplateSet: ShiftSlotTemplateNodeConnection
  standardGroups: InternalGroupNodeConnection
}

export type ScheduleSlotTypeNodeShiftslotSetArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type ScheduleSlotTypeNodeShiftslottemplateSetArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type ScheduleSlotTypeNodeStandardGroupsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type ScheduleSlotTypeNodeConnection = {
  __typename?: 'ScheduleSlotTypeNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ScheduleSlotTypeNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `ScheduleSlotTypeNode` and its cursor. */
export type ScheduleSlotTypeNodeEdge = {
  __typename?: 'ScheduleSlotTypeNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<ScheduleSlotTypeNode>
}

/** An enumeration. */
export enum ScheduleSlotTypeRole {
  /** Functionary */
  Functionary = 'FUNCTIONARY',
  /** Gang member */
  GangMember = 'GANG_MEMBER',
}

export type ScheduleTemplateNode = Node & {
  __typename?: 'ScheduleTemplateNode'
  /** The ID of the object. */
  id: Scalars['ID']
  name: Scalars['String']
  schedule: ScheduleNode
  shiftslotgrouptemplateSet: ShiftSlotGroupTemplateNodeConnection
}

export type ScheduleTemplateNodeShiftslotgrouptemplateSetArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type ScheduleTemplateNodeConnection = {
  __typename?: 'ScheduleTemplateNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ScheduleTemplateNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `ScheduleTemplateNode` and its cursor. */
export type ScheduleTemplateNodeEdge = {
  __typename?: 'ScheduleTemplateNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<ScheduleTemplateNode>
}

export type SensorMeasurementNode = Node & {
  __typename?: 'SensorMeasurementNode'
  createdAt: Scalars['DateTime']
  /** The ID of the object. */
  id: Scalars['ID']
  type: SensorMeasurementType
  value: Scalars['Float']
}

export type SensorMeasurementNodeConnection = {
  __typename?: 'SensorMeasurementNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<SensorMeasurementNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `SensorMeasurementNode` and its cursor. */
export type SensorMeasurementNodeEdge = {
  __typename?: 'SensorMeasurementNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<SensorMeasurementNode>
}

/** An enumeration. */
export enum SensorMeasurementType {
  /** Humidity */
  Humidity = 'HUMIDITY',
  /** People count */
  People = 'PEOPLE',
  /** Sound */
  Sound = 'SOUND',
  /** Temperature */
  Temperature = 'TEMPERATURE',
}

export type ShiftNode = Node & {
  __typename?: 'ShiftNode'
  /** The ID of the object. */
  id: Scalars['ID']
  offeredInTrades: ShiftTradeNodeConnection
  offeredToShifts: ShiftTradeOfferNodeConnection
  slot: ShiftSlotNode
  takenInTrades: ShiftTradeNodeConnection
  user: UserNode
}

export type ShiftNodeOfferedInTradesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type ShiftNodeOfferedToShiftsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type ShiftNodeTakenInTradesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type ShiftNodeConnection = {
  __typename?: 'ShiftNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ShiftNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `ShiftNode` and its cursor. */
export type ShiftNodeEdge = {
  __typename?: 'ShiftNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<ShiftNode>
}

export type ShiftSlotGroupDayRuleNode = Node & {
  __typename?: 'ShiftSlotGroupDayRuleNode'
  /** The ID of the object. */
  id: Scalars['ID']
  rule: ShiftSlotGroupDayRuleRule
  shiftSlotGroupTemplate: ShiftSlotGroupTemplateNode
}

export type ShiftSlotGroupDayRuleNodeConnection = {
  __typename?: 'ShiftSlotGroupDayRuleNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ShiftSlotGroupDayRuleNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `ShiftSlotGroupDayRuleNode` and its cursor. */
export type ShiftSlotGroupDayRuleNodeEdge = {
  __typename?: 'ShiftSlotGroupDayRuleNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<ShiftSlotGroupDayRuleNode>
}

/** An enumeration. */
export enum ShiftSlotGroupDayRuleRule {
  /** Weekends */
  Ed = 'ED',
  /** Friday */
  Fr = 'FR',
  /** Full weekends */
  Fu = 'FU',
  /** Monday */
  Mo = 'MO',
  /** Saturday */
  Sa = 'SA',
  /** Sunday */
  Su = 'SU',
  /** Thursday */
  Th = 'TH',
  /** Tuesday */
  Tu = 'TU',
  /** Wednesday */
  We = 'WE',
  /** Weekdays */
  Wk = 'WK',
}

export type ShiftSlotGroupInterestNode = Node & {
  __typename?: 'ShiftSlotGroupInterestNode'
  /** The ID of the object. */
  id: Scalars['ID']
  shiftGroup: ShiftSlotGroupNode
  user: UserNode
}

export type ShiftSlotGroupInterestNodeConnection = {
  __typename?: 'ShiftSlotGroupInterestNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ShiftSlotGroupInterestNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `ShiftSlotGroupInterestNode` and its cursor. */
export type ShiftSlotGroupInterestNodeEdge = {
  __typename?: 'ShiftSlotGroupInterestNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<ShiftSlotGroupInterestNode>
}

export type ShiftSlotGroupNode = Node & {
  __typename?: 'ShiftSlotGroupNode'
  /** The ID of the object. */
  id: Scalars['ID']
  interests: ShiftSlotGroupInterestNodeConnection
  meetTime: Scalars['DateTime']
  name: Scalars['String']
  schedule: ScheduleNode
  shiftSlots: ShiftSlotNodeConnection
  startTime: Scalars['DateTime']
}

export type ShiftSlotGroupNodeInterestsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type ShiftSlotGroupNodeShiftSlotsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type ShiftSlotGroupNodeConnection = {
  __typename?: 'ShiftSlotGroupNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ShiftSlotGroupNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `ShiftSlotGroupNode` and its cursor. */
export type ShiftSlotGroupNodeEdge = {
  __typename?: 'ShiftSlotGroupNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<ShiftSlotGroupNode>
}

export type ShiftSlotGroupTemplateNode = Node & {
  __typename?: 'ShiftSlotGroupTemplateNode'
  dayRules: ShiftSlotGroupDayRuleNodeConnection
  /** The ID of the object. */
  id: Scalars['ID']
  meetTime: Scalars['Time']
  name: Scalars['String']
  scheduleTemplate: ScheduleTemplateNode
  shiftslottemplateSet: ShiftSlotTemplateNodeConnection
  startTime: Scalars['Time']
}

export type ShiftSlotGroupTemplateNodeDayRulesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type ShiftSlotGroupTemplateNodeShiftslottemplateSetArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type ShiftSlotGroupTemplateNodeConnection = {
  __typename?: 'ShiftSlotGroupTemplateNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ShiftSlotGroupTemplateNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `ShiftSlotGroupTemplateNode` and its cursor. */
export type ShiftSlotGroupTemplateNodeEdge = {
  __typename?: 'ShiftSlotGroupTemplateNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<ShiftSlotGroupTemplateNode>
}

export type ShiftSlotNode = Node & {
  __typename?: 'ShiftSlotNode'
  end: Scalars['Time']
  filledShift?: Maybe<ShiftNode>
  group: ShiftSlotGroupNode
  /** The ID of the object. */
  id: Scalars['ID']
  start: Scalars['Time']
  type: ScheduleSlotTypeNode
}

export type ShiftSlotNodeConnection = {
  __typename?: 'ShiftSlotNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ShiftSlotNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `ShiftSlotNode` and its cursor. */
export type ShiftSlotNodeEdge = {
  __typename?: 'ShiftSlotNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<ShiftSlotNode>
}

export type ShiftSlotTemplateNode = Node & {
  __typename?: 'ShiftSlotTemplateNode'
  end: Scalars['Time']
  group: ShiftSlotGroupTemplateNode
  /** The ID of the object. */
  id: Scalars['ID']
  start: Scalars['Time']
  type: ScheduleSlotTypeNode
}

export type ShiftSlotTemplateNodeConnection = {
  __typename?: 'ShiftSlotTemplateNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ShiftSlotTemplateNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `ShiftSlotTemplateNode` and its cursor. */
export type ShiftSlotTemplateNodeEdge = {
  __typename?: 'ShiftSlotTemplateNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<ShiftSlotTemplateNode>
}

export type ShiftTradeNode = Node & {
  __typename?: 'ShiftTradeNode'
  counterOffers: ShiftTradeOfferNodeConnection
  /** The ID of the object. */
  id: Scalars['ID']
  offeror: UserNode
  shiftOffer: ShiftNode
  shiftTaker?: Maybe<ShiftNode>
  signedOffBy?: Maybe<UserNode>
  taker?: Maybe<UserNode>
}

export type ShiftTradeNodeCounterOffersArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type ShiftTradeNodeConnection = {
  __typename?: 'ShiftTradeNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ShiftTradeNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `ShiftTradeNode` and its cursor. */
export type ShiftTradeNodeEdge = {
  __typename?: 'ShiftTradeNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<ShiftTradeNode>
}

export type ShiftTradeOfferNode = Node & {
  __typename?: 'ShiftTradeOfferNode'
  accepted: Scalars['Boolean']
  /** The ID of the object. */
  id: Scalars['ID']
  offeror: UserNode
  shiftOffer: ShiftNode
  shiftTrade: ShiftTradeNode
}

export type ShiftTradeOfferNodeConnection = {
  __typename?: 'ShiftTradeOfferNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ShiftTradeOfferNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `ShiftTradeOfferNode` and its cursor. */
export type ShiftTradeOfferNodeEdge = {
  __typename?: 'ShiftTradeOfferNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<ShiftTradeOfferNode>
}

export type SidebarData = {
  __typename?: 'SidebarData'
  pendingDeposits?: Maybe<Scalars['Int']>
  pendingQuotes?: Maybe<Scalars['Int']>
}

export type SociBankAccountNode = Node & {
  __typename?: 'SociBankAccountNode'
  balance: Scalars['Int']
  cardUuid?: Maybe<Scalars['String']>
  deposits: DepositNodeConnection
  destinationTransfers: TransferNodeConnection
  /** The ID of the object. */
  id: Scalars['ID']
  productOrders: ProductOrderNodeConnection
  sourceTransfers: TransferNodeConnection
  user: UserNode
}

export type SociBankAccountNodeDepositsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type SociBankAccountNodeDestinationTransfersArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type SociBankAccountNodeProductOrdersArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type SociBankAccountNodeSourceTransfersArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type SociBankAccountNodeConnection = {
  __typename?: 'SociBankAccountNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<SociBankAccountNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `SociBankAccountNode` and its cursor. */
export type SociBankAccountNodeEdge = {
  __typename?: 'SociBankAccountNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<SociBankAccountNode>
}

export type SociProductNode = Node & {
  __typename?: 'SociProductNode'
  description?: Maybe<Scalars['String']>
  end?: Maybe<Scalars['DateTime']>
  icon?: Maybe<Scalars['String']>
  /** The ID of the object. */
  id: Scalars['ID']
  name: Scalars['String']
  price: Scalars['Int']
  productorderSet: ProductOrderNodeConnection
  skuNumber: Scalars['String']
  start?: Maybe<Scalars['DateTime']>
}

export type SociProductNodeProductorderSetArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type SociProductNodeConnection = {
  __typename?: 'SociProductNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<SociProductNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `SociProductNode` and its cursor. */
export type SociProductNodeEdge = {
  __typename?: 'SociProductNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<SociProductNode>
}

export type SociSessionNode = Node & {
  __typename?: 'SociSessionNode'
  closed: Scalars['Boolean']
  end?: Maybe<Scalars['DateTime']>
  /** The ID of the object. */
  id: Scalars['ID']
  name?: Maybe<Scalars['String']>
  productOrders: ProductOrderNodeConnection
  signedOffBy?: Maybe<UserNode>
  start?: Maybe<Scalars['DateTime']>
  type: SociSessionType
}

export type SociSessionNodeProductOrdersArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type SociSessionNodeConnection = {
  __typename?: 'SociSessionNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<SociSessionNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `SociSessionNode` and its cursor. */
export type SociSessionNodeEdge = {
  __typename?: 'SociSessionNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<SociSessionNode>
}

/** An enumeration. */
export enum SociSessionType {
  /** Krysseliste */
  Krysseliste = 'KRYSSELISTE',
  /** Societeten */
  Societeten = 'SOCIETETEN',
  /** Stilletime */
  Stilletime = 'STILLETIME',
}

export type SummaryNode = Node & {
  __typename?: 'SummaryNode'
  contents: Scalars['String']
  date: Scalars['DateTime']
  /** The ID of the object. */
  id: Scalars['ID']
  participants?: Maybe<Array<Maybe<UserNode>>>
  reporter: UserNode
  summaryType: SummarySummaryType
  updatedAt: Scalars['DateTime']
}

export type SummaryNodeConnection = {
  __typename?: 'SummaryNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<SummaryNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `SummaryNode` and its cursor. */
export type SummaryNodeEdge = {
  __typename?: 'SummaryNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<SummaryNode>
}

/** An enumeration. */
export enum SummarySummaryType {
  /** Arrangement summary */
  Arrangement = 'ARRANGEMENT',
  /** Barsjef summary */
  Barsjef = 'BARSJEF',
  /** Daglighallen summary */
  Daglighallen = 'DAGLIGHALLEN',
  /** Drift summary */
  Drift = 'DRIFT',
  /** Hovmester summary */
  Hovmester = 'HOVMESTER',
  /** Kafeansvarlig summary */
  Kafeansvarlig = 'KAFEANSVARLIG',
  /** KSG-IT summary */
  Kit = 'KIT',
  /** Økonomi summary */
  Okonomi = 'OKONOMI',
  /** Other summary */
  Other = 'OTHER',
  /** Souschef summary */
  Souschef = 'SOUSCHEF',
  /** Styret summary */
  Styret = 'STYRET',
}

export type TransferNode = Node & {
  __typename?: 'TransferNode'
  amount: Scalars['Int']
  created: Scalars['DateTime']
  destination?: Maybe<SociBankAccountNode>
  /** The ID of the object. */
  id: Scalars['ID']
  modified: Scalars['DateTime']
  source?: Maybe<SociBankAccountNode>
}

export type TransferNodeConnection = {
  __typename?: 'TransferNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<TransferNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `TransferNode` and its cursor. */
export type TransferNodeEdge = {
  __typename?: 'TransferNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<TransferNode>
}

export type UserNode = Node & {
  __typename?: 'UserNode'
  allPermissions?: Maybe<Array<Maybe<Scalars['String']>>>
  anonymizeInMadeOutMap: Scalars['Boolean']
  balance?: Maybe<Scalars['Int']>
  bankAccount?: Maybe<SociBankAccountNode>
  bankAccountActivity?: Maybe<Array<Maybe<BankAccountActivity>>>
  biography: Scalars['String']
  comissions: CommissionNodeConnection
  commissionHistory: CommissionMembershipNodeConnection
  dateJoined: Scalars['DateTime']
  dateOfBirth?: Maybe<Scalars['Date']>
  email: Scalars['String']
  firstName: Scalars['String']
  fullName?: Maybe<Scalars['String']>
  haveMadeOutWith: UserNodeConnection
  homeAddress: Scalars['String']
  /** The ID of the object. */
  id: Scalars['ID']
  inRelationship?: Maybe<Scalars['Boolean']>
  initials?: Maybe<Scalars['String']>
  internalGroupPositionHistory: InternalGroupPositionMembershipNodeConnection
  /** Designates whether this user should be treated as active. Unselect this instead of deleting accounts. */
  isActive: Scalars['Boolean']
  /** Designates whether the user can log into this admin site. */
  isStaff: Scalars['Boolean']
  /** Designates that this user has all permissions without explicitly assigning them. */
  isSuperuser: Scalars['Boolean']
  lastLogin?: Maybe<Scalars['DateTime']>
  lastName: Scalars['String']
  lastTransactions?: Maybe<Array<Maybe<BankAccountActivity>>>
  phone: Scalars['String']
  positions: InternalGroupPositionNodeConnection
  profileImage?: Maybe<Scalars['String']>
  profilePicture?: Maybe<Scalars['String']>
  quotes: QuoteNodeConnection
  quotevoteSet: QuoteVoteNodeConnection
  reportedQuotes: QuoteNodeConnection
  reportedSummaries: SummaryNodeConnection
  shiftOffers: ShiftTradeOfferNodeConnection
  shiftSet: ShiftNodeConnection
  shiftTradesSignedOff: ShiftTradeNodeConnection
  shiftsInterests: ShiftSlotGroupInterestNodeConnection
  shiftsOffered: ShiftTradeNodeConnection
  shiftsTaken: ShiftTradeNodeConnection
  socisessionSet: SociSessionNodeConnection
  startKsg: Scalars['Date']
  study: Scalars['String']
  studyAddress: Scalars['String']
  summaries: SummaryNodeConnection
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars['String']
  users: UserNodeConnection
  verifiedDeposits: DepositNodeConnection
  verifiedQuotes: QuoteNodeConnection
}

export type UserNodeComissionsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type UserNodeCommissionHistoryArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type UserNodeHaveMadeOutWithArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type UserNodeInternalGroupPositionHistoryArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type UserNodePositionsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type UserNodeQuotesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type UserNodeQuotevoteSetArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type UserNodeReportedQuotesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type UserNodeReportedSummariesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type UserNodeShiftOffersArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type UserNodeShiftSetArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type UserNodeShiftTradesSignedOffArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type UserNodeShiftsInterestsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type UserNodeShiftsOfferedArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type UserNodeShiftsTakenArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type UserNodeSocisessionSetArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type UserNodeSummariesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type UserNodeUsersArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type UserNodeVerifiedDepositsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type UserNodeVerifiedQuotesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type UserNodeConnection = {
  __typename?: 'UserNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<UserNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `UserNode` and its cursor. */
export type UserNodeEdge = {
  __typename?: 'UserNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<UserNode>
}

export type VerifyResetPasswordTokenNode = {
  __typename?: 'VerifyResetPasswordTokenNode'
  reason?: Maybe<Scalars['String']>
  valid?: Maybe<Scalars['Boolean']>
}

export type SignInMutationVariables = Exact<{
  username: Scalars['String']
  password: Scalars['String']
}>

export type SignInMutation = {
  __typename?: 'Mutation'
  login?:
    | {
        __typename?: 'LoginMutation'
        ok: boolean
        token?: string | null | undefined
        user?:
          | {
              __typename?: 'UserNode'
              id: string
              email: string
              username: string
            }
          | null
          | undefined
      }
    | null
    | undefined
}

export type QuoteShallowQueryVariables = Exact<{
  id: Scalars['ID']
}>

export type QuoteShallowQuery = {
  __typename?: 'Query'
  quote?:
    | { __typename?: 'QuoteNode'; id: string; text: string }
    | null
    | undefined
}

export type QuoteQueryVariables = Exact<{
  id: Scalars['ID']
}>

export type QuoteQuery = {
  __typename?: 'Query'
  quote?:
    | {
        __typename?: 'QuoteNode'
        id: string
        text: string
        context?: string | null | undefined
      }
    | null
    | undefined
}

export type MeQueryVariables = Exact<{ [key: string]: never }>

export type MeQuery = {
  __typename?: 'Query'
  me?:
    | {
        __typename?: 'UserNode'
        id: string
        username: string
        firstName: string
        lastName: string
        profilePicture?: string | null | undefined
        fullName?: string | null | undefined
        initials?: string | null | undefined
        email: string
        balance?: number | null | undefined
        biography: string
        studyAddress: string
        homeAddress: string
        phone: string
      }
    | null
    | undefined
}

export type UserQueryVariables = Exact<{
  id: Scalars['ID']
}>

export type UserQuery = {
  __typename?: 'Query'
  user?:
    | {
        __typename?: 'UserNode'
        fullName?: string | null | undefined
        biography: string
        homeAddress: string
        studyAddress: string
        phone: string
        initials?: string | null | undefined
        profilePicture?: string | null | undefined
      }
    | null
    | undefined
}

export type IsLoggedInQueryVariables = Exact<{ [key: string]: never }>

export type IsLoggedInQuery = {
  __typename?: 'Query'
  isLoggedIn?: boolean | null | undefined
}

export const SignInDocument = gql`
  mutation SignIn($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      user {
        id
        email
        username
      }
    }
  }
`
export type SignInMutationFn = Apollo.MutationFunction<
  SignInMutation,
  SignInMutationVariables
>

/**
 * __useSignInMutation__
 *
 * To run a mutation, you first call `useSignInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signInMutation, { data, loading, error }] = useSignInMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSignInMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SignInMutation,
    SignInMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<SignInMutation, SignInMutationVariables>(
    SignInDocument,
    options
  )
}
export type SignInMutationHookResult = ReturnType<typeof useSignInMutation>
export type SignInMutationResult = Apollo.MutationResult<SignInMutation>
export type SignInMutationOptions = Apollo.BaseMutationOptions<
  SignInMutation,
  SignInMutationVariables
>
export const QuoteShallowDocument = gql`
  query QuoteShallow($id: ID!) {
    quote(id: $id) {
      id
      text
    }
  }
`

/**
 * __useQuoteShallowQuery__
 *
 * To run a query within a React component, call `useQuoteShallowQuery` and pass it any options that fit your needs.
 * When your component renders, `useQuoteShallowQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQuoteShallowQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useQuoteShallowQuery(
  baseOptions: Apollo.QueryHookOptions<
    QuoteShallowQuery,
    QuoteShallowQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<QuoteShallowQuery, QuoteShallowQueryVariables>(
    QuoteShallowDocument,
    options
  )
}
export function useQuoteShallowLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    QuoteShallowQuery,
    QuoteShallowQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<QuoteShallowQuery, QuoteShallowQueryVariables>(
    QuoteShallowDocument,
    options
  )
}
export type QuoteShallowQueryHookResult = ReturnType<
  typeof useQuoteShallowQuery
>
export type QuoteShallowLazyQueryHookResult = ReturnType<
  typeof useQuoteShallowLazyQuery
>
export type QuoteShallowQueryResult = Apollo.QueryResult<
  QuoteShallowQuery,
  QuoteShallowQueryVariables
>
export const QuoteDocument = gql`
  query Quote($id: ID!) {
    quote(id: $id) {
      id
      text
      context
    }
  }
`

/**
 * __useQuoteQuery__
 *
 * To run a query within a React component, call `useQuoteQuery` and pass it any options that fit your needs.
 * When your component renders, `useQuoteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQuoteQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useQuoteQuery(
  baseOptions: Apollo.QueryHookOptions<QuoteQuery, QuoteQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<QuoteQuery, QuoteQueryVariables>(
    QuoteDocument,
    options
  )
}
export function useQuoteLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<QuoteQuery, QuoteQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<QuoteQuery, QuoteQueryVariables>(
    QuoteDocument,
    options
  )
}
export type QuoteQueryHookResult = ReturnType<typeof useQuoteQuery>
export type QuoteLazyQueryHookResult = ReturnType<typeof useQuoteLazyQuery>
export type QuoteQueryResult = Apollo.QueryResult<
  QuoteQuery,
  QuoteQueryVariables
>
export const MeDocument = gql`
  query Me {
    me {
      id
      username
      firstName
      lastName
      profilePicture
      fullName
      initials
      email
      balance
      biography
      studyAddress
      homeAddress
      phone
    }
  }
`

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(
  baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options)
}
export function useMeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options)
}
export type MeQueryHookResult = ReturnType<typeof useMeQuery>
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>
export const UserDocument = gql`
  query User($id: ID!) {
    user(id: $id) {
      fullName
      biography
      homeAddress
      studyAddress
      phone
      initials
      profilePicture
    }
  }
`

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserQuery(
  baseOptions: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options)
}
export function useUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(
    UserDocument,
    options
  )
}
export type UserQueryHookResult = ReturnType<typeof useUserQuery>
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>
export const IsLoggedInDocument = gql`
  query IsLoggedIn {
    isLoggedIn
  }
`

/**
 * __useIsLoggedInQuery__
 *
 * To run a query within a React component, call `useIsLoggedInQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsLoggedInQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsLoggedInQuery({
 *   variables: {
 *   },
 * });
 */
export function useIsLoggedInQuery(
  baseOptions?: Apollo.QueryHookOptions<
    IsLoggedInQuery,
    IsLoggedInQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<IsLoggedInQuery, IsLoggedInQueryVariables>(
    IsLoggedInDocument,
    options
  )
}
export function useIsLoggedInLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    IsLoggedInQuery,
    IsLoggedInQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<IsLoggedInQuery, IsLoggedInQueryVariables>(
    IsLoggedInDocument,
    options
  )
}
export type IsLoggedInQueryHookResult = ReturnType<typeof useIsLoggedInQuery>
export type IsLoggedInLazyQueryHookResult = ReturnType<
  typeof useIsLoggedInLazyQuery
>
export type IsLoggedInQueryResult = Apollo.QueryResult<
  IsLoggedInQuery,
  IsLoggedInQueryVariables
>
