import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { verifyToken } from '@clerk/clerk-sdk-node';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<any>();
    const auth = (req.headers['authorization'] as string) || '';
    const token = auth.startsWith('Bearer ') ? auth.substring('Bearer '.length) : '';

    // Allow bypass in dev if keys are missing (matches web middleware fallback)
    const hasClerkKeys = !!process.env.CLERK_SECRET_KEY && !!process.env.CLERK_PUBLISHABLE_KEY;
    if (!hasClerkKeys) {
      return true;
    }

    if (!token) throw new UnauthorizedException('Missing Bearer token');

    try {
      const claims = await verifyToken(token, {
        // Audience optional; include if you configure it on the frontend
        secretKey: process.env.CLERK_SECRET_KEY!,
      });
      // Attach minimal identity to request for controllers to use
      req.user = {
        sub: claims.sub,
        email: Array.isArray(claims.email) ? claims.email[0] : (claims.email as string | undefined),
        sid: (claims as any).sid,
      };
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid Clerk token');
    }
  }
}
