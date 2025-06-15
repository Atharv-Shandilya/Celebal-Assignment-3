import { MdAdd } from "react-icons/md";
import { useProjectStore } from "../../store/projectStore";
import Stages from "./Stages";
import CreateTaskModal from "./CreateTaskModal";

export default () => {
  const stageOrder = useProjectStore((prev) => prev.stageOrder);
  const addStages = useProjectStore((prev) => prev.addStages);

  const createModal = useProjectStore((prev) => prev.createModal);
  const openCreateModal = useProjectStore((prev) => prev.openCreateModal);

  return (
    <main className="p-4 h-full">
      <article className="flex gap-4">
        {stageOrder.map((v) => {
          return <Stages id={v} key={v} />;
        })}
        <div className="grow-0 w-[200px]">
          <button
            onClick={() => {
              addStages();
            }}
            className="px-6 py-2 text-center text-primary border border-dashed flex  w-full justify-center items-center cursor-pointer rounded-xl shrink-0"
          >
            <MdAdd className="mr-3" /> Add List
          </button>
        </div>
      </article>
      {createModal != "" && (
        <div
          className="bg-black/10 fixed left-0 right-0 top-0 bottom-0"
          onClick={() => {
            openCreateModal("");
          }}
        ></div>
      )}
      {createModal != "" && <CreateTaskModal />}
    </main>
  );
};
