import { Server, Socket } from 'socket.io';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@my/shared/src/event-map';
import { Session, SessionService } from '../application/session.service';
import { Injectable } from 'injection-js';
import { RequestListRoomsUseCase } from '../application/use-cases/request-list-rooms.use-case';
import { JoinRoomUseCase } from '../application/use-cases/join-room.use-case';
import { onDomainEvent } from '../domain/domain-event.emitter';
import { UserJoinedRoomEvent } from '../domain/events/user-joined-room.event';
import { UserLeftRoomEvent } from '../domain/events/user-left-room.event';
import { RoomEntity } from '../domain/entities/room.entity';
import { UserPlacedBetEvent } from '../domain/events/user-placed-bet.event';
import { GameStartedEvent } from '../domain/events/game-started.event';
import { DieRolledEvent } from '../domain/events/die-rolled.event';
import { RoomRepository } from '../infrastructure/persistence/room.repository';
import { UserException } from '../domain/exceptions/user-exception';
import { GameCompleteEvent } from '../domain/events/game-complete.event';
import { PlayersTiedEvent } from '../domain/events/players-tied.event';
import { UserBalanceChangedEvent } from '../domain/events/user-balance-changed.event';

@Injectable()
export class RegisterWsEventHandlers {
  constructor(
    private readonly sessionService: SessionService,
    private readonly roomRepository: RoomRepository,
    private readonly requestListRoomsUseCase: RequestListRoomsUseCase,
    private readonly joinRoomUseCase: JoinRoomUseCase
  ) {}

  private static getRoomWsId(room: RoomEntity) {
    return `room-${room.id}`;
  }

  public registerDomainEventHandlers(
    server: Server<ClientToServerEvents, ServerToClientEvents>
  ) {
    onDomainEvent(UserJoinedRoomEvent, (event) => {
      const { room, user } = event;
      const roomWsId = RegisterWsEventHandlers.getRoomWsId(room);
      const socket = this.sessionService.getCurrentSocketForUser(user);
      if (socket) {
        console.log(`joining room ${roomWsId} on socket ${socket.id}`);
        socket.join(roomWsId);
      }
      server.to(roomWsId).emit('ROOM_STATUS', room.getRoomStatus());
    });

    onDomainEvent(UserLeftRoomEvent, (event) => {
      const { room, user } = event;
      const roomWsId = RegisterWsEventHandlers.getRoomWsId(room);
      const socket = this.sessionService.getCurrentSocketForUser(user);
      if (socket) {
        socket.leave(roomWsId);
      }
      server.to(roomWsId).emit('ROOM_STATUS', room.getRoomStatus());
    });

    onDomainEvent(UserBalanceChangedEvent, (event) => {
      const { user } = event;
      const socket = this.sessionService.getCurrentSocketForUser(user);
      if (socket) {
        socket.emit('BALANCE', { balance: user.balance });
      }
    });

    onDomainEvent(UserPlacedBetEvent, (event) => {
      const { room, user, amount } = event;
      const roomWsId = RegisterWsEventHandlers.getRoomWsId(room);
      server
        .to(roomWsId)
        .emit('BET_PLACED', { username: user.username, amount });
    });

    onDomainEvent(GameStartedEvent, (event) => {
      const { room, data } = event;
      const roomWsId = RegisterWsEventHandlers.getRoomWsId(room);
      server.to(roomWsId).emit('GAME_STARTED', data);
    });

    onDomainEvent(DieRolledEvent, (event) => {
      const { room, user, value } = event;
      const roomWsId = RegisterWsEventHandlers.getRoomWsId(room);
      server.to(roomWsId).emit('DIE_ROLLED', {
        username: user.username,
        value,
      });
    });

    onDomainEvent(GameCompleteEvent, (event) => {
      const { room, user, pot } = event;
      const roomWsId = RegisterWsEventHandlers.getRoomWsId(room);
      server.to(roomWsId).emit('GAME_COMPLETE', {
        winner: {
          username: user.username,
          amount: pot,
        },
      });
    });

    onDomainEvent(PlayersTiedEvent, (event) => {
      const { users } = event;
      for (const user of users) {
        const socket = this.sessionService.getCurrentSocketForUser(user);
        if (socket) {
          socket.emit('REROLL');
        }
      }
    });
  }

  public registerSocketEventHandlers(
    socket: Socket<ClientToServerEvents, ServerToClientEvents>
  ) {
    const session: Session = socket.data.session;
    const { user } = session;

    console.log(`user ${user.username} connected. balance: ${user.balance}`);

    setTimeout(() => {
      socket.emit('BALANCE', { balance: user.balance });
    }, 1_000);

    socket.on('disconnect', () => {
      console.log('disconnect', user.username);
      this.sessionService.signOut(user.username);
    });

    function handleErrors(error: unknown) {
      if (error instanceof UserException) {
        if (error.code === 'INSUFFICIENT_FUNDS') {
          socket.emit('INSUFFICIENT_FUNDS'); // requirement to send specific message
        } else {
          socket.emit('ERROR', { errorCode: error.code });
        }
      } else if (error instanceof Error) {
        socket.emit('ERROR', { errorMessage: error.message });
      } else {
        throw error;
      }
    }

    socket.on('LIST_ROOMS', (callback) => {
      const response = this.requestListRoomsUseCase.handle();
      callback(response);
    });
    socket.on('JOIN_ROOM', (roomId) => {
      this.joinRoomUseCase.handle(user, roomId);
    });
    socket.on('BET', ({ amount }) => {
      try {
        const room = this.roomRepository.findCurrentRoomForUserOrFail(user);
        room.userPlaceBet(user, amount);
      } catch (error) {
        handleErrors(error);
      }
    });
    socket.on('START', () => {
      try {
        const room = this.roomRepository.findCurrentRoomForUserOrFail(user);
        room.startGame();
      } catch (error) {
        handleErrors(error);
      }
    });
    socket.on('ROLL', () => {
      try {
        const room = this.roomRepository.findCurrentRoomForUserOrFail(user);
        room.rollDie(user);
      } catch (error) {
        handleErrors(error);
      }
    });
  }
}
