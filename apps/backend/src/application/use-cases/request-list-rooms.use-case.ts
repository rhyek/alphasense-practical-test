import { Injectable } from 'injection-js';
import { ListRoomsDto } from '@my/shared/dist/dtos/list-rooms.dto';
import { RoomRepository } from '../../infrastructure/persistence/room.repository';

@Injectable()
export class RequestListRoomsUseCase {
  constructor(private readonly roomRepository: RoomRepository) {}

  handle(): ListRoomsDto {
    const rooms = this.roomRepository.getRooms();
    return {
      rooms: rooms.map((room) => ({ id: room.id })),
    };
  }
}
