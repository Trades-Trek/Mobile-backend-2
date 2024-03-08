import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export class PaginationDto {
    page: number;
    limit: number;
}



export const PaginationParams = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const response = new PaginationDto();
        response.limit = Number(request.query.limit)
            ? Number(request.query.limit) > 100
                ? 100
                : Number(request.query.limit)
            : 25;
        response.page = Number(request.query.page) || 1;
        return response;
    },
);
