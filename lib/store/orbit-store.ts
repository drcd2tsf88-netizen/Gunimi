import { create } from "zustand";

type Message = {
  role: string;

  content: string;

  agent?: string;
};

type OrbitStore = {
  messages: Message[];

  addMessage: (
    message: Message
  ) => void;

  setMessages: (
    messages: Message[]
  ) => void;

  loading: boolean;

  setLoading: (
    loading: boolean
  ) => void;

  activeAgent: string;

  setActiveAgent: (
    agent: string
  ) => void;

  aiMemory: string[];

  addMemory: (
    memory: string
  ) => void;

  workflowTimeline: string[];

  setWorkflowTimeline: (
    timeline: string[]
  ) => void;
};

export const useOrbitStore =
  create<OrbitStore>((set) => ({
    messages: [
      {
        role: "assistant",

        content:
          "Good morning, Michal. Orbit AI analyzed your workspace and detected 3 priority insights requiring attention today.",
      },
    ],

    addMessage: (message) =>
      set((state) => ({
        messages: [
          ...state.messages,
          message,
        ],
      })),

    setMessages: (messages) =>
      set({
        messages,
      }),

    loading: false,

    setLoading: (loading) =>
      set({
        loading,
      }),

    activeAgent: "strategist",

    setActiveAgent: (
      activeAgent
    ) =>
      set({
        activeAgent,
      }),

    aiMemory: [
      "CRM workflows prioritized frequently",
    ],

    addMemory: (memory) =>
      set((state) => ({
        aiMemory: [
          ...state.aiMemory,
          memory,
        ],
      })),

    workflowTimeline: [],

    setWorkflowTimeline: (
      workflowTimeline
    ) =>
      set({
        workflowTimeline,
      }),
  }));