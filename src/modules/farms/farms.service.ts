import { DeepPartial, Repository } from "typeorm";
import { Farm } from "./entities/farm.entity";
import { CreateFarmDto } from "./dto/create-farm.dto";
import dataSource from "orm/orm.config";

export class FarmsService {
  private readonly farmsRepository: Repository<Farm>;

  constructor() {
    this.farmsRepository = dataSource.getRepository(Farm);
  }

  public async createFarm(data: CreateFarmDto): Promise<Farm> {
    const farmData: DeepPartial<Farm> = data;
    const newFarm = this.farmsRepository.create(farmData);
    return this.farmsRepository.save(newFarm);
  }
}
