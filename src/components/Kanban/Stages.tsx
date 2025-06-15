import { useEffect, useRef, useState } from "react";
import { FaPlus, FaEllipsis } from "react-icons/fa6";
import {
  RiDeleteBin6Line,
  RiPencilLine,
  RiCloseCircleLine,
} from "react-icons/ri";
import { useProjectStore } from "../../store/projectStore";
import TaskCard from "./TaskCard";
import { useDrop } from "react-dnd";

export default ({ id }: { id: string }) => {
  const [edit, setEdit] = useState(false);
  const titleRef = useRef<HTMLInputElement | null>(null);

  const stages = useProjectStore((prev) => prev.stages);
  const renameStage = useProjectStore((prev) => prev.renameStage);
  const [title, setTitle] = useState(stages[id].title);

  const deleteStage = useProjectStore((prev) => prev.deleteStage);

  const openContextMenuFor = useProjectStore((prev) => prev.openContextMenu);
  const contextMenuFor = useProjectStore((prev) => prev.contextMenuFor);

  const openCreateModal = useProjectStore((prev) => prev.openCreateModal);

  const moveCard = useProjectStore((prev) => prev.moveCard);

  useEffect(() => {
    if (titleRef.current && edit) {
      titleRef.current.focus();
    }
  }, [edit]);

  const renameOnEnterHandler = (e: any) => {
    if (e.key == "Enter") {
      if (title != "") {
        renameStage(id, title);
      } else {
        renameStage(id, "New List");
      }

      setEdit(false);
    }
  };

  const renameHandler = (e: any) => {
    setTitle(e.target.value);
  };

  const deleteHandler = () => {
    deleteStage(id);
    openContextMenuFor("");
  };

  const [_, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item: { id: string; stageId: string }) => {
      if (id != item.stageId) {
        moveCard(item.id, item.stageId, id);
      }
    },
  }));

  return (
    <>
      {contextMenuFor && (
        <div
          className="fixed bg-black/10 left-0 right-0 top-0 bottom-0"
          onClick={() => openContextMenuFor("")}
        ></div>
      )}
      <article
        className="border border-black/10 w-[300px] shrink-0 rounded-lg p-4 max-h-full  flex flex-col"
        ref={drop as unknown as React.Ref<HTMLElement> | undefined}
      >
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center font-bold">
            <p className=" bg-white rounded-full w-[30px] h-[30px] flex items-center justify-center mr-4 ">
              {stages[id].taskIds.length}
            </p>
            <div className="text-xl flex-1 mr-2">
              {edit && (
                <input
                  className="outline-none w-full "
                  value={title}
                  ref={titleRef}
                  onChange={renameHandler}
                  onKeyUp={renameOnEnterHandler}
                />
              )}
              {!edit && <h2>{stages[id].title}</h2>}
            </div>
          </div>

          <div className="relative">
            <FaEllipsis
              className=" cursor-pointer relative z-10"
              onClick={() => {
                openContextMenuFor(id);
              }}
            />
            {contextMenuFor == id && (
              <ul
                className="bg-white absolute right-[10px] top-[25px] p-2 rounded w-[200px] shadow-sm cursor-pointer text-gray-500 font-medium [&>div.top_li]:mb-[2px]
          [&_li]:flex [&_li]:items-center [&_li>span]:mr-1 [&_li]:px-2 [&_li]:py-1 z-50  [&_li]:rounded-sm"
              >
                <div className="  [&>li]:hover:bg-gray-100 top border-b-[0.5px] pb-1 mb-2">
                  <li
                    onClick={() => {
                      openContextMenuFor("");
                      setEdit(true);
                    }}
                  >
                    <span>
                      <RiPencilLine />
                    </span>
                    Rename
                  </li>
                  <li onClick={deleteHandler}>
                    <span>
                      <RiCloseCircleLine />
                    </span>
                    Remove All Tasks
                  </li>
                </div>
                <li
                  className="hover:text-red-600 hover:bg-red-100 bottom"
                  onClick={deleteHandler}
                >
                  <span>
                    <RiDeleteBin6Line />
                  </span>
                  Delete
                </li>
              </ul>
            )}
          </div>
        </header>
        {/* Tasks */}
        <section className=" overflow-y-scroll">
          {stages[id].taskIds.map((id) => {
            return <TaskCard id={id} key={id} />;
          })}
        </section>
        <section className="mt-4">
          <button
            className="px-6 py-2 text-center hover:bg-black/5 border border-dashed flex  w-full justify-center items-center cursor-pointer rounded-xl"
            onClick={() => {
              openCreateModal(id);
            }}
          >
            <FaPlus className="mr-3" />
            Add task
          </button>
        </section>
      </article>
    </>
  );
};
