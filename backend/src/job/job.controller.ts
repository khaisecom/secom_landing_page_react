import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CreateJobDto } from './dto/create-job.dto.js';
import { JobService } from './job.service.js';

@Controller('jobs')
export class JobController {
  constructor(private jobService: JobService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('departments') departments?: string,
    @Query('workForms') workForms?: string,
  ) {
    return this.jobService.findAll({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      search: search || '',
      departments: departments ? departments.split(',') : [],
      workForms: workForms ? workForms.split(',') : [],
    });
  }

  @Get('attributes')
  getAttributes() {
    return this.jobService.getAttributes();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobService.findOne(parseInt(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateJobDto, @Request() req: any) {
    return this.jobService.create(dto, req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: CreateJobDto, @Request() req: any) {
    return this.jobService.update(parseInt(id), dto, req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobService.remove(parseInt(id));
  }
}
