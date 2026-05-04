export class PaginationQueryDto {
  page?: number = 1;
  limit?: number = 10;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class FilterCanchasDto extends PaginationQueryDto {
  tenantId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export class FilterReservationsDto extends PaginationQueryDto {
  canchaId?: string;
  userId?: string;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  dateFrom?: Date;
  dateTo?: Date;
}
