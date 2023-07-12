export enum ApplicantStatusValues {
  EMAIL_SENT = 'EMAIL_SENT',
  HAS_REGISTERED_PROFILE = 'HAS_REGISTERED_PROFILE',
  HAS_SET_PRIORITIES = 'HAS_SET_PRIORITIES',
  SCHEDULED_INTERVIEW = 'SCHEDULED_INTERVIEW',
  INTERVIEW_FINISHED = 'INTERVIEW_FINISHED',
  DID_NOT_SHOW_UP_FOR_INTERVIEW = 'DID_NOT_SHOW_UP_FOR_INTERVIEW',
  TO_BE_CALLED = 'TO_BE_CALLED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  RETRACTED_APPLICATION = 'RETRACTED_APPLICATION',
}

export enum InterviewAdditionalEvaluationAnswerValues {
  VERY_LITTLE = 'VERY_LITTLE',
  LITTLE = 'LITTLE',
  MEDIUM = 'MEDIUM',
  SOMEWHAT = 'SOMEWHAT',
  VERY = 'VERY',
}

export enum InterviewTotalEvaluationValues {
  VERY_POOR = 'VERY_POOR',
  POOR = 'POOR',
  MEDIUM = 'MEDIUM',
  GOOD = 'GOOD',
  VERY_GOOD = 'VERY_GOOD',
}

export enum InternalGroupPositionPriorityApplicantPriorityValues {
  FIRST = 'FIRST',
  SECOND = 'SECOND',
  THIRD = 'THIRD',
}

export enum InternalGroupPositionPriorityInternalGroupPriorityValues {
  WANT = 'WANT',
  PROBABLY_WANT = 'PROBABLY_WANT',
  DO_NOT_WANT = 'DO_NOT_WANT',
  CURRENTLY_DISCUSSING = 'CURRENTLY_DISCUSSING',
  RESERVE = 'RESERVE',
  PASS_AROUND = 'PASS_AROUND',
  INTERESTED = 'INTERESTED',
}

export enum AdmissionStatusValues {
  CONFIGURATION = 'CONFIGURATION',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  IN_SESSION = 'IN_SESSION',
  LOCKED = 'LOCKED',
}

export enum NoticeMethodValues {
  EMAIL = 'EMAIL',
  CALL = 'CALL',
}

export enum InternalGroupDiscussionDataOrderingKeyValue {
  PRIORITY = 'priority',
  INTERVIEW = 'interview',
}
