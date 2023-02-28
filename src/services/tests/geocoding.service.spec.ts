import { Geocoding } from "../geocoding.service";

describe("Geocoding", () => {
  let fetchMock: jest.SpyInstance;

  beforeAll(() => {
    const mockedImplementation = () =>
      Promise.resolve({
        json: () => Promise.resolve({
          result: [
            {
              geometry: {
                location: {
                  lat: 37,
                  lng: -122,
                }
              }
            }
          ],
        }),
      });

    fetchMock = jest.spyOn(global, "fetch");
    fetchMock.mockImplementation(mockedImplementation);
  });

  afterAll(() => {
    fetchMock.mockRestore();
  });

  describe("getCoordinates", () => {
    it("should get address coordinates", async () => {
      const address = "1600 Amphitheatre Parkway, Mountain View, CA";
      const geocodingService = new Geocoding();

      const coordinates = await geocodingService.getCoordinates(address);

      expect(coordinates?.latitude).toBe(37);
      expect(coordinates?.longitude).toBe(-122);
    });
  });
});
