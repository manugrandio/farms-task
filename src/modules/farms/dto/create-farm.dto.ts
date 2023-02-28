import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { User } from "../../users/entities/user.entity";

export class CreateFarmDto {
  @IsString()
  @IsNotEmpty()
  public user: User;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  public address?: string;

  @IsNumber()
  public size?: number;

  @IsNumber()
  public cropYield?: number;
}
