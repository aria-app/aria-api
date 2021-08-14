import { ID, Result, Song } from '../../../types';

export interface SongRepository {
  getSongById(id: ID): Promise<Result<Song>>;
}
