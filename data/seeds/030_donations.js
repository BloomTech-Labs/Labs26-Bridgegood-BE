exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('donations')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('donations').insert([
        {
          id: 'f497c3b7-01ef-4612-840e-e7f3ffc687d3',
          amount: 15.0,
          user_id: '6bcd387f-3448-4d34-8de1-d4c748672ff5',
        },
      ]);
    });
};
