import { getTranslations } from "next-intl/server";
import { getWorkspaceTasks } from "@/server/actions/tasks/getWorkspaceTasks";
import { getWorkspaceMembers } from "@/server/actions/workspace/getWorkspaceMembers";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import TasksPageView from "@/components/tasks/TasksPageView";
import { WorkspaceMember } from "@/types/task";

export async function generateMetadata() {
  const t = await getTranslations("tasks");
  return { title: t("pageTitle") };
}

export default async function TasksPage() {
  const [tasks, members, workspace, user] = await Promise.all([
    getWorkspaceTasks(),
    getWorkspaceMembers(),
    getCurrentWorkspace(),
    getUser(),
  ]);

  return (
    <TasksPageView
      initialTasks={tasks}
      members={members as unknown as WorkspaceMember[]}
      workspaceId={workspace?.id ?? ""}
      currentUserId={user?.id ?? ""}
    />
  );
}
