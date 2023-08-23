import CustomError from '../../api.errors.js';
import { StatusCodes } from 'http-status-codes';
import * as BlocksQueries from './blocks.queries.js';
import logger from '../../../../utils/logger.js';

export async function getBlocks(req, res) {
  const uid = req.query.user_id;

  // when called via /api/v1/blocks?user_id=1
  if (uid) {
    const usersBlocks = await BlocksQueries.getBlocksByUserId(uid);

    // if (!usersBlocks.length) throw new CustomError.BadRequestError(`There are no blocks available for user id ${uid}!`); // prettier-ignore

    return res.status(StatusCodes.OK).json({
      status: 'success',
      request_url: req.originalUrl,
      message: 'The resource was returned successfully!',
      data: usersBlocks,
    });
  }

  // when called via /api/v1/blocks
  const blocks = await BlocksQueries.getAllBlocks();

  if (!blocks.length) throw new CustomError.BadRequestError(`There are no blocks available currently!`); // prettier-ignore

  return res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: blocks,
  });
}

export async function getBlock(req, res) {
  const bid = req.params.bid;
  const block = await BlocksQueries.getBlockByBlockId(bid);

  if (!block.length) throw new CustomError.BadRequestError(`There is no block available for block id ${bid}!`); // prettier-ignore

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: block,
  });
}

export async function postBlock(req, res) {
  const body = req.body;
  const block = await BlocksQueries.createBlock(body);

  if (!block.length) throw new CustomError.BadRequestError(`Something went wrong while creating a block for for  User ID: ${body.user_id}!`); // prettier-ignore

  logger.info(`UserID: ${body.user_id} has created a BlockID: ${block[0].id}`);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: block,
  });
}
