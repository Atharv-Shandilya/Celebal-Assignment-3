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

  return (
    <section className="flex-1 border px-2">
      <header className="px-8 flex items-center">
        <h2 className="text-3xl font-medium mr-[30px]">
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
          className="grid grid-cols-8 sticky  top-0"
          style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}
        >
          <div></div>
          {getWeeks().map((v, i) => {
            return (
              <div className="text-center px-2 py-4 bg-gray-100">
                <span> {v.short2} </span>
                {dates[current.week][i] > 0 && (
                  <span>{dates[current.week][i]}</span>
                )}
              </div>
            );
          })}
        </header>
        <section
          className="grid grid-cols-8 "
          style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}
        >
          <div className=" flex flex-col ">
            {hours.map((hour) => (
              <span key={hour} className=" h-[100px] p-1 text-left text-xs">
                {hour}:00
              </span>
            ))}
          </div>
          {getWeeks().map((v, i) => {
            return (
              <div className="border-l">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="min-h-[100px] border-b   cursor-pointer relative"
                  >
                    <span className="absolute top-0 bottom-1/2 left-0 right-0 hover:bg-black/5"></span>
                    <span className="absolute top-1/2 bottom-0 left-0 right-0 hover:bg-black/5"></span>
                  </div>
                ))}
              </div>
            );
          })}
        </section>
      </section>
    </section>
  );
};
