import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { randomUUID } from 'crypto';

class FakeSignupDto {
  email!: string;
  firstName!: string;
  lastName!: string;
  phone?: string;
  tenantName?: string;
}

@Controller('signup')
export class FakeSignupController {
  private static activated = new Set<string>();
  // MVP: no persistence; return a fake auth token containing memberId
  @Post('fake-checkout')
  @HttpCode(200)
  async fakeCheckout(@Body() body: any) {
    const memberId = randomUUID();
    const token = `fake.${memberId}`;
    return {
      ok: true,
      memberId,
      token,
      // send the UI to a hosted-like payment step (mocked)
      redirect: `/signup/payment?memberId=${memberId}`,
    };
  }

  // Mock payment endpoint: activates the member as if Stripe webhook confirmed
  @Post('mock-pay')
  @HttpCode(200)
  async mockPay(@Body() body: { memberId: string }) {
    const memberId = body?.memberId ?? randomUUID();
    FakeSignupController.activated.add(memberId);
    return { ok: true, memberId, status: 'ACTIVE' };
  }

  // Optional: query membership status (optimistic UI → final state)
  @Post('status')
  @HttpCode(200)
  async status(@Body() body: { memberId: string }) {
    const memberId = body?.memberId;
    const active = !!memberId && FakeSignupController.activated.has(memberId);
    return { ok: true, memberId, status: active ? 'ACTIVE' : 'PENDING' };
  }
}
