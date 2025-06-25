import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase.guard';
import { UserService } from './user.service';
import { Request } from 'express';

@Controller('user')
@UseGuards(SupabaseAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async profile(@Req() req: Request) {
    const user: any = req['user'];
    const data = await this.userService.findById(user.sub);
    return data;
  }
}
