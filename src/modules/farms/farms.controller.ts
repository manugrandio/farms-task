import { NextFunction, Response } from "express";
import { CreateFarmDto } from "./dto/create-farm.dto";
import { FarmDto } from "./dto/farm.dto";
import { FarmsService } from "./farms.service";
import { RequestWithUser } from "middlewares/auth.interfaces";

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
}
