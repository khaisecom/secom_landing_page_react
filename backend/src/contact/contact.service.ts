import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateContactDto } from './dto/create-contact.dto.js';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateContactDto) {
    const contact = await this.prisma.tbl_contact.create({
      data: {
        customer_name: dto.customer_name,
        email: dto.email,
        contact_method: dto.contact_method,
        message: dto.message,
        status: 'NEW',
        is_completed: false,
        created_at: new Date(),
      },
    });

    return {
      id: Number(contact.id),
      message: 'Gửi liên hệ thành công',
    };
  }

  async findAll(query: { page?: number; limit?: number; search?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.search) {
      where.OR = [
        { customer_name: { contains: query.search } },
        { email: { contains: query.search } },
        { contact_method: { contains: query.search } },
      ];
    }

    const [contacts, total] = await Promise.all([
      this.prisma.tbl_contact.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.tbl_contact.count({ where }),
    ]);

    return {
      data: contacts.map((c) => ({
        id: Number(c.id),
        customer_name: c.customer_name,
        email: c.email,
        contact_method: c.contact_method,
        message: c.message,
        status: c.status,
        is_completed: !!c.is_completed,
        created_at: c.created_at,
      })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
