const db = require('../../data/db-config');
const { v4: uuidv4 } = require('uuid');

const getAllDonations = async () =>
  await db('donations')
    .select('*');

const getDonationByFilter = async (filter) =>
  await db('donations')
    .where(filter)
    .select('*');

const findDonationsByID = async (id) =>
  await db('donations')
    .where({ id })
    .select('*')
    .first();

const createDonation = async (donation) =>
  db('donations')
    .insert({ ...donation, id: uuidv4() })
    .returning('*');

const updateDonation = (id, donation) =>
  db('donations')
    .where({ id })
    .first()
    .update(donation)
    .returning('*');

const removeDonation = async (id) => await db('donations').where({ id }).del();

module.exports = {
  getAllDonations,
  findDonationsByID,
  getDonationByFilter,
  createDonation,
  updateDonation,
  removeDonation,
};
