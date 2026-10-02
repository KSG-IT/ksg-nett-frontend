import { PERMISSIONS } from 'util/permissions'
import {
  InternalGroupPositionType,
  InternalGroupPositionTypeOption,
} from './types.graphql'

export const internalGroupPositionTypeOptions: InternalGroupPositionTypeOption[] =
  [
    {
      value: InternalGroupPositionType['GANG_MEMBER'],
      label: 'Gjengmedlem',
    },
    {
      value: InternalGroupPositionType['HANGAROUND'],
      label: 'Hangaround',
    },
    {
      value: InternalGroupPositionType['TEMPORARY_LEAVE'],
      label: 'Permisjon',
    },
    {
      value: InternalGroupPositionType['FUNCTIONARY'],
      label: 'Funksjonær',
    },
    {
      value: InternalGroupPositionType['ACTIVE_GANG_MEMBER_PANG'],
      label: 'Gjengpang',
    },
    {
      value: InternalGroupPositionType['ACTIVE_FUNCTIONARY_PANG'],
      label: 'Aktiv funkepang',
    },
    {
      value: InternalGroupPositionType['INTEREST_GROUP_MEMBER'],
      label: 'Interessegruppemedlem',
    },
    {
      value: InternalGroupPositionType['OLD_FUNCTIONARY_PANG'],
      label: 'Gammel funkepang',
    },
    {
      value: InternalGroupPositionType['OLD_GANG_MEMBER_PANG'],
      label: 'Gammel gjengpang',
    },
  ]

// setUserMembershipHistory creates, changes and deletes memberships
export const MEMBERSHIP_HISTORY_PERMISSIONS = [
  PERMISSIONS.organization.add.internalGroupPositionMembership,
  PERMISSIONS.organization.change.internalGroupPositionMembership,
  PERMISSIONS.organization.delete.internalGroupPositionMembership,
]
