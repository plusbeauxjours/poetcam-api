import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase.guard';
import { PoemService } from './poem.service';
import { Request } from 'express';

@Controller('poems')
@UseGuards(SupabaseAuthGuard)
export class PoemController {
  constructor(private readonly poemService: PoemService) {}

  @Post('generate')
  async generate(@Body('image') image: string) {
    const poem = await this.poemService.generatePoem(image);
    return { poem };
  }

  @Post()
  async create(
    @Req() req: Request,
    @Body('imageUrl') imageUrl: string,
    @Body('content') content: string,
  ) {
    const user: any = req['user'];
    const saved = await this.poemService.createPoem(
      user.sub,
      imageUrl,
      content,
      user.user_metadata?.is_premium,
    );
    return saved;
  }

  @Get()
  async list(@Req() req: Request) {
    const user: any = req['user'];
    return this.poemService.findUserPoems(user.sub);
  }
}
