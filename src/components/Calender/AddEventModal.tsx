import { IoClose } from "react-icons/io5";
import { useCalenderStore } from "../../store/calenderStore";
import { FaArrowRight, FaCalendar, FaClock } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

export default ({
  currHour,
  setEventOfDate,
}: {
  currHour: number;
  nextScheduledTime: number;
  setEventOfDate: React.Dispatch<
    React.SetStateAction<{
      date: number;
      hour: number;
    } | null>
  >;
}) => {
  //Get Selected Date for Modal
  const current = useCalenderStore((prev) => prev.current);
  const getMonth = useCalenderStore((prev) => prev.getMonthName);
  const getWeeks = useCalenderStore((prev) => prev.getWeeks);

  //Event input properties
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [event, changeEvent] = useState("");
  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.style.height = "0px";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  });

  let nextScheduledTime = 24;
  const getEvents = useCalenderStore((state) => state.eventByDates);

  const dateEvent =
    getEvents[`${current.year}-${current.month}-${current.date}`];

  if (dateEvent) {
    const i = dateEvent.findIndex((elem) => currHour < elem.end);
    console.log(i);
    if (i != -1) nextScheduledTime = dateEvent[i].start;
    console.log(nextScheduledTime);
  }

  //Dropdown Properites
  const [openDropDown, setDropDown] = useState(false);
  const timePeriod = Array.from(
    { length: (24 - currHour - (24 - nextScheduledTime)) * 2 },
    (_, i) => {
      const time = currHour + (i + 1) * 0.5;
      return {
        time: `${Math.floor(time)}:${
          time - Math.floor(time) > 0 ? "30" : "00"
        }`,
        timePeriod: (i + 1) * 0.5,
      };
    }
  );
  const [selected, setSelected] = useState(timePeriod[0]);
  const addEvent = useCalenderStore((state) => state.addEvent);

  return (
    <>
      {/*Back Drop */}
      <div
        className="fixed left-0 right-0 top-0 bottom-0 bg-black/5 z-100"
        onClick={() => setEventOfDate(null)}
      ></div>
      <article className="w-[300px] bg-white absolute top-1/2 left-1/2 transform -translate-1/2 p-4 border z-[101]">
        <section className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Add Schedule</h2>
          <IoClose
            className="cursor-pointer"
            onClick={() => setEventOfDate(null)}
          />
        </section>
        <section className="flex flex-col gap-y-3 mb-4">
          <textarea
            className="border px-2 py-1 resize-none overflow-hidden"
            placeholder="Event"
            ref={inputRef}
            onChange={(e) => {
              changeEvent(e.target.value);
            }}
            value={event}
            onKeyDown={(e) => {
              if (e.key == "Enter") e.preventDefault();
            }}
          />
          <div className="flex items-center">
            <FaCalendar className="mr-2" />
            <p>
              {getWeeks()[(current.date - 1) % 7].full},{" "}
              {getMonth(current.month).short} {current.date}
            </p>
          </div>
          <div className="flex items-center">
            <p className="flex items-center border px-2 py-1 opacity-40 rounded-lg">
              <FaClock className="mr-1" />{" "}
              <span>
                {currHour - Math.floor(currHour) > 0
                  ? `${Math.floor(currHour)}:30`
                  : `${Math.floor(currHour)}:00`}
              </span>
            </p>
            <FaArrowRight className="mx-2" />
            <p
              className="flex items-center  border px-2 py-1 rounded-lg cursor-pointer relative"
              onClick={() => {
                setDropDown((prev) => !prev);
              }}
            >
              <FaClock className="mr-1" />

              <div>
                <span className="mr-2">{selected.time}</span>
                <span>({selected.timePeriod}hr)</span>
              </div>

              {openDropDown && (
                <ul className="absolute top-[40px] left-0 border  bg-white max-h-[300px] overflow-scroll">
                  {timePeriod.map((curr) => {
                    return (
                      <li
                        className={`whitespace-nowrap py-1 px-3 ${
                          curr.timePeriod == selected.timePeriod
                            ? "bg-black/20"
                            : "hover:bg-black/10"
                        }`}
                        onClick={() => {
                          setSelected(curr);
                        }}
                      >
                        <span className="mr-2">{curr.time}</span>
                        <span>({curr.timePeriod}hr)</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </p>
          </div>
        </section>
        <section className="flex justify-end">
          <button
            className="border px-4 py-1 rounded-lg mr-2 cursor-pointer"
            onClick={() => {
              setEventOfDate(null);
            }}
          >
            Cancel
          </button>
          <button
            className="border px-4 py-1 rounded-lg cursor-pointer"
            onClick={() => {
              addEvent(
                {
                  id: v4(),
                  event: event,
                  start: currHour,
                  end: currHour + selected.timePeriod,
                },
                current.date
              );
              setEventOfDate(null);
            }}
          >
            Save
          </button>
        </section>
      </article>
    </>
  );
};
