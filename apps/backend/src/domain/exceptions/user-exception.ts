import { UserExceptionCode } from '@my/shared/dist/user-exception-codes';

export class UserException extends Error {
  constructor(public readonly code: UserExceptionCode) {
    super();
  }
}
