export class CreateCanchaDto {
  tenantId!: string;
  name!: string;
  description?: string;
  pricePerHour!: number;
  image?: string; // Base64
}

export class UpdateCanchaDto {
  name?: string;
  description?: string;
  pricePerHour?: number;
  image?: string;
}
