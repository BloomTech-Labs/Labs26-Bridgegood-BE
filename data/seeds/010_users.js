const faker = require('faker');
const users = [...new Array(5)].map((i, idx) => {
  var names = [
    'Ana:Carillo',
    'Alexander:Besse',
    'Drake:Alia',
    'Anthony:Koharian',
    'Yasir:Hamm',
  ];
  var ids = [
    '57e747fc-a0d0-44af-a9ee-1b90e083a88b',
    'd22b9b36-f699-4f46-bd01-6918772b4f59',
    '6bcd387f-3448-4d34-8de1-d4c748672ff5',
    '0bc64799-fa50-4110-8c18-83ff6f59fc01',
    'f882279e-1f56-44ca-a04f-1ceea1841c96',
  ];
  var firstName = names[idx].split(':')[0];
  var lastName = names[idx].split(':')[1];
  return {
    id: ids[idx],
    email: idx == 0 ? 'lambda@labs.com' : `llama00${idx}@maildrop.cc`,
    first_name: firstName,
    last_name: lastName,
    school: `Lambda School`,
    bg_username: `${firstName}-${lastName}`,
    profile_url: `https://www.bridgegood.dev/${names[idx]
      .replace(':', '_')
      .toLowerCase()}`,
    isLocked: 0,
    praises: 0,
    demerits: 0,
    user_rating: 0,
    visits: 0,
    phone: `${faker.phone.phoneNumber()}`,
    role_id: idx == 0 ? 1 : 2,
  };
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
