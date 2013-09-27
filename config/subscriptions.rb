# Default subscriptions that will be created in dev

module RallyUtils
  SUBSCRIPTIONS = {}
  SUBSCRIPTIONS[:admin_username] = 'slmadmin'
  SUBSCRIPTIONS[:admin_password] = 'w0rk$h0p'
  SUBSCRIPTIONS[:subscriptions] = [
      {
          :username => 'admin@ee.com',
          :modules => ['Rally Portfolio Manager', 'Rally Quality Manager'],
          :subscription_type => 'Enterprise',
          :toggles => ['ENABLE_BULK_EDIT_OF_ALL_FIELDS', 'PROVISION_TRIAL_AND_COMMUNITY_IN_PROD','IMPORT_TASKS','IMPORT_TEST_CASES_WITH_RELATIONSHIPS', 'JS_DETAIL_PAGE', 'NEW_FEEDBACK_STYLING', 'HARMONIZE_ALM_UI', 'CRAZYTRAIN_F4090_EDP_LAYOUT']
      }
  ]
end
