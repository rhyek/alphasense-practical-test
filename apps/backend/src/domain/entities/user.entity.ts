import { emitDomainEvent } from '../domain-event.emitter';
import { UserBalanceChangedEvent } from '../events/user-balance-changed.event';

export class UserEntity {
  constructor(public readonly username: string, public balance: number) {}

  public addBalance(credit: number) {
    this.balance += credit;
    emitDomainEvent(new UserBalanceChangedEvent(this));
  }
}
