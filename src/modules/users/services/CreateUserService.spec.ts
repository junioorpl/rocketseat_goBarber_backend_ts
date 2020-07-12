import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Junior',
      email: 'a@a.com',
      password: 'senhasegura',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create user with same email', async () => {
    await createUser.execute({
      name: 'Junior',
      email: 'a@a.com',
      password: 'senhasegura',
    });

    await expect(
      createUser.execute({
        name: 'Junior',
        email: 'a@a.com',
        password: 'senhasegura',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
