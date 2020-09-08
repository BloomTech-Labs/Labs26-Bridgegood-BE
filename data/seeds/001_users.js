const faker = require('faker');
const bc = require('bcryptjs');

const users = [...new Array(5)].map((i, idx) => {
  var firstName = faker.name.firstName();
  var lastName = faker.name.lastName();
  return {
    email: idx == 0 ? 'lambda@labs.com' : faker.internet.email(),
    first_name: idx == 0 ? 'Lambda' : `${firstName}`,
    last_name: idx == 0 ? 'School' : `${lastName}`,
    school: `Lambda School`,
    bg_username: idx == 0 ? 'Lambda-School' : `${firstName}-${lastName}`,
    phone: `${faker.phone.phoneNumber()}`,
    password: bc.hashSync(idx == 0 ? 'password' : `${firstName}${faker.random * 500}`, 12),
  }
});

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert(users);
    });
};
