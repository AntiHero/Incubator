import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Blog } from 'root/blogs/entity/blog.entity';

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class CheckBlogExistance implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Blog)
    private readonly blogsRepository: Repository<Blog>,
  ) {}

  async validate(value: string) {
    try {
      const blog = (
        await this.blogsRepository.query(
          `
          SELECT id FROM blogs WHERE id=$1
        `,
          [value],
        )
      )[0];

      return blog ? true : false;
    } catch (e) {
      return false;
    }
  }

  defaultMessage() {
    return "Blog doesn't exist";
  }
}
