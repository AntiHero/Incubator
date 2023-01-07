import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { SecurityDeviceModel } from '../schemas/security-device.schema';
import { convertToSecurityDeviceDTO } from '../utils/convertToSecurityDeviceDTO';

@Injectable()
export class SecurityDevicesAdapter {
  constructor(
    @InjectModel(SecurityDeviceModel)
    private readonly model: ModelType<SecurityDeviceModel>,
  ) {}

  async getAll() {
    const docs = await this.model.find({}).lean();

    return docs.map(convertToSecurityDeviceDTO);
  }

  async create(inputData: any) {
    try {
      const doc = await this.model.create(inputData);
      return convertToSecurityDeviceDTO(doc);
    } catch (e) {
      console.log(e);

      return null;
    }
  }

  async findById(id: string) {
    const doc = await this.model.findById(id).lean().exec();

    if (!doc) return null;

    return convertToSecurityDeviceDTO(doc);
  }

  async deleteAll() {
    await this.model.deleteMany({}).exec();
  }

  async findOneByQuery(query: Record<string, any>) {
    const doc = await this.model.findOne(query).lean().exec();

    if (!doc) return null;

    return convertToSecurityDeviceDTO(doc);
  }

  async findAllByQuery(query: Record<string, any>) {
    const docs = await this.model.find(query).lean().exec();

    return docs.map(convertToSecurityDeviceDTO);
  }

  async deleteById(id: string) {
    const result = await this.model.findByIdAndDelete(id).exec();

    if (result) return true;

    return null;
  }

  async deleteOneByQuery(query: Record<string, any>) {
    const result = await this.model.deleteOne(query).exec();

    if (result.deletedCount === 1) return true;

    return null;
  }

  async updateOne(filter: Record<string, any>, update: Record<string, any>) {
    const result = await this.model
      .findOneAndUpdate(
        filter,
        {
          $set: update,
        },
        { new: true },
      )
      .exec();

    return result;
  }

  async deleteAllButOne(query: { userId: string; deviceId: string }) {
    await this.model.deleteMany({
      userId: new Types.ObjectId(query.userId),
      deviceId: { $nin: [query.deviceId] },
    });
  }
}
