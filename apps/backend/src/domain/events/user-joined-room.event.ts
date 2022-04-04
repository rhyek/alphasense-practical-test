import { RoomEntity } from '../entities/room.entity';
import { UserEntity } from '../entities/user.entity';

export class UserJoinedRoomEvent {
  constructor(
    public readonly user: UserEntity,
    public readonly room: RoomEntity
  ) {}
}
