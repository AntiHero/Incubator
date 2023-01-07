import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Blog } from 'root/blogs/entity/blog.entity';

@Injectable()
export class AnyService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogsRepository: Repository<Blog>,
  ) {}

  async getAllBlogs() {
    try {
      const blogs = await this.blogsRepository.find();

      return blogs;
    } catch (e) {
      console.log(e);

      return [];
    }
  }
}
