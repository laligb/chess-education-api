import { Injectable, NotFoundException } from '@nestjs/common';
import { Group } from './groups.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateGroupDto } from './groups.dto';

@Injectable()
export class GroupsService {
  constructor(@InjectModel(Group.name) private groupModel: Model<Group>) {}

  async create(groupDto: CreateGroupDto): Promise<Group> {
    const group = new this.groupModel(groupDto);
    return group.save();
  }

  async findAll(): Promise<Group[]> {
    return this.groupModel.find().exec();
  }

  async findOne(id: string): Promise<Group | null> {
    return this.groupModel.findById(id).exec();
  }

  // async joinGroup(groupId: string, professorId: string): Promise<Group> {
  //   const group = await this.groupModel.findById(groupId);
  //   if (!group) {
  //     throw new NotFoundException('Group not found');
  //   }

  //   if (!group.professors){}
  // }
}
