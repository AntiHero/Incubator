import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import mongoose from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { BlogModel } from 'root/blogs/schemas/blogs.schema';

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class IsBlogExist implements ValidatorConstraintInterface {
  constructor(
    @InjectModel(BlogModel)
    private blogModel: mongoose.Model<BlogModel>,
  ) {}

  async validate(value: string) {
    try {
      const blog = await this.blogModel.findById(String(value));

      return blog ? true : false;
    } catch (e) {
      return false;
    }
  }

  defaultMessage() {
    return "Blog doesn't exist";
  }
}
