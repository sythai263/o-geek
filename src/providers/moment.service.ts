import * as moment from 'moment';

export class MomentService {
    moment(): moment.Moment {
        // eslint-disable-next-line import/namespace
        moment.updateLocale('en', { week: { dow: 6 } });
        return this.moment();
    }
    public static getDateInWeek(week: number): Date {
        return moment().utcOffset('+07:00').week(week).toDate();
    }

    public static getCurrentWeek(): number {
        return moment().week();
    }

    public static getCurrentDay(): number {
        return moment().toDate().getDay();
    }

    public static getNumOfWeek(injectedDate: Date): string {
        return moment(injectedDate).format('e');
    }

    public static convertDateToWeek(injectedDate: Date): number {
        return moment(injectedDate).week();
    }

    public static getStartOfDay(injectedDate: Date): Date {
        return moment(injectedDate).startOf('day').toDate();
    }

    public static getFirstDateOfWeek(injectedDate: Date): string {
        const num = moment(injectedDate).day();
        return moment(injectedDate)
            .utcOffset('+07:00')
            .add(-num, 'days')
            .startOf('day')
            .format('MM-DD-YYYY');
    }

    public static getLastDateOfWeek(injectedDate: Date): string {
        const num = 6;
        return moment(injectedDate)
            .utcOffset('+07:00')
            .add(num, 'days')
            .endOf('day')
            .format('MM-DD-YYYY');
    }

    public static shiftLastDateChart(injectedDate: Date): Date {
        const numOfWeekAfterCurrentWeekWhichContainsPlannedWorkload = 5;
        const numOfDaysInAWeek = 7;
        const result = new Date(
            moment(this.getLastDateOfWeek(injectedDate))
                .utcOffset('+07:00')
                .add(
                    numOfDaysInAWeek *
                        numOfWeekAfterCurrentWeekWhichContainsPlannedWorkload,
                    'days',
                )
                .endOf('day')
                .format('MM-DD-YYYY'),
        );
        // eslint-disable-next-line @typescript-eslint/tslint/config
        return result;
    }

    public static firstDateOfWeek(week: number): Date {
        const date = moment().week(week).format();

        const num = moment(date).format('e');

        const firstDateOfWeek = moment(date)
            .add(-num, 'days')
            .startOf('day')
            .format();

        return new Date(firstDateOfWeek);
    }

    public static lastDateOfWeek(week: number): Date {
        const date = moment().week(week).format();

        const num = moment(date).format('e');

        const endNum = 6 - Number(num);
        const endDateOfWeek = moment(date)
            .add(endNum, 'days')
            .endOf('day')
            .format();

        return new Date(endDateOfWeek);
    }

    public static firstDateOfWeekByYear(week: number, year: number): Date {
        const date = moment().week(week).year(year).format();

        const num = moment(date).format('e');

        const firstDateOfWeek = moment(date)
            .add(-num, 'days')
            .startOf('day')
            .format();

        return new Date(firstDateOfWeek);
    }
    public static lastDateOfWeekByYear(week: number, year: number): Date {
        const date = moment().week(week).year(year).format();

        const num = moment(date).format('e');

        const endNum = 6 - Number(num);
        const endDateOfWeek = moment(date)
            .add(endNum, 'days')
            .endOf('day')
            .format();

        return new Date(endDateOfWeek);
    }

    public static shiftFirstDateChart(injectedDate: Date): Date {
        const numOfWeekToContainWorklog = 12;
        const numOfDaysInAWeek = 7;

        return new Date(
            moment(this.getFirstDateOfWeek(injectedDate))
                .utcOffset('+07:00') // Change timezone to +7 UTC
                .subtract(numOfDaysInAWeek * numOfWeekToContainWorklog, 'days')
                .endOf('day')
                .format('MM-DD-YYYY'),
        );
    }

    public static shiftFirstWeekChart(injectedDate: Date): number {
        const createdWeek = moment(injectedDate).week();
        const currentWeek = moment().week();
        const subtract = currentWeek - createdWeek;
        const weekOne = 1;
        const numOfWeekToContainWorklog = 12;
        if (moment(injectedDate).year() < moment().year()) {
            if (currentWeek > 0 && currentWeek < numOfWeekToContainWorklog) {
                return weekOne;
            }
            return currentWeek - numOfWeekToContainWorklog + 1;
        }
        if (moment(injectedDate).year === moment().year) {
            if (currentWeek > 0 && currentWeek <= numOfWeekToContainWorklog) {
                return createdWeek;
            }
            if (currentWeek > numOfWeekToContainWorklog) {
                if (subtract > 0) {
                    return currentWeek - numOfWeekToContainWorklog + 1;
                }
                return createdWeek;
            }
        }
    }

    public static shiftLastWeekChart(startWeekChart: number): number {
        const weekAmountInChart = 17;
        const numOfWeekInYear = 52;
        if (startWeekChart + weekAmountInChart > numOfWeekInYear) {
            return numOfWeekInYear;
        }
        return startWeekChart + weekAmountInChart;
    }
}
