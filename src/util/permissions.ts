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
  economy: {
    add: {
      sociSession: 'economy.add_socisession',
    },
    view: {
      sociSession: 'economy.view_socisession',
    },
    change: {
      sociSession: 'economy.change_socisession',
      sociProduct: 'economy.change_sociproduct',
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
  users: {
    change: {
      user: 'users.change_user',
    },
  },
  schedules: {
    add: {
      schedule: 'schedules.add_schedule',
      scheduleTemplate: 'schedules.add_scheduletemplate',
    },
    change: {
      schedule: 'schedules.change_schedule',
    },
    delete: {
      schedule: 'schedules.delete_schedule',
      scheduleTemplate: 'schedules.delete_scheduletemplate',
    },
    view: {
      schedule: 'schedules.view_schedule',
      scheduleTemplate: 'schedules.view_scheduletemplate',
    },
  },
}
