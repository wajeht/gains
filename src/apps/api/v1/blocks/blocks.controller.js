import CustomError from '../../api.errors.js';
import { StatusCodes } from 'http-status-codes';
import * as BlocksQueries from './blocks.queries.js';
import logger from '../../../../libs/logger.js';

export async function getBlocks(req, res) {
  const uid = req.query.user_id;

  // when called via /api/v1/blocks?user_id=1
  if (uid) {
    const usersBlocks = await BlocksQueries.getBlocksByUserId(uid);

    if (!usersBlocks.length) {
      throw new CustomError.BadRequestError(
        `Something went wrong while fetching blocks for user id ${uid}!`,
      );
    }

    return res.status(StatusCodes.OK).json({
      status: 'success',
      request_url: req.originalUrl,
      message: 'The resource was returned successfully!',
      data: usersBlocks,
    });
  }

  // when called via /api/v1/blocks
  const blocks = await BlocksQueries.getAllBlocks();

  if (!blocks.length) throw new CustomError.BadRequestError(`Something went wrong while fetching blocks!`); // prettier-ignore

  return res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: blocks,
  });
}

/**
 * It fetches a block by its block id
 * @param req - The request object.
 * @param res - The response object.
 */
export async function getBlock(req, res) {
  const bid = req.params.bid;
  const block = await BlocksQueries.getBlockByBlockId(bid);

  if (!block.length) {
    throw new CustomError.BadRequestError(`Something went wrong while fetching a block id ${bid}!`);
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: block,
  });
}

/**
 * It creates a block for a user
 * @param req - The request object.
 * @param res - The response object.
 */
export async function postBlock(req, res) {
  const body = req.body;
  const block = await BlocksQueries.createBlock(body);

  if (!block.length) {
    throw new CustomError.BadRequestError(
      `Something went wrong while creating a block for for  User ID: ${body.user_id}!`,
    );
  }

  logger.info(`UserID: ${body.user_id} has created a BlockID: ${block[0].id}`);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: block,
  });
}
