import { FaAngleDown } from "react-icons/fa6";

interface DropDownI {
  options: string[];
  selected: string | null;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  showDrop: boolean;
  setShowDrop: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DropDown = ({
  options,
  selected,
  setSelected,
  showDrop,
  setShowDrop,
}: DropDownI) => {
  return (
    <article className="relative ">
      <section
        className={`flex justify-between  px-4 py-2 items-center rounded-full border bg-white border-blue-200 cursor-pointer w-[120px]`}
        onClick={() => {
          if (options != null && options.length != 0)
            setShowDrop((prev) => !prev);
        }}
      >
        <p className="mr-2">{selected}</p>
        <FaAngleDown
          className={` transform ${showDrop ? "" : "rotate-180"} text-sm  `}
        />
      </section>
      {showDrop && (
        <article className=" absolute overflow-scroll border bg-white border-blue-200 rounded-lg mt-4 w-full ">
          {options.map((v: string, i) => {
            return (
              <section
                key={v}
                className={` ${
                  i == options.length - 1 ? "" : "border-b border-gray-300"
                }  px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                  selected == v ? "bg-blue-200" : ""
                } `}
                onClick={() => {
                  setSelected(v);
                  setShowDrop(false);
                }}
              >
                {v}
              </section>
            );
          })}
        </article>
      )}
    </article>
  );
};
