# Default subscriptions that will be created in dev

module RallyUtils
  SUBSCRIPTIONS = {}
  SUBSCRIPTIONS[:admin_username] = 'slmadmin'
  SUBSCRIPTIONS[:admin_password] = 'w0rk$h0p'
  SUBSCRIPTIONS[:subscriptions] = [
      {
          :username => 'admin@hs.com',
          :modules => [],
          :subscription_type => 'HS_1',
          :toggles => []
      },
      {
          :username => 'admin@ce.com',
          :modules => [],
          :subscription_type => 'HS_1',
          :toggles => ['F2577_ADD_STORY_DEFECT_ASSOCIATION_TO_COMMUNITY_EDITION']
      },
      {
          :username => 'admin@ee.com',
          :modules => ['Rally Portfolio Manager', 'Rally Quality Manager'],
          :subscription_type => 'Enterprise',
          :toggles => ['ENABLE_BULK_EDIT_OF_ALL_FIELDS', 'PROVISION_TRIAL_AND_COMMUNITY_IN_PROD']
      },
      {
          :username => 'admin@xe.com',
          :modules => [],
          :subscription_type => 'Express_Edition',
          :toggles => []
      }
  ]
end
