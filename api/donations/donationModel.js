const db = require('../../data/db-config');

const getAllDonations = async () => await db('donations');
const findDonationsByFilter = async (filter) =>
  await db('donations').where(filter);
const findDonationByID = async (id) =>
  await db('donations').where({ id }).first();
const createDonation = async (donation) =>
  await db('donations').insert(donation).returning('*');
const updateDonation = async (id, donation) =>
  await db('donations').where({ id }).first().update(donation).returning('*');
const removeDonation = async (id) => await db('donations').where({ id }).del();

module.exports = {
  getAllDonations,
  findDonationsByFilter,
  findDonationByID,
  createDonation,
  updateDonation,
  removeDonation,
};
