import { Geocoding } from "../geocoding.service";

describe("Geocoding", () => {
  describe("getCoordinates", () => {
    it("should get address coordinates", async () => {
      const address = "1600 Amphitheatre Parkway, Mountain View, CA";
      const geocodingService = new Geocoding();

      const coordinates = await geocodingService.getCoordinates(address);

      expect(coordinates).toBe({ latitude: 1, longitude: 2 });
    });
  });
});
