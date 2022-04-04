import 'reflect-metadata';
import { ReflectiveInjector } from 'injection-js';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { SessionService } from './application/session.service';
import { RoomRepository } from './infrastructure/persistence/room.repository';
import { RequestListRoomsUseCase } from './application/use-cases/request-list-rooms.use-case';
import { JoinRoomUseCase } from './application/use-cases/join-room.use-case';
import { RegisterWsEventHandlers } from './presentation/register-ws-event-handlers';

export const injector = ReflectiveInjector.resolveAndCreate([
  RegisterWsEventHandlers,
  SessionService,
  UserRepository,
  RoomRepository,
  RequestListRoomsUseCase,
  JoinRoomUseCase,
]);
