import { groupBy, random, remove } from 'lodash';
import { emitDomainEvent } from '../domain-event.emitter';
import { DieRolledEvent } from '../events/die-rolled.event';
import { GameCompleteEvent } from '../events/game-complete.event';
import { GameStartedEvent } from '../events/game-started.event';
import { PlayersTied } from '../events/players-tied.event';
import { UserJoinedRoomEvent } from '../events/user-joined-room.event';
import { UserLeftRoomEvent } from '../events/user-left-room.event';
import { UserPlacedBetEvent } from '../events/user-placed-bet.event';
import { UserException } from '../exceptions/user-exception';
import { UserEntity } from './user.entity';

class Bet {
  constructor(
    public readonly user: UserEntity,
    public readonly amount: number
  ) {}
}

class Roll {
  constructor(
    public readonly user: UserEntity,
    public readonly value: number
  ) {}
}

export class RoomEntity {
  public users: UserEntity[] = [];

  private gameStarted = false;
  private gameTied = false;
  private bets: Bet[] = [];
  private players: UserEntity[] = [];
  private rolls: Roll[] = [];

  private dev_gamePhase = 1; // to help during dev since no e2e or integration tests

  constructor(public readonly id: number) {}

  public userJoin(user: UserEntity) {
    if (!this.users.includes(user)) {
      this.users.push(user);
      emitDomainEvent(new UserJoinedRoomEvent(user, this));
    }
  }

  public userLeave(user: UserEntity) {
    const index = this.users.indexOf(user);
    if (index >= 0) {
      this.users.splice(index, 1);
      remove(this.players, (player) => player === user);
      remove(this.rolls, (roll) => roll.user === user);
      this.processCompletedGameIfCompleted();
      emitDomainEvent(new UserLeftRoomEvent(user, this));
    }
  }

  public getRoomStatus() {
    const roomStatus = {
      users: this.users.map((user) => ({ username: user.username })),
    };
    return roomStatus;
  }

  public userPlaceBet(user: UserEntity, amount: number) {
    if (this.gameStarted && !this.gameTied) {
      throw new UserException('GAME_ONGOING');
    }
    if (this.gameTied && !this.players.includes(user)) {
      throw new UserException('NOT_PARTICIPATING');
    }
    if (user.balance < amount) {
      throw new UserException('INSUFFICIENT_FUNDS');
    }
    user.balance -= amount;
    this.bets.push(new Bet(user, amount));
    emitDomainEvent(new UserPlacedBetEvent(user, this, amount));
  }

  private static betsSum(bets: Bet[]) {
    return bets
      .map((bet) => bet.amount)
      .reduce((sum, current) => sum + current, 0);
  }

  private getCurrentPot() {
    return RoomEntity.betsSum(this.bets);
  }

  private getBetsGroupedByUsername() {
    const bets = Object.entries(
      groupBy(this.bets, (bet) => bet.user.username)
    ).map(([username, bets]) => ({
      username,
      amount: RoomEntity.betsSum(bets),
    }));
    return bets;
  }

  private getBettingUsers() {
    const betsGroupedByUsername = this.getBetsGroupedByUsername();
    const bettingUsernames = betsGroupedByUsername.map((bet) => bet.username);
    return this.users.filter((user) =>
      bettingUsernames.includes(user.username)
    );
  }

  public startGame() {
    if (this.gameStarted) {
      throw new UserException('GAME_ONGOING');
    }
    if (this.getBetsGroupedByUsername().length < 2) {
      throw new UserException('NOT_ENOUGH_BETS');
    }
    this.gameStarted = true;
    this.gameTied = false;
    this.dev_gamePhase = 1; // to help during dev since no e2e or integration tests
    this.players = this.getBettingUsers();
    const betsGroupedByUsername = this.getBetsGroupedByUsername();
    emitDomainEvent(
      new GameStartedEvent(this, {
        bets: betsGroupedByUsername,
        total: this.getCurrentPot(),
      })
    );
  }

  public rollDie(user: UserEntity) {
    if (!this.gameStarted) {
      return; // if game is not started just ignore
    }
    // ensure they are a current player
    if (this.players.every((player) => player !== user)) {
      throw new UserException('NOT_PARTICIPATING');
    }
    // ensure they haven't rolled already
    if (this.rolls.some((roll) => roll.user === user)) {
      throw new UserException('ALREADY_ROLLED');
    }

    // to help during dev since no e2e or integration tests
    // first phase: all users except marty get 4, marty gets 1.
    // next phases: all users get random(1, 6) (marty no longer participating)
    const value =
      this.dev_gamePhase === 1 // to help during dev since no e2e or integration tests
        ? user.username === 'marty'
          ? 1
          : 4
        : random(1, 6);
    const roll = new Roll(user, value);
    this.rolls.push(roll);

    emitDomainEvent(new DieRolledEvent(this, user, value));

    this.processCompletedGameIfCompleted();
  }

  private processCompletedGameIfCompleted() {
    if (this.players.length === this.rolls.length) {
      this.dev_gamePhase++; // to help during dev since no e2e or integration tests
      const max = Math.max(...this.rolls.map((roll) => roll.value));
      const winningRolls = this.rolls.filter((roll) => roll.value === max);
      if (winningRolls.length === 1) {
        const [winningRoll] = winningRolls;
        const { user } = winningRoll;
        const pot = this.getCurrentPot();
        user.balance += pot; // assign winnings

        this.players = [];
        this.bets = [];
        this.rolls = [];
        this.gameStarted = false;
        this.gameTied = false;
        emitDomainEvent(new GameCompleteEvent(this, user, pot));
      } else {
        this.gameTied = true;
        const tiedPlayers = winningRolls.map((winningRoll) => winningRoll.user);
        this.players = tiedPlayers;
        this.rolls = [];
        emitDomainEvent(new PlayersTied(this, tiedPlayers, max));
      }
    }
  }
}
