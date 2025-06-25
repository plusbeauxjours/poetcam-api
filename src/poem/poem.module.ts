import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poem } from './poem.entity';
import { PoemService } from './poem.service';
import { PoemController } from './poem.controller';
import { ClaudeService } from '../services/claude.service';

@Module({
  imports: [TypeOrmModule.forFeature([Poem])],
  providers: [PoemService, ClaudeService],
  controllers: [PoemController],
})
export class PoemModule {}
