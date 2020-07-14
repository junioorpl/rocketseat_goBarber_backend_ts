import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeAll(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list the providers', async () => {
    const loggedUser = await fakeUsersRepository.create({
      name: 'Junior',
      email: 'a@a.com.br',
      password: 'senhasegura',
    });

    const user1 = await fakeUsersRepository.create({
      name: 'Second user',
      email: 'b@b.com.br',
      password: '123123',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Third User',
      email: 'c@c.com.br',
      password: '123456',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
