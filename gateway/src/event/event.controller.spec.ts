import { Test, TestingModule } from "@nestjs/testing"
import { EventController, RewardController } from "./event.controller"
import { EventService } from "./event.service"
import {
  CreateEventDto,
  CreateRewardDto,
  RewardRequestDto,
  RewardRequestStatus,
  UpdateRewardDto,
  UpdateEventDto,
} from "./event.dto"
import { UserRole } from "../common/constants/roles"

describe("EventController", () => {
  let controller: EventController
  let eventService: EventService

  const mockEventService = {
    getAllEvents: jest.fn(),
    getActiveEvents: jest.fn(),
    getEventById: jest.fn(),
    createEvent: jest.fn(),
    updateEvent: jest.fn(),
    deleteEvent: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        {
          provide: EventService,
          useValue: mockEventService,
        },
      ],
    }).compile()

    controller = module.get<EventController>(EventController)
    eventService = module.get<EventService>(EventService)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  describe("getAllEvents", () => {
    it("should return all events when active parameter is not provided", async () => {
      const expectedEvents = [
        { id: "1", name: "Event 1", isActive: true },
        { id: "2", name: "Event 2", isActive: false },
      ]

      mockEventService.getAllEvents.mockResolvedValue(expectedEvents)

      const result = await controller.getAllEvents()

      expect(result).toEqual(expectedEvents)
      expect(eventService.getAllEvents).toHaveBeenCalled()
    })

    it("should return only active events when active parameter is true", async () => {
      const expectedEvents = [{ id: "1", name: "Event 1", isActive: true }]

      mockEventService.getActiveEvents.mockResolvedValue(expectedEvents)

      const result = await controller.getAllEvents("true")

      expect(result).toEqual(expectedEvents)
      expect(eventService.getActiveEvents).toHaveBeenCalled()
    })
  })

  describe("getEventById", () => {
    it("should return event by id", async () => {
      const eventId = "1"
      const expectedEvent = { id: eventId, name: "Event 1", isActive: true }

      mockEventService.getEventById.mockResolvedValue(expectedEvent)

      const result = await controller.getEventById(eventId)

      expect(result).toEqual(expectedEvent)
      expect(eventService.getEventById).toHaveBeenCalledWith(eventId)
    })
  })

  describe("createEvent", () => {
    it("should create new event", async () => {
      const createEventDto: CreateEventDto = {
        title: "New Event",
        description: "Event Description",
        startDate: new Date(),
        endDate: new Date(),
        isActive: true,
      }
      const expectedEvent = { id: "1", ...createEventDto }

      mockEventService.createEvent.mockResolvedValue(expectedEvent)

      const result = await controller.createEvent(createEventDto)

      expect(result).toEqual(expectedEvent)
      expect(eventService.createEvent).toHaveBeenCalledWith(createEventDto)
    })
  })

  describe("updateEvent", () => {
    it("should update event", async () => {
      const eventId = "1"
      const updateEventDto: UpdateEventDto = {
        title: "Updated Event",
        description: "Updated Description",
      }
      const expectedEvent = { id: eventId, ...updateEventDto }

      mockEventService.updateEvent.mockResolvedValue(expectedEvent)

      const result = await controller.updateEvent(eventId, updateEventDto)

      expect(result).toEqual(expectedEvent)
      expect(eventService.updateEvent).toHaveBeenCalledWith(
        eventId,
        updateEventDto
      )
    })
  })

  describe("deleteEvent", () => {
    it("should delete event", async () => {
      const eventId = "1"
      const expectedResponse = { message: "Event deleted successfully" }

      mockEventService.deleteEvent.mockResolvedValue(expectedResponse)

      const result = await controller.deleteEvent(eventId)

      expect(result).toEqual(expectedResponse)
      expect(eventService.deleteEvent).toHaveBeenCalledWith(eventId)
    })
  })
})

