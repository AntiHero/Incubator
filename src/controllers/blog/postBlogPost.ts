import { Request, Response } from 'express';
import { body } from 'express-validator';

import Post from '@/models/Post';
import { PostFields } from '@/enums';
import { APIErrorResult } from '@/@types';
import * as ErrorMessages from '@/errorMessages';
import * as postsRepository from '@/repository/posts.repository';
import * as blogsRepository from '@/repository/blogs.repository';
import { checkAuthorization } from '@/customValidators/basicAuthValidator';
import { customValidationResult } from '@/customValidators/customValidationResults';
import { validateObjectId } from '@/customValidators/objectIdValidator';

/* Constraints */
const MAX_TITLE_LEN = 30;
const MAX_CONTENT_LEN = 1000;
const MAX_SHORT_DESCR_LEN = 100;

export const postBlogPost = [
  ...checkAuthorization,
  validateObjectId,
  body(PostFields.title)
    .isString()
    .withMessage(ErrorMessages.NOT_STRING_ERROR)
    .isLength({ max: MAX_TITLE_LEN })
    .withMessage(ErrorMessages.MAX_LENGHTH_ERROR(MAX_TITLE_LEN))
    .trim()
    .not()
    .isEmpty()
    .withMessage(ErrorMessages.EMPTY_STRING_ERROR),
  body(PostFields.content)
    .isString()
    .withMessage(ErrorMessages.NOT_STRING_ERROR)
    .isLength({ max: MAX_CONTENT_LEN })
    .withMessage(ErrorMessages.MAX_LENGHTH_ERROR(MAX_CONTENT_LEN))
    .trim()
    .not()
    .isEmpty()
    .withMessage(ErrorMessages.EMPTY_STRING_ERROR),
  body(PostFields.shortDescription)
    .isString()
    .withMessage(ErrorMessages.NOT_STRING_ERROR)
    .isLength({ max: MAX_SHORT_DESCR_LEN })
    .withMessage(ErrorMessages.MAX_LENGHTH_ERROR(MAX_SHORT_DESCR_LEN))
    .trim()
    .not()
    .isEmpty()
    .withMessage(ErrorMessages.EMPTY_STRING_ERROR),
  async (req: Request, res: Response) => {
    const blog = await blogsRepository.findBlogById(req.params.id);

    if (blog === null) return res.sendStatus(404);

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

    const post = new Post(
      req.body.title,
      req.body.shortDescription,
      req.body.content,
      req.params.id,
      blog.name as string
    );

    const createdPost = await postsRepository.savePost(post);

    res
      .type('text/plain')
      .status(201)
      .send(JSON.stringify(createdPost));
  },
];
