import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePostDto } from './dto/create-post.dto.js';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    categorySlug?: string;
    sort?: 'asc' | 'desc';
  }) {
    const page = query.page || 1;
    const limit = query.limit || 9;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { short_description: { contains: query.search } },
      ];
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.categorySlug) {
      where.tbl_post_category = {
        slug: query.categorySlug,
      };
    }

    const [posts, total] = await Promise.all([
      this.prisma.tbl_post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: query.sort || 'desc' },
        include: {
          tbl_post_category: true,
        },
      }),
      this.prisma.tbl_post.count({ where }),
    ]);

    return {
      data: posts.map((post) => this.formatPost(post)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.tbl_post.findUnique({
      where: { slug },
      include: {
        tbl_post_category: true,
        tbl_post_gallery: true,
      },
    });

    if (!post) throw new NotFoundException('Post not found');

    // Increment views
    await this.prisma.tbl_post.update({
      where: { slug },
      data: { views: (post.views || 0) + 1 },
    });

    return this.formatPost(post);
  }

  async findFeatured() {
    const posts = await this.prisma.tbl_post.findMany({
      where: { active_on_home: true },
      take: 6,
      orderBy: { created_at: 'desc' },
      include: { tbl_post_category: true },
    });

    return posts.map((post) => this.formatPost(post));
  }

  async getCategories() {
    return this.prisma.tbl_post_category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(dto: CreatePostDto, userEmail: string) {
    const slug = dto.slug || this.generateSlug(dto.title);

    const post = await this.prisma.tbl_post.create({
      data: {
        title: dto.title,
        slug,
        short_description: dto.short_description,
        html_desc: dto.html_desc,
        thumbnail: dto.thumbnail,
        type: dto.type || 'news',
        podcast_url: dto.podcast_url,
        article_link: dto.article_link,
        news_website_name: dto.news_website_name,
        event_date: dto.event_date ? new Date(dto.event_date) : null,
        active_on_home: dto.active_on_home ?? false,
        post_category_id: dto.post_category_id ? BigInt(dto.post_category_id) : null,
        views: 0,
        likes: 0,
        created_at: new Date(),
        created_by: userEmail,
      },
      include: { tbl_post_category: true },
    });

    return this.formatPost(post);
  }

  async update(id: number, dto: CreatePostDto, userEmail: string) {
    const existing = await this.prisma.tbl_post.findUnique({ where: { id: BigInt(id) } });
    if (!existing) throw new NotFoundException('Post not found');

    const post = await this.prisma.tbl_post.update({
      where: { id: BigInt(id) },
      data: {
        title: dto.title,
        slug: dto.slug,
        short_description: dto.short_description,
        html_desc: dto.html_desc,
        thumbnail: dto.thumbnail,
        type: dto.type,
        podcast_url: dto.podcast_url,
        article_link: dto.article_link,
        news_website_name: dto.news_website_name,
        event_date: dto.event_date ? new Date(dto.event_date) : undefined,
        active_on_home: dto.active_on_home,
        post_category_id: dto.post_category_id ? BigInt(dto.post_category_id) : undefined,
        modified_at: new Date(),
        modified_by: userEmail,
      },
      include: { tbl_post_category: true },
    });

    return this.formatPost(post);
  }

  async remove(id: number) {
    const existing = await this.prisma.tbl_post.findUnique({ where: { id: BigInt(id) } });
    if (!existing) throw new NotFoundException('Post not found');

    await this.prisma.tbl_post_gallery.deleteMany({ where: { post_id: BigInt(id) } });
    await this.prisma.tbl_post.delete({ where: { id: BigInt(id) } });

    return { message: 'Post deleted successfully' };
  }

  async likePost(id: number) {
    const post = await this.prisma.tbl_post.findUnique({ where: { id: BigInt(id) } });
    if (!post) throw new NotFoundException('Post not found');

    await this.prisma.tbl_post.update({
      where: { id: BigInt(id) },
      data: { likes: (post.likes || 0) + 1 },
    });

    return { likes: (post.likes || 0) + 1 };
  }

  private formatPost(post: any) {
    return {
      id: Number(post.id),
      title: post.title,
      slug: post.slug,
      short_description: post.short_description,
      thumbnail: post.thumbnail,
      html_desc: post.html_desc,
      type: post.type,
      podcast_url: post.podcast_url,
      article_link: post.article_link,
      news_website_name: post.news_website_name,
      event_date: post.event_date,
      active_on_home: !!post.active_on_home,
      likes: post.likes || 0,
      views: post.views || 0,
      created_at: post.created_at,
      category: post.tbl_post_category
        ? {
            id: Number(post.tbl_post_category.id),
            name: post.tbl_post_category.name,
            slug: post.tbl_post_category.slug,
          }
        : null,
      gallery: (post.tbl_post_gallery || []).map((g: any) => ({
        id: Number(g.id),
        url: g.url,
      })),
    };
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}
