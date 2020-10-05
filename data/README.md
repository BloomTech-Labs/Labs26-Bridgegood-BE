# DB Schema

## 1. Knex-based schema in JavaScript

      .createTable('roles', (tbl) => {
        tbl.increments();
        tbl.string('name');
        tbl.timestamps(true, true);
      })

      .createTable('users', (tbl) => {
        tbl.string('id').unique().notNullable();
        tbl.string('first_name').notNullable();
        tbl.string('last_name').notNullable();
        tbl.string('school').notNullable();
        tbl.string('bg_username').notNullable().unique();
        tbl.string('email').notNullable().unique(); // create INDEX on this column
        tbl.string('phone').notNullable().unique();
        // profileURL (string)
        // isLocked (bool)
        // praises (num)
        // demerits (num)
        // userRating (calculated based on merits/demerits)
        // visits (calculated based on checkins)
        // reservations (tentative - calc based on reservations)

        tbl
          .integer('role_id')
          .notNullable()
          .references('id')
          .inTable('roles')
          .onDelete('CASCADE') // do not cascade deletes
          .onUpdate('CASCADE');
        tbl.timestamps(true, true);
      })

      .createTable('rooms', (tbl) => {
        tbl.string('id').unique().notNullable();
        tbl.string('roomtype');
        tbl.string('time_slots_taken'); // json object, array of slots taken
        // seats (num)
      })

      .createTable('donations', (tbl) => {
        tbl.string('id').unique().notNullable();
        tbl.string('amount');
        // email (string) -- allows for anonymous users to make donations
        tbl.timestamps(true, true);
        tbl
          .string('user_id')
          .notNullable()  // should be nullable
          .references('id')
          .inTable('users')
          .onDelete('CASCADE')
          .onUpdate('CASCADE');
      })

      .createTable('reservations', (tbl) => {
        tbl.string('id').unique().notNullable();
        tbl.string('datetime'); // reservation time
        tbl.string('duration');
        // donation amount (num)
        // donationID (reference to donation table)
        tbl.timestamps(true, true);
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
      });
