import { RoomEntity } from '../entities/room.entity';
import { UserEntity } from '../entities/user.entity';

export class UserPlacedBetEvent {
  constructor(
    public readonly user: UserEntity,
    public readonly room: RoomEntity,
    public readonly amount: number
  ) {}
}
