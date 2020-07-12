import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import AppError from '@shared/errors/AppError';
import UpdateProfileService from './UpdateProfileService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });
  it('should be able to update the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'Junior',
      email: 'a@a.com',
      password: 'senhasegura',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'outro nome',
      email: 'b@b.com',
    });

    expect(updatedUser.name).toBe('outro nome');
    expect(updatedUser.email).toBe('b@b.com');
  });

  it('should not be able to update the profile of non existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-id',
        name: 'Test name',
        email: 'Test keyword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change the email to already used email', async () => {
    const user = await fakeUserRepository.create({
      name: 'Junior',
      email: 'a@a.com',
      password: 'senhasegura',
    });

    await fakeUserRepository.create({
      name: 'Outro user',
      email: 'b@b.com',
      password: 'senhamaissegura',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'outro nome',
        email: 'b@b.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUserRepository.create({
      name: 'Junior',
      email: 'a@a.com',
      password: 'senhasegura',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Junior',
      email: 'a@a.com',
      oldPassword: 'senhasegura',
      password: 'senhasemseguranca',
    });

    expect(updatedUser.password).toBe('senhasemseguranca');
  });

  it('should not be able to update the password without the old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'Junior',
      email: 'a@a.com',
      password: 'senhasegura',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Junior',
        email: 'a@a.com',
        password: 'senhasemseguranca',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with the wrong old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'Junior',
      email: 'a@a.com',
      password: 'senhasegura',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Junior',
        email: 'a@a.com',
        oldPassword: 'senhasemseguranca',
        password: 'senhasemseguranca',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
