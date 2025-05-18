import { Test, TestingModule } from "@nestjs/testing"
import { AuthController, UsersController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { LoginDto, CreateUserDto, UpdateUserDto } from "./auth.dto"
import { HttpStatus } from "@nestjs/common"
import { UserRole } from "../common/constants/roles"

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

describe("UsersController", () => {
  let controller: UsersController
  let authService: AuthService

  const mockAuthService = {
    getAllUsers: jest.fn(),
    getUserByEmail: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    setUserRole: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile()

    controller = module.get<UsersController>(UsersController)
    authService = module.get<AuthService>(AuthService)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  describe("getAllUsers", () => {
    it("should return all users when no email is provided", async () => {
      const expectedUsers = [
        { id: "1", email: "user1@example.com", username: "User 1" },
        { id: "2", email: "user2@example.com", username: "User 2" },
      ]

      mockAuthService.getAllUsers.mockResolvedValue(expectedUsers)

      const result = await controller.getAllUsers()

      expect(result).toEqual(expectedUsers)
      expect(authService.getAllUsers).toHaveBeenCalled()
    })

    it("should return specific user when email is provided", async () => {
      const email = "user1@example.com"
      const expectedUser = { id: "1", email, username: "User 1" }

      mockAuthService.getUserByEmail.mockResolvedValue(expectedUser)

      const result = await controller.getAllUsers(email)

      expect(result).toEqual(expectedUser)
      expect(authService.getUserByEmail).toHaveBeenCalledWith(email)
    })
  })

  describe("getUserById", () => {
    it("should return user by id", async () => {
      const userId = "1"
      const expectedUser = {
        id: userId,
        email: "user1@example.com",
        username: "User 1",
      }

      mockAuthService.getUserById.mockResolvedValue(expectedUser)

      const result = await controller.getUserById(userId)

      expect(result).toEqual(expectedUser)
      expect(authService.getUserById).toHaveBeenCalledWith(userId)
    })
  })

  describe("updateUser", () => {
    it("should update user information", async () => {
      const userId = "1"
      const updateUserDto: UpdateUserDto = {
        username: "Updated User",
        email: "updated@example.com",
      }
      const expectedUser = { id: userId, ...updateUserDto }

      mockAuthService.updateUser.mockResolvedValue(expectedUser)

      const result = await controller.updateUser(userId, updateUserDto)

      expect(result).toEqual(expectedUser)
      expect(authService.updateUser).toHaveBeenCalledWith(userId, updateUserDto)
    })
  })

  describe("deleteUser", () => {
    it("should delete user", async () => {
      const userId = "1"
      const expectedResponse = { message: "User deleted successfully" }

      mockAuthService.deleteUser.mockResolvedValue(expectedResponse)

      const result = await controller.deleteUser(userId)

      expect(result).toEqual(expectedResponse)
      expect(authService.deleteUser).toHaveBeenCalledWith(userId)
    })
  })

  describe("setUserRole", () => {
    it("should set user role", async () => {
      const userId = "1"
      const roleData = { role: UserRole.ADMIN }
      const expectedUser = { id: userId, role: UserRole.ADMIN }

      mockAuthService.setUserRole.mockResolvedValue(expectedUser)

      const result = await controller.setUserRole(userId, roleData)

      expect(result).toEqual(expectedUser)
      expect(authService.setUserRole).toHaveBeenCalledWith(
        userId,
        roleData.role
      )
    })
  })
})
