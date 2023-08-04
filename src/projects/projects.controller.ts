import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { Role } from '@/common/enums/role.enum';
import { UseGuards } from '@nestjs/common';
import { Roles } from '@/common/decorators/roles.decorator';
import { RolesGuard } from '@/common/guards/roles.guard';
import { BuyProjectDto } from './dto/buy-project.dto';
@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.Provider, Role.Admin)
  async create(@Body() createProjectDto: CreateProjectDto, @GetUser() user) {
    const newProject = await this.projectsService.create(createProjectDto, user);
    return {
      success: true,
      message: 'Project created successfully',
      data: newProject,
    };
  }

  @Post('/buy')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.Provider, Role.Admin)
  async Buy(@GetUser() user,@Body() buyProjectDto: BuyProjectDto) {
    const newProject = await this.projectsService.buy(buyProjectDto, user);
    return {
      success: true,
      message: 'Buy Project successfully',
      data: newProject,
    };
  }

  @Get()
  async findAll() {
    const projects = await this.projectsService.findAll();
    return {
      success: true,
      message: 'Projects retrieved successfully',
      data: projects,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const project =  await this.projectsService.findOne(id);
    console.log(project);
    if(project == undefined){
      throw new Error('project not found');
    }else{
      return {
        success: true,
        message: 'Projects retrieved successfully',
        data: project,
      };
  }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.Provider, Role.Admin)
  async remove(@Param('id') id: string) {
    console.log(id);
    const projectRemoved =  await this.projectsService.remove(id);
    return {
      success: true,
      message: 'Ticket removed successfully',
      data: projectRemoved,
    };
  }
}
