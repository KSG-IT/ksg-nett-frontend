export const PERMISSIONS = {
  admissions: {
    add: {
      admission: 'admissions.add.admission',
      applicant: 'admissions.add_applicant',
      internalGroupPriority: 'admissions.add.internalgrouppriority',
    },
    change: {
      interview: 'admissions.change_interview',
      admission: 'admissions.change_admission',
    },
    delete: {
      applicant: 'admissions.delete_applicant',
    },
    view: {
      admission: 'admissions.view_admission',
    },
  },
  quotes: {
    add: {
      quote: 'quotes.add_quote',
    },
    change: {
      quote: 'quotes.change_quote',
    },
  },
}
