import config from "config/config";
import { UnprocessableEntityError } from "errors/errors";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import { setupServer } from "server/server";
import { disconnectAndClearDatabase } from "helpers/utils";
import { CreateUserDto } from "modules/users/dto/create-user.dto";
import { UsersService } from "modules/users/users.service";
import { User } from "modules/users/entities/user.entity";
import ds from "orm/orm.config";
import { AuthService } from "../auth.service";
import { LoginUserDto } from "../dto/login-user.dto";
import http, { Server } from "http";

describe("AuthService", () => {
  let app: Express;
  let usersService: UsersService;
  let authService: AuthService;
  let server: Server;

  beforeAll(() => {
    app = setupServer();
    server = http.createServer(app).listen(config.APP_PORT);
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(async () => {
    await ds.initialize();

    usersService = new UsersService();
    authService = new AuthService();
  });

  afterEach(async () => {
    await disconnectAndClearDatabase(ds);
  });

  describe(".login", () => {
    const loginDto: LoginUserDto = { email: "user@test.com", password: "password" };
    const createUser = async (userDto: CreateUserDto) => usersService.createUser(userDto);

    it("should create access token for existing user", async () => {
      await createUser(loginDto);

      const { token } = await authService.login(loginDto);

      expect(token).toBeDefined();
    });

    it("should throw UnprocessableEntityError when user logs in with invalid email", async () => {
      await authService.login({ email: "invalidEmail", password: "pwd" }).catch((error: UnprocessableEntityError) => {
        expect(error).toBeInstanceOf(UnprocessableEntityError);
        expect(error.message).toBe("Invalid user email or password");
      });
    });

    it("should throw UnprocessableEntityError when user logs in with invalid password", async () => {
      await createUser(loginDto);

      await authService.login({ email: loginDto.email, password: "invalidPassword" }).catch((error: UnprocessableEntityError) => {
        expect(error).toBeInstanceOf(UnprocessableEntityError);
        expect(error.message).toBe("Invalid user email or password");
      });
    });
  });

  describe(".getUserFromToken", () => {
    const loginDto: LoginUserDto = { email: "user@test.com", password: "password" };
    const createUser = async (userDto: CreateUserDto) => usersService.createUser(userDto);

    it("should return user if token is valid", async () => {
      const user = await createUser(loginDto);
      const validToken = sign(
        {
          id: user.id,
          email: user.email,
        },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_AT },
      );

      const foundUser = await authService.getUserFromToken(validToken) as User;

      expect(foundUser.id).toEqual(user.id);
    });

    it("should return null if token is invalid", async () => {
      const user = await createUser(loginDto);
      const invalidToken = sign(
        {
          id: user.id,
          email: user.email,
        },
        "not-the-right-secret",
        { expiresIn: config.JWT_EXPIRES_AT },
      );

      const foundUser = await authService.getUserFromToken(invalidToken);

      expect(foundUser).toBeNull();
    });
  });
});
