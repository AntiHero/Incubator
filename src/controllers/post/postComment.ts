import { body } from 'express-validator';
import { Request, Response } from 'express';

import { CommentFields } from '@/enums';
import { APIErrorResult } from '@/@types';
import * as ErrorMessages from '@/errorMessages';
import * as usersService from '@/app/users.service';
import { convertToUser } from '@/utils/convertToUser';
import * as commentsService from '@/app/comments.service';
import * as postRepository from '@/repository/posts.repository';
import { customValidationResult } from '@/customValidators/customValidationResults';
import { checkAuthorization as checkBearerAuth } from '@/customValidators/bearerAuthValidator';
import { convertToCommentViewModel } from '@/utils/convertToCommentView';

const MIN_LENGTH = 20;
const MAX_LENGTH = 300;

export const postComment = [
  ...checkBearerAuth,
  body(CommentFields.content)
    .isString()
    .withMessage(ErrorMessages.NOT_STRING_ERROR)
    .trim()
    .isLength({ max: MAX_LENGTH })
    .withMessage(ErrorMessages.MAX_LENGTH_ERROR(MAX_LENGTH))
    .isLength({ min: MIN_LENGTH })
    .withMessage(ErrorMessages.MIN_LENGTH_ERROR(MIN_LENGTH)),
  async (req: Request, res: Response) => {
    const postId = req.params.id;
    const post = await postRepository.findPostById(postId);

    if (!post) return res.sendStatus(404);

    if (!customValidationResult(req).isEmpty()) {
      res
        .type('text/plain')
        .status(400)
        .send(
          JSON.stringify({
            errorsMessages: customValidationResult(req).array({
              onlyFirstError: true,
            }),
          } as APIErrorResult)
        );

      return;
    }

    const doc = await usersService.findUserById(req.userId);

    if (doc) {
      const user = convertToUser(doc);
      const content = req.body.content as string;

      const comment = await commentsService.addComment(
        content,
        user.id,
        user.login,
        postId
      );

      if (comment) {
        res
          .status(201)
          .type('text/plain')
          .json(convertToCommentViewModel(comment));
      }

      return;
    }

    res.end();
  },
];
