const db = require('../../data/db-config');

const getAllUsers = async () =>
  await db('users as u').select(
    'u.id as user_id',
    'u.first_name',
    'u.last_name',
    'u.school',
    'u.bg_username',
    'u.email',
    'u.phone',
    'u.created_at'
  );

const findUserByFilter = async (filter) =>
  await db('users as u')
    .where(filter)
    .select(
      'u.id as user_id',
      'u.first_name',
      'u.last_name',
      'u.school',
      'u.bg_username',
      'u.email',
      'u.phone',
      'u.created_at'
    );

const findUserByID = async (id) =>
  await db('users as u')
    .where({ id })
    .select(
      'u.id as user_id',
      'u.first_name',
      'u.last_name',
      'u.school',
      'u.bg_username',
      'u.email',
      'u.phone',
      'u.created_at'
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
      return newUser ? newUser[0] : newUser;
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
