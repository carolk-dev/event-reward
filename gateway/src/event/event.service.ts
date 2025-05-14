import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class EventService {
  private eventServiceUrl: string;

  constructor(private configService: ConfigService) {
    this.eventServiceUrl = this.configService.get<string>('EVENT_SERVICE_URL', 'http://event:3002');
  }

  async getAllEvents() {
    const response = await axios.get(`${this.eventServiceUrl}/events`);
    return response.data;
  }

  async getEventById(id: string) {
    const response = await axios.get(`${this.eventServiceUrl}/events/${id}`);
    return response.data;
  }

  async createEvent(eventData: any) {
    const response = await axios.post(`${this.eventServiceUrl}/events`, eventData);
    return response.data;
  }

  async updateEvent(id: string, eventData: any) {
    const response = await axios.put(`${this.eventServiceUrl}/events/${id}`, eventData);
    return response.data;
  }

  async deleteEvent(id: string) {
    const response = await axios.delete(`${this.eventServiceUrl}/events/${id}`);
    return response.data;
  }

  async getAllRewards() {
    const response = await axios.get(`${this.eventServiceUrl}/rewards`);
    return response.data;
  }

  async getRewardById(id: string) {
    const response = await axios.get(`${this.eventServiceUrl}/rewards/${id}`);
    return response.data;
  }

  async createReward(rewardData: any) {
    const response = await axios.post(`${this.eventServiceUrl}/rewards`, rewardData);
    return response.data;
  }

  async requestReward(userId: string, rewardId: string) {
    const response = await axios.post(`${this.eventServiceUrl}/rewards/request`, {
      userId,
      rewardId,
    });
    return response.data;
  }

  async approveReward(rewardRequestId: string) {
    const response = await axios.post(`${this.eventServiceUrl}/rewards/approve/${rewardRequestId}`);
    return response.data;
  }

  async rejectReward(rewardRequestId: string, reason: string) {
    const response = await axios.post(`${this.eventServiceUrl}/rewards/reject/${rewardRequestId}`, {
      reason,
    });
    return response.data;
  }
} 