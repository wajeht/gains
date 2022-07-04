import { StatusCodes } from 'http-status-codes';
import { jwt_secret } from '../../../config/env.js';
import * as AuthService from './auth.service.js';
import jwt from 'jsonwebtoken';

export async function postLogin(req, res) {
  res.json({
    msg: 'ok',
  });
}

export function getLogout(req, res) {}

export function postSignup(req, res) {}
