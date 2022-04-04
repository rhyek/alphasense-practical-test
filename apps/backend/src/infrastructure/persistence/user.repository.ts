import { Injectable } from 'injection-js';
import { UserEntity } from '../../domain/entities/user.entity';

@Injectable()
export class UserRepository {
  private data = new Map<string, UserEntity>();

  public findByUsername(username: string) {
    let user = this.data.get(username);
    if (!user) {
      user = new UserEntity(username, 200);
      this.data.set(username, user);
    }
    return user;
  }
}
