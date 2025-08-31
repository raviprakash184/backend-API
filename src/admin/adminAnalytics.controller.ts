import { Controller, Get } from '@nestjs/common';
import { AdminAnalyticsService } from './adminAnalytics.service';

@Controller('admin/analytics')
export class AdminAnalyticsController {
  constructor(private readonly analyticsService: AdminAnalyticsService) {}

  @Get('orders')
  async getOrderStats() {
    try {
      const stats = await this.analyticsService.getOrderStats();
      return { statusCode: 200, message: 'Order stats fetched successfully', data: stats };
    } catch (error) {
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Get('revenue')
  async getRevenueStats() {
    try {
      const stats = await this.analyticsService.getRevenueStats();
      return { statusCode: 200, message: 'Revenue stats fetched successfully', data: stats };
    } catch (error) {
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Get('users')
  async getUserStats() {
    try {
      const stats = await this.analyticsService.getUserStats();
      return { statusCode: 200, message: 'User stats fetched successfully', data: stats };
    } catch (error) {
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Get('top-products')
  async getTopProducts() {
    try {
      const stats = await this.analyticsService.getTopProducts();
      return { statusCode: 200, message: 'Top products fetched successfully', data: stats };
    } catch (error) {
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Get('top-agents')
  async getAgentPerformance() {
    try {
      const stats = await this.analyticsService.getAgentPerformance();
      return { statusCode: 200, message: 'Agent performance fetched successfully', data: stats };
    } catch (error) {
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }
}
