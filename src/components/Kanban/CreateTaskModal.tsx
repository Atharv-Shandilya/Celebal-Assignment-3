import { v4 } from "uuid";

import { useState } from "react";
import { DropDown } from "../UI/DropDown";
import { useProjectStore } from "../../store/projectStore";

export default ({}: {}) => {
  const [task, setTask] = useState("");
  const [selected, setSelected] = useState<string>("High");
  const [showDropDown, setShowDropDown] = useState(false);
  const [error, setError] = useState(false);

  const createModal = useProjectStore((prev) => prev.createModal);
  const openCreateModal = useProjectStore((prev) => prev.openCreateModal);

  const addTask = useProjectStore((prev) => prev.addTask);

  function addTaskHandler() {
    if (task == "") {
      setError(true);
    } else {
      addTask(createModal, {
        id: v4(),
        title: task,
        listId: createModal,
        priority: selected,
      });
      openCreateModal("");
    }
  }

  return (
    <article className="fixed top-1/2 left-1/2 transform -translate-1/2 p-8 rounded-lg w-[500px] shadow-sm bg-[#fffefe]">
      <h2 className="text-2xl font-bold mb-[40px] pb-4 border-b-[0.5px] border-black/20">
        Add Task
      </h2>
      {/* Input Section */}
      <section className="mb-[50px] ">
        {/* Input Field */}
        <div className="flex flex-col mb-[30px] ">
          {/* Label */}
          <div className="flex justify-between items-center">
            <p className="mb-2 font-medium">
              Write your task clearly and concisely.
            </p>
            {error && <p className="text-xs text-red-600">Cannot be empty</p>}
          </div>
          {/* Input Field */}
          <textarea
            className=" resize-none h-[150px] p-4 outline-none border-[1px] border-gray-300 rounded-lg overflow-hidden "
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              setError(false);
              if (task.length < 160) setTask(e.target.value);
            }}
            value={task}
          />
        </div>
        {/* Priority Selector */}
        <div className="flex items-center justify-between">
          <p className="font-medium">Select Your Priority</p>
          <div className=" w-fit">
            <DropDown
              options={["High", "Medium", "Low"]}
              selected={selected}
              setSelected={setSelected}
              showDrop={showDropDown}
              setShowDrop={setShowDropDown}
            />
          </div>
        </div>
      </section>
      {/* Action Button Section */}
      <section className="flex justify-end border-t-[0.5px] pt-6 border-black/20 ">
        <button
          onClick={() => {
            openCreateModal("");
          }}
          className=" bg-gray-100 px-6 py-2 text-black rounded-lg cursor-pointer mr-5 shadow-sm"
        >
          Cancel
        </button>
        <button
          onClick={addTaskHandler}
          className=" bg-blue-500 px-6 py-2 text-white rounded-lg cursor-pointer  shadow-sm"
        >
          Add
        </button>
      </section>
    </article>
  );
};
