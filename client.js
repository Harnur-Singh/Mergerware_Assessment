import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { ReactiveVar } from 'meteor/reactive-var';

const loanRequestFormVisible = new ReactiveVar(false);

Template.body.onCreated(function () {
  Meteor.subscribe('userData');
});

Template.body.helpers({
  isAdmin() {
    return Roles.userIsInRole(Meteor.userId(), 'admin');
  },
  loanRequestFormVisible() {
    return loanRequestFormVisible.get();
  },
});

Template.body.events({
  'click .toggle-loan-request-form': function (event, template) {
    loanRequestFormVisible.set(!loanRequestFormVisible.get());
  },
});

Template.registerForm.onCreated(function () {
  this.role = new ReactiveVar('borrower');
});

Template.registerForm.helpers({
  role() {
    return Template.instance().role.get();
  },
});

Template.registerForm.events({
  'change #role-select': function (event, template) {
    template.role.set(event.target.value);
  },
  'submit .register-form': function (event, template) {
    event.preventDefault();
    const email = template.find('#email').value;
    const password = template.find('#password').value;
    const role = template.role.get();

    Accounts.createUser({
      email,
      password,
      profile: {
        role,
      },
    }, (err) => {
      if (!err) {
        if (role === 'lender') {
          Roles.addUsersToRoles(Meteor.userId(), 'lender');
        }
        loanRequestFormVisible.set(false);
      }
    });
  },
});

Template.userDashboard.helpers({
  loans() {
    const userId = Meteor.userId();
    if (!userId) return [];

    const user = Meteor.users.findOne(userId);
    return user.profile.loans || [];
  },
});

Template.userDashboard.events({
  'click .request-loan': function (event, template) {
    // Implement loan request logic here
  },
  'click .confirm-payment': function (event, template) {
    // Implement payment confirmation logic here
  },
});