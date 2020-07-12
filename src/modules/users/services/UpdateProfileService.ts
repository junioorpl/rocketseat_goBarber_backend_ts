import User from '@modules/users/infra/typeorm/entities/User';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  oldPassword?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) { } //eslint-disable-line

  public async execute({
    user_id,
    name,
    email,
    oldPassword,
    password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('User does not exists');

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id)
      throw new AppError('E-mail already in use.');

    user.name = name;
    user.email = email;

    if (password && !oldPassword)
      throw new AppError(
        'You need to inform the old password to set a new password',
      );

    if (password && oldPassword) {
      const checkOldPassword = await this.hashProvider.compareHash(
        oldPassword,
        user.password,
      );

      if (!checkOldPassword) throw new AppError('Incorrect old password.');

      user.password = await this.hashProvider.generateHash(password);
    }
    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
