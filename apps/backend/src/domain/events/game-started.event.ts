import { RoomEntity } from '../entities/room.entity';

export class GameStartedEvent {
  constructor(
    public readonly room: RoomEntity,
    public readonly data: {
      bets: {
        username: string;
        amount: number;
      }[];
      total: number;
    }
  ) {}
}
