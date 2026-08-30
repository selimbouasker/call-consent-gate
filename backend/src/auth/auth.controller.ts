import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppPasswordGuard } from './app-password.guard';

@UseGuards(AppPasswordGuard)
@Controller('auth')
export class AuthController {
  @Get('verify')
  verify() {
    return { ok: true };
  }
}
