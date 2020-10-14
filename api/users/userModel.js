const db = require('../../data/db-config');
const { v4: uuidv4 } = require('uuid');

const getAllUsers = async () => await db('users').select('*');

const findUserByFilter = async (filter) =>
  await db('users').where(filter).select('*');

const findUserByID = async (id) =>
  await db('users').where({ id }).select('*').first();

const createUser = async (user) =>
  db('users')
    .insert({
      ...user,
      id: uuidv4(),
    })
    .returning('*');

const updateUser = (id, user) =>
  db('users').where({ id }).first().update(user).returning('*');

const removeUser = async (id) => await db('users').where({ id }).del();

const findOrCreateUserBy = async (userObj) => {
  const foundUser = await findUserByFilter(userObj.findBy).then((user) => user);
  if (foundUser) {
    return foundUser;
  } else {
    let insert = { ...userObj.insert };
    if (!insert.first_name || !insert.last_name || !insert.email)
      throw Error(
        'User object must include a minimum of first name, last name, and e-mail. All other values can be defaulted by function.'
      );
    const otherField = [
      'school-str',
      'bg_username-str',
      'profile_url-str',
      'isLocked-bool',
      'praises-num',
      'demerits-num',
      'user_rating-num',
      'visits-num',
      'reservations-num',
      'phone-str',
    ];
    for (let field in otherField) {
      const [name, type] = field.split('-');
      if (!insert[name]) {
        switch (type) {
          case 'str':
            insert[name] = '';
            break;
          case 'bool':
            insert[name] = false;
            break;
          case 'num':
            insert[name] = 0;
            break;
          default:
            insert[name] = '';
            break;
        }
        continue;
      } else continue;
    }
    return await createUser(insert).then((newUser) => {
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
  findOrCreateUserBy,
};
