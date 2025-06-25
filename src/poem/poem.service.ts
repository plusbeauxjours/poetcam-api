import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poem } from './poem.entity';
import { ClaudeService } from '../services/claude.service';

@Injectable()
export class PoemService {
  constructor(
    @InjectRepository(Poem)
    private readonly poems: Repository<Poem>,
    private readonly claude: ClaudeService,
  ) {}

  async generatePoem(image: string): Promise<string> {
    return this.claude.generatePoemFromImage(image);
  }

  async createPoem(userId: string, imageUrl: string, content: string, isPremium: boolean): Promise<Poem> {
    if (!isPremium) {
      const count = await this.poems.count({ where: { user_id: userId } });
      if (count >= 3) {
        throw new ForbiddenException('Free users can store up to 3 poems.');
      }
    }
    const poem = this.poems.create({ user_id: userId, image_url: imageUrl, content });
    return this.poems.save(poem);
  }

  findUserPoems(userId: string) {
    return this.poems.find({ where: { user_id: userId }, order: { created_at: 'DESC' } });
  }
}
