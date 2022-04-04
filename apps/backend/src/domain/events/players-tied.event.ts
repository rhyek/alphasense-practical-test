import { RoomEntity } from '../entities/room.entity';
import { UserEntity } from '../entities/user.entity';

export class PlayersTied {
  constructor(
    public readonly room: RoomEntity,
    public readonly users: UserEntity[],
    public readonly dieValue: number
  ) {}
}
