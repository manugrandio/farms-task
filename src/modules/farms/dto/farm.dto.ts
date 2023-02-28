import { Exclude, Expose } from "class-transformer";
import { Farm } from "../entities/farm.entity";

export class FarmDto {
  constructor(partial?: Partial<FarmDto>) {
    Object.assign(this, partial);
  }

  @Exclude()
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public address?: string;

  @Exclude()
  public coordinates?: string;

  @Expose()
  public size?: number;

  @Expose()
  public cropYield?: number;

  public static createFromEntity(farm: Farm | null): FarmDto | null {
    if (!farm) {
      return null;
    }

    return new FarmDto({ ...farm });
  }
}
