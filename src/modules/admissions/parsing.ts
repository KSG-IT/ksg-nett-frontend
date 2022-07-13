import {
  ApplicantStatusValues,
  InternalGroupPositionPriorityApplicantPriorityValues,
  InternalGroupPositionPriorityInternalGroupPriorityValues,
} from './consts'

export const parseBooleanEvaluation = (value: true | false | null) => {
  switch (value) {
    case true:
      return 'Ja'
    case false:
      return 'Nei'
    case null:
      return 'Ubesvart'
  }
}

export const parseAdditionalEvaluation = (
  value: 'VERY_LITTLE' | 'LITTLE' | 'MEDIUM' | 'SOMEWHAT' | 'VERY' | null
) => {
  switch (value) {
    case 'VERY_LITTLE':
      return 'Veldig lite'
    case 'LITTLE':
      return 'Lite'
    case 'MEDIUM':
      return 'Middels'
    case 'SOMEWHAT':
      return 'Litt'
    case 'VERY':
      return 'Veldig'
    case null:
      return 'Ikke evaluert'
  }
}

export const parseTotalEvaluation = (
  value: 'VERY_POOR' | 'POOR' | 'MEDIUM' | 'GOOD' | 'VERY_GOOD' | null
) => {
  switch (value) {
    case 'VERY_POOR':
      return 'Veldig dårlig'
    case 'POOR':
      return 'Dårlig'
    case 'MEDIUM':
      return 'Middels'
    case 'GOOD':
      return 'Bra'
    case 'VERY_GOOD':
      return 'Veldig bra'
    case null:
      return 'Ikke evaluert'
  }
}

export const parseApplicantStatus = (status: ApplicantStatusValues) => {
  switch (status) {
    case 'EMAIL_SENT':
      return 'Sendt epost'

    case 'SCHEDULED_INTERVIEW':
      return 'Booket intervju'

    case 'HAS_REGISTERED_PROFILE':
      return 'Registrert'

    case 'ACCEPTED':
      return 'Akseptert'

    case 'DID_NOT_SHOW_UP_FOR_INTERVIEW':
      return 'Ikke møtt'

    case 'REJECTED':
      return 'Avslått'

    case 'RETRACTED_APPLICATION':
      return 'Trukket søknad'

    case 'INTERVIEW_FINISHED':
      return 'Hatt intervju'

    case 'TO_BE_CALLED':
      return 'Skal ringes'
    case 'HAS_SET_PRIORITIES':
      return 'Valgt stillinger'
  }
}

export const parseInternalGroupPositionPriority = (
  priority: InternalGroupPositionPriorityInternalGroupPriorityValues
) => {
  switch (priority) {
    case 'WANT':
      return 'Vil ha'
    case 'PROBABLY_WANT':
      return 'Vil sannsynligvis ha'
    case 'INTERESTED':
      return 'Interessert'
    case 'DO_NOT_WANT':
      return 'Vil ikke ha'
    case 'CURRENTLY_DISCUSSING':
      return 'Diskuteres'
    case 'RESERVE':
      return 'Reserve'
    case 'PASS_AROUND':
      return 'På runde'
    case null:
      return 'Ikke vurdert'
  }
}

export const parseApplicantPriority = (
  priority: InternalGroupPositionPriorityApplicantPriorityValues | 'N/A'
) => {
  switch (priority) {
    case 'FIRST':
      return 'Første'
    case 'SECOND':
      return 'Andre'
    case 'THIRD':
      return 'Tredje'
    case 'N/A':
      return 'N/A'
  }
}
