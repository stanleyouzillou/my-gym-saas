import { Controller, Get } from '@nestjs/common';
import { getEventStore } from '../../infrastructure/compose';

@Controller('_debug')
export class SchedulingDebugEventsController {
  @Get('events')
  list() {
    return getEventStore().all();
  }
}
