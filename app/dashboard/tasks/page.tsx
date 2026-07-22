import { getTranslations } from "next-intl/server";
import { getWorkspaceTasks } from "@/server/actions/tasks/getWorkspaceTasks";
import { getWorkspaceMembers } from "@/server/actions/workspace/getWorkspaceMembers";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import TasksPageView from "@/components/tasks/TasksPageView";
import { WorkspaceMember } from "@/types/task";

export async function generateMetadata() {
  const t = await getTranslations("tasks");
  return { title: t("pageTitle") };
}

export default async function TasksPage() {
  const [tasks, members, workspace] = await Promise.all([
    getWorkspaceTasks(),
    getWorkspaceMembers(),
    getCurrentWorkspace(),
  ]);

  return (
    <TasksPageView
      initialTasks={tasks}
      members={members as unknown as WorkspaceMember[]}
      workspaceId={workspace?.id ?? ""}
    />
  );
}
