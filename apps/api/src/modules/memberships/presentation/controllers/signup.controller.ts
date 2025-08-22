import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';
import { SyncUserUseCase } from '../../application/use_cases/syncUser';
import { SyncUserUseCaseToken } from '../../application/tokens';

class SignupDto {
  email!: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tenantName!: string;
}

@Controller('signup')
export class SignupController {
  constructor(
    @Inject(SyncUserUseCaseToken) private readonly syncUser: SyncUserUseCase,
  ) {}

  @Post()
  @HttpCode(200)
  async signup(@Body() body: SignupDto) {
    const result = await this.syncUser.execute({
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      tenantName: body.tenantName,
      role: 'member',
      status: 'PENDING',
    });
    return result;
  }
}
