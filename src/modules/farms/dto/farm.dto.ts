import { Exclude, Expose } from "class-transformer";
import { Farm } from "../entities/farm.entity";
import { User } from "modules/users/entities/user.entity";

export class FarmDto {
  constructor(partial?: Partial<FarmDto>) {
    Object.assign(this, partial);
  }

  @Exclude()
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public owner: string;

  @Expose()
  public address?: string;

  @Exclude()
  public coordinates?: string;

  @Exclude()
  public user: User;

  @Expose()
  public size?: number;

  @Expose()
  public cropYield?: number;

  public static createFromEntity(farm: Farm | null): FarmDto | null {
    if (!farm) {
      return null;
    }

    return new FarmDto({ ...farm, owner: farm.user.email });
  }
}
