export interface IWebhookVerifier {
  verify(
    payload: Buffer | string,
    headers: Record<string, string | string[] | undefined>,
  ): Promise<boolean>;
}

export type WebhookVerificationResult =
  | { ok: true }
  | { ok: false; reason: string };
