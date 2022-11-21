import mongoose from 'mongoose';
import { TokenDTO } from '../types';
import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { TokenModel } from '../schemas/token.schema';

@Injectable()
export class TokensAdapter {
  constructor(
    @InjectModel(TokenModel) private model: mongoose.Model<TokenModel>,
  ) {}

  async save(data: Omit<TokenDTO, 'blackListed'>) {
    try {
      await this.model.create(data);

      return true;
    } catch (e) {
      console.log(e);

      return null;
    }
  }

  async findByQuery(query: Partial<TokenDTO>) {
    const token = await this.model.findOne(query).lean().exec();

    if (!token) return null;

    return true;
  }

  async deleteAll() {
    try {
      await this.model.deleteMany({});

      return true;
    } catch (e) {
      return null;
    }
  }
}
