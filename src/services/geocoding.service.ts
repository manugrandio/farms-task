import config from "config/config";
import { CoordinatesDto } from "./coordinates.dto";

export class Geocoding {
  private readonly baseUrl = "https://api.distancematrix.ai/maps/api/geocode/json";

  public async getCoordinates(address: string): Promise<CoordinatesDto | null> {
    const queryParams = new URLSearchParams({
      address,
      key: config.DISTANCE_MATRIX_TOKEN,
    });
    const url = `${this.baseUrl}?${queryParams}`;
    try {
      const response = await fetch(url);
      const bodyJson = await response.json();
      return CoordinatesDto.createFromPayload(bodyJson);
    } catch {
      return null;
    }
  }
}
