exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('reservations')
    .truncate() // redundant? use .del() ?
    .then(function () {
      // Inserts seed entries
      return knex('roles').insert([
        {
          id: 1,
          name: 'admin',
        },
        {
          id: 2,
          name: 'user',
        },
      ]);
    });
};
