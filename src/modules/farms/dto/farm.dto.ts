import { Exclude, Expose, Transform } from "class-transformer";
import { Farm } from "../entities/farm.entity";
import { User } from "modules/users/entities/user.entity";
import { Point } from "helpers/utils.interfaces";
import { DistanceMatrix } from "services/distancematrix.service";

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

  @Expose()
  public drivingDistance?: number;

  @Transform(({ value }) => (value as Date).toISOString())
  @Expose()
  public createdAt: Date;

  public static async createFromEntity(farm: Farm | null, userCoordinates?: Point): Promise<FarmDto | null> {
    if (farm === null) {
      return null;
    }

    let drivingDistance: number | undefined | null;
    let farmCoordinates: Point | undefined;
    if (userCoordinates !== undefined && userCoordinates !== null && farm.coordinates !== undefined) {
      farmCoordinates = <Point>(<unknown>farm?.coordinates);
      const distanceMatrixService = new DistanceMatrix();
      drivingDistance = await distanceMatrixService.calculateDrivingDistance(userCoordinates, farmCoordinates);
    }

    return new FarmDto({ ...farm, drivingDistance: drivingDistance || undefined, owner: farm.user.email });
  }
}
