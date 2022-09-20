import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';

import { BlogFields } from '../../@types';
import * as ErrorMessages from '../../errorMessages';
import * as blogsRepository from '../../repository/blogs.repository';
import { checkAuthorization } from '../../customValidators/checkAuthorization';
import { customValidationResult } from '../../customValidators/customValidationResults';

/* Constraints */
const MAX_NAME_LEN = 15;
const MAX_YOUTUBEURL_LEN = 40;

export const updateBlog = [
  ...checkAuthorization,
  async (req: Request, res: Response, next: NextFunction) => {
    if ((await blogsRepository.findBlogById(req.params.id)) === null) {
      res.status(404).end();
      return;
    }

    next();
  },
  body(BlogFields.name)
    .isString()
    .withMessage(ErrorMessages.NOT_STRING_ERROR)
    .isLength({ max: MAX_NAME_LEN })
    .withMessage(ErrorMessages.MAX_LENGHTH_ERROR(MAX_NAME_LEN)),
  body(BlogFields.youtubeUrl)
    .isString()
    .withMessage(ErrorMessages.NOT_STRING_ERROR)
    .isLength({ max: MAX_YOUTUBEURL_LEN })
    .withMessage(ErrorMessages.MAX_LENGHTH_ERROR(MAX_YOUTUBEURL_LEN))
    .matches(
      /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/
    )
    .withMessage(ErrorMessages.NOT_MATCHNG_PATTER_ERROR),
  async (req: Request, res: Response) => {
    if (!customValidationResult(req).isEmpty()) {
      res
        .type('text/plain')
        .status(400)
        .send(JSON.stringify(customValidationResult(req).array({ onlyFirstError: true })));

      return;
    }

    await blogsRepository.findBlogByIdAndUpdate(req.params.id, {
      name: req.body.name,
      youtubeUrl: req.body.youtubeUrl,
    });

    res.status(204).end();
  },
];
