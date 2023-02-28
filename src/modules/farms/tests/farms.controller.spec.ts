import config from "config/config";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import { setupServer } from "server/server";
import { disconnectAndClearDatabase } from "helpers/utils";
import http, { Server } from "http";
import ds from "orm/orm.config";
import supertest, { SuperAgentTest } from "supertest";
import { CreateUserDto } from "../../users/dto/create-user.dto";
import { CreateFarmDto } from "../dto/create-farm.dto";
import { UsersService } from "../../users/users.service";
import { FarmsService } from "../farms.service";
import { Geocoding } from "services/geocoding.service";

describe("FarmsController", () => {
  let app: Express;
  let agent: SuperAgentTest;
  let server: Server;
  const geocodingService = new Geocoding();

  let usersService: UsersService;

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
      const token = sign(
        {
          id: user.id,
          email: user.email,
        },
        "invalid-token",
        { expiresIn: config.JWT_EXPIRES_AT },
      );

      const res = await agent.post("/api/farms")
        .set("Authorization", `Bearer ${token}`)
        .send(createFarmPayload);

      expect(res.statusCode).toBe(403);
    });

    it("should create new farm", async () => {
      const user = await usersService.createUser(createUserDto);
      const token = sign(
        {
          id: user.id,
          email: user.email,
        },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_AT },
      );
      const res = await agent.post("/api/farms")
        .set("Authorization", `Bearer ${token}`)
        .send(createFarmPayload);

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        id: expect.any(String),
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
      const token = sign(
        {
          id: user.id,
          email: user.email,
        },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_AT },
      );
      const createFarmDto: CreateFarmDto = {
        name: "Schrute Farms",
        address: "10 Daniels Rd, Honesdale, PA 18431",
        size: 10,
        cropYield: 200,
        user: user,
      };
      const farmsService = new FarmsService(geocodingService);
      const { id: farmId } = await farmsService.createFarm(createFarmDto);

      const res = await agent.delete(`/api/farms/${farmId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(202);
      expect(res.body).toMatchObject({ success: true });
    });

    it("should handle non-existing farm deletion error", async () => {
      const user = await usersService.createUser(createUserDto);
      const token = sign(
        {
          id: user.id,
          email: user.email,
        },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_AT },
      );
      const nonExistingFarmID = "0102865f-0eba-4e64-a507-3d1afb620a5a";

      const res = await agent.delete(`/api/farms/${nonExistingFarmID}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toMatchObject({ success: false });
    });
  });
});
