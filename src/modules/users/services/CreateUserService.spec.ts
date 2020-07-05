import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name: 'Junior',
      email: 'a@a.com',
      password: 'senhasegura',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create user with same email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      name: 'Junior',
      email: 'a@a.com',
      password: 'senhasegura',
    });

    expect(
      createUser.execute({
        name: 'Junior',
        email: 'a@a.com',
        password: 'senhasegura',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
