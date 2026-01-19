import {
  Controller,
  Get,
  Patch,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/updateSettings.dto';
import type { RequestWithUser } from '../auth/types';
import { JwtGuard } from 'src/common/guards/jwt.guard';
@Controller('settings')
@UseGuards(JwtGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}
  /**
   * GET /api/v1/settings
   * Get current user's settings
   */
  @Get()
  async getSettings(@Req() req: RequestWithUser) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    const settings = await this.settingsService.getSettings(userId);
    return {
      message: 'Settings fetched successfully',
      data: settings,
    };
  }
  /**
   * PATCH /api/v1/settings
   * Update user settings (partial update)
   */
  @Patch()
  @HttpCode(HttpStatus.OK)
  async updateSettings(
    @Req() req: RequestWithUser,
    @Body() updateSettingsDto: UpdateSettingsDto,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    const settings = await this.settingsService.updateSettings(
      userId,
      updateSettingsDto,
    );
    return {
      message: 'Settings updated successfully',
      data: settings,
    };
  }
}