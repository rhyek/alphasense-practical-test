import { Injectable } from 'injection-js';
import { UserEntity } from '../../domain/entities/user.entity';
import { RoomRepository } from '../../infrastructure/persistence/room.repository';

@Injectable()
export class JoinRoomUseCase {
  constructor(private readonly roomRepository: RoomRepository) {}

  public handle(user: UserEntity, roomId: number) {
    const currentRoom = this.roomRepository.findCurrentRoomForUser(user);
    if (currentRoom) {
      if (currentRoom.id === roomId) {
        return;
      } else {
        currentRoom.userLeave(user);
      }
    }
    const room = this.roomRepository.findRoom(roomId);
    if (!room) {
      throw new Error('Room not found');
    }
    room.userJoin(user);
  }
}
