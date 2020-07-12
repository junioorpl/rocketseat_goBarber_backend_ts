import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import IAppointmentsRepoistory from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IUsersRepoistory from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IUserTokensRepoistory from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

container.registerSingleton<IAppointmentsRepoistory>(
  'AppointmentsRepository',
  AppointmentsRepository,
);

container.registerSingleton<IUsersRepoistory>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepoistory>(
  'UserTokensRepository',
  UserTokensRepository,
);
