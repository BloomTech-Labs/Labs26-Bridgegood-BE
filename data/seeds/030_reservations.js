exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('reservations')
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex('reservations').insert([
        {
          id: '4d3ffc4c-c32d-4917-8ee9-757fc46e5db7',
          datetime: '09022020:1000',
          duration: '1h',
          user_id: '57e747fc-a0d0-44af-a9ee-1b90e083a88b',
          room_id: 'da3024b3-ad0d-4bda-b45b-7fcf129ab08a',
        },
        {
          id: '5c13ceb8-af60-45bb-84ea-545d4d773fe3',
          datetime: '09022020:1400',
          duration: '1h',
          user_id: 'd22b9b36-f699-4f46-bd01-6918772b4f59',
          room_id: 'da3024b3-ad0d-4bda-b45b-7fcf129ab08a',
        },
        {
          id: '36b7210f-9fb1-4941-a3f1-7672df561665',
          datetime: '09022020:1700',
          duration: '1h',
          user_id: '6bcd387f-3448-4d34-8de1-d4c748672ff5',
          room_id: 'da3024b3-ad0d-4bda-b45b-7fcf129ab08a',
        },
        {
          id: 'a4e48bf5-9b2b-48f1-ae4e-ffd1dd1dfba8',
          datetime: '09022020:1000',
          duration: '1h',
          user_id: '0bc64799-fa50-4110-8c18-83ff6f59fc01',
          room_id: 'eccfbc02-b0a8-4cb1-ae42-ee1e91e420fe',
        },
        {
          id: '4151cfca-a626-4a99-8ec0-d16d10fd2827',
          datetime: '09022020:1200',
          duration: '1h',
          user_id: 'f882279e-1f56-44ca-a04f-1ceea1841c96',
          room_id: 'eccfbc02-b0a8-4cb1-ae42-ee1e91e420fe',
        },
      ]);
    });
};
