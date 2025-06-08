import { create } from "zustand";

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

  updateToday: () => void;

  setCalender: (month: number, year: number) => void;
  setCurrent: (date: number, week: number, month: number, year: number) => void;
  getDates: (month: number, year: number) => number[][];
  getMonth: (month: number) => { full: string; short: string };
  getWeeks: () => { short1: string; short2: string }[];
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

export const useCalenderStore = create<CalenderStore>()((set) => {
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

    getMonth: (month) =>
      [
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
      ][month],

    getWeeks: () => [
      { short1: "Su", short2: "SUN" },
      { short1: "Mo", short2: "MON" },
      { short1: "Tu", short2: "TUE" },
      { short1: "We", short2: "WED" },
      { short1: "Th", short2: "THU" },
      { short1: "Fr", short2: "FRI" },
      { short1: "Sa", short2: "SAT" },
    ],
  };
});
