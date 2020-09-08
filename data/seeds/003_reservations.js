
exports.seed = function(knex) {
  // Deletes ALL existing entries
    return knex('reservations')
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex('reservations').insert([
        {
          datetime: '09022020:1000',
          duration: '1h',
          user_id: 1,
          room_id: 1
        },
        {
          datetime: '09022020:1400',
          duration: '1h',
          user_id: 2,
          room_id: 1
        },
        {
          datetime: '09022020:1700',
          duration: '1h',
          user_id: 3,
          room_id: 1
        },
        {
          datetime: '09022020:1000',
          duration: '1h',
          user_id: 4,
          room_id: 2
        },
        {
          datetime: '09022020:1200',
          duration: '1h',
          user_id: 5,
          room_id: 2
        },
      ]);
    });
};
