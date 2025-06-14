import { MdModeEdit, MdDelete, MdClose } from "react-icons/md";
import type { EventI, SelectedScheduleTimeI } from "../../types/global";
import EditMenuItems from "../UI/EditMenuItems";
import { useCalenderStore } from "../../store/calenderStore";
import TimePicker from "./TimePicker";
import { useEffect, useRef, useState } from "react";

export default ({
  event,
  dateKey,
  close,
}: {
  event: EventI;
  dateKey: string;
  close: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const deleteEvent = useCalenderStore((prev) => prev.deleteEvent);
  const getNextSchdeuledTime = useCalenderStore(
    (prev) => prev.getNextScheduledTime
  );

  const nextScheduledTime = getNextSchdeuledTime(event.end);

  const [selected, setSelected] = useState<SelectedScheduleTimeI | null>(null);

  const edit = useCalenderStore((prev) => prev.editEvent);

  //Event input properties
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [editEvent, changeEvent] = useState(event.event);
  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.style.height = "0px";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  });

  return (
    <>
      <div
        className="bg-black/5 fixed left-0 right-0 top-0 bottom-0 z-[100]"
        onClick={() => close(-1)}
      ></div>
      <article className="fixed left-1/2 top-1/2 transform -translate-y-1/2 border w-[300px] z-[101] bg-white p-4 rounded-lg min-h-[300px] flex flex-col ">
        <header className=" flex text-xl justify-end [&_*]:cursor-pointer items-center mb-4">
          <div className="mr-1">
            <EditMenuItems>
              <MdDelete
                onClick={() => {
                  deleteEvent(dateKey, event.start);
                  close(-1);
                }}
              />
            </EditMenuItems>
          </div>
          <EditMenuItems>
            <MdClose
              onClick={() => {
                close(-1);
              }}
            />
          </EditMenuItems>
        </header>
        <section>
          <textarea
            value={editEvent}
            className="w-full resize-none mb-3 "
            ref={inputRef}
            onChange={(e) => {
              changeEvent(e.target.value);
            }}
          />

          <div>
            <TimePicker
              currHour={event.start}
              nextScheduledTime={nextScheduledTime}
              selected={selected}
              setSelected={setSelected}
            />
          </div>
        </section>
        <section className=" mt-auto flex justify-end">
          <button
            className="border px-4 py-1 rounded-lg mr-2 cursor-pointer"
            onClick={() => {
              close(-1);
            }}
          >
            Cancel
          </button>
          <button
            className="border px-4 py-1 rounded-lg cursor-pointer"
            onClick={() => {
              if (selected)
                edit(dateKey, {
                  ...event,
                  event: editEvent,
                  end: event.start + selected.timePeriod,
                });

              close(-1);
            }}
          >
            Save
          </button>
        </section>
      </article>
    </>
  );
};
