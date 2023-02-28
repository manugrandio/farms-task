import { DeepPartial, DeleteResult, FindOptionsWhere, Repository } from "typeorm";
import dataSource from "orm/orm.config";
import { Farm } from "./entities/farm.entity";
import { CreateFarmDto } from "./dto/create-farm.dto";
import { DistanceMatrix } from "services/distancematrix.service";
import { NotFoundError } from "errors/errors";

const OUTLIER_PERCENTAGE = 0.3;

export class FarmsService {
  private readonly farmsRepository: Repository<Farm>;
  private readonly distanceMatrix: DistanceMatrix;

  constructor(distanceMatrix?: DistanceMatrix) {
    this.farmsRepository = dataSource.getRepository(Farm);
    this.distanceMatrix = distanceMatrix || new DistanceMatrix();
  }

  public async findOneBy(param: FindOptionsWhere<Farm>): Promise<Farm | null> {
    return this.farmsRepository.findOneBy({ ...param });
  }

  public async createFarm(data: CreateFarmDto): Promise<Farm> {
    const { address } = data;
    let coordinatesStr;
    if (address !== undefined) {
      const coordinates = await this.distanceMatrix.getCoordinates(address);
      if (coordinates !== null) {
        const { latitude, longitude } = coordinates;
        coordinatesStr = `(${latitude}, ${longitude})`;
      }
    }
    const farmData: DeepPartial<Farm> = { ...data, coordinates: coordinatesStr };
    const newFarm = this.farmsRepository.create(farmData);
    return this.farmsRepository.save(newFarm);
  }

  public async deleteFarm(farmId: string): Promise<DeleteResult> {
    const deleteResult = await this.farmsRepository.delete(farmId);
    if (deleteResult.affected === 0) {
      throw new NotFoundError();
    }
    return deleteResult;
  }

  public async findFarms(onlyOutliers: boolean): Promise<Farm[]> {
    if (onlyOutliers) {
      return this.findOutliers();
    } else {
      return this.findAllFarms();
    }
  }

  public async findAllFarms(): Promise<Farm[]> {
    const farms = await this.farmsRepository
      .createQueryBuilder("farm")
      .leftJoinAndSelect("farm.user", "user")
      .getMany();
    return farms;
  }

  public async findOutliers(): Promise<Farm[]> {
    const { avgYieldStr } = <{ avgYieldStr: string }>(await this.farmsRepository
      .createQueryBuilder("farm")
        .select("AVG(farm.cropYield)", "avgYieldStr")
        .getRawOne());

    const avgYield = Number(avgYieldStr);
    const yieldBottom = Math.floor((1 - OUTLIER_PERCENTAGE) * avgYield);
    const yieldTop = Math.floor((1 + OUTLIER_PERCENTAGE) * avgYield);

    const farms = await this.farmsRepository
      .createQueryBuilder("farm")
      .leftJoinAndSelect("farm.user", "user")
      .where("farm.cropYield < :yieldBottom", { yieldBottom })
      .orWhere("farm.cropYield > :yieldTop", { yieldTop })
      .getMany();
    return farms;
  }
}
