import { useEffect, useState } from "react";
import { FaClock, FaArrowRight } from "react-icons/fa";
import type { SelectedScheduleTimeI } from "../../types/global";

export default ({
  currHour,
  nextScheduledTime,
  selected,
  setSelected,
}: {
  currHour: number;
  nextScheduledTime: number;
  selected: SelectedScheduleTimeI | null;
  setSelected: React.Dispatch<
    React.SetStateAction<SelectedScheduleTimeI | null>
  >;
}) => {
  const [openDropDown, setDropDown] = useState(false);

  console.log((24 - currHour - (24 - nextScheduledTime)) * 2);
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

  useEffect(() => {
    setSelected(timePeriod[0]);
  }, []);

  return (
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
      <div
        className="flex items-center  border px-2 py-1 rounded-lg cursor-pointer relative"
        onClick={() => {
          setDropDown((prev) => !prev);
        }}
      >
        <FaClock className="mr-1" />

        <div>
          <span className="mr-2">{selected?.time}</span>
          <span>({selected?.timePeriod}hr)</span>
        </div>

        {openDropDown && (
          <ul className="absolute top-[40px] left-0 border  bg-white max-h-[300px] overflow-scroll">
            {timePeriod.map((curr) => {
              return (
                <li
                  className={`whitespace-nowrap py-1 px-3 ${
                    curr.timePeriod == selected?.timePeriod
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
      </div>
    </div>
  );
};
