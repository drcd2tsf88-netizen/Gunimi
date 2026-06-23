"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/server/actions/auth/getUser";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

type UpdateTaskParams = {
  id: string;
  title?: string;
  description?: string | null;
  priority?: string;
  status?: string;
  due_date?: string | null;
  assigned_to?: string | null;
};

export async function updateTask({
  id,
  ...fields
}: UpdateTaskParams): Promise<boolean> {
  try {
    const user = await getUser();
    if (!user) return false;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    const supabase = await createClient();

    const { error } = await supabase
      .from("workspace_tasks")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("workspace_id", workspace.id);

    if (error) {
      console.error(error);
      return false;
    }

    await supabaseAdmin
      .from("workspace_activity")
      .insert({
        workspace_id: workspace.id,
        user_id: user.id,
        type: "task_updated",
        title: "Task Updated",
        description: fields.title
          ? `Updated task "${fields.title}"`
          : "Updated a task",
      });

    revalidatePath("/dashboard/tasks");

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
