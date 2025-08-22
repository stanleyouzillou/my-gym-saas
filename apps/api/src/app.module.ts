import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SchedulingSessionsController } from './modules/scheduling/presentation/controllers/sessions.controller';
import { SchedulingDebugEventsController } from './modules/scheduling/presentation/controllers/events.debug.controller';
import { MembershipsModule } from './modules/memberships/infrastructure/module';
import { SchedulingModule } from './modules/scheduling/infrastructure/module';

@Module({
  imports: [MembershipsModule, SchedulingModule],
  controllers: [
    AppController,
    SchedulingSessionsController,
    SchedulingDebugEventsController,
  ],
  providers: [AppService],
})
export class AppModule {}
