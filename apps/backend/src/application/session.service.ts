import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@my/shared/src/event-map';
import { Injectable } from 'injection-js';
import { Socket } from 'socket.io';
import { UserEntity } from '../domain/entities/user.entity';
import { RoomRepository } from '../infrastructure/persistence/room.repository';
import { UserRepository } from '../infrastructure/persistence/user.repository';

export type Session = {
  user: UserEntity;
  socket?: Socket<ClientToServerEvents, ServerToClientEvents>;
};

@Injectable()
export class SessionService {
  private sessionsByUsername = new Map<string, Session>();

  constructor(
    private readonly userRepository: UserRepository,
    private readonly roomRepository: RoomRepository
  ) {}

  public signIn(username: string) {
    const user = this.userRepository.findByUsername(username);
    this.sessionsByUsername.set(username, { user });
  }

  public validateSession(username: string) {
    return this.sessionsByUsername.get(username) ?? null;
  }

  public signOut(username: string) {
    const session = this.sessionsByUsername.get(username);
    if (session) {
      const { user } = session;
      const currentRoom = this.roomRepository.findCurrentRoomForUser(user);
      if (currentRoom) {
        currentRoom.userLeave(user);
      }
      this.sessionsByUsername.delete(username);
    }
  }

  public getCurrentSocketForUser(user: UserEntity) {
    return this.sessionsByUsername.get(user.username)?.socket ?? null;
  }
}
