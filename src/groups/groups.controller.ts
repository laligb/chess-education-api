import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './groups.dto';
import { Group } from './groups.schema';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  async create(@Body() groupDto: CreateGroupDto): Promise<Group> {
    return this.groupsService.create(groupDto);
  }

  @Get()
  async findAll(): Promise<Group[]> {
    return this.groupsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Group | null> {
    return this.groupsService.findOne(id);
  }
}
