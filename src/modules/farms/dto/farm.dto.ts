import { Expose, Transform } from "class-transformer";
import { Farm } from "../entities/farm.entity";
import { User } from "../../users/entities/user.entity";

export class FarmDto {
  constructor(partial?: Partial<FarmDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  public readonly id: string;

  @Expose()
  public name: string;

  @Expose()
  public address?: string;

  @Expose()
  public coordinates?: string;

  @Expose()
  public size?: number;

  @Expose()
  public cropYield?: number;

  @Transform(({ value }) => (value as User).id)
  @Expose()
  public user: User;

  public static createFromEntity(farm: Farm | null): FarmDto | null {
    if (!farm) {
      return null;
    }

    return new FarmDto({ ...farm });
  }
}
