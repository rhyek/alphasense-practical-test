import { ListRoomsDto } from './dtos/list-rooms.dto';
import { UserExceptionCode } from './user-exception-codes';

export type ClientToServerEvents = {
  LIST_ROOMS: (callback: (data: ListRoomsDto) => void) => void;
  JOIN_ROOM: (roomId: number) => void;
  BET: (data: { amount: number }) => void;
  START: () => void;
  ROLL: () => void;
};

export type ServerToClientEvents = {
  ERROR: (data: {
    errorCode?: UserExceptionCode;
    errorMessage?: string;
  }) => void;
  ROOM_STATUS: (data: {
    users: {
      username: string;
    }[];
  }) => void;
  BET_PLACED: (data: { username: string; amount: number }) => void;
  BALANCE: (data: { balance: number }) => void;
  INSUFFICIENT_FUNDS: () => void;
  GAME_STARTED: (data: {
    bets: {
      username: string;
      amount: number;
    }[];
    total: number;
  }) => void;
  DIE_ROLLED: (data: { username: string; value: number }) => void;
  GAME_COMPLETE: (data: {
    winner: {
      username: string;
      amount: number;
    };
  }) => void;
  REROLL: () => void;
};
