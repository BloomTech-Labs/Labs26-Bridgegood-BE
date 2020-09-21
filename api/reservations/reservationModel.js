const db = require('../../data/db-config');

const getAllReservations = async () => await db('reservations');
const getAllReservationsWithRooms = async () => await db('reservations as res')
  .join('rooms', 'rooms.id', '=', 'res.room_id')
  .select('*', 'res.id as id');
const findReservationByFilter = async (filter) =>
  await db('reservations').where(filter);
const findReservationByID = async (id) =>
  await db('reservations').where({ id }).first();
const createReservation = async (reservation) =>
  await db('reservations').insert(reservation).returning('*');
const updateReservation = async (id, reservation) =>
  await db('reservations')
    .where({ id })
    .first()
    .update(reservation)
    .returning('*');
const removeReservation = async (id) =>
  await db('reservations').where({ id }).del();

module.exports = {
  getAllReservations,
  getAllReservationsWithRooms,
  findReservationByFilter,
  findReservationByID,
  createReservation,
  updateReservation,
  removeReservation,
};
