import { getTranslations } from "next-intl/server";
import { getWorkspaceTasks } from "@/server/actions/tasks/getWorkspaceTasks";
import { getWorkspaceMembers } from "@/server/actions/workspace/getWorkspaceMembers";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { getWorkspaceTaskTagsMap } from "@/server/actions/tasks/getWorkspaceTaskTagsMap";
import TasksPageView from "@/components/tasks/TasksPageView";
import { WorkspaceMember } from "@/types/task";

export async function generateMetadata() {
  const t = await getTranslations("tasks");
  return { title: t("pageTitle") };
}

type Props = {
  searchParams: Promise<{ task?: string }>;
};

export default async function TasksPage({ searchParams }: Props) {
  const [{ task: initialTaskId }, tasks, members, workspace, user, taskTagsMap] = await Promise.all([
    searchParams,
    getWorkspaceTasks(),
    getWorkspaceMembers(),
    getCurrentWorkspace(),
    getUser(),
    getWorkspaceTaskTagsMap(),
  ]);

  return (
    <TasksPageView
      initialTasks={tasks}
      members={members as unknown as WorkspaceMember[]}
      workspaceId={workspace?.id ?? ""}
      currentUserId={user?.id ?? ""}
      initialTaskId={initialTaskId}
      initialTaskTagsMap={taskTagsMap}
    />
  );
}
