import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateJobDto } from './dto/create-job.dto.js';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    departments?: string[];
    workForms?: string[];
  }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { is_active: true };

    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { title_en: { contains: query.search } },
      ];
    }

    const attributeFilters = [
      ...(query.departments || []),
      ...(query.workForms || []),
    ];

    if (attributeFilters.length > 0) {
      where.tbl_job_attribute_mapping = {
        some: {
          tbl_job_attribute: {
            search_key: { in: attributeFilters },
          },
        },
      };
    }

    const [jobs, total] = await Promise.all([
      this.prisma.tbl_job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          tbl_job_attribute_mapping: {
            include: { tbl_job_attribute: true },
          },
        },
      }),
      this.prisma.tbl_job.count({ where }),
    ]);

    return {
      data: jobs.map((job) => this.formatJob(job)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const job = await this.prisma.tbl_job.findUnique({
      where: { id: BigInt(id) },
      include: {
        tbl_job_attribute_mapping: {
          include: { tbl_job_attribute: true },
        },
      },
    });

    if (!job) throw new NotFoundException('Job not found');
    return this.formatJob(job);
  }

  async create(dto: CreateJobDto, userEmail: string) {
    const job = await this.prisma.tbl_job.create({
      data: {
        title: dto.title,
        title_en: dto.title_en,
        description: dto.description,
        description_en: dto.description_en,
        vacancies: dto.vacancies,
        locations: dto.locations,
        deadline: dto.deadline ? new Date(dto.deadline) : null,
        from_salary: dto.from_salary ?? 0,
        to_salary: dto.to_salary ?? 0,
        is_negotiable: dto.is_negotiable ? 1 : 0,
        is_active: dto.is_active ?? true,
        created_at: new Date(),
        created_by: userEmail,
        tbl_job_attribute_mapping: dto.attribute_ids?.length
          ? {
              createMany: {
                data: dto.attribute_ids.map((id) => ({ attribute_id: BigInt(id) })),
              },
            }
          : undefined,
      },
      include: {
        tbl_job_attribute_mapping: {
          include: { tbl_job_attribute: true },
        },
      },
    });

    return this.formatJob(job);
  }

  async update(id: number, dto: CreateJobDto, userEmail: string) {
    const existing = await this.prisma.tbl_job.findUnique({ where: { id: BigInt(id) } });
    if (!existing) throw new NotFoundException('Job not found');

    // Update attributes: delete old, create new
    if (dto.attribute_ids !== undefined) {
      await this.prisma.tbl_job_attribute_mapping.deleteMany({
        where: { job_id: BigInt(id) },
      });
    }

    const job = await this.prisma.tbl_job.update({
      where: { id: BigInt(id) },
      data: {
        title: dto.title,
        title_en: dto.title_en,
        description: dto.description,
        description_en: dto.description_en,
        vacancies: dto.vacancies,
        locations: dto.locations,
        deadline: dto.deadline ? new Date(dto.deadline) : undefined,
        from_salary: dto.from_salary,
        to_salary: dto.to_salary,
        is_negotiable: dto.is_negotiable !== undefined ? (dto.is_negotiable ? 1 : 0) : undefined,
        is_active: dto.is_active,
        modified_at: new Date(),
        modified_by: userEmail,
        tbl_job_attribute_mapping: dto.attribute_ids?.length
          ? {
              createMany: {
                data: dto.attribute_ids.map((aid) => ({ attribute_id: BigInt(aid) })),
              },
            }
          : undefined,
      },
      include: {
        tbl_job_attribute_mapping: {
          include: { tbl_job_attribute: true },
        },
      },
    });

    return this.formatJob(job);
  }

  async remove(id: number) {
    const existing = await this.prisma.tbl_job.findUnique({ where: { id: BigInt(id) } });
    if (!existing) throw new NotFoundException('Job not found');

    await this.prisma.tbl_job_attribute_mapping.deleteMany({ where: { job_id: BigInt(id) } });
    await this.prisma.tbl_job.delete({ where: { id: BigInt(id) } });

    return { message: 'Job deleted successfully' };
  }

  async getAttributes() {
    const attributes = await this.prisma.tbl_job_attribute.findMany({
      orderBy: [{ type: 'asc' }, { position: 'asc' }],
    });

    const grouped: Record<string, any[]> = {};
    for (const attr of attributes) {
      const type = attr.type || 'OTHER';
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push({
        id: Number(attr.id),
        name: attr.name,
        name_en: attr.name_en,
        search_key: attr.search_key,
      });
    }

    return grouped;
  }

  private formatJob(job: any) {
    return {
      id: Number(job.id),
      category_id: job.category_id ? Number(job.category_id) : null,
      title: job.title,
      title_en: job.title_en,
      description: job.description,
      description_en: job.description_en,
      created_at: job.created_at,
      vacancies: job.vacancies,
      locations: job.locations,
      deadline: job.deadline,
      from_salary: job.from_salary,
      to_salary: job.to_salary,
      is_negotiable: !!job.is_negotiable,
      is_active: !!job.is_active,
      attributes: (job.tbl_job_attribute_mapping || []).map((m: any) => ({
        id: Number(m.tbl_job_attribute.id),
        name: m.tbl_job_attribute.name,
        name_en: m.tbl_job_attribute.name_en,
        type: m.tbl_job_attribute.type,
        search_key: m.tbl_job_attribute.search_key,
      })),
    };
  }
}
