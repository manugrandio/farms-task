import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Farm } from "../../farms/entities/farm.entity"

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;

  @IsString()
  public address?: string;

  @IsString()
  public coordinates?: string;

  @IsArray()
  public farms?: Farm[];
}
