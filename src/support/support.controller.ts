import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { SupportService } from './support.service';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('create')
  async createTicket(
    @Body('userId') userId: string,
    @Body('subject') subject: string,
    @Body('message') message: string,
  ) {
    try {
      const ticket = await this.supportService.createTicket(userId, subject, message);
      return { statusCode: 201, message: 'Support ticket created successfully', data: ticket };
    } catch (error) {
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Get('user/:userId')
  async getUserTickets(@Param('userId') userId: string) {
    try {
      const tickets = await this.supportService.getUserTickets(userId);
      return { statusCode: 200, message: 'User tickets fetched successfully', data: tickets };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Tickets not found' };
    }
  }

  @Post('respond/:id')
  async respondToTicket(
    @Param('id') id: string,
    @Body('response') response: string,
  ) {
    try {
      const ticket = await this.supportService.respondToTicket(id, response);
      return { statusCode: 200, message: 'Response added to ticket', data: ticket };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Ticket not found' };
    }
  }
}
