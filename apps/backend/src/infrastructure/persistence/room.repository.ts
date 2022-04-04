import { Injectable } from 'injection-js';
import { RoomEntity } from '../../domain/entities/room.entity';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserException } from '../../domain/exceptions/user-exception';

@Injectable()
export class RoomRepository {
  private rooms: RoomEntity[] = [];

  constructor() {
    for (let id = 1; id < 6; id++) {
      const room = new RoomEntity(id);
      this.rooms.push(room);
    }
  }

  getRooms() {
    return this.rooms;
  }

  findRoom(id: number) {
    return this.rooms.find((room) => room.id === id) ?? null;
  }

  findCurrentRoomForUser(user: UserEntity) {
    return (
      this.rooms.find((room) => room.users.some((u) => u === user)) ?? null
    );
  }

  findCurrentRoomForUserOrFail(user: UserEntity) {
    const room = this.findCurrentRoomForUser(user);
    if (!room) {
      throw new UserException('NOT_IN_ROOM');
    }
    return room;
  }
}
