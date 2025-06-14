import { useEffect } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useCalenderStore } from "../../store/calenderStore";

export default () => {
  const today = useCalenderStore((state) => state.today);
  const setToday = useCalenderStore((state) => state.updateToday);

  const calender = useCalenderStore((state) => state.calender);
  const setCalender = useCalenderStore((state) => state.setCalender);

  const current = useCalenderStore((state) => state.current);
  const setCurrent = useCalenderStore((state) => state.setCurrent);

  const getDates = useCalenderStore((state) => state.getDates);
  const getMonth = useCalenderStore((state) => state.getMonthName);
  const getWeeks = useCalenderStore((state) => state.getWeeks);

  //Updates the Date at every midnight
  useEffect(() => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);

    const msRemaining = midnight.getTime() - now.getTime();
    const timeOutID = setTimeout(() => {
      setToday();
    }, msRemaining);

    return () => clearTimeout(timeOutID);
  }, [today]);

  const dates: number[][] = getDates(calender.month, calender.year);

  return (
    <article className="w-full max-w-[300px] p-4 border-[0.5px] border-black/20 rounded-lg h-min mr-2">
      <header className="flex justify-between [&>*]:cursor-pointer px-4 mb-4">
        <button
          onClick={() => {
            if (calender.month == 0) {
              setCalender(11, calender.year - 1);
            } else {
              setCalender(calender.month - 1, calender.year);
            }
          }}
        >
          <FaAngleLeft />
        </button>
        <p>
          <span>{getMonth(calender.month).full}</span>{" "}
          <span>{calender.year}</span>
        </p>
        <button
          onClick={() => {
            if (calender.month == 11) {
              setCalender(0, calender.year + 1);
            } else {
              setCalender(calender.month + 1, calender.year);
            }
          }}
        >
          <FaAngleRight />
        </button>
      </header>
      <section>
        <header className="grid grid-cols-7 text-center mb-2 gap-x-2">
          {getWeeks().map((v) => {
            return <div key={v.short1}>{v.short1}</div>;
          })}
        </header>
        <section>
          {/*Weeks Row */}
          {dates.map((week, i) => (
            <div
              className={`
                grid grid-cols-7 text-center ${
                  i != dates.length - 1 ? "mb-2" : ""
                } gap-x-2 h-[32px] 
                ${
                  current.week == i &&
                  current.month == calender.month &&
                  current.year == calender.year
                    ? "bg-blue-100 rounded-lg"
                    : ""
                }
              `}
              key={i}
            >
              {/*Dates in a week */}
              {week.map((date, j) => (
                <span
                  key={`${date + "" + i + "" + j}`}
                  onClick={() => {
                    if (date != 0)
                      setCurrent(date, i, calender.month, calender.year);
                  }}
                  className={`
                    ${date != 0 ? "cursor-pointer" : ""} 

                    ${
                      date == today.date &&
                      today.month == calender.month &&
                      today.year == calender.year
                        ? "bg-black text-white"
                        : ""
                    }

                  rounded-full flex justify-center items-center cursor-default

                    `}
                >
                  {date > 0 ? date : ""}
                </span>
              ))}
            </div>
          ))}
        </section>
      </section>
    </article>
  );
};
