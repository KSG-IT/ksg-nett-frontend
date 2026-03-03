# admissions — Module Summary

## 1. Purpose / Responsibility

Frontend for the full KSG recruitment pipeline: a public applicant portal (token-based), admin dashboards for interview scheduling/evaluation, group discussion/allocation, and a configuration wizard for new admission cycles.

## 2. Key Pages / Views

| Route                                  | Component                 | Purpose                                                                   |
| -------------------------------------- | ------------------------- | ------------------------------------------------------------------------- |
| `/admissions`                          | `AdmissionDashboard`      | Hub: status overview, upcoming interviews, shortcuts                      |
| `/admissions/configure`                | `ConfigurationWizard`     | Guided setup (schedule → locations → template → positions)                |
| `/admissions/applicants-overview`      | `ApplicantsOverview`      | Applicant table + CSV import/export                                       |
| `/admissions/applicants/:id`           | `ApplicantDetails`        | Full profile, priorities, comments, interview                             |
| `/admissions/interviews-overview`      | `InterviewsOverview`      | Grid calendar of all interview slots by location/time                     |
| `/admissions/internal-group/:id`       | `InternalGroupApplicants` | Applicants filtered by group with priority badges                         |
| `/admissions/discussion-dashboard`     | `DiscussionDashboard`     | All-groups view for allocation phase                                      |
| `/admissions/discussion-dashboard/:id` | `InternalGroupDiscussion` | Per-group discussion: priorities + recommendations                        |
| `/admissions/close`                    | `CloseAdmission`          | Final allocation review + closure                                         |
| `/admissions/statistics`               | `AdmissionStatistics`     | KPI dashboard                                                             |
| `/applicant-portal/:token`             | `ApplicantPortal`         | **Public** stepper: register info → priorities → book interview → summary |

## 3. GraphQL Operations

40+ queries and mutations. Key ones:

**Queries**: `ACTIVE_ADMISSION_QUERY`, `INTERVIEW_OVERVIEW_QUERY`, `APPLICANT_QUERY`, `INTERNAL_GROUP_DISCUSSION_DATA`, `VALID_APPLICANTS_QUERY`, `INTERVIEWS_AVAILABLE_FOR_BOOKING`, `GET_APPLICATION_FROM_TOKEN`

**Mutations**: `CREATE/PATCH/LOCK/CLOSE_ADMISSION`, `GENERATE_INTERVIEWS`, `BOOK_INTERVIEW`, `PATCH_INTERVIEW_*_EVALUATION_ANSWER`, `ASSIGN_NEW_INTERVIEW`, `ADD/DELETE_INTERNAL_GROUP_POSITION_PRIORITY`, `TOGGLE_APPLICANT_WILL_BE_ADMITTED`, `CLOSE_ADMISSION_MUTATION`

## 4. Key Components

Approx. 50 components across views, sub-components, and hooks. Key areas:

- **ApplicantPortal**: stepper subcomponents (RegisterInfo, SetPriorities, InterviewBooking, ApplicationSummary)
- **ConfigurationWizard**: schedule, locations, template, positions setup sub-steps
- **EditInterview**: TotalEvaluationSelect, BooleanEvaluationInline, AdditionalEvaluationInline
- **CloseAdmission**: ToggleApplicantTableRow, ResultPreview, FinalOverlookModal
- Reusable: `ApplicantStatusBadge`, `InternalGroupPositionPriorityBadge`, `ApplicantSelect`

## 5. State Management

- **Apollo** — primary; `fetchPolicy: 'network-only'` on `ACTIVE_ADMISSION_QUERY`
- **Local** — wizard stage progression, modal open/close, CSV parsing state
- **No Zustand** — admissions is entirely Apollo-driven
- Custom hooks: `useInterviewMutations`, `useApplicantMutations`, `useAdmissionMutations`, etc.

## 6. Notable Patterns

- **Token-based applicant access** — no login; token in URL gates all applicant mutations
- **GraphQL fragments** — `CORE_APPLICANT_FIELDS`, `INTERNAL_GROUP_PRIORITY_FIELDS` reused across queries
- **Three evaluation types** on interviews: boolean, additional (Likert scale), and total score
- **Three-enum priority system**: applicant rank (1st/2nd/3rd) × group rating (WANT/DO_NOT_WANT/etc.)
- **`parsing.ts`** centralises all enum → Norwegian text translations
- **CSV bulk import**: parse file → preview → `CREATE_APPLICANTS_FROM_CSV_DATA` mutation
