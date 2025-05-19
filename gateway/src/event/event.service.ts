import { Injectable, HttpException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosError } from "axios";

@Injectable()
export class EventService {
  private eventServiceUrl: string;
  private readonly logger = new Logger(EventService.name);

  constructor(private configService: ConfigService) {
    this.eventServiceUrl = this.configService.get<string>("EVENT_SERVICE_URL", "http://event:3002");
    this.logger.log(`Event service URL: ${this.eventServiceUrl}`);
  }

  // 에러 핸들링 헬퍼 메서드
  private handleError(error: any) {
    this.logger.error(`Event service error: ${error.message}`, error.stack);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status || 500;
      const data = axiosError.response?.data || { message: "Event service internal error" };

      // 로그에 자세한 에러 정보 출력
      this.logger.error(`Status: ${status}, Response: ${JSON.stringify(data)}`);

      // 원본 상태 코드와 에러 메시지 유지
      throw new HttpException(data, status);
    }

    // 기타 에러
    throw new HttpException(error.message || "Unknown error", 500);
  }

  async getAllEvents() {
    try {
      const response = await axios.get(`${this.eventServiceUrl}/events`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getAllEventsWithParams(active?: string) {
    try {
      let url = `${this.eventServiceUrl}/events`;
      if (active !== undefined) {
        url += `?active=${active}`;
      }
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getEventById(id: string) {
    try {
      const response = await axios.get(`${this.eventServiceUrl}/events/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createEvent(eventData: any) {
    try {
      const response = await axios.post(`${this.eventServiceUrl}/events`, eventData);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateEvent(id: string, eventData: any) {
    try {
      const response = await axios.put(`${this.eventServiceUrl}/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteEvent(id: string) {
    try {
      const response = await axios.delete(`${this.eventServiceUrl}/events/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getAllRewards() {
    try {
      const response = await axios.get(`${this.eventServiceUrl}/rewards`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getRewardsWithParams(params?: Record<string, string>) {
    try {
      let url = `${this.eventServiceUrl}/rewards`;

      // 쿼리 파라미터가 있으면 URL에 추가
      if (params && Object.keys(params).length > 0) {
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
          if (value !== undefined) {
            queryParams.append(key, value);
          }
        }
        url += `?${queryParams.toString()}`;
      }

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getRewardById(id: string) {
    try {
      const response = await axios.get(`${this.eventServiceUrl}/rewards/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getRewardsByEventId(eventId: string) {
    try {
      const response = await axios.get(`${this.eventServiceUrl}/rewards?eventId=${eventId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createReward(rewardData: any) {
    try {
      const response = await axios.post(`${this.eventServiceUrl}/rewards`, rewardData);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateReward(id: string, rewardData: any) {
    try {
      const response = await axios.put(`${this.eventServiceUrl}/rewards/${id}`, rewardData);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteReward(id: string) {
    try {
      const response = await axios.delete(`${this.eventServiceUrl}/rewards/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async requestReward(userId: string, rewardId: string) {
    try {
      const response = await axios.post(`${this.eventServiceUrl}/reward-requests`, {
        userId,
        rewardId,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getRewardRequestsWithParams(params?: Record<string, string>) {
    try {
      let url = `${this.eventServiceUrl}/reward-requests`;

      // 쿼리 파라미터가 있으면 URL에 추가
      if (params && Object.keys(params).length > 0) {
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
          if (value !== undefined) {
            queryParams.append(key, value);
          }
        }
        url += `?${queryParams.toString()}`;
      }

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}
