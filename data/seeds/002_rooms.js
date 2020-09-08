
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('rooms')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('rooms').insert([
        {
          roomtype: 'Coworking',
          time_slots_taken: JSON.stringify({
            09022020: [
              '1000',
              // '1300' is not open because 
              '1400',
              '1700',
            ]
          }),
        },
        {
          roomtype: 'Media',
          time_slots_taken: JSON.stringify({
            09022020: [
              '1000',
              '1200',
            ]
          }),
        },
      ]);
    });
};
