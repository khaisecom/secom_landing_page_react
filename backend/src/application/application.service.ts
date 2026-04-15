import { Injectable, NotFoundException } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { PrismaService } from '../prisma/prisma.service.js';
import { ApplyDto } from './dto/apply.dto.js';

@Injectable()
export class ApplicationService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { page?: number; limit?: number; search?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.search) {
      where.tbl_candidate = {
        OR: [
          { full_name: { contains: query.search } },
          { email: { contains: query.search } },
          { phone_number: { contains: query.search } },
        ],
      };
    }

    const [applications, total] = await Promise.all([
      this.prisma.tbl_application_profile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'desc' },
        include: {
          tbl_candidate: true,
          tbl_job_category: true,
        },
      }),
      this.prisma.tbl_application_profile.count({ where }),
    ]);

    return {
      data: applications.map((app) => ({
        id: Number(app.id),
        full_name: app.tbl_candidate?.full_name || '',
        email: app.tbl_candidate?.email || '',
        phone_number: app.tbl_candidate?.phone_number || '',
        job_category: app.tbl_job_category?.name || '',
        location: app.location,
        cv_url: app.cv_url,
        application_date: app.application_date,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async apply(dto: ApplyDto, cvUrl?: string) {
    // Find or create candidate
    let candidate = await this.prisma.tbl_candidate.findFirst({
      where: { email: dto.email },
    });

    if (!candidate) {
      candidate = await this.prisma.tbl_candidate.create({
        data: {
          full_name: dto.full_name,
          email: dto.email,
          phone_number: dto.phone_number,
          is_saved: false,
          created_at: new Date(),
          created_by: dto.email,
        },
      });
    } else {
      candidate = await this.prisma.tbl_candidate.update({
        where: { id: candidate.id },
        data: {
          full_name: dto.full_name,
          phone_number: dto.phone_number,
          modified_at: new Date(),
        },
      });
    }

    // Create application profile
    // Validate job_category_id exists if provided
    let categoryId: bigint | null = null;
    if (dto.job_category_id) {
      const category = await this.prisma.tbl_job_category.findUnique({
        where: { id: BigInt(dto.job_category_id) },
      });
      if (category) categoryId = category.id;
    }

    const application = await this.prisma.tbl_application_profile.create({
      data: {
        candidate_id: candidate.id,
        job_category_id: categoryId,
        location: dto.location,
        cv_url: cvUrl,
        application_date: new Date(),
      },
    });

    return {
      id: Number(application.id),
      message: 'Application submitted successfully',
    };
  }

  async remove(id: number) {
    const app = await this.prisma.tbl_application_profile.findUnique({
      where: { id: BigInt(id) },
    });
    if (!app) throw new NotFoundException('Application not found');

    // Delete CV file if exists
    if (app.cv_url) {
      try {
        const filePath = join(process.cwd(), app.cv_url.replace(/^\//, ''));
        await unlink(filePath);
      } catch {}
    }

    await this.prisma.tbl_application_profile.delete({
      where: { id: BigInt(id) },
    });

    return { message: 'Application deleted successfully' };
  }
}
