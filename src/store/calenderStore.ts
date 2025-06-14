import type { EventI } from "./../types/global.d";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CalenderStore {
  today: {
    date: number;
    month: number;
    year: number;
    week: number;
  };

  current: {
    date: number;
    month: number;
    year: number;
    week: number;
  };

  calender: {
    month: number;
    year: number;
  };

  eventByDates: Record<string, EventI[]>;

  updateToday: () => void;
  setCalender: (month: number, year: number) => void;
  setCurrent: (date: number, week: number, month: number, year: number) => void;

  getDates: (month: number, year: number) => number[][];
  getMonths: () => { full: string; short: string }[];
  getMonthName: (month: number) => { full: string; short: string };
  getWeeks: () => { short1: string; short2: string; full: string }[];
  getNextScheduledTime: (currHour: number) => number;
  addEvent: (event: EventI, date: number) => void;
  editEvent: (key: string, event: EventI) => void;
  deleteEvent: (key: string, startHour: number) => void;
}

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

const firstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const daysInMonth = (month: number, year: number) =>
  [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][
    month
  ];

const getWeek = (date: number, month: number, year: number) =>
  Math.floor((date - 1 + firstDayOfMonth(year, month)) / 7);

export const useCalenderStore = create<CalenderStore>()(
  persist(
    (set, get) => {
      const today = {
        date: new Date().getDate(),
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
      };
      const todayWeek = getWeek(today.date, today.month, today.year);

      return {
        today: {
          ...today,
          week: todayWeek,
        },

        current: {
          date: today.date,
          month: today.month,
          year: today.year,
          week: todayWeek,
        },

        calender: {
          month: today.month,
          year: today.year,
        },

        eventByDates: {},

        updateToday: () => {
          set((state) => {
            const newDate = new Date();
            if (
              newDate.getDate() != state.today.date ||
              newDate.getMonth() != state.today.month ||
              newDate.getFullYear() != state.today.year
            )
              return {
                ...state,
                today: {
                  date: newDate.getDate(),
                  month: newDate.getMonth(),
                  week: getWeek(
                    newDate.getDate(),
                    newDate.getMonth(),
                    newDate.getFullYear()
                  ),
                  year: newDate.getFullYear(),
                },
              };

            return state;
          });
        },

        setCalender: (month, year) => {
          set((state) => {
            return {
              ...state,
              calender: {
                month,
                year,
              },
            };
          });
        },

        setCurrent: (date, week, month, year) => {
          set((state) => ({
            ...state,
            current: {
              date,
              month: month,
              year: year,
              week,
            },
          }));
        },

        getDates: (month, year) => {
          let dates: number[][] = [];
          for (
            let i = 0;
            i < daysInMonth(month, year) + firstDayOfMonth(year, month);
            i++
          ) {
            let currentDate = i - firstDayOfMonth(year, month) + 1;
            if (currentDate <= 0) currentDate = 0;

            if (i % 7 != 0) {
              dates[Math.floor(i / 7)].push(currentDate);
            } else {
              dates[Math.floor(i / 7)] = [currentDate];
            }
          }

          for (let i = dates[dates.length - 1].length; i < 7; i++) {
            dates[dates.length - 1].push(0);
          }
          return dates;
        },

        getMonths: () => [
          { full: "January", short: "Jan" },
          { full: "February", short: "Feb" },
          { full: "March", short: "Mar" },
          { full: "April", short: "Apr" },
          { full: "May", short: "May" },
          { full: "June", short: "Jun" },
          { full: "July", short: "Jul" },
          { full: "August", short: "Aug" },
          { full: "September", short: "Sep" },
          { full: "October", short: "Oct" },
          { full: "November", short: "Nov" },
          { full: "December", short: "Dec" },
        ],

        getMonthName: (month) => get().getMonths()[month],

        getNextScheduledTime: (currHour) => {
          let nextScheduledTime = 24;
          const getEvents = useCalenderStore((state) => state.eventByDates);

          const dateEvent =
            getEvents[
              `${get().current.year}-${get().current.month}-${
                get().current.date
              }`
            ];

          if (dateEvent) {
            const i = dateEvent.findIndex((elem) => currHour < elem.end);
            if (i != -1) nextScheduledTime = dateEvent[i].start;
          }
          return nextScheduledTime;
        },
        getWeeks: () => [
          { short1: "Su", short2: "SUN", full: "Sunday" },
          { short1: "Mo", short2: "MON", full: "Monday" },
          { short1: "Tu", short2: "TUE", full: "Tuesday" },
          { short1: "We", short2: "WED", full: "Wednesday" },
          { short1: "Th", short2: "THU", full: "Thursday" },
          { short1: "Fr", short2: "FRI", full: "Friday" },
          { short1: "Sa", short2: "SAT", full: "Saturday" },
        ],

        addEvent: (event, date) => {
          set((state) => {
            const key = `${state.calender.year}-${state.calender.month}-${date}`;

            if (state.eventByDates[key] == null) {
              return {
                ...state,
                eventByDates: {
                  ...state.eventByDates,
                  [key]: [event],
                },
              };
            }
            const dateArray = [...state.eventByDates[key]];
            const i = dateArray.findIndex((el) => el.end > event.start);
            if (i != -1) dateArray.splice(i, 0, event);
            else dateArray.push(event);

            return {
              ...state,
              eventByDates: {
                ...state.eventByDates,
                [key]: [...dateArray],
              },
            };
          });
        },

        editEvent: (key, event) => {
          const eventsOfDay = get().eventByDates[key];
          const idx = eventsOfDay.findIndex((v) => v.start == event.start);
          const newA = [...get().eventByDates[key]];
          newA[idx] = { ...event, event: event.event, end: event.end };
          set((state) => ({
            ...state,
            eventByDates: {
              ...state.eventByDates,
              [key]: [...newA],
            },
          }));
        },

        deleteEvent: (key, startHour) => {
          const eventsOfDay = get().eventByDates[key];
          const idx = eventsOfDay.findIndex((v) => v.start == startHour);

          set((state) => ({
            ...state,
            eventByDates: {
              ...state.eventByDates,
              [key]: [
                ...state.eventByDates[key].slice(0, idx),
                ...state.eventByDates[key].slice(idx + 1),
              ],
            },
          }));
        },
      };
    },
    {
      name: "calender-event",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ eventByDates: state.eventByDates }),
    }
  )
);
