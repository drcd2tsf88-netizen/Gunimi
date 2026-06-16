"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase }
from "@/lib/supabase";

import OrbitAssistant
from "@/components/ai/OrbitAssistant";

import DashboardHero
from "@/components/dashboard/DashboardHero";

import DashboardStats
from "@/components/dashboard/DashboardStats";

import DashboardActivity
from "@/components/dashboard/DashboardActivity";
import DashboardQuickActions from "@/components/dashboard/DashboardQuickActions";
import { runWorkspaceWatcher } from "@/lib/autonomy/runworkspacewatcher";
import OrbitIntelligence from "@/components/dashboard/OrbitIntelligence";
import DashboardMemory from "@/components/dashboard/WorkspaceMemory";
import { getWorkspaceStats } from "@/server/actions/dashboard/getWorkspaceStats";

import DashboardWorkspaceStrip from "@/components/dashboard/DashboardWorkspaceStrip";


type ActivityItem = {
  id: string;

  type: string;

  title: string;

  description: string;

  created_at: string;
};

export default function DashboardPage() {
  const [
    assistantOpen,

    setAssistantOpen,
  ] = useState(false);
  
  const [profile, setProfile] =
  useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState<any>(null);
  const [
    activityFeed,

    setActivityFeed,
  ] = useState<
    ActivityItem[]
    >([]);
const displayName =
  profile?.full_name ||
  profile?.email?.split("@")[0] ||
  "Operator";

  // LOAD DASHBOARD

  async function loadDashboard() {
    try {
      setLoading(true);
      await runWorkspaceWatcher();
      const {
  data: { user },
} = await supabase.auth.getUser();

if (user) {
  const {
    data: profileData,
  } = await supabase
    .from("profiles")
    .select(
      "full_name,email"
    )
    .eq(
      "id",
      user.id
    )
    .single();

  setProfile(
    profileData
  );
}

      // TASKS

      const {
        data: tasks,
      } = await supabase
        .from(
          "workspace_tasks"
        )
        .select("*");

      // CONTACTS

      const {
        data: contacts,
      } = await supabase
        .from(
          "workspace_contacts"
        )
        .select("id");

      // NOTES

      const {
        data: notes,
      } = await supabase
        .from(
          "workspace_notes"
        )
        .select("id");

      // ACTIVITY

      const {
        data: activity,
      } = await supabase
        .from(
          "workspace_activity"
        )
        .select("*")
        .order(
          "created_at",
          {
            ascending: false,
          }
        )
        .limit(8);

      setStats({
        tasks:
          tasks?.length ?? 0,

        contacts:
          contacts?.length ??
          0,

        notes:
          notes?.length ?? 0,

        activity:
          activity?.length ??
          0,

        completedTasks:
          tasks?.filter(
            (
              task
            ) =>
              task.status ===
              "completed"
          ).length ?? 0,
      });

      setActivityFeed(
        activity ?? []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // INITIAL LOAD

  useEffect(() => {
    loadDashboard();
  }, []);

  // REALTIME

 useEffect(() => {
  async function refreshDashboard() {
    // LIVE STATS

    const statsData =
      await getWorkspaceStats();

    // ACTIVITY

    const {
      data: activity,
    } = await supabase
      .from(
        "workspace_activity"
      )
      .select("*")
      .order(
        "created_at",
        {
          ascending: false,
        }
      )
      .limit(8);

    setStats(
      (prev: any) => ({
        ...prev,

        ...statsData,
      })
    );

    setActivityFeed(
      activity ?? []
    );
  }

  // INITIAL

  refreshDashboard();

  // REALTIME TASKS

  const tasksChannel =
    supabase
      .channel(
        "dashboard-tasks"
      )
      .on(
        "postgres_changes",
        {
          event: "*",

          schema: "public",

          table:
            "workspace_tasks",
        },
        refreshDashboard
      )
      .subscribe();

  // REALTIME ACTIVITY

  const activityChannel =
    supabase
      .channel(
        "dashboard-activity"
      )
      .on(
        "postgres_changes",
        {
          event: "*",

          schema: "public",

          table:
            "workspace_activity",
        },
        refreshDashboard
      )
      .subscribe();

  return () => {
    supabase.removeChannel(
      tasksChannel
    );

    supabase.removeChannel(
      activityChannel
    );
  };
}, []);


  return (
    <div className="space-y-8">
     <DashboardHero
  
  displayName={displayName}
  onOpenAssistant={() =>
    setAssistantOpen(true)
  }
/>

      <DashboardWorkspaceStrip />
      <DashboardStats
        loading={loading}
        stats={stats}
      />
      
      <OrbitIntelligence />
      <DashboardQuickActions />
      <DashboardMemory />
      <DashboardActivity
        loading={loading}
        activity={
          activityFeed
        }
      />
      <OrbitAssistant
        open={assistantOpen}
        onClose={() =>
          setAssistantOpen(
            false
          )
        }
      />
    </div>
  );
}