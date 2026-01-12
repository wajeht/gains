import { validator, catchAsyncErrors } from '../../api.middlewares.js';
import { uploadPicture } from '../../../utils/multer.js';

import * as UsersController from './users.controller.js';
import * as UsersValidation from './users.validation.js';

import express from 'express';
const users = express.Router();

users.get('/check-authentication', UsersController.getCheckAuthentication);

users.get('/', validator(UsersValidation.getUsers), catchAsyncErrors(UsersController.getUsers));

users.post('/', validator(UsersValidation.postUser), catchAsyncErrors(UsersController.postUser));

users.get('/:id', validator(UsersValidation.getUser), catchAsyncErrors(UsersController.getUser));

users.get(
  '/:user_id/download-user-data',
  validator(UsersValidation.getDownloadUserData),
  catchAsyncErrors(UsersController.getDownloadUserData),
);

users.patch(
  '/:id',
  validator(UsersValidation.patchUser),
  catchAsyncErrors(UsersController.patchUser),
);

users.patch(
  '/:id/update-personal-information',
  validator(UsersValidation.patchUpdatePersonalInformation),
  catchAsyncErrors(UsersController.patchUpdatePersonalInformation),
);

users.patch(
  '/:id/update-account-information',
  validator(UsersValidation.patchUpdateAccountInformation),
  catchAsyncErrors(UsersController.patchUpdateAccountInformation),
);

users.delete(
  '/:user_id/data',
  validator(UsersValidation.postDeleteUserData),
  catchAsyncErrors(UsersController.postDeleteUserData),
);

users.post(
  '/:user_id/restore-data',
  validator(UsersValidation.postRestoreUserData),
  catchAsyncErrors(UsersController.postRestoreUserData),
);

users.post(
  '/:user_id/restore-user',
  validator(UsersValidation.postRestoreUser),
  catchAsyncErrors(UsersController.postRestoreUser),
);

users.delete(
  '/:id',
  validator(UsersValidation.deleteUser),
  catchAsyncErrors(UsersController.deleteUser),
);

users.post(
  '/update-profile-picture/:user_id',
  uploadPicture,
  validator(UsersValidation.postUpdateProfilePicture),
  catchAsyncErrors(UsersController.postUpdateProfilePicture),
);

users.post(
  '/:following_id/follow',
  validator(UsersValidation.postFollowUser),
  catchAsyncErrors(UsersController.postFollowUser),
);

users.get(
  '/:user_id/followers',
  validator(UsersValidation.getUserFollowers),
  catchAsyncErrors(UsersController.getUserFollowers),
);

export default users;
