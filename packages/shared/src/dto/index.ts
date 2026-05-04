export * from './cancha.dto';
export * from './pagination.dto';

export class CreateUserDto {
  email!: string;
  name!: string;
  password!: string;
}
