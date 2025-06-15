import { v4 } from "uuid";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TaskI {
  id: string;
  listId: string;
  title: string;
  priority: string;
}

interface StagesI {
  id: string;
  projectId: string;
  title: string;
  taskIds: string[];
}

interface ProjectStoreI {
  stageOrder: string[];
  stages: Record<string, StagesI>;
  tasks: Record<string, TaskI>;

  //Context Menu For Stages
  contextMenuFor: string;
  openContextMenu: (id: string) => void;

  createModal: string;
  openCreateModal: (id: string) => void;
  //Stage Management
  addStages: () => void;
  renameStage: (id: string, title: string) => void;
  deleteStage: (id: string) => void;

  addTask: (id: string, task: TaskI) => void;
  deleteTask: (id: string) => void;
  editTask: (id: string, newTitle: string) => void;

  moveCard: (id: string, sourceId: string, destinationId: string) => void;
}

export const useProjectStore = create<ProjectStoreI>()(
  persist(
    (set) => ({
      stageOrder: [],
      stages: {},
      tasks: {},
      contextMenuFor: "",

      openContextMenu: (id) => {
        set((state) => ({
          ...state,
          contextMenuFor: id,
        }));
      },

      createModal: "",
      openCreateModal: (id) => {
        set((state) => {
          return { ...state, createModal: id };
        });
      },

      addStages: () => {
        const newListId = v4();

        set((state) => ({
          ...state,
          stageOrder: [...state.stageOrder, newListId],
          stages: {
            ...state.stages,
            [newListId]: {
              id: newListId,
              title: "New List",
              projectId: "123",
              taskIds: [],
            },
          },
        }));
      },

      renameStage: (id, title) => {
        set((state) => ({
          ...state,
          stages: {
            ...state.stages,
            [id]: { ...state.stages[id], title: title },
          },
        }));
      },

      deleteStage: (id) => {
        set((state) => {
          const updatedStages = { ...state.stages };
          delete updatedStages[id];

          const idx = state.stageOrder.findIndex((v) => v == id);

          const newStageOrder = [
            ...state.stageOrder.slice(0, idx),
            ...state.stageOrder.slice(idx + 1),
          ];

          return { ...state, stages: updatedStages, stageOrder: newStageOrder };
        });
      },

      addTask: (id, task) => {
        set((state) => {
          const newTaskId = [...state.stages[id].taskIds];
          newTaskId.push(task.id);
          return {
            ...state,
            stages: {
              ...state.stages,
              [id]: { ...state.stages[id], taskIds: [...newTaskId] },
            },
            tasks: { ...state.tasks, [task.id]: task },
          };
        });
      },
      deleteTask: (id) => {
        set((state) => {
          const stageId = state.tasks[id].listId;
          const idx = state.stages[stageId].taskIds.findIndex(
            (curr) => curr == id
          );

          const newIds = [
            ...state.stages[stageId].taskIds.slice(0, idx),
            ...state.stages[stageId].taskIds.slice(idx + 1),
          ];

          const updatedTask = state.tasks;
          delete updatedTask[id];

          return {
            ...state,
            stages: {
              ...state.stages,
              [stageId]: { ...state.stages[stageId], taskIds: newIds },
            },
            tasks: updatedTask,
          };
        });
      },
      editTask: (id, newTitle) => {
        set((state) => {
          return {
            ...state,
            tasks: {
              ...state.tasks,
              [id]: { ...state.tasks[id], title: newTitle },
            },
          };
        });
      },

      moveCard: (id, sId, dId) => {
        set((state) => {
          const idx = state.stages[sId].taskIds.findIndex((curr) => id == curr);
          const removeFromSource = [
            ...state.stages[sId].taskIds.slice(0, idx),
            ...state.stages[sId].taskIds.slice(idx + 1),
          ];

          const addToDestination = [...state.stages[dId].taskIds];
          addToDestination.push(id);

          return {
            ...state,
            tasks: {
              ...state.tasks,
              [id]: { ...state.tasks[id], listId: dId },
            },
            stages: {
              ...state.stages,
              [sId]: { ...state.stages[sId], taskIds: removeFromSource },
              [dId]: { ...state.stages[dId], taskIds: addToDestination },
            },
          };
        });
      },
    }),
    {
      name: "Kanban",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        return {
          stageOrder: state.stageOrder,
          stages: state.stages,
          tasks: state.tasks,
        };
      },
    }
  )
);
