exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('rooms')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('rooms').insert([
        {
          id: 'da3024b3-ad0d-4bda-b45b-7fcf129ab08a',
          roomtype: 'Coworking',
          seats: 10,
          time_slots_taken: JSON.stringify({
            '09022020': ['1000', '1400', '1700'],
          }),
        },
        {
          id: 'eccfbc02-b0a8-4cb1-ae42-ee1e91e420fe',
          roomtype: 'Media',
          seats: 20,
          time_slots_taken: JSON.stringify({
            '09022020': ['1000', '1200'],
          }),
        },
      ]);
    });
};
