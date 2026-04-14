import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ApplyDto } from './dto/apply.dto.js';

@Injectable()
export class ApplicationService {
  constructor(private prisma: PrismaService) {}

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
    }

    // Create application profile
    const application = await this.prisma.tbl_application_profile.create({
      data: {
        candidate_id: candidate.id,
        job_category_id: BigInt(dto.job_category_id),
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
}
