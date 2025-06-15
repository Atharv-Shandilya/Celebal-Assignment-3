import { RiDeleteBin6Line, RiPencilLine } from "react-icons/ri";
import { useEffect, useRef, useState, type Ref } from "react";
import { useProjectStore } from "../../store/projectStore";
import { useDrag } from "react-dnd";

export default ({ id }: { id: string }) => {
  const tasks = useProjectStore((prev) => prev.tasks);
  const deleteTask = useProjectStore((prev) => prev.deleteTask);
  const editTask = useProjectStore((prev) => prev.editTask);

  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const [value, setValue] = useState(tasks[id].title);
  const [editActive, setEditActive] = useState(false);

  useEffect(() => {
    if (textRef && textRef.current) {
      textRef.current.style.height = "0px";
      textRef.current.style.height = textRef.current.scrollHeight + "px";
    }
  }, [editActive, value]);

  useEffect(() => {
    if (textRef && textRef.current) {
      textRef.current.focus();
      const length = textRef.current.value.length;
      textRef.current.setSelectionRange(length, length);
    }
  }, [editActive]);

  function updateTask() {
    if (value != "") editTask(id, value);
    else editTask(id, tasks[id].title);
    setEditActive(false);
  }

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: id, stageId: tasks[id].listId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <section
      className={`bg-white rounded-lg  p-4 mb-4  text-primary leading-[1.25] group relative border  ${
        isDragging ? "opacity-20" : "opacity-100"
      }`}
      ref={drag as unknown as Ref<HTMLElement> | undefined}
    >
      {/* Context Menu */}
      {!editActive && (
        <div className="group-hover:flex justify-end  hidden bg-white p-2 absolute top-2 right-2 rounded-xl shadow-sm ">
          <RiPencilLine
            className="mr-2 cursor-pointer"
            onClick={() => {
              setEditActive(true);
            }}
          />
          <RiDeleteBin6Line
            className="cursor-pointer hover:text-red-600"
            onClick={() => {
              deleteTask(id);
            }}
          />
        </div>
      )}

      {/* Tasks */}
      {!editActive && <p className="font-medium">{tasks[id].title}</p>}
      {editActive && (
        <textarea
          className=" resize-none  outline-none overflow-hidden min-h-4"
          ref={textRef}
          onBlur={() => {
            setValue(value);
            setEditActive(false);
          }}
          value={value}
          onKeyDown={(e) => {
            if (e.key == "Escape") {
              updateTask();
            } else if (e.key == "Enter") {
              e.preventDefault();
              updateTask();
            }
          }}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
      )}
      {/* Priority and Mark as complete button */}
      <div className="flex items-center mt-[20px]  justify-between ">
        <p
          className={`${
            tasks[id].priority == "High"
              ? "text-red-600 bg-red-100"
              : tasks[id].priority == "Medium"
              ? "text-orange-600 bg-orange-100"
              : "text-green-600 bg-green-100"
          } px-6 py-2 rounded-lg text-sm`}
        >
          {tasks[id].priority}
        </p>
      </div>
    </section>
  );
};
