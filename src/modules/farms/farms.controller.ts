import { NextFunction, Request, Response } from "express";
import { CreateFarmDto } from "./dto/create-farm.dto";
import { FarmDto } from "./dto/farm.dto";
import { FarmsService } from "./farms.service";
import { RequestWithUser } from "middlewares/auth.interfaces";
import { NotFoundError } from "errors/errors";
import { instanceToPlain } from "class-transformer";
import { Point } from "helpers/utils.interfaces";
import { getSortFunction } from "./farms.helpers";

export class FarmsController {
  private readonly farmsService: FarmsService;

  constructor() {
    this.farmsService = new FarmsService();
  }

  public async create(req: RequestWithUser, res: Response, next: NextFunction) {
    const createFarmDto = {
      user: req.user,
      ...req.body,
    } as CreateFarmDto;
    try {
      const farm = await this.farmsService.createFarm(createFarmDto);
      const plainFarm = instanceToPlain(await FarmDto.createFromEntity(farm));
      res.status(201).send(plainFarm);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    const farmId = req.params.farmId;
    try {
      await this.farmsService.deleteFarm(farmId);
      res.status(202).send({ success: true });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).send({ success: false });
      }
      next(error);
    }
  }

  public async list(req: RequestWithUser, res: Response, next: NextFunction) {
    const { user } = req;
    const query = (<Request><unknown>req).query;
    const orderBy = query.orderBy;

    let userCoordinates: Point | undefined;
    if (user?.coordinates !== undefined) {
      userCoordinates = <Point>(<unknown>user?.coordinates);
    }

    let formattedFarms;
    try {
      const farmsList = await this.farmsService.findFarms();

      formattedFarms = await Promise.all(
        farmsList.map(farm => instanceToPlain(FarmDto.createFromEntity(farm, userCoordinates)))
      );

    } catch (error) {
      next(error);
    }

    if (formattedFarms && orderBy !== undefined) {
      const sortFunction = getSortFunction(<string>orderBy);
      if (sortFunction !== undefined) {
        formattedFarms.sort(sortFunction);
      }
    }

    res.status(202).send({ farms: formattedFarms });
  }
}
