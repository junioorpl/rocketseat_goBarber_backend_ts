import { uuid } from 'uuidv4';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '@modules/users/infra/typeorm/entities/UserTokens';

class FakeUserTokensRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.userTokens.find(t => t.token === token);

    return userToken;
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: Date.now(),
      updated_at: Date.now(),
    });

    this.userTokens.push(userToken);

    return userToken;
  }
}

export default FakeUserTokensRepository;
