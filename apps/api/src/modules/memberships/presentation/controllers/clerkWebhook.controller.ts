import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ClerkWebhookVerifierToken,
  SyncUserUseCaseToken,
} from '../../application/tokens';
import { SyncUserUseCase } from '../../application/use_cases/syncUser';
import type { Request } from 'express';
import type { IWebhookVerifier } from '../../application/ports/WebhookVerifier';

// Minimal Clerk webhook payload shape we care about
// Adjust as needed to match actual Clerk events
interface ClerkUserEventPayload {
  data?: {
    email_addresses?: { email_address: string }[];
    first_name?: string;
    last_name?: string;
    public_metadata?: Record<string, any>;
    id?: string;
    phone_numbers?: { phone_number: string }[];
  };
  // For manual sync endpoint we accept a simpler body as well
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  tenantName?: string;
  clerkUserId?: string;
  phone?: string;
  status?: 'PENDING' | 'ACTIVE';
}

@Controller()
export class ClerkWebhookController {
  constructor(
    @Inject(SyncUserUseCaseToken) private readonly syncUser: SyncUserUseCase,
    @Inject(ClerkWebhookVerifierToken)
    private readonly verifier: IWebhookVerifier,
  ) {}

  @Post('/webhooks/clerk')
  @HttpCode(200)
  async handleClerkWebhook(@Req() req: Request) {
    const rawBody = req.body; // Buffer when raw body parsing is enabled
    const ok = await this.verifier.verify(rawBody, req.headers as any);
    if (!ok) throw new UnauthorizedException('Invalid webhook signature');

    const body = JSON.parse(rawBody.toString()) as ClerkUserEventPayload;
    const email =
      body.data?.email_addresses?.[0]?.email_address || body.email || '';
    const firstName = body.data?.first_name ?? body.firstName;
    const lastName = body.data?.last_name ?? body.lastName;
    const role = (body.data?.public_metadata?.role ?? body.role ?? 'member') as
      | 'member'
      | 'franchise_admin'
      | 'coach';
    const tenantName = (body.data?.public_metadata?.tenantName ?? body.tenantName ?? 'DefaultFranchise') as string;
    const clerkUserId = (body.data?.id ?? body.clerkUserId) as string | undefined;
    const phone = (body.data?.phone_numbers?.[0]?.phone_number ?? body.phone) as string | undefined;
    const status = (body.data?.public_metadata?.status ?? body.status) as 'PENDING' | 'ACTIVE' | undefined;

    const result = await this.syncUser.execute({
      email,
      firstName,
      lastName,
      role,
      tenantName,
      clerkUserId,
      phone,
      status,
    });
    return result;
  }

  // Convenience endpoint to trigger sync without webhook signature
  @Post('/memberships/sync-user')
  @HttpCode(200)
  async manualSync(@Body() body: ClerkUserEventPayload) {
    const email = body.email || '';
    const role = (body.role || 'member') as
      | 'member'
      | 'franchise_admin'
      | 'coach';
    const tenantName = body.tenantName || 'DefaultFranchise';
    const result = await this.syncUser.execute({
      email,
      firstName: body.firstName,
      lastName: body.lastName,
      role,
      tenantName,
      clerkUserId: body.clerkUserId,
      phone: body.phone,
      status: body.status,
    });
    return result;
  }
}
