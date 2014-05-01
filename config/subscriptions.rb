# Default subscriptions that will be created in dev

module RallyUtils
  TOGGLES = ['ENABLE_BULK_EDIT_OF_ALL_FIELDS', 'PROVISION_TRIAL_AND_COMMUNITY_IN_PROD','IMPORT_TASKS','IMPORT_TEST_CASES_WITH_RELATIONSHIPS', 'NEW_FEEDBACK_STYLING', 'HARMONIZE_ALM_UI', 'CRAZYTRAIN_F4090_EDP_LAYOUT', 'F4514_COMPLETE_EDP_LAYOUT', 'CRAZYTRAIN_F4089_EDP_BETA', 'EDP_TASK_BETA', 'EDP_DEFECT_BETA','EDP_BETA_SET_PREFERENCE_ON_BY_DEFAULT']
  SUBSCRIPTIONS = {}
  SUBSCRIPTIONS[:admin_username] = 'slmadmin'
  SUBSCRIPTIONS[:admin_password] = 'w0rk$h0p'
  SUBSCRIPTIONS[:subscriptions] = [
      {
          :username => 'admin@ee.com',
          :modules => ['Rally Portfolio Manager', 'Rally Quality Manager'],
          :subscription_type => 'Enterprise',
          :toggles => TOGGLES 
      }
  ]
end
