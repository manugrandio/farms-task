import { Expose } from "class-transformer";
import { CoordinatesPayload } from "./geocoding.interfaces";

export class CoordinatesDto {
  constructor(coordinates: CoordinatesDto) {
    Object.assign(this, coordinates);
  }

  @Expose()
  public latitude: number;

  @Expose()
  public longitude: number;

  public static createFromPayload(responsePayload: CoordinatesPayload): CoordinatesDto {
    const latitude = responsePayload.result[0].geometry.location.lat;
    const longitude = responsePayload.result[0].geometry.location.lng;
    return new CoordinatesDto({ latitude, longitude });
  }
}
