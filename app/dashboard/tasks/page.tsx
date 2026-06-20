import { getWorkspaceTasks } from "@/server/actions/tasks/getWorkspaceTasks";
import TasksPageView from "@/components/tasks/TasksPageView";

export default async function TasksPage() {
  const tasks = await getWorkspaceTasks();

  return <TasksPageView initialTasks={tasks} />;
}
