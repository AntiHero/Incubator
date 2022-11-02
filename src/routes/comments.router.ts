import { Router } from 'express';

import { getComment } from '@/controllers/comments/getComment';
import { deleteComment } from '@/controllers/comments/deleteComment';
import { updateComment } from '@/controllers/comments/updateComment';
import { updateCommentsLikeStatus } from '@/controllers/comments/updateCommentsLikeStatus';

const commentsRouter = Router();

commentsRouter.put('/:id/like-status', updateCommentsLikeStatus);

commentsRouter.delete('/:id', deleteComment);

commentsRouter.put('/:id', updateComment);

commentsRouter.get('/:id', getComment);

export default commentsRouter;
