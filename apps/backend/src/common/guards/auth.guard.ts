import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { prisma } from '@cancha/database';
import { ERROR_MESSAGES } from '../constants/messages.constant';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    let token = '';

    // 1. Check Bearer token (API clients)
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } 
    // 2. Check Cookie (Next.js Better Auth Client)
    else if (request.headers.cookie) {
      const cookies = request.headers.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.split('=').map((c: string) => c.trim());
        if (name === 'better-auth.session_token') {
          token = value;
          break;
        }
      }
    }

    if (!token) throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED);

    // Validate Better Auth session directly in PostgreSQL
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException(ERROR_MESSAGES.SESSION_EXPIRED);
    }

    // Inject the validated user into the request for Controllers
    request.user = session.user;
    return true;
  }
}

