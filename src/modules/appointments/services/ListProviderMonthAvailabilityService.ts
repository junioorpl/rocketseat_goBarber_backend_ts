import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate } from 'date-fns';

import IAppointmentsRepoistory from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appoinmentsRepository: IAppointmentsRepoistory,
  ) { } //eslint-disable-line

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appoinmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        year,
        month,
      },
    );

    const daysInMonth = getDaysInMonth(new Date(year, month - 1));

    const eachDay = Array.from(
      { length: daysInMonth },
      (_, index) => index + 1,
    );

    const availability = eachDay.map(day => {
      const appointmentsInDay = appointments.filter(a => {
        return getDate(a.date) === day;
      });

      return {
        day,
        available: appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
