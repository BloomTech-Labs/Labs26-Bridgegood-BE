exports.up = (knex) => {
  return knex.schema
    .createTable('roles', (tbl) => {
      tbl.increments();
      tbl.string('name').notNullable().unique();
      tbl.timestamps(true, true);
    })
    .createTable('users', (tbl) => {
      tbl.string('id').unique().notNullable();
      tbl.string('first_name').notNullable();
      tbl.string('last_name').notNullable();
      tbl.string('school').notNullable();
      tbl.string('bg_username').notNullable().unique();
      tbl.string('profile_url').notNullable().unique();
      tbl.integer('isLocked').notNullable().defaultTo(0);
      tbl.integer('praises').notNullable().defaultTo(0);
      tbl.integer('demerits').notNullable().defaultTo(0);
      tbl.integer('user_rating').notNullable().defaultTo(0);
      tbl.integer('visits').notNullable().defaultTo(0);
      tbl.integer('reservations').notNullable().defaultTo(0);
      tbl.string('phone').notNullable().unique();
      tbl.string('email').notNullable().unique();
      tbl.index('email');
      tbl
        .integer('role_id')
        .notNullable()
        .references('id')
        .inTable('roles')
        .onDelete('NO ACTION')
        .onUpdate('CASCADE');
      tbl.timestamps(true, true);
    })
    .createTable('rooms', (tbl) => {
      tbl.string('id').unique().notNullable();
      tbl.string('roomtype');
      tbl.string('time_slots_taken');
      tbl.integer('seats').defaultTo(20).notNullable();
    })
    .createTable('donations', (tbl) => {
      tbl.string('id').unique().notNullable();
      tbl.integer('amount').notNullable();
      tbl.string('email');
      tbl.timestamps(true, true);
      tbl
        .string('user_id')
        .references('id')
        .inTable('users')
        .onDelete('NO ACTION')
        .onUpdate('CASCADE');
    })
    .createTable('reservations', (tbl) => {
      tbl.string('id').unique().notNullable();
      tbl.string('datetime'); // Reservation time
      tbl.string('duration'); // Duration of the Reservation
      // RoomID and UserID
      tbl
        .string('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      tbl
        .string('room_id')
        .notNullable()
        .references('id')
        .inTable('rooms')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      tbl.timestamps(true, true);
    });
};

exports.down = (knex) => {
  return knex.schema
    .dropTableIfExists('donations')
    .dropTableIfExists('reservations')
    .dropTableIfExists('rooms')
    .dropTableIfExists('users')
    .dropTableIfExists('roles');
};
