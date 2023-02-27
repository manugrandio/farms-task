import config from "config/config";

interface Coordinates {
  lat: number;
  lng: number;
}

export class Geocoding {
  private readonly baseUrl = "https://api.distancematrix.ai/maps/api/geocode/json";

  public async getCoordinates(address: string): Promise<Coordinates> {
    const queryParams = new URLSearchParams({
      address,
      key: config.DISTANCE_MATRIX_TOKEN,
    });
    const url = `${this.baseUrl}?${queryParams}`;
    // TODO handle errors
    const response = await fetch(url);
    const bodyJson = await response.json();
    return {
      lat: bodyJson.result[0].geometry.location.lat,
      lng: bodyJson.result[0].geometry.location.lng,
    };
  }
}
