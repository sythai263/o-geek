import { Injectable } from '@nestjs/common';

import { Order } from '../../common/constants/order';
import { paginationDefault } from '../../common/constants/pagination';
import {
    PaginationDto,
    PaginationRepoDto,
} from '../../modules/ogeek/infra/dtos/pagination.dto';

export interface SortDefault {
    [key: string]: Order;
}

@Injectable()
export class PaginationService {
    static pagination(
        query: PaginationDto,
        allowSortColumnArray: string[],
        sortDefault: SortDefault,
    ): PaginationRepoDto {
        let page = query.page;
        let limit = query.take;
        let orderBy = {};
        if (!query.sort) {
            orderBy = sortDefault;
        }

        if (query.sort) {
            const sortArray = query.sort.split(',');

            const filterSortArray = sortArray.filter((sort) =>
                allowSortColumnArray.find((allow) => allow === sort),
            );

            if (filterSortArray.length === 0) {
                orderBy = sortDefault;
            } else {
                let orderArray: string[] = [];
                if (query.order) {
                    orderArray = query.order.split(',');
                }

                filterSortArray.forEach((sort, index) => {
                    if (orderArray[index]) {
                        orderBy[sort] = orderArray[index].toUpperCase();
                        return;
                    }

                    orderBy[sort] = Order.DESC;
                });
            }
        }

        if (!page) {
            page = paginationDefault.PAGE_DEFAULT;
        }

        if (page) {
            page = query.page - 1;
        }

        if (!limit) {
            limit = paginationDefault.LIMIT_DEFAULT;
        }

        if (limit > paginationDefault.LIMIT_MAX) {
            limit = paginationDefault.LIMIT_MAX;
        }

        return {
            limit,
            page,
            order: orderBy,
        } as PaginationRepoDto;
    }
}
