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
import { getWorkspaceActivity } from "@/server/actions/activity/getWorkspaceActivity";

type UserProfile = {
  full_name?: string;
  email?: string;
};

type DashboardStats = {
  tasks: number;
  contacts: number;
  notes: number;
  activity: number;
  completedTasks: number;
};

type ActivityItem = {
  id: string;
  type: string;
  title: string;
  description: string;
  created_at: string;
  company_id?: string | null;
  deal_id?: string | null;
};

export default function DashboardPage() {
  const [
    assistantOpen,

    setAssistantOpen,
  ] = useState(false);
  
  const [profile, setProfile] =
  useState<UserProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState<DashboardStats | null>(null);
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
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name,email")
          .eq("id", user.id)
          .single();

        setProfile(profileData);
      }

      const [statsData, activity] = await Promise.all([
        getWorkspaceStats(),
        getWorkspaceActivity(8),
      ]);

      setStats({
        tasks: statsData?.tasks ?? 0,
        completedTasks: statsData?.completedTasks ?? 0,
        contacts: statsData?.contacts ?? 0,
        notes: statsData?.notes ?? 0,
        activity: activity.length,
      });

      setActivityFeed(activity);
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
    const [statsData, activity] = await Promise.all([
      getWorkspaceStats(),
      getWorkspaceActivity(8),
    ]);

    setStats((prev) => ({
      ...prev,
      tasks: statsData?.tasks ?? prev?.tasks ?? 0,
      completedTasks: statsData?.completedTasks ?? prev?.completedTasks ?? 0,
      contacts: statsData?.contacts ?? prev?.contacts ?? 0,
      notes: statsData?.notes ?? prev?.notes ?? 0,
      activity: activity.length,
    }));

    setActivityFeed(activity);
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

      <DashboardStats
        loading={loading}
        stats={stats ?? { tasks: 0, completedTasks: 0, contacts: 0, activity: 0 }}
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