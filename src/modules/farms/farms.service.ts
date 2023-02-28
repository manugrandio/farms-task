import { DeepPartial, Repository } from "typeorm";
import dataSource from "orm/orm.config";
import { Farm } from "./entities/farm.entity";
import { CreateFarmDto } from "./dto/create-farm.dto";
import { Geocoding } from "services/geocoding.service";

export class FarmsService {
  private readonly farmsRepository: Repository<Farm>;
  private readonly geocoding: Geocoding;

  constructor(geocoding?: Geocoding) {
    this.farmsRepository = dataSource.getRepository(Farm);
    this.geocoding = geocoding || new Geocoding();
  }

  public async createFarm(data: CreateFarmDto): Promise<Farm> {
    const { address } = data;
    let coordinatesStr;
    if (address !== undefined) {
      const coordinates = await this.geocoding.getCoordinates(address);
      if (coordinates !== null) {
        const { latitude, longitude } = coordinates;
        coordinatesStr = `(${latitude}, ${longitude})`;
      }
    }
    const farmData: DeepPartial<Farm> = { ...data, coordinates: coordinatesStr };
    const newFarm = this.farmsRepository.create(farmData);
    return this.farmsRepository.save(newFarm);
  }
}