describe("RewardController", () => {
  let controller: RewardController
  let eventService: EventService

  const mockEventService = {
    getAllRewards: jest.fn(),
    getRewardsByEventId: jest.fn(),
    getRewardById: jest.fn(),
    createReward: jest.fn(),
    updateReward: jest.fn(),
    deleteReward: jest.fn(),
    requestReward: jest.fn(),
    getUserRewardRequests: jest.fn(),
    getRewardRequestsByEvent: jest.fn(),
    getRewardRequestsByStatus: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RewardController],
      providers: [
        {
          provide: EventService,
          useValue: mockEventService,
        },
      ],
    }).compile()

    controller = module.get<RewardController>(RewardController)
    eventService = module.get<EventService>(EventService)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  describe("getAllRewards", () => {
    it("should return all rewards when eventId is not provided", async () => {
      const expectedRewards = [
        { id: "1", name: "Reward 1", eventId: "1" },
        { id: "2", name: "Reward 2", eventId: "2" },
      ]

      mockEventService.getAllRewards.mockResolvedValue(expectedRewards)

      const result = await controller.getAllRewards()

      expect(result).toEqual(expectedRewards)
      expect(eventService.getAllRewards).toHaveBeenCalled()
    })

    it("should return rewards for specific event when eventId is provided", async () => {
      const eventId = "1"
      const expectedRewards = [{ id: "1", name: "Reward 1", eventId }]

      mockEventService.getRewardsByEventId.mockResolvedValue(expectedRewards)

      const result = await controller.getAllRewards(eventId)

      expect(result).toEqual(expectedRewards)
      expect(eventService.getRewardsByEventId).toHaveBeenCalledWith(eventId)
    })
  })

  describe("getRewardById", () => {
    it("should return reward by id", async () => {
      const rewardId = "1"
      const expectedReward = { id: rewardId, name: "Reward 1", eventId: "1" }

      mockEventService.getRewardById.mockResolvedValue(expectedReward)

      const result = await controller.getRewardById(rewardId)

      expect(result).toEqual(expectedReward)
      expect(eventService.getRewardById).toHaveBeenCalledWith(rewardId)
    })
  })

  describe("createReward", () => {
    it("should create new reward", async () => {
      const createRewardDto: CreateRewardDto = {
        name: "New Reward",
        description: "Reward Description",
        event: "1",
        quantity: 100,
      }
      const expectedReward = { id: "1", ...createRewardDto }

      mockEventService.createReward.mockResolvedValue(expectedReward)

      const result = await controller.createReward(createRewardDto)

      expect(result).toEqual(expectedReward)
      expect(eventService.createReward).toHaveBeenCalledWith(createRewardDto)
    })
  })

  describe("updateReward", () => {
    it("should update reward", async () => {
      const rewardId = "1"
      const updateRewardDto: UpdateRewardDto = {
        name: "Updated Reward",
        description: "Updated Description",
      }
      const expectedReward = { id: rewardId, ...updateRewardDto }

      mockEventService.updateReward.mockResolvedValue(expectedReward)

      const result = await controller.updateReward(rewardId, updateRewardDto)

      expect(result).toEqual(expectedReward)
      expect(eventService.updateReward).toHaveBeenCalledWith(
        rewardId,
        updateRewardDto
      )
    })
  })

  describe("deleteReward", () => {
    it("should delete reward", async () => {
      const rewardId = "1"
      const expectedResponse = { message: "Reward deleted successfully" }

      mockEventService.deleteReward.mockResolvedValue(expectedResponse)

      const result = await controller.deleteReward(rewardId)

      expect(result).toEqual(expectedResponse)
      expect(eventService.deleteReward).toHaveBeenCalledWith(rewardId)
    })
  })

  describe("requestReward", () => {
    it("should create reward request", async () => {
      const requestData: RewardRequestDto = {
        userId: "1",
        rewardId: "1",
      }
      const expectedRequest = {
        id: "1",
        ...requestData,
        status: RewardRequestStatus.PENDING,
      }

      mockEventService.requestReward.mockResolvedValue(expectedRequest)

      const result = await controller.requestReward(requestData)

      expect(result).toEqual(expectedRequest)
      expect(eventService.requestReward).toHaveBeenCalledWith(
        requestData.userId,
        requestData.rewardId
      )
    })
  })

  describe("getRewardRequestsByStatus", () => {
    it("should return user reward requests when userId is provided", async () => {
      const userId = "1"
      const expectedRequests = [
        { id: "1", userId, rewardId: "1", status: RewardRequestStatus.PENDING },
      ]

      mockEventService.getUserRewardRequests.mockResolvedValue(expectedRequests)

      const result = await controller.getRewardRequestsByStatus(
        undefined,
        undefined,
        userId
      )

      expect(result).toEqual(expectedRequests)
      expect(eventService.getUserRewardRequests).toHaveBeenCalledWith(userId)
    })

    it("should return event reward requests when eventId is provided", async () => {
      const eventId = "1"
      const expectedRequests = [
        {
          id: "1",
          userId: "1",
          rewardId: "1",
          status: RewardRequestStatus.PENDING,
        },
      ]

      mockEventService.getRewardRequestsByEvent.mockResolvedValue(
        expectedRequests
      )

      const result = await controller.getRewardRequestsByStatus(
        undefined,
        eventId
      )

      expect(result).toEqual(expectedRequests)
      expect(eventService.getRewardRequestsByEvent).toHaveBeenCalledWith(
        eventId
      )
    })

    it("should return requests by status when status is provided", async () => {
      const status = RewardRequestStatus.PENDING
      const expectedRequests = [{ id: "1", userId: "1", rewardId: "1", status }]

      mockEventService.getRewardRequestsByStatus.mockResolvedValue(
        expectedRequests
      )

      const result = await controller.getRewardRequestsByStatus(status)

      expect(result).toEqual(expectedRequests)
      expect(eventService.getRewardRequestsByStatus).toHaveBeenCalledWith(
        status
      )
    })
  })
})
