import { ID, Result, Song } from '../../../types';

export interface GetSongsOptions {
  limit?: number;
  page?: number;
  search?: string;
  sort?: string;
  sortDirection?: string;
  userId?: number;
}

export const SongRepository = Symbol('SongRepository');
export interface SongRepository {
  getSongById(id: ID): Promise<Result<Song>>;
  getSongs(options: GetSongsOptions): Promise<Result<Song[]>>;
  // getSongsCount(options: GetSongsOptions): Promise<Result<number>>;
}
