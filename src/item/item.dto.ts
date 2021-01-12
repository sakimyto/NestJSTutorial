import { IsNotEmpty, IsString, IsOptional } from 'class-validator'

export class CreateItemDTO {
  @IsNotEmpty()
  @IsString()
  todo: string

  @IsNotEmpty()
  @IsString()
  limit: string

  @IsNotEmpty()
  @IsString()
  deletePassword: string
}
// ↓追記！
export class UpdateItemDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  todo: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  limit: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  isDone: string
}

export class DeleteItemDTO {
  @IsString()
  @IsNotEmpty()
  deletePassword: string
}
