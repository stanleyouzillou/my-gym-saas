import { Injectable } from '@nestjs/common';
import { IWebhookVerifier } from '../../application/ports/WebhookVerifier';
import { Webhook } from 'svix';

@Injectable()
export class SvixWebhookVerifier implements IWebhookVerifier {
  private readonly webhook: Webhook;

  constructor() {
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) {
      // In non-prod environments we may run without this; controller should handle missing secret with 501/400 as needed.
      this.webhook = null as any;
    } else {
      this.webhook = new Webhook(secret);
    }
  }

  async verify(
    payload: Buffer | string,
    headers: Record<string, string | string[] | undefined>,
  ): Promise<boolean> {
    if (!this.webhook) return false;
    try {
      // Svix expects the signature headers as provided by Clerk
      // Typically: 'svix-id', 'svix-timestamp', 'svix-signature'
      this.webhook.verify(payload, {
        'svix-id': String(headers['svix-id'] ?? ''),
        'svix-timestamp': String(headers['svix-timestamp'] ?? ''),
        'svix-signature': String(headers['svix-signature'] ?? ''),
      });
      return true;
    } catch {
      return false;
    }
  }
}
