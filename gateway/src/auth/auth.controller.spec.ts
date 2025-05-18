import { Test, TestingModule } from "@nestjs/testing"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { LoginDto, CreateUserDto } from "./auth.dto"
import { HttpStatus } from "@nestjs/common"

describe("AuthController", () => {
  let controller: AuthController
  let authService: AuthService

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    refreshToken: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  describe("login", () => {
    it("should return login response", async () => {
      const loginDto: LoginDto = {
        email: "test@example.com",
        password: "password123",
      }
      const expectedResponse = {
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
      }

      mockAuthService.login.mockResolvedValue(expectedResponse)

      const result = await controller.login(loginDto)

      expect(result).toEqual(expectedResponse)
      expect(authService.login).toHaveBeenCalledWith(loginDto)
    })
  })

  describe("register", () => {
    it("should return registered user data", async () => {
      const createUserDto: CreateUserDto = {
        email: "newuser@example.com",
        password: "password123",
        username: "New User",
      }
      const expectedResponse = {
        id: "1",
        email: createUserDto.email,
        username: createUserDto.username,
      }

      mockAuthService.register.mockResolvedValue(expectedResponse)

      const result = await controller.register(createUserDto)

      expect(result).toEqual(expectedResponse)
      expect(authService.register).toHaveBeenCalledWith(createUserDto)
    })
  })

  describe("refreshToken", () => {
    it("should return new access token", async () => {
      const refreshToken = "mock-refresh-token"
      const expectedResponse = {
        accessToken: "new-access-token",
      }

      mockAuthService.refreshToken.mockResolvedValue(expectedResponse)

      const result = await controller.refreshToken(refreshToken)

      expect(result).toEqual(expectedResponse)
      expect(authService.refreshToken).toHaveBeenCalledWith(refreshToken)
    })
  })
})
