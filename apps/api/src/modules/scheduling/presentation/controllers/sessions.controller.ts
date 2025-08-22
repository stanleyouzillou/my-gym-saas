import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  BadRequestException,
  Param,
  Req,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { CreateSessionInput } from '../../application/dto/CreateSessionInput';
import { CreateSessionDto } from '../validation/createSession.dto';
import { ListSessionsQueryDto } from '../validation/listSessions.query.dto';
import {
  CreateSessionUseCaseToken,
  ListSessionsUseCaseToken,
  RegisterForSessionUseCaseToken,
} from '../../application/tokens';
import { ListSessionsUseCase } from '../../application/use_cases/listSessions';
import { CreateSessionUseCase } from '../../application/use_cases/createSession';
import { RegisterForSessionUseCase } from '../../application/use_cases/registerForSession';
import { ClerkAuthGuard } from '../../../../shared/presentation/guards/clerkAuth.guard';
import { IMemberRepository } from '../../../memberships/application/ports/MemberRepo';
import { IMemberRepositoryToken } from '../../../memberships/application/tokens';
import { Email } from '../../../memberships/domain/value_objects/Email';

@Controller('sessions')
export class SchedulingSessionsController {
  constructor(
    @Inject(ListSessionsUseCaseToken)
    private readonly listSessionsUc: ListSessionsUseCase,
    @Inject(CreateSessionUseCaseToken)
    private readonly createSessionUc: CreateSessionUseCase,
    @Inject(RegisterForSessionUseCaseToken)
    private readonly registerForSessionUc: RegisterForSessionUseCase,
    @Inject(IMemberRepositoryToken)
    private readonly members: any,
  ) {}

  @Get()
  async list(@Query() q: ListSessionsQueryDto) {
    const params = {
      programId: q.programId,
      from: q.from ? new Date(q.from) : undefined,
      to: q.to ? new Date(q.to) : undefined,
    };
    const sessions = await this.listSessionsUc.execute(params);
    return sessions.map((s) => ({
      id: s.id,
      programId: s.programId,
      startTime: s.startTime.toISOString(),
      durationMinutes: s.durationMinutes,
      maxCapacity: s.maxCapacity,
      coachName: s.coachName ?? null,
    }));
  }

  @Post()
  async create(@Body() body: CreateSessionDto) {
    const input: CreateSessionInput = {
      programId: body.programId,
      startTime: body.startTime,
      durationMinutes: body.durationMinutes,
      maxCapacity: body.maxCapacity,
      coachName: body.coachName,
    };
    const result = await this.createSessionUc.execute(input);
    if (!result.ok) {
      const message =
        result.error.kind === 'MissingProgramId'
          ? 'programId is required'
          : result.error.kind === 'InvalidDuration'
            ? 'durationMinutes must be >= 1'
            : result.error.kind === 'InvalidCapacity'
              ? 'maxCapacity must be >= 1'
              : 'startTime must be ISO date';
      throw new BadRequestException(message);
    }
    const created = result.value;
    return {
      id: created.id,
      programId: created.programId,
      startTime: created.startTime.toISOString(),
      durationMinutes: created.durationMinutes,
      maxCapacity: created.maxCapacity,
      coachName: created.coachName ?? null,
    };
  }

  @Post(':id/register')
  @UseGuards(ClerkAuthGuard)
  async register(@Param('id') id: string, @Req() req: any) {
    // Resolve current member: prefer Clerk identity (email), fallback to header in dev
    let memberId = '';
    const emailFromReq: string | undefined = req.user?.email;
    if (emailFromReq) {
      const email = Email.create(emailFromReq);
      const found = await this.members.findByEmail(email);
      if (!found) {
        throw new BadRequestException('Member not found for authenticated user');
      }
      memberId = found.id;
    } else {
      memberId = (req.headers['x-member-id'] as string) || '';
    }
    if (!memberId) throw new BadRequestException('Missing member identity');
    const result = await this.registerForSessionUc.execute(memberId, id);
    if (result.ok) {
      const value = result.value;
      if (value.kind === 'BOOKED') {
        return { status: 'BOOKED', bookingId: value.booking.id.value };
      }
      return { status: 'WAITLISTED', position: value.entry.position };
    }
    const kind = result.error.kind;
    if (kind === 'SessionNotFound') throw new BadRequestException('Session not found');
    if (kind === 'AlreadyRegistered') throw new BadRequestException('Already registered');
    throw new BadRequestException('Unable to register');
  }
}
