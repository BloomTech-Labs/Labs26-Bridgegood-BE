const db = require('../../data/db-config');

const getAllUsers = async () =>
  await db('users').select(
    'id',
    'first_name',
    'last_name',
    'school',
    'bg_username',
    'email',
    'phone',
    'created_at'
  );

const findUserByFilter = async (filter) =>
  await db('users')
    .where(filter)
    .select(
      'id',
      'first_name',
      'last_name',
      'school',
      'bg_username',
      'email',
      'phone',
      'created_at'
    );

const findUserByID = async (id) =>
  await db('users')
    .where({ id })
    .select(
      'id',
      'first_name',
      'last_name',
      'school',
      'bg_username',
      'email',
      'phone',
      'created_at'
    )
    .first();

const createUser = async (user) =>
  db('users')
    .insert(user)
    .returning([
      'id',
      'first_name',
      'last_name',
      'school',
      'bg_username',
      'email',
      'phone',
      'created_at',
    ]);

const updateUser = (id, user) =>
  db('users')
    .where({ id })
    .first()
    .update(user)
    .returning([
      'id',
      'first_name',
      'last_name',
      'school',
      'bg_username',
      'email',
      'phone',
      'created_at',
    ]);

const removeUser = async (id) => await db('users').where({ id }).del();

const findOrCreateUser = async (userObj) => {
  const foundUser = await findUserByID(userObj.id).then((user) => user);
  if (foundUser) {
    return foundUser;
  } else {
    return await createUser(userObj).then((newUser) => {
      return newUser ? newUser[0] : null;
    });
  }
};

module.exports = {
  getAllUsers,
  findUserByFilter,
  findUserByID,
  createUser,
  updateUser,
  removeUser,
  findOrCreateUser,
};
