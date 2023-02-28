import { NextFunction, Request, Response } from "express";
import { CreateFarmDto } from "./dto/create-farm.dto";
import { FarmDto } from "./dto/farm.dto";
import { FarmsService } from "./farms.service";
import { RequestWithUser } from "middlewares/auth.interfaces";
import { NotFoundError } from "errors/errors";

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
      res.status(201).send(FarmDto.createFromEntity(farm));
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
}
