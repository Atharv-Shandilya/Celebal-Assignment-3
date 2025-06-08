import { useCalenderStore } from "../../store/calenderStore";

export default () => {
  const current = useCalenderStore((state) => state.current);
  const today = useCalenderStore((state) => state.today);
  const setCurrent = useCalenderStore((state) => state.setCurrent);
  const setCalender = useCalenderStore((state) => state.setCalender);
  const getDates = useCalenderStore((state) => state.getDates);

  const getMonth = useCalenderStore((state) => state.getMonth);
  const getWeeks = useCalenderStore((state) => state.getWeeks);
  const dates = getDates(current.month, current.year);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const scheduledMeeting: {
    [key: string]: { event: string; isHalf: boolean };
  } = {};
  scheduledMeeting["2025-5-8-2"] = {
    event: " Scheduled a meet with 'Dasim' for their MVP",
    isHalf: true,
  };

  scheduledMeeting["2025-5-10-1"] = {
    event: " Scheduled a meet with 'Dasim' for their MVP",
    isHalf: false,
  };

  scheduledMeeting["2025-5-10-4"] = {
    event: " Scheduled a meet with 'Dasim' for their MVP",
    isHalf: false,
  };
  return (
    <section className="flex-1 overflow-hidden pb-[100px] px-2">
      <header className="px-8 flex items-center py-4 border-[0.5px] border-black/20">
        <h2 className="text-3xl font-medium mr-[30px] ">
          {getMonth(current.month).full} {current.year}
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
        <header
          className="grid grid-cols-8 sticky z-30 top-0 bg-gray-100"
          style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}
        >
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
        </header>
        <section
          className="grid grid-cols-8 "
          style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}
        >
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
              >
                {hours.map((hour) => {
                  const event =
                    scheduledMeeting[
                      `${current.year}-${current.month}-${
                        dates[current.week][i]
                      }-${hour}`
                    ];
                  return (
                    <div
                      key={hour}
                      className={`min-h-[100px] border-b-[0.5px] border-b-black/20 ${
                        dates[current.week][i] == 0 ? "" : "cursor-pointer"
                      } relative`}
                    >
                      {dates[current.week][i] != 0 && (
                        <>
                          <span className="absolute top-0 bottom-1/2 left-0 right-0 hover:bg-black/5"></span>
                          <span className="absolute top-1/2 bottom-0 left-0 right-0 hover:bg-black/5"></span>
                        </>
                      )}

                      {event && (
                        <div
                          style={{ height: 2 * 100 + "px" }}
                          className={`absolute ${
                            event.isHalf ? "top-1/2" : "top-0"
                          } left-[2px] right-[2px] bg-gray-200 p-2 rounded-lg z-10 `}
                        >
                          <p className="text-sm ">{event.event}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </section>
      </section>
    </section>
  );
};
