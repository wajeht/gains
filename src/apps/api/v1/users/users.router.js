import { validator, catchAsyncErrors } from '../../api.middlewares.js';
import { uploadPicture } from '../../../../utils/multer.js';

import * as UsersController from './users.controller.js';
import * as UsersValidation from './users.validation.js';

import express from 'express';
const users = express.Router();

/**
 * GET /api/v1/users/check-authentication
 * @tags users
 * @summary check to see the state of if authentication is still valid
 */
users.get('/check-authentication', UsersController.getCheckAuthentication);

/**
 * GET /api/v1/users
 * @tags users
 * @summary get a list of users
 */
users.get('/', catchAsyncErrors(UsersController.getUsers));

/**
 * POST /api/v1/users
 * @tags users
 * @summary create a user
 * @param {string} email.form.required - the email - application/x-www-form-urlencoded
 * @param {string} username.form.required - the username - application/x-www-form-urlencoded
 * @param {string} password.form.required - the password - application/x-www-form-urlencoded
 */
users.post('/', validator(UsersValidation.postUser), catchAsyncErrors(UsersController.postUser));

/**
 * GET /api/v1/users/{id}
 * @tags users
 * @summary get a specific user
 * @param {number} uid.path.required - user id
 */
users.get('/:id', validator(UsersValidation.getUser), catchAsyncErrors(UsersController.getUser));

/**
 * GET /api/v1/users/{id}/download-user-data
 * @tags users
 * @summary download all data of a user
 * @param {number} user_id.path.required - user id
 */
users.get(
  '/:user_id/download-user-data',
  validator(UsersValidation.getDownloadUserData),
  catchAsyncErrors(UsersController.getDownloadUserData),
);

/**
 * PATCH /api/v1/users/{id}
 * @tags users
 * @summary update a specific user details
 * @param {number} uid.path.required - the user id
 * @param {string} username.form - the username - application/x-www-form-urlencoded
 * @param {string} password.form - the password - application/x-www-form-urlencoded
 * @param {string} first_name.form - the first_name - application/x-www-form-urlencoded
 * @param {string} last_name.form - the last_name - application/x-www-form-urlencoded
 * @param {string} birth_date.form - the birth_date - application/x-www-form-urlencoded
 * @param {string} email.form - the email - application/x-www-form-urlencoded
 * @param {number} weight.form - the weight - application/x-www-form-urlencoded
 * @param {number} user_id.form - the user_id - application/x-www-form-urlencoded
 * @param {string} updated_at.form.optional - the updated_at - application/x-www-form-urlencoded
 */
users.patch(
  '/:id',
  validator(UsersValidation.patchUser),
  catchAsyncErrors(UsersController.patchUser),
);

/**
 * PATCH /api/v1/users/{id}/update-personal-information
 * @tags users
 * @summary update personal information of a user
 * @param {number} uid.path.required - the user id
 * @param {string} first_name.form - the first_name - application/x-www-form-urlencoded
 * @param {string} last_name.form - the last_name - application/x-www-form-urlencoded
 * @param {string} birth_date.form - the birth_date - application/x-www-form-urlencoded
 * @param {number} weight.form - the weight - application/x-www-form-urlencoded
 */
users.patch(
  '/:id/update-personal-information',
  validator(UsersValidation.patchUpdatePersonalInformation),
  catchAsyncErrors(UsersController.patchUpdatePersonalInformation),
);

/**
 * PATCH /api/v1/users/{id}/update-account-information
 * @tags users
 * @summary update account information of a user
 * @param {number} uid.path.required - the user id
 * @param {string} email.form - the email - application/x-www-form-urlencoded
 * @param {string} username.form - the username - application/x-www-form-urlencoded
 * @param {string} password.form - the password - application/x-www-form-urlencoded
 */
users.patch(
  '/:id/update-account-information',
  validator(UsersValidation.patchUpdateAccountInformation),
  catchAsyncErrors(UsersController.patchUpdateAccountInformation),
);

/**
 * DELETE /api/v1/users/{user_id}/data
 * @tags users
 * @summary delete a user data from the database
 * @param {number} user_id.path.required - user id
 */
users.delete(
  '/:user_id/data',
  validator(UsersValidation.postDeleteUserData),
  catchAsyncErrors(UsersController.postDeleteUserData),
);

/**
 * POST /api/v1/users/{user_id}/restore-data
 * @tags users
 * @summary restore user data
 * @param {number} user_id.path.required - user id
 */
users.post(
  '/:user_id/restore-data',
  validator(UsersValidation.postRestoreUserData),
  catchAsyncErrors(UsersController.postRestoreUserData),
);

/**
 * POST /api/v1/users/{user_id}/restore-user
 * @tags users
 * @summary restore user data
 * @param {number} user_id.path.required - user id
 */
users.post(
  '/:user_id/restore-user',
  validator(UsersValidation.postRestoreUser),
  catchAsyncErrors(UsersController.postRestoreUser),
);

/**
 * DELETE /api/v1/users/{id}
 * @tags users
 * @summary delete a user from the database
 * @param {number} uid.path.required - user id
 */
users.delete(
  '/:id',
  validator(UsersValidation.deleteUser),
  catchAsyncErrors(UsersController.deleteUser),
);

/**
 * POST /api/v1/users/update-profile-picture/{user_id}
 * @tags users
 * @summary update user profile picture
 * @param {number} user_id.form.required - the user_id - application/x-www-form-urlencoded
 * @param {file} profilePicture.form.required - the profilePicture - application/x-www-form-urlencoded
 */
users.post(
  '/update-profile-picture/:user_id',
  uploadPicture,
  validator(UsersValidation.postUpdateProfilePicture),
  catchAsyncErrors(UsersController.postUpdateProfilePicture),
);

export default users;
