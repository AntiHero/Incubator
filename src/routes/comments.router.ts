import { Router } from 'express';

import { getComment } from '@/controllers/comments/getComment';
import { deleteComment } from '@/controllers/comments/deleteComment';
import { updateComment } from '@/controllers/comments/updateComment';

const commentsRouter = Router();

commentsRouter.delete('/:id', deleteComment);

commentsRouter.get('/:id', getComment);

commentsRouter.put('/:id', updateComment);

export default commentsRouter;
