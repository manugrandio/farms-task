import config from "config/config";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import { setupServer } from "server/server";
import { disconnectAndClearDatabase } from "helpers/utils";
import http, { Server } from "http";
import ds from "orm/orm.config";
import supertest, { SuperAgentTest } from "supertest";
import { User } from "modules/users/entities/user.entity";
import { CreateUserDto } from "../../users/dto/create-user.dto";
import { CreateFarmDto } from "../dto/create-farm.dto";
import { UsersService } from "../../users/users.service";
import { FarmsService } from "../farms.service";
import { DistanceMatrix } from "services/distancematrix.service";
import { CoordinatesDto } from "services/coordinates.dto";

const createToken = (user: User, secret?: string): string => {
  const token = sign(
    {
      id: user.id,
      email: user.email,
    },
    secret || config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_AT },
  );
  return token;
};

describe("FarmsController", () => {
  let app: Express;
  let agent: SuperAgentTest;
  let server: Server;
  const distanceMatrixService = new DistanceMatrix();

  let usersService: UsersService;

  let getCoordinatesMock: jest.SpyInstance;

  beforeAll(() => {
    app = setupServer();
    server = http.createServer(app).listen(config.APP_PORT);
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(async () => {
    await ds.initialize();
    agent = supertest.agent(app);

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

    getCoordinatesMock = jest.spyOn(distanceMatrixService, "getCoordinates");
    getCoordinatesMock.mockImplementation(mockedImplementation);
  });

  afterEach(() => {
    getCoordinatesMock.mockRestore();
  });

  describe("POST /farms", () => {
    const createFarmPayload: Partial<CreateFarmDto> = {
      name: "Schrute Farms",
      address: "Test St. 12345",
      size: 10,
      cropYield: 200,
    };
    const createUserDto: CreateUserDto = {
      email: "user@test.com",
      password: "password",
      address: "Test St. 12345",
    };

    it("should get a 401 status code if token is not provided", async () => {
      const res = await agent.post("/api/farms").send(createFarmPayload);

      expect(res.statusCode).toBe(401);
    });

    it("should get a 403 status code if token is invalid", async () => {
      const user = await usersService.createUser(createUserDto);
      const token = createToken(user, "invalid-token");

      const res = await agent.post("/api/farms")
        .set("Authorization", `Bearer ${token}`)
        .send(createFarmPayload);

      expect(res.statusCode).toBe(403);
    });

    it("should create new farm", async () => {
      const user = await usersService.createUser(createUserDto);
      const token = createToken(user);
      const res = await agent.post("/api/farms")
        .set("Authorization", `Bearer ${token}`)
        .send(createFarmPayload);

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        ...createFarmPayload,
      });
    });
  });

  describe("DELETE /farms/:farmId", () => {
    const createUserDto: CreateUserDto = {
      email: "user@test.com",
      password: "password",
      address: "Test St. 12345",
    };

    it("should delete existing farm", async () => {
      const user = await usersService.createUser(createUserDto);
      const token = createToken(user);
      const createFarmDto: CreateFarmDto = {
        name: "Schrute Farms",
        address: "10 Daniels Rd, Honesdale, PA 18431",
        size: 10,
        cropYield: 200,
        user: user,
      };
      const farmsService = new FarmsService(distanceMatrixService);
      const { id: farmId } = await farmsService.createFarm(createFarmDto);

      const res = await agent.delete(`/api/farms/${farmId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(202);
      expect(res.body).toMatchObject({ success: true });
    });

    it("should handle non-existing farm deletion error", async () => {
      const user = await usersService.createUser(createUserDto);
      const token = createToken(user);
      const nonExistingFarmID = "0102865f-0eba-4e64-a507-3d1afb620a5a";

      const res = await agent.delete(`/api/farms/${nonExistingFarmID}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toMatchObject({ success: false });
    });
  });

  describe("GET /farms/list/", () => {
    const createUserDto: CreateUserDto = {
      email: "user@test.com",
      password: "password",
      address: "Test St. 12345",
      coordinates: "(12.34, 56.78)",
    };

    it("should return a list of all farms", async () => {
      const user = await usersService.createUser(createUserDto);
      const token = createToken(user);
      const createFarmDtoOne: CreateFarmDto = {
        name: "Schrute Farms",
        address: "10 Daniels Rd, Honesdale, PA 18431",
        size: 10,
        cropYield: 200,
        user: user,
      };
      const createFarmDtoTwo: CreateFarmDto = {
        name: "Carrot Farms",
        address: "Test St. 1234",
        size: 20,
        cropYield: 500,
        user: user,
      };
      const farmsService = new FarmsService(distanceMatrixService);
      await farmsService.createFarm(createFarmDtoOne);
      await farmsService.createFarm(createFarmDtoTwo);

      const response = await agent.get("/api/farms/list?orderBy=name")
        .set("Authorization", `Bearer ${token}`);

      expect(response.body).toEqual({
        farms: [
          {
            name: "Carrot Farms",
            address: "Test St. 1234",
            size: 20,
            cropYield: 500,
            owner: "user@test.com",
            createdAt: expect.any(String),
          },
          {
            name: "Schrute Farms",
            address: "10 Daniels Rd, Honesdale, PA 18431",
            size: 10,
            cropYield: 200,
            owner: "user@test.com",
            createdAt: expect.any(String),
          },
        ]
      });
    });
  });
});
