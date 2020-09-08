exports.up = (knex) => {
    return knex.schema
      .createTable('users', tbl => {
        tbl.increments();
        tbl.string('first_name').notNullable();
        tbl.string('last_name').notNullable();
        tbl.string('school').notNullable();
        tbl.string('bg_username').notNullable().unique();
        tbl.string('email').notNullable().unique();
        tbl.string('phone').notNullable().unique();
        tbl.string('password').notNullable();
        tbl.timestamps(true, true);
      })
      .createTable("rooms", tbl => {
        tbl.increments();
        tbl.string("roomtype");
        tbl.string("time_slots_taken");
      })
      .createTable("donations", tbl => {
        tbl.increments();
        tbl.string("amount");
        tbl
          .integer("user_id")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("users")
          .onDelete("CASCADE")
          .onUpdate("CASCADE");
      })
      .createTable("reservations", tbl => {
        tbl.increments();
        tbl.string('datetime');
        tbl.string('duration');
        // RoomID and UserID
        tbl
          .integer("user_id")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("users")
          .onDelete("CASCADE")
          .onUpdate("CASCADE");
        tbl
          .integer("room_id")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("rooms")
          .onDelete("CASCADE")
          .onUpdate("CASCADE");
      });
  };
  
  exports.down = (knex) => {
    return knex.schema
      .dropTableIfExists('donations')
      .dropTableIfExists('reservations')
      .dropTableIfExists('rooms')
      .dropTableIfExists('users');
  };
  