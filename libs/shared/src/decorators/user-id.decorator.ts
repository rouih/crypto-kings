import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { BadRequestException } from '../error-handling/src';

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const userId = request.headers['x-user-id'];

    if (!userId || typeof userId !== 'string') {
      throw new BadRequestException('Missing or invalid X-User-ID header');
    }

    return userId;
  },
);
