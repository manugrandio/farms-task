import { Expose } from "class-transformer";

export class CoordinatesDto {
  constructor(coordinates: CoordinatesDto) {
    Object.assign(this, coordinates);
  }

  @Expose()
  public latitude: number;

  @Expose()
  public longitude: number;

  public static createFromPayload(responsePayload: object): CoordinatesDto {
    const latitude = responsePayload.result[0].geometry.location.lat as number;
    const longitude = responsePayload.result[0].geometry.location.lng as number;
    return new CoordinatesDto({ latitude, longitude });
  }
}
