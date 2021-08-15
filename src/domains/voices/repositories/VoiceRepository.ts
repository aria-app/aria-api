import { Result, Voice } from '../../../types';

export interface GetVoicesOptions {
  limit?: number;
  page?: number;
  sort?: string;
  sortDirection?: string;
}

export const VoiceRepository = Symbol('VoiceRepository');
export interface VoiceRepository {
  getVoices(options: GetVoicesOptions): Promise<Result<Voice[]>>;
  getVoicesCount(): Promise<Result<number>>;
}
