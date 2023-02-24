import { disconnectAndClearDatabase } from "helpers/utils";
import ds from "orm/orm.config";
import { CreateFarmDto } from "../dto/create-farm.dto";
import { Farm } from "../entities/farm.entity";
import { FarmsService } from "../farms.service";

describe("FarmsService", () => {
  let farmsService: FarmsService;

  beforeEach(async () => {
    await ds.initialize();
    farmsService = new FarmsService();
  });

  afterEach(async () => {
    await disconnectAndClearDatabase(ds);
  });

  describe(".createFarm", () => {
    const createFarmDto: CreateFarmDto = {
      name: "Schrute Farms",
      address: "Test St. 12345",
      coordinates: "(12.34, 56.78)",
      size: 10,
      cropYield: 200,
    };

    it("should create new farm", async () => {
      const createdFarm = await farmsService.createFarm(createFarmDto);
      expect(createdFarm).toBeInstanceOf(Farm);
    });
  });
});
