import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUserRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatar = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    );
  });
  it('should be able to update avatar', async () => {
    const user = await fakeUserRepository.create({
      name: 'Junior',
      email: 'a@a.com',
      password: 'senhasegura',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpeg',
    });

    expect(user.avatar).toBe('avatar.jpeg');
  });
  it('should not be able to update avatar of non existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-userid',
        avatarFilename: 'avatar.jpeg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should delete old avatar when updating to a new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUserRepository.create({
      name: 'Junior',
      email: 'a@a.com',
      password: 'senhasegura',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpeg',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.jpeg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpeg');
    expect(user.avatar).toBe('avatar2.jpeg');
  });
});
