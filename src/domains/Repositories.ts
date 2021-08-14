import { SongRepository } from './songs';

export { PrismaSongRepository } from './songs';

export interface Repositories {
  songRepository: SongRepository;
}
