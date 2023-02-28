import { disconnectAndClearDatabase } from "helpers/utils";
import ds from "orm/orm.config";
import { CreateFarmDto } from "../dto/create-farm.dto";
import { Farm } from "../entities/farm.entity";
import { FarmsService } from "../farms.service";
import { CreateUserDto } from "../../users/dto/create-user.dto";
import { UsersService } from "../../users/users.service";
import { Geocoding } from "../../../services/geocoding.service"
import { CoordinatesDto } from "services/coordinates.dto";
import { NotFoundError } from "errors/errors";

describe("FarmsService", () => {
  let usersService: UsersService;
  const geocodingService = new Geocoding();

  let getCoordinatesMock: jest.SpyInstance;

  beforeEach(async () => {
    await ds.initialize();
    usersService = new UsersService();
  });

  afterEach(async () => {
    await disconnectAndClearDatabase(ds);
  });


  beforeEach(() => {
    const mockedImplementation = () =>
      Promise.resolve(new CoordinatesDto({
        latitude: 41.5899187,
        longitude: -75.2389501,
      }));

    getCoordinatesMock = jest.spyOn(geocodingService, "getCoordinates");
    getCoordinatesMock.mockImplementation(mockedImplementation);
  });

  afterEach(() => {
    getCoordinatesMock.mockRestore();
  });

  describe(".createFarm", () => {
    it("should create new farm", async () => {
      const createUserDto: CreateUserDto = {
        email: "user@test.com",
        password: "password",
        address: "Test St. 12345",
        coordinates: "(12.34, 56.78)",
      };
      const user = await usersService.createUser(createUserDto);
      const createFarmDto: CreateFarmDto = {
        name: "Schrute Farms",
        address: "10 Daniels Rd, Honesdale, PA 18431",
        size: 10,
        cropYield: 200,
        user: user,
      };
      const farmsService = new FarmsService(geocodingService);

      const createdFarm = await farmsService.createFarm(createFarmDto);

      expect(createdFarm).toBeInstanceOf(Farm);
      expect(createdFarm.user.email).toEqual("user@test.com");
      expect(createdFarm.coordinates).toEqual("(41.5899187, -75.2389501)");
    });
  });

  describe(".deleteFarm", () => {
    it("should delete an existing farm", async () => {
      const createUserDto: CreateUserDto = {
        email: "user@test.com",
        password: "password",
        address: "Test St. 12345",
        coordinates: "(12.34, 56.78)",
      };
      const user = await usersService.createUser(createUserDto);
      const createFarmDto: CreateFarmDto = {
        name: "Schrute Farms",
        address: "10 Daniels Rd, Honesdale, PA 18431",
        size: 10,
        cropYield: 200,
        user: user,
      };
      const farmsService = new FarmsService(geocodingService);
      const { id: farmId } = await farmsService.createFarm(createFarmDto);

      const deleteResult = await farmsService.deleteFarm(farmId);
      const foundFarm = await farmsService.findOneBy({ id: farmId });

      expect(deleteResult.affected).toEqual(1);
      expect(foundFarm).toBeNull();
    });

    it("should throw error when trying to delete non existing farm", async () => {
      const nonExistingFarmID = "0102865f-0eba-4e64-a507-3d1afb620a5a";
      const farmsService = new FarmsService(geocodingService);
      await expect(async () => farmsService.deleteFarm(nonExistingFarmID))
        .rejects
        .toThrow(NotFoundError);
    });
  });
});
