import db from '../../../../database/db.js';
import { pick, omit } from 'lodash-es';
import dayjs from 'dayjs';

export function getAllUsers({ search, pagination = { perPage: null, currentPage: null } }) {
  let s = '';

  if (search.length === 0) {
    s = '';
  } else {
    s = search;
  }

  let query = db
    .select('*', 'u.deleted as deleted')
    .from('users as u')
    .leftJoin('user_details as ud', 'u.id', 'ud.user_id')
    .whereRaw(
      `
      ud.first_name like '%${s}%'
      or ud.last_name like '%${s}%'
      or u.username like '%${s}%'
      or u.email like '%${s}%'
      `,
    )
    .orderBy('u.id', 'desc')
    .paginate({
      ...pagination,
      isLengthAware: true,
    });

  return query;
}

export async function createUser(body, verificationToken) {
  return db
    .insert({ ...body })
    .into('users')
    .returning('*')
    .then(async ([user]) => {
      const { id } = user;
      await db.insert({ user_id: id, verification_token: verificationToken }).into('user_details');
      return db
        .select()
        .from('users')
        .leftJoin('user_details', 'users.id', 'user_details.user_id')
        .where({ 'users.id': id });
    });
}

export function findUserById(id) {
  return db
    .select('*')
    .from('users')
    .leftJoin('user_details', 'users.id', 'user_details.user_id')
    .where({ 'users.id': id });
}

export function findUserByParam(param) {
  return db.select('*').from('users').where(param);
}

export async function updateUserById(id, body) {
  const u = pick(body, ['username', 'email', 'password', 'deleted']);

  await db
    .update({ ...u, updated_at: new Date() })
    .from('users')
    .where({ id });

  const ud = omit(body, ['username', 'email', 'password']);

  await db
    .update({ ...ud, updated_at: new Date() })
    .from('user_details')
    .where({ id });

  return findUserById(id);
}

export function deleteUser(id) {
  // return db.delete('*').from('users').where({ id }).returning('*');
  return db.update({ deleted: true }).from('users').where({ id }).returning('*');
}

export function updatePersonalInformation(uid, body) {
  return db
    .update({ ...body })
    .from('user_details')
    .where({ user_id: uid })
    .returning('*');
}

export function updateAccountInformation(id, body) {
  return db
    .update({ ...body })
    .from('users')
    .where({ id })
    .returning('*');
}

export function updateProfilePicture({ profile_picture_url, profile_picture_path, user_id }) {
  return db
    .update({ profile_picture_path, profile_picture_url })
    .from('user_details')
    .where({ user_id })
    .returning('*');
}

export function deleteUserData(user_id) {
  return Promise.all([
    db.update({ deleted: true }).from('comments').where({ user_id }).returning('*'),
    db.update({ deleted: true }).from('videos').where({ user_id }).returning('*'),
    db.update({ deleted: true }).from('variables').where({ user_id }).returning('*'),
    db.update({ deleted: true }).from('sets').where({ user_id }).returning('*'),
    db.update({ deleted: true }).from('logs').where({ user_id }).returning('*'),
    db.update({ deleted: true }).from('sessions').where({ user_id }).returning('*'),
    db.update({ deleted: true }).from('blocks').where({ user_id }).returning('*'),
  ]);
}

export function restoreUserData(user_id) {
  return Promise.all([
    db.update({ deleted: false }).from('comments').where({ user_id }).returning('*'),
    db.update({ deleted: false }).from('videos').where({ user_id }).returning('*'),
    db.update({ deleted: false }).from('variables').where({ user_id }).returning('*'),
    db.update({ deleted: false }).from('sets').where({ user_id }).returning('*'),
    db.update({ deleted: false }).from('logs').where({ user_id }).returning('*'),
    db.update({ deleted: false }).from('sessions').where({ user_id }).returning('*'),
    db.update({ deleted: false }).from('blocks').where({ user_id }).returning('*'),
  ]);
}

export function postRestoreUser(user_id) {
  return db.update({ deleted: false }).from('users').where({ id: user_id }).returning('*');
}

export function getAllUsersWhoseBirthdayIsToday() {
  const TODAY = dayjs().format('YYYY-MM-DD');
  return db
    .select('*')
    .from('users')
    .leftJoin('user_details', 'users.id', 'user_details.user_id')
    .andWhere({ birth_date: TODAY });
}
