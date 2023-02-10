export const PERMISSIONS = {
  // ===== ADMISSIONS ======
  admissions: {
    add: {
      admission: 'admissions.add.admission',
      applicant: 'admissions.add_applicant',
      internalGroupPriority: 'admissions.add_internalgrouppriority',
      interview: 'admissions.add_interview',
    },
    change: {
      interview: 'admissions.change_interview',
      admission: 'admissions.change_admission',
    },
    delete: {
      applicant: 'admissions.delete_applicant',
      interview: 'admissions.delete_interview',
    },
    view: {
      admission: 'admissions.view_admission',
      interview: 'admissions.view_interview',
    },
  },
  // ===== ECONOMY ======
  economy: {
    add: {
      sociSession: 'economy.add_socisession',
      sociOrderSession: 'economy.add_sociordersession',
    },
    view: {
      sociSession: 'economy.view_socisession',
    },
    change: {
      sociSession: 'economy.change_socisession',
      sociProduct: 'economy.change_sociproduct',
      deposit: 'economy.change_deposit',
      sociOrderSession: 'economy.add_sociordersession',
    },
    approve: {
      deposit: 'economy.approve_deposit',
    },
    invalidate: {
      deposit: 'economy.invalidate_deposit',
    },
  },
  // ===== HANDBOOK ======
  handbook: {
    add: {
      document: 'handbook.add_document',
    },
    view: {},
    change: {
      document: 'handbook.change_document',
    },
    delete: {
      document: 'handbook.delete_document',
    },
  },
  // ===== SUMMARIES ======
  summaries: {
    add: {
      summary: 'summaries.add_summary',
    },
    change: {
      summary: 'summaries.change_summary',
    },
    view: {
      summary: 'summaries.view_summary',
    },
  },

  // ===== BARTABS ======
  barTab: {
    view: {
      barTab: 'bar_tab.view_bartab',
      barTabCustomer: 'bar_tab.view_bartabcustomer',
    },
    add: {},
    change: {
      barTab: 'bar_tab.change_bartab',
    },
    delete: {
      barTab: 'bar_tab.delete_bartab',
    },
  },
  // ===== QUOTES ======
  quotes: {
    add: {
      quote: 'quotes.add_quote',
    },
    change: {
      quote: 'quotes.change_quote',
    },
    delete: {
      quote: 'quotes.delete_quote',
    },
    approve: {
      quote: 'quotes.approve_quote',
    },
    invalidate: {
      quote: 'quotes.invalidate_quote',
    },
    view: {
      quote: 'quotes.view_quote',
    },
  },
  // ===== USERS ======
  users: {
    change: {
      user: 'users.change_user',
      userType: 'users.change_usertype',
    },
    view: {
      user: 'users.view_user',
      userType: 'users.view_usertype',
    },
  },
  // ===== ORGANIZATION =====
  organization: {
    change: {
      internalGroup: 'organization.change_internalgroup',
      internalGroupPosition: 'organization.change_internalgroupposition',
      internalGroupPositionMembership:
        'organization.change_internalgrouppositionmembership',
      internalGroupUserHighlight:
        'organization.change_internalgroupuserhighlight',
    },
    add: {
      internalGroup: 'organization.add_internalgroup',
      internalGroupPosition: 'organization.add_internalgroupposition',
      internalGroupPositionMembership:
        'organization.add_internalgrouppositionmembership',
      internalGroupUserHighlight: 'organization.add_internalgroupuserhighlight',
    },
    delete: {
      internalGroup: 'organization.delete_internalgroup',
      internalGroupPosition: 'organization.delete_internalgroupposition',
      internalGroupPositionMembership:
        'organization.delete_internalgrouppositionmembership',
      internalGroupUserHighlight:
        'organization.delete_internalgroupuserhighlight',
    },
    view: {
      internalGroup: 'organization.view_internalgroup',
      internalGroupPosition: 'organization.view_internalgroupposition',
      internalGroupPositionMembership:
        'organization.view_internalgrouppositionmembership',
    },
  },

  // ===== SCHEDULES ======
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
