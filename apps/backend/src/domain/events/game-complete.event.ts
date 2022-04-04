import { RoomEntity } from '../entities/room.entity';
import { UserEntity } from '../entities/user.entity';

export class GameCompleteEvent {
  constructor(
    public readonly room: RoomEntity,
    public readonly user: UserEntity,
    public readonly pot: number
  ) {}
}
