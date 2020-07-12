import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import SendForgotPasswordMailService from './SendForgotPasswordMailService';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordMail: SendForgotPasswordMailService;

describe('SendForgotPasswordMail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    sendForgotPasswordMail = new SendForgotPasswordMailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'Junior',
      email: 'a@a.com',
      password: 'senhasegura',
    });

    await sendForgotPasswordMail.execute({
      email: 'a@a.com',
    });

    expect(sendMail).toBeCalled();
  });

  it('should not be able to recover a non-existing password', async () => {
    await expect(
      sendForgotPasswordMail.execute({
        email: 'a@a.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Junior',
      email: 'a@a.com',
      password: 'senhasegura',
    });

    await sendForgotPasswordMail.execute({ email: 'a@a.com' });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
