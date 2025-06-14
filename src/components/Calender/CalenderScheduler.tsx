import { useEffect, useRef, useState } from "react";
import { useCalenderStore } from "../../store/calenderStore";
import AddEventModal from "./AddEventModal";

export default () => {
  const current = useCalenderStore((state) => state.current);
  const today = useCalenderStore((state) => state.today);
  const setCurrent = useCalenderStore((state) => state.setCurrent);
  const setCalender = useCalenderStore((state) => state.setCalender);

  const getMonthName = useCalenderStore((state) => state.getMonthName);

  const [currTime, setCurrTime] = useState(new Date());

  //udpate Time for live pointer
  useEffect(() => {
    const timeUpdate = setTimeout(() => {
      console.log("time updated");
      setCurrTime(new Date());
    }, 1000);

    return () => clearTimeout(timeUpdate);
  }, [currTime]);

  //scroll into today
  const currentMarker = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      currentMarker.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 200);
    return () => clearTimeout(timer);
  }, [current.week]);

  //Function for getting Array of Weeks
  const getWeeks = useCalenderStore((state) => state.getWeeks);

  //For Getting 2D array Describing weeks within a month.
  const getDates = useCalenderStore((state) => state.getDates);
  const dates = getDates(current.month, current.year);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const eventByDates = useCalenderStore((state) => state.eventByDates);

  const [eventOfDate, setEventOfDate] = useState<{
    date: number;
    hour: number;
  } | null>(null);

  return (
    <section className="flex-1  pb-[100px] px-2 relative">
      <header className="px-8 flex items-center py-4 border-[0.5px] border-black/20">
        <h2 className="text-3xl font-medium mr-[30px] ">
          {getMonthName(current.month).full} {current.year}
        </h2>
        <button
          className="border px-4 py-1 rounded-lg cursor-pointer"
          onClick={() => {
            setCurrent(today.date, today.week, today.month, today.year);
            setCalender(today.month, today.year);
          }}
        >
          Today
        </button>
      </header>
      <section className="h-full overflow-scroll">
        {/*Schedule Header*/}
        <header
          className="grid grid-cols-8 sticky z-30 top-0 bg-gray-100"
          style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}
        >
          <>
            <div className="px-2 py-4 border-r-[0.5px] border-r-black/20  relative -right-[1px]">
              Time
            </div>
            {getWeeks().map((v, i) => {
              return (
                <div className="text-center px-2 py-4 " key={i}>
                  <span> {v.short2} </span>
                  {dates[current.week][i] > 0 && (
                    <span
                      className={`${
                        today.date == dates[current.week][i]
                          ? "bg-black rounded-full text-white px-2"
                          : ""
                      }`}
                    >
                      {dates[current.week][i]}
                    </span>
                  )}
                </div>
              );
            })}
          </>
        </header>
        <section
          className="grid grid-cols-8 "
          style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}
        >
          {/*Days Columns*/}
          <>
            <div className=" flex flex-col border-l-[0.5px] border-l-black/20 border-b-[0.5px] border-b-black/20 pl-2">
              {hours.map((hour) => (
                <span key={hour} className=" h-[100px] p-1 text-left text-xs">
                  {hour}:00
                </span>
              ))}
            </div>
            {getWeeks().map((_, i) => {
              return (
                <div
                  key={i}
                  className={`border-l-[0.5px] border-l-black/20 ${
                    i == getWeeks().length - 1
                      ? "border-r-[0.5px] border-r-black/20"
                      : ""
                  }`}
                  onClick={() => {
                    setCurrent(
                      dates[current.week][i],
                      current.week,
                      current.month,
                      current.year
                    );
                  }}
                >
                  {/*Hours Row*/}
                  {hours.map((hour) => {
                    const eventOfDay =
                      eventByDates[
                        `${current.year}-${current.month}-${
                          dates[current.week][i]
                        }`
                      ];

                    const event = eventOfDay
                      ? eventOfDay.find((curr) => curr.start == hour)
                      : null;
                    return (
                      <div
                        key={hour}
                        className={`min-h-[100px] border-b-[0.5px] border-b-black/20 ${
                          dates[current.week][i] == 0 ? "" : "cursor-pointer"
                        } relative`}
                      >
                        {dates[current.week][i] != 0 && (
                          <>
                            <span
                              className="absolute top-0 bottom-1/2 left-0 right-0 hover:bg-black/5"
                              onClick={() => {
                                setEventOfDate({
                                  date: dates[current.week][i],
                                  hour: hour,
                                });
                              }}
                            ></span>
                            <span
                              className="absolute top-1/2 bottom-0 left-0 right-0 hover:bg-black/5"
                              onClick={() => {
                                setEventOfDate({
                                  date: dates[current.week][i],
                                  hour: hour + 0.5,
                                });
                              }}
                            ></span>
                          </>
                        )}

                        {event && (
                          <div
                            style={{
                              height: (event.end - event.start) * 100 + "px",
                            }}
                            className={`absolute ${
                              event.start - Math.floor(event.start) > 0
                                ? "top-1/2"
                                : "top-0"
                            } left-[2px] right-[2px] bg-gray-200 p-2 rounded-lg z-10  overflow-auto`}
                          >
                            <p className="text-sm ">{event.event}</p>
                          </div>
                        )}

                        {hour == currTime.getHours() &&
                          dates[current.week][i] == today.date && (
                            <div
                              ref={currentMarker}
                              className="absolute h-[2px] w-full bg-red-400"
                              style={{
                                top: (currTime.getMinutes() / 60) * 100,
                              }}
                            ></div>
                          )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </>
        </section>
      </section>
      {eventOfDate && (
        <AddEventModal
          currHour={eventOfDate.hour}
          nextScheduledTime={24}
          setEventOfDate={setEventOfDate}
        />
      )}
    </section>
  );
};
