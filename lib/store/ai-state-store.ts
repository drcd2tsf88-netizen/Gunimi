import { create }
from "zustand";

type Message = {
  id: string;

  role:
    | "user"
    | "assistant";

  content: string;

  createdAt: string;

  metadata?: Record<string, unknown>;
};

type MemoryItem = {
  role: string;

  content: string;
};

type WorkflowItem = {
  id: string;

  title: string;

  status: string;
};

type AIStateStore = {
  // THINKING

  thinking: boolean;

  currentThought: string;

  setThinking: (
    thinking: boolean
  ) => void;

  setCurrentThought: (
    thought: string
  ) => void;

  // CHAT

  messages: Message[];

  addMessage: (
    message: Message
  ) => void;

  appendToMessage: (
    id: string,
    token: string
  ) => void;

  setMessageMetadata: (
    id: string,
    metadata: Record<string, unknown>
  ) => void;

  clearMessages: () => void;

  // MEMORY

  memory: MemoryItem[];

  setMemory: (
    memory: MemoryItem[]
  ) => void;

  // WORKFLOW

  workflowTimeline:
    WorkflowItem[];

  setWorkflowTimeline: (
    workflowTimeline: WorkflowItem[]
  ) => void;
};

export const useAIStateStore =
  create<AIStateStore>(
    (set) => ({
      // THINKING

      thinking: false,

      currentThought: "",

      setThinking: (
        thinking
      ) =>
        set({
          thinking,
        }),

      setCurrentThought: (
        currentThought
      ) =>
        set({
          currentThought,
        }),

      // CHAT

      messages: [],

      addMessage: (
        message
      ) =>
        set((state) => ({
          messages: [
            ...state.messages,

            message,
          ],
        })),

      appendToMessage: (id, token) =>
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === id ? { ...m, content: m.content + token } : m
          ),
        })),

      setMessageMetadata: (id, metadata) =>
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === id ? { ...m, metadata } : m
          ),
        })),

      clearMessages: () =>
        set({
          messages: [],
        }),

      // MEMORY

      memory: [],

      setMemory: (
        memory
      ) =>
        set({
          memory,
        }),

      // WORKFLOW

      workflowTimeline:
        [],

      setWorkflowTimeline:
        (
          workflowTimeline
        ) =>
          set({
            workflowTimeline,
          }),
    })
  );