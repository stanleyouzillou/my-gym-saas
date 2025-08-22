import { Controller, Get } from '@nestjs/common';

@Controller('sessions')
export class SessionsController {
  @Get()
  list() {
    return [
      {
        id: 'sess_1',
        programId: 'prog_1',
        startsAt: new Date(Date.now() + 3600_000).toISOString(),
        durationMin: 60,
        capacity: 12,
        instructor: 'Alex',
      },
    ];
  }
}
