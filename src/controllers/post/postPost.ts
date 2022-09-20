import { Request, Response } from 'express';
import { body } from 'express-validator';

import Post from '../../models/Post';
import { APIErrorResult, PostFields } from '../../@types';
import * as ErrorMessages from '../../errorMessages';
import * as postsRepository from '../../repository/posts.repository';
import * as blogsRepository from '../../repository/blogs.repository';
import { checkAuthorization } from '../../customValidators/checkAuthorization';
import { customValidationResult } from '../../customValidators/customValidationResults';

/* Constraints */
const MAX_TITLE_LEN = 30;
const MAX_CONTENT_LEN = 1000;
const MAX_SHORT_DESCR_LEN = 100;

export const postPost = [
  ...checkAuthorization,
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
    .withMessage(ErrorMessages.MAX_LENGHTH_ERROR(MAX_SHORT_DESCR_LEN)),
  body(PostFields.blogId)
    .isString()
    .withMessage(ErrorMessages.NOT_STRING_ERROR)
    .custom(async (value: string) => {
      const blog = await blogsRepository.findBlogById(value);

      if (blog === null) throw new Error('Corresponding blog was not found');

      return true;
    }),
  async (req: Request, res: Response) => {
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

    const blog = await blogsRepository.findBlogById(req.body.blogId);

    if (blog !== null) {
      const post = new Post(
        req.body.title,
        req.body.shortDescription,
        req.body.content,
        req.body.blogId,
        blog.name as string
      );

      await postsRepository.savePost(post);

      res
        .type('text/plain')
        .status(201)
        .send(JSON.stringify(post));

      return;
    }

    res.end();
  },
];
