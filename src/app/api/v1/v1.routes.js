import ExerciseCategoriesRouter from './exercise-categories/exercise-categories.router.js';
import SubscriptionsRoutes from './subscriptions/subscriptions.routes.js';
import SessionsRouter from './sessions/sessions.router.js';
import ExercisesRouter from './exercises/exercises.router.js';
import MessagesRouter from './messages/messages.router.js';
import FollowsRouter from './follows/follows.router.js';
import BlocksRouter from './blocks/blocks.router.js';
import UsersRouter from './users/users.router.js';
import VideosRouter from './videos/videos.router.js';
import ApiKeysRoutes from './api-keys/api-keys.routes.js';
import CacheRoutes from './cache/cache.routes.js';
import VariablesRouter from './variables/variables.router.js';
import CommentsRoutes from './comments/comments.routes.js';
import SetsRouter from './sets/sets.router.js';
import LogsRouter from './logs/logs.router.js';
import TagsRoutes from './tags/tags.routes.js';

import express from 'express';
const v1 = express.Router();

v1.use('/exercise-categories', ExerciseCategoriesRouter);
v1.use('/subscriptions', SubscriptionsRoutes);
v1.use('/sessions', SessionsRouter);
v1.use('/exercises', ExercisesRouter);
v1.use('/messages', MessagesRouter);
v1.use('/follows', FollowsRouter);
v1.use('/variables', VariablesRouter);
v1.use('/comments', CommentsRoutes);
v1.use('/api-keys', ApiKeysRoutes);
v1.use('/blocks', BlocksRouter);
v1.use('/videos', VideosRouter);
v1.use('/users', UsersRouter);
v1.use('/cache', CacheRoutes);
v1.use('/sets', SetsRouter);
v1.use('/logs', LogsRouter);
v1.use('/tags', TagsRoutes);

export default v1;
