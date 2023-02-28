import config from "config/config";
import { CoordinatesDto } from "./coordinates.dto";
import { CoordinatesPayload, DrivingDistancePayload } from "./distancematrix.interfaces";
import { Point } from "helpers/utils.interfaces";

export class DistanceMatrix {
  private readonly geocodeBaseUrl = "https://api.distancematrix.ai/maps/api/geocode/json";
  private readonly distanceMatrixBaseUrl = "https://api.distancematrix.ai/maps/api/distancematrix/json"

  public async getCoordinates(address: string): Promise<CoordinatesDto | null> {
    const queryParams = new URLSearchParams({
      address,
      key: config.DISTANCE_MATRIX_TOKEN,
    });
    const url = `${this.geocodeBaseUrl}?${queryParams}`;
    try {
      const response = await fetch(url);
      const bodyJson = await response.json() as CoordinatesPayload;
      return CoordinatesDto.createFromPayload(bodyJson);
    } catch {
      return null;
    }
  }

  public async calculateDrivingDistance(origin: Point, destination: Point): Promise<number|null> {
    const originStr = `${origin.x},${origin.y}`;
    const destinationStr = `${destination.x},${destination.y}`;
    const queryParams = new URLSearchParams({
      originStr,
      destinationStr,
      key: config.DISTANCE_MATRIX_TOKEN,
    });
    const url = `${this.distanceMatrixBaseUrl}?${queryParams}`;
    try {
      const response = await fetch(url);
      const bodyJson = await response.json() as DrivingDistancePayload;
      const drivingDistanceInMeters = bodyJson.rows[0].elements.distance.value;
      return drivingDistanceInMeters;
    } catch {
      return null;
    }
  }
}
