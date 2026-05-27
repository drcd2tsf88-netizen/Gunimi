"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

import WorkspaceHero from "@/components/workspace/WorkspaceHero";
import WorkspaceCRM from "@/components/workspace/WorkspaceCRM";
import WorkspaceMembers from "@/components/workspace/WorkspaceMembers";
import WorkspaceNotes from "@/components/workspace/WorkspaceNotes";
import WorkspaceActivity from "@/components/workspace/WorkspaceActivity";
import WorkspaceTasks from "@/components/workspace/WorkspaceTasks";

export default function CompanyPage() {

  const params = useParams();

  const companyId = params.id as string;

  const [company, setCompany] =
    useState<any>(null);

  const [tasks, setTasks] =
    useState<any[]>([]);

  const [contacts, setContacts] =
    useState<any[]>([]);

  const [notes, setNotes] =
    useState<any[]>([]);

  const [members, setMembers] =
    useState<any[]>([]);

  const [activity, setActivity] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadWorkspace();
  }, []);

  async function loadWorkspace() {

    try {

      setLoading(true);

      const { data } =
        await supabase
          .from("companies")
          .select("*")
          .eq("id", companyId)
          .single();

      setCompany(data);

      await Promise.all([
        loadTasks(),
        loadContacts(),
        loadNotes(),
        loadMembers(),
        loadActivity(),
      ]);

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to load workspace"
      );

    } finally {

      setLoading(false);

    }
  }

  async function loadTasks() {

    const { data } =
      await supabase
        .from("tasks")
        .select("*")
        .eq("company_id", companyId);

    setTasks(data || []);
  }

  async function loadContacts() {

    const { data } =
      await supabase
        .from("workspace_contacts")
        .select("*")
        .eq("company_id", companyId);

    setContacts(data || []);
  }

  async function loadNotes() {

    const { data } =
      await supabase
        .from("workspace_notes")
        .select("*")
        .eq("company_id", companyId);

    setNotes(data || []);
  }

  async function loadMembers() {

    const { data } =
      await supabase
        .from("workspace_members")
        .select("*")
        .eq("company_id", companyId);

    setMembers(data || []);
  }

  async function loadActivity() {

    const { data } =
      await supabase
        .from("workspace_activity")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", {
          ascending: false,
        });

    setActivity(data || []);
  }

  if (loading) {

    return (
      <main className="orbit-background min-h-screen text-white p-10">
        Loading workspace...
      </main>
    );
  }

  return (
    <main className="orbit-background min-h-screen text-white">

      <WorkspaceHero
        company={company}
      />

      <WorkspaceCRM
        contacts={contacts}
        companyId={companyId}
        refresh={loadContacts}
        refreshActivity={loadActivity}
      />

      <WorkspaceTasks
        tasks={tasks}
      />

      <WorkspaceMembers
        members={members}
        companyId={companyId}
        refreshActivity={loadActivity}
      />

      <WorkspaceNotes
        notes={notes}
        companyId={companyId}
        refresh={loadNotes}
        refreshActivity={loadActivity}
      />

      <WorkspaceActivity
        activity={activity}
      />

    </main>
  );
}