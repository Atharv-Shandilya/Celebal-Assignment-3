import { IoClose } from "react-icons/io5";
import { useCalenderStore } from "../../store/calenderStore";
import { FaCalendar } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import TimePicker from "./TimePicker";
import type { SelectedScheduleTimeI } from "../../types/global";

export default ({
  currHour,
  setEventOfDate,
}: {
  currHour: number;

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

  //get Next Scheduled Time to prevent conflict
  const getNextSchdeuledTime = useCalenderStore(
    (prev) => prev.getNextScheduledTime
  );
  let nextScheduledTime = getNextSchdeuledTime(currHour);

  const addEvent = useCalenderStore((state) => state.addEvent);
  const [selected, setSelected] = useState<SelectedScheduleTimeI | null>(null);

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
          <TimePicker
            currHour={currHour}
            nextScheduledTime={nextScheduledTime}
            selected={selected}
            setSelected={setSelected}
          />
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
              if (selected)
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
