import { disconnectAndClearDatabase } from "helpers/utils";
import ds from "orm/orm.config";
import { CreateFarmDto } from "../dto/create-farm.dto";
import { Farm } from "../entities/farm.entity";
import { FarmsService } from "../farms.service";
import { CreateUserDto } from "../../users/dto/create-user.dto";
import { UsersService } from "../../users/users.service";

describe("FarmsService", () => {
  let farmsService: FarmsService;
  let usersService: UsersService;

  beforeEach(async () => {
    await ds.initialize();
    farmsService = new FarmsService();
    usersService = new UsersService();
  });

  afterEach(async () => {
    await disconnectAndClearDatabase(ds);
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
        address: "Test St. 12345",
        coordinates: "(12.34, 56.78)",
        size: 10,
        cropYield: 200,
        user: user,
      };

      const createdFarm = await farmsService.createFarm(createFarmDto);

      expect(createdFarm).toBeInstanceOf(Farm);
      expect(createdFarm.user.email).toEqual("user@test.com");
    });
  });
});
