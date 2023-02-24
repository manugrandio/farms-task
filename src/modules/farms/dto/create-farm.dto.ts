import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateFarmDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public address?: string;

  @IsString()
  public coordinates?: string;

  @IsNumber()
  public size?: number;

  @IsNumber()
  public cropYield?: number;
}
