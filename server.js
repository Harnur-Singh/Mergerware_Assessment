import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

Meteor.startup(() => {
  if (Meteor.users.find().count() === 0) {
    const adminUser = Accounts.createUser({
      email: 'admin@example.com',
      password: 'password',
    });
    Roles.addUsersToRoles(adminUser, ['admin']);
  }
});

Meteor.publish({
  'userData': function () {
    return Meteor.users.find({}, { fields: { roles: 1, 'profile. loans': 1 } });
  },
});