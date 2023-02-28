import { DistanceMatrix } from "../distancematrix.service";
import { Point } from "helpers/utils.interfaces";

describe("DistanceMatrix", () => {
  let fetchMock: jest.SpyInstance;

  describe(".getCoordinates", () => {
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

    it("should get address coordinates", async () => {
      const address = "1600 Amphitheatre Parkway, Mountain View, CA";
      const distanceMatrixService = new DistanceMatrix();

      const coordinates = await distanceMatrixService.getCoordinates(address);

      expect(coordinates?.latitude).toBe(37);
      expect(coordinates?.longitude).toBe(-122);
    });
  });

  describe(".calculateDrivingDistance", () => {
    beforeAll(() => {
      const mockedImplementation = () =>
        Promise.resolve({
          json: () => Promise.resolve({
            rows: [
              {
                elements: {
                  distance: {
                    value: 5000,
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

    it("should calculate driving distance", async () => {
      const origin: Point = { x: 100, y: -100 };
      const destination: Point = { x: 200, y: -200 };
      const distanceMatrixService = new DistanceMatrix();

      const drivingDistance = await distanceMatrixService.calculateDrivingDistance(origin, destination);

      expect(drivingDistance).toEqual(5000);
    });
  });
});
