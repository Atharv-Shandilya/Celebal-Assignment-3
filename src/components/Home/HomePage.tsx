import { useProjectStore } from "../../store/projectStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PRIORITY_COLORS: Record<string, string> = {
  High: "#EF4444",
  Medium: "#F59E42",
  Low: "#22C55E",
};

interface StageBarData {
  name: string;
  total: number;
  High: number;
  Medium: number;
  Low: number;
}

interface PriorityPieData {
  name: string;
  value: number;
}

interface TaskRow {
  title: string;
  stage: string;
  priority: string;
}

export default () => {
  const stages = useProjectStore((s) => s.stages);
  const tasks = useProjectStore((s) => s.tasks);
  const stageOrder = useProjectStore((s) => s.stageOrder);

  const stageBarData: StageBarData[] = stageOrder.map((stageId) => {
    const stage = stages[stageId];
    const taskObjs = stage.taskIds.map((tid) => tasks[tid]);
    return {
      name: stage.title,
      total: stage.taskIds.length,
      High: taskObjs.filter((t) => t.priority === "High").length,
      Medium: taskObjs.filter((t) => t.priority === "Medium").length,
      Low: taskObjs.filter((t) => t.priority === "Low").length,
    };
  });

  const priorityCounts: Record<string, number> = { High: 0, Medium: 0, Low: 0 };
  Object.values(tasks).forEach((t) => {
    if (priorityCounts[t.priority] !== undefined) priorityCounts[t.priority]++;
  });
  const priorityPieData: PriorityPieData[] = Object.keys(priorityCounts).map(
    (k) => ({
      name: k,
      value: priorityCounts[k],
    })
  );

  // Stage summary table
  const summaryRows = stageBarData;

  // All tasks table
  const allTasks: TaskRow[] = Object.values(tasks).map((t) => ({
    title: t.title,
    stage: stages[t.listId]?.title || "Unknown",
    priority: t.priority,
  }));

  return (
    <div className="p-4 overflow-auto mt-20 mx-auto">
      <h2 className="text-2xl font-bold mb-4">Kanban Dashboard</h2>
      <div className="flex flex-wrap gap-8 mb-8">
        {/* Bar Chart: Tasks per Stage */}
        <div style={{ width: 350, height: 300 }}>
          <h3 className="font-semibold mb-2">Tasks per Stage</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={stageBarData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="High" stackId="a" fill={PRIORITY_COLORS.High} />
              <Bar dataKey="Medium" stackId="a" fill={PRIORITY_COLORS.Medium} />
              <Bar dataKey="Low" stackId="a" fill={PRIORITY_COLORS.Low} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart: Priority Distribution */}
        <div style={{ width: 350, height: 300 }}>
          <h3 className="font-semibold mb-2">Priority Distribution</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={priorityPieData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label={({ name, value }: { name: string; value: number }) =>
                  `${name}: ${value}`
                }
              >
                {priorityPieData.map((entry, idx) => (
                  <Cell
                    key={entry.name}
                    fill={PRIORITY_COLORS[entry.name] || "#8884d8"}
                  />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stage Summary Table */}
      <div className="mb-8">
        <h3 className="font-semibold mb-2">Stage Summary</h3>
        <table className="min-w-full border rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Stage</th>
              <th className="px-4 py-2 border">Total</th>
              <th className="px-4 py-2 border">High</th>
              <th className="px-4 py-2 border">Medium</th>
              <th className="px-4 py-2 border">Low</th>
            </tr>
          </thead>
          <tbody>
            {summaryRows.map((row, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2 border">{row.name}</td>
                <td className="px-4 py-2 border">{row.total}</td>
                <td className="px-4 py-2 border">{row.High}</td>
                <td className="px-4 py-2 border">{row.Medium}</td>
                <td className="px-4 py-2 border">{row.Low}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* All Tasks Table */}
      <div>
        <h3 className="font-semibold mb-2">All Tasks</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Task</th>
                <th className="px-4 py-2 border">Stage</th>
                <th className="px-4 py-2 border">Priority</th>
              </tr>
            </thead>
            <tbody>
              {allTasks.map((row, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 border">{row.title}</td>
                  <td className="px-4 py-2 border">{row.stage}</td>
                  <td className="px-4 py-2 border">{row.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
