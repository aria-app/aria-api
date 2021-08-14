import { ID, Result, Song } from '../../../types';

export const SongRepository = Symbol('SongRepository');
export interface SongRepository {
  getSongById(id: ID): Promise<Result<Song>>;
}
