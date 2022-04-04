import { UserEntity } from '../entities/user.entity';

export class UserBalanceChangedEvent {
  constructor(public readonly user: UserEntity) {}
}
