"use client";
import {

  saveMemory,
  loadMemory,

} from "@/lib/ai-memory";
import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  Sparkles,
  Send,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

type OrbitAssistantProps = {

  open: boolean;

  onClose: () => void;
};

export default function OrbitAssistant({

  open,

  onClose,

}: OrbitAssistantProps) {
  const [

  executingAction,

  setExecutingAction,

] = useState(false);
const [

  aiMemory,

  setAiMemory,

] = useState<string[]>([
  "CRM workflows prioritized frequently",
]);
const [

  activeAgent,

  setActiveAgent,

] = useState("strategist");
   const [message, setMessage] =
  useState("");

const [messages, setMessages] =
  useState([

    {

      role: "assistant",

      content:
        "Good morning, Michal. Orbit AI analyzed your workspace and detected 3 priority insights requiring attention today.",

    },

  ]);
  const [workspaceMemory, setWorkspaceMemory] =
  useState<string[]>([]);
useEffect(() => {

  async function fetchMemory() {

    const data =
      await loadMemory(
        "orbit-demo"
      );

    setAiMemory(

      data.map(
        (item) => item.memory
      )

    );

  }

  fetchMemory();

}, []);
async function saveNewMemory(memory: string) {
  await saveMemory("orbit-demo", memory);
}
const [suggestions] = useState([

  "Review overdue CRM tasks",

  "Generate AI workspace briefing",

  "Analyze productivity trends",

  "Prepare daily execution plan",

]);
const workspaceContext = {

  activeTasks: 12,

  overdueTasks: 3,

  crmLeads: 24,

  aiActions: 184,

  productivity: "+18%",

};
const [actionCards, setActionCards] =
  useState<string[]>([]);
  const [workflowTimeline, setWorkflowTimeline] =
  useState<string[]>([]);

const [loading, setLoading] =
  useState(false);
  async function handleSend() {

  if (!message.trim())
    return;

  const userMessage = {

    role: "user",

    content: message,

  };
  let generatedActions: string[] = [];

if (

  message
    .toLowerCase()
    .includes("task")

) {

  generatedActions = [

    "Create Follow-up Task",

    "Review Workspace Tasks",

  ];

}

if (

  message
    .toLowerCase()
    .includes("crm")

) {

  generatedActions = [

    "Open CRM Pipeline",

    "Generate Follow-up Notes",

  ];

}

if (

  message
    .toLowerCase()
    .includes("analyze")

) {

  generatedActions = [

    "Open Workspace Analytics",

    "Generate AI Report",

  ];

}

setActionCards(generatedActions);

  setMessages((prev) => [

    ...prev,

    userMessage,

  ]);

  setMessage("");

  setLoading(true);

  setTimeout(async () => {

    let response =

      "Orbit AI processed your workspace request.";

    if (

      message
        .toLowerCase()
        .includes("task")

    ) {

      response =
        "You currently have 3 overdue tasks and 8 active workspace priorities.";

    }

    if (

      message
        .toLowerCase()
        .includes("crm")

    ) {

      response =
        "CRM engagement increased 24% today with 4 new lead interactions detected.";

    }

    if (

      message
        .toLowerCase()
        .includes("summary")

    ) {

      response =
        "Workspace productivity increased today with strong AI workflow completion performance.";

    }
    if (
       



  message
    .toLowerCase()
    .includes("briefing")

) {

  response =

    `Orbit AI Workspace Briefing

• Workspace productivity increased by 18% today.

• 3 overdue tasks require attention.

• CRM engagement increased with 4 new lead interactions.

• AI systems completed 184 automated actions.

• Team collaboration performance remains optimal.

Recommendation:
Prioritize overdue tasks and review CRM pipeline opportunities.`;
}
if (

  message
    .toLowerCase()
    .includes("priority")

) {

  response =

    `Orbit AI analyzed your workspace priorities.

Current Workspace Memory:

${workspaceMemory.join("\n")}

Recommendation:
Focus on CRM execution workflows and overdue productivity items.`;

}
if (

  message
    .toLowerCase()
    .includes("create task")
 

) {

  response =

    `Orbit AI successfully created a new workspace task.

Task:
CRM Review Follow-up

Priority:
High

Status:
Added to active workspace queue.

Orbit AI also scheduled the task for today's productivity workflow.`;
   setWorkspaceMemory((prev) => [

  ...prev,

  "CRM review task created",

]);
setWorkflowTimeline([

  "Task Created",

  "CRM Workflow Scheduled",

  "Workspace Updated",

  "AI Summary Generated",

]);

}
if (

  message
    .toLowerCase()
    .includes("analyze")

) {

  response =

`Orbit AI Workspace Analysis

• Active Tasks:
${workspaceContext.activeTasks}

• Overdue Tasks:
${workspaceContext.overdueTasks}

• CRM Leads:
${workspaceContext.crmLeads}

• AI Actions Today:
${workspaceContext.aiActions}

• Productivity Trend:
${workspaceContext.productivity}

Analysis:
Workspace performance remains stable with elevated CRM engagement and healthy AI workflow activity.

Recommendation:
Focus on overdue task resolution and prioritize high-engagement CRM opportunities.`;

}
if (

  message
    .toLowerCase()
    .includes("crm")

) {

  setAiMemory((prev) => [

    ...prev,

    "User actively focuses on CRM operations",
   ]);


if (

  message
    .toLowerCase()
    .includes("task")

) {

  setAiMemory((prev) => [

    ...prev,

    "Task workflow activity detected",

  ]);
}
}
await saveMemory(

  "orbit-demo",

  "User actively focuses on CRM operations"

);
    setMessages((prev) => [

      ...prev,

      {

        role: "assistant",

        content: response,

      },

    ]);

    setLoading(false);

  }, 1400);

}
const agents = [

  {

    id:
      "strategist",

    name:
      "Orbit Strategist",

    description:
      "Growth intelligence and operational strategy.",

    color:
      "violet",

  },

  {

    id:
      "operator",

    name:
      "Orbit Operator",

    description:
      "Workflow orchestration and execution systems.",

    color:
      "cyan",

  },

  {

    id:
      "analyst",

    name:
      "Orbit Analyst",

    description:
      "Predictive analytics and AI observatory.",

    color:
      "emerald",

  },

  {

    id:
      "crm",

    name:
      "Orbit CRM AI",

    description:
      "Pipeline intelligence and lead optimization.",

    color:
      "pink",

  },

];
  return (

    <AnimatePresence>

      {

        open && (

          <motion.div

            initial={{
              opacity: 0,
            }}

            animate={{
              opacity: 1,
            }}

            exit={{
              opacity: 0,
            }}

            className="

              fixed
              inset-0
              z-[999]

              flex
              justify-end

              bg-black/50

              backdrop-blur-sm

            "

            onClick={onClose}

          >

            <motion.div

              initial={{
                x: 40,
                opacity: 0,
              }}

              animate={{
                x: 0,
                opacity: 1,
              }}

              exit={{
                x: 40,
                opacity: 0,
              }}

              transition={{
                duration: 0.25,
              }}

              onClick={(e) =>
                e.stopPropagation()
              }

              className="

                relative

                flex
                h-full
                w-full
                max-w-xl
                flex-col

                overflow-hidden

                border-l
                border-white/10

                bg-[#060816]/95

                backdrop-blur-3xl

              "

            >

              {/* Ambient Glow */}
              <div

                className="

                  pointer-events-none

                  absolute
                  right-[-120px]
                  top-[-120px]

                  h-[320px]
                  w-[320px]

                  rounded-full

                  bg-violet-500/10

                  blur-3xl

                "

              />

              {/* Header */}
              <div

                className="

                  relative
                  z-10

                  flex
                  items-center
                  justify-between

                  border-b
                  border-white/10

                  px-6
                  py-5

                "

              >

                <div
                  className="flex items-center gap-4"
                >
                  <div className="mt-6">

  <p

    className="

      mb-3

      text-xs
      uppercase
      tracking-[0.2em]

      text-zinc-500

    "

  >

    Orbit AI Memory

  </p>

  <div
    className="flex flex-wrap gap-3"
  >

    {

      aiMemory
        .slice(-3)
        .map((memory) => (

          <div

            key={memory}

            className="

              rounded-full

              border
              border-violet-500/20

              bg-violet-500/10

              px-3
              py-2

              text-xs
              text-violet-300

            "

          >

            {memory}

          </div>

        ))

    }

  </div>

</div>
// Agent Info//
<div className="mt-8">

  <p

    className="

      mb-4

      text-xs
      uppercase
      tracking-[0.2em]

      text-zinc-500

    "

  >

    Orbit AI Agents

  </p>

  <div
    className="grid gap-3 md:grid-cols-2"
  >

    {

      agents.map((agent) => (

        <motion.button

          key={agent.id}

          whileHover={{
            y: -2,
          }}

          whileTap={{
            scale: 0.98,
          }}

          onClick={() =>
            setActiveAgent(agent.id)
          }

          className={`

            relative

            overflow-hidden

            rounded-2xl

            border

            p-5

            text-left

            transition-all
            duration-300

            ${

              activeAgent === agent.id

                ? "border-violet-500/30 bg-violet-500/10"

                : "border-white/10 bg-white/[0.03]"

            }

          `}

        >

          {/* Glow */}
          {

            activeAgent === agent.id && (

              <div

                className="

                  pointer-events-none

                  absolute
                  right-[-40px]
                  top-[-40px]

                  h-[120px]
                  w-[120px]

                  rounded-full

                  bg-violet-500/10

                  blur-3xl

                "

              />

            )

          }

          <div className="relative z-10">

            <div

              className="

                flex
                items-center
                gap-3

              "

            >

              <motion.div

                animate={{

                  scale:
                    activeAgent === agent.id

                      ? [1, 1.3, 1]

                      : 1,

                  opacity:
                    activeAgent === agent.id

                      ? [0.5, 1, 0.5]

                      : 0.5,

                }}

                transition={{

                  duration: 2,
                  repeat: Infinity,

                }}

                className="

                  h-3
                  w-3

                  rounded-full

                  bg-violet-400

                "

              />

              <h3

                className="

                  text-sm
                  font-semibold
                  text-white

                "

              >

                {agent.name}

              </h3>

            </div>

            <p

              className="

                mt-3

                text-sm
                leading-relaxed
                text-zinc-400

              "

            >

              {agent.description}

            </p>

          </div>

        </motion.button>

      ))

    }

  </div>

</div>

                  {/* Orbit Core */}
                  <motion.div

                    animate={{

                      boxShadow: [

                        "0 0 0px rgba(124,58,237,0)",

                        "0 0 35px rgba(124,58,237,0.4)",

                        "0 0 0px rgba(124,58,237,0)",

                      ],

                    }}

                    transition={{

                      duration: 4,
                      repeat: Infinity,

                    }}

                    className="

                      relative

                      flex
                      h-14
                      w-14

                      items-center
                      justify-center

                      rounded-2xl

                      border
                      border-violet-500/20

                      bg-violet-500/10

                    "

                  >

                    {/* Pulse */}
                    <motion.div

                      animate={{

                        scale: [1, 1.6, 1],
                        opacity: [0.4, 0, 0.4],

                      }}

                      transition={{

                        duration: 2.5,
                        repeat: Infinity,

                      }}

                      className="

                        absolute

                        h-5
                        w-5

                        rounded-full

                        bg-violet-400/40

                      "

                    />

                    <Sparkles
                      className="h-5 w-5 text-violet-300"
                    />

                  </motion.div>

                  <div>

                    <h2

                      className="

                        text-lg
                        font-semibold

                      "

                    >

                      Orbit AI Assistant

                    </h2>

                    <div

  className="

    mt-3

    inline-flex
    items-center
    gap-2

    rounded-full

    border
    border-green-500/20

    bg-green-500/10

    px-3
    py-1

    text-xs
    text-green-300

  "

>

  <div

    className="

      h-2
      w-2

      rounded-full

      bg-green-400

    "

  />

  Live workspace context connected

</div>
                  </div>

                </div>

                <button

                  onClick={onClose}

                  className="

                    rounded-2xl

                    border
                    border-white/10

                    bg-white/[0.03]

                    px-4
                    py-2

                    text-sm
                    text-zinc-400

                    transition-all
                    duration-300

                    hover:bg-white/[0.06]

                  "

                >

                  Close

                </button>

              </div>

              {/* Messages */}
              <div

                className="

                  relative
                  z-10

                  flex-1

                  space-y-6

                  overflow-y-auto

                  px-6
                  py-6

                "

              >

                {/* AI Message */}
                <div
  
  className="mb-6 flex flex-wrap gap-3"
>

  {

    suggestions.map((item) => (

      <motion.button

        key={item}

        whileHover={{
          y: -2,
        }}

        whileTap={{
          scale: 0.98,
        }}

        onClick={() =>
          setMessage(item)
        }

        className="

          rounded-2xl

          border
          border-white/10

          bg-white/[0.03]

          px-4
          py-3

          text-sm
          text-zinc-300

          transition-all
          duration-300

          hover:border-violet-500/20
          hover:bg-violet-500/10
          hover:text-white

        "

      >

        ✦ {item}

      </motion.button>

    ))

  }

</div>
  {

    messages.map((msg, index) => (

      <motion.div

  key={index}

  initial={{
    opacity: 0,
    y: 10,
  }}

  animate={{
    opacity: 1,
    y: 0,
  }}

  className={`

    max-w-md

    rounded-[28px]

    p-5

    ${

      msg.role === "assistant"

        ? "border border-violet-500/20 bg-violet-500/10 text-white"

        : "ml-auto bg-white text-black"

    }

  `}

>

  {msg.role === "assistant" && (

    <div

      className="

        mb-3

        flex
        items-center
        gap-2

      "

    >

      <motion.div

        animate={{

          scale: [1, 1.3, 1],

          opacity: [0.5, 1, 0.5],

        }}

        transition={{

          duration: 2,
          repeat: Infinity,

        }}

        className="

          h-2
          w-2

          rounded-full

          bg-violet-400

        "

      />

      <p

        className="

          text-xs
          uppercase
          tracking-[0.2em]

          text-violet-300

        "

      >

        {

          activeAgent === "strategist"

            ? "Orbit Strategist"

            : activeAgent === "operator"

              ? "Orbit Operator"

              : activeAgent === "analyst"

                ? "Orbit Analyst"

                : "Orbit CRM AI"

        }

      </p>

    </div>

  )}

  <p

    className="

      whitespace-pre-line

      leading-relaxed

    "

  >

    {msg.content}

  </p>

</motion.div>

   

    ))

  }
  {

  loading && (

    <p

      className="

        mb-3

        text-xs
        text-violet-300

      "

    >

      Orbit AI is processing workspace context...

    </p>

  )

}

  {

    loading && (

      <motion.div

        initial={{
          opacity: 0,
        }}

        animate={{
          opacity: 1,
        }}

        className="

          max-w-[140px]

          rounded-[24px]

          border
          border-violet-500/20

          bg-violet-500/10

          px-5
          py-4

        "

      >

        <div
          className="flex gap-2"
        >

          <div
            className="h-2 w-2 rounded-full bg-violet-300 animate-bounce"
          />

          <div
            className="h-2 w-2 rounded-full bg-violet-300 animate-bounce [animation-delay:0.2s]"
          />

          <div
            className="h-2 w-2 rounded-full bg-violet-300 animate-bounce [animation-delay:0.4s]"
          />

        </div>

      </motion.div>

    )

  }

</div>
{
actionCards.length > 0 && (

    <motion.div

      initial={{
        opacity: 0,
        y: 10,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      className="mt-6"

    >

      <p

        className="

          mb-4

          text-xs
          uppercase
          tracking-[0.2em]

          text-zinc-500

        "

      >

        Orbit AI Suggested Actions

      </p>

      <div
        className="flex flex-wrap gap-3"
      >

        {

          actionCards.map((action) => (

            <motion.button

  onClick={async () => {
    setExecutingAction(true);

setMessages((prev) => [

  ...prev,

  {

    role: "assistant",

    content:
      "Orbit AI executing workflow...",

  },

]);

    try {

      const response =
        await fetch(

          "/api/tasks/create",

          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              companyId:
                "orbit-demo",

              title:
                action,

              description:
                `AI-generated execution task for ${action}`,

              priority:
                "high",

            }),

          }

        );

      if (!response.ok) {

        throw new Error(
          "Execution failed"
        );

      }

      setMessages((prev) => [

  ...prev,

  {

    role: "assistant",

    content:

`Orbit AI execution completed successfully.

• ${action}

Workspace systems updated
AI workflow synchronized
Execution pipeline operational.`,

  },

]);

setExecutingAction(false);

    } catch (error) {
      setExecutingAction(false);

      setMessages((prev) => [

        ...prev,

        {

          role: "assistant",

          content:

            "Orbit AI execution failed. Please verify workspace systems and retry.",

        },

      ]);

    }

  }}

  whileHover={{
    y: -2,
  }}

  whileTap={{
    scale: 0.98,
  }}

>
  </motion.button>

          ))

        }

      </div>

    </motion.div>

  )
        }
{

  executingAction && (

    <motion.div

      initial={{
        opacity: 0,
        y: 10,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      className="mt-6"

    >

      <div

        className="

          flex
          items-center
          gap-4

          rounded-2xl

          border
          border-violet-500/20

          bg-violet-500/10

          px-5
          py-4

        "

      >

        <motion.div

          animate={{

            rotate: 360,

          }}

          transition={{

            duration: 1.2,
            repeat: Infinity,
            ease: "linear",

          }}

          className="

            h-5
            w-5

            rounded-full

            border-2
            border-violet-400/20
            border-t-violet-400

          "

        />

        <div>

          <p
            className="text-sm font-medium text-white"
          >

            Orbit AI Workflow Execution Active

          </p>

          <p
            className="mt-1 text-xs text-zinc-400"
          >

            Synchronizing workspace systems...

          </p>

        </div>

      </div>

    </motion.div>

  )

}
  {

  workflowTimeline.length > 0 && (

    <motion.div

      initial={{
        opacity: 0,
        y: 10,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      className="mt-8"

    >

      <p

        className="

          mb-5

          text-xs
          uppercase
          tracking-[0.2em]

          text-zinc-500

        "

      >

        Orbit AI Workflow Timeline

      </p>

      <div
        className="space-y-4"
      >

        {

          workflowTimeline.map((step, index) => (

            <motion.div

              key={step}

              initial={{
                opacity: 0,
                x: -10,
              }}

              animate={{
                opacity: 1,
                x: 0,
              }}

              transition={{
                delay: index * 0.12,
              }}

              className="

                flex
                items-center
                gap-4

              "

            >

              {/* Pulse */}
              <motion.div

                animate={{

                  scale: [1, 1.3, 1],

                  opacity: [0.6, 1, 0.6],

                }}

                transition={{

                  duration: 2,
                  repeat: Infinity,

                  delay: index * 0.2,

                }}

                className="

                  relative

                  flex
                  h-4
                  w-4

                  items-center
                  justify-center

                "

              >

                <div

                  className="

                    absolute

                    h-4
                    w-4

                    rounded-full

                    bg-violet-400/30

                  "

                />

                <div

                  className="

                    relative

                    h-2.5
                    w-2.5

                    rounded-full

                    bg-violet-300

                  "

                />

              </motion.div>

              {/* Step */}
              <div

                className="

                  flex-1

                  rounded-2xl

                  border
                  border-white/10

                  bg-white/[0.03]

                  px-5
                  py-4

                  text-sm
                  text-zinc-300

                "

              >

                {step}

              </div>

            </motion.div>

          ))

        }

      </div>

    </motion.div>

  )

}

              {/* Input */}
              <div

                className="

                  relative
                  z-10

                  border-t
                  border-white/10

                  p-5

                "

              >

                <div

                  className="

                    flex
                    items-center
                    gap-3

                    rounded-[28px]

                    border
                    border-white/10

                    bg-white/[0.03]

                    p-3

                  "

                >

                  <input

  value={message}

  onChange={(e) =>
    setMessage(e.target.value)
  }

  onKeyDown={(e) => {

    if (e.key === "Enter") {

      handleSend();

    }

  }}

  placeholder="
    Ask Orbit AI...
  "

  className="

    flex-1

    bg-transparent

    px-3

    text-white

    outline-none

    placeholder:text-zinc-500

  "

/>

                  <button
                  onClick={handleSend}  

                    className="

                      flex
                      h-12
                      w-12

                      items-center
                      justify-center

                      rounded-2xl

                      bg-white

                      text-black

                    "

                  >

                    <Send
                      className="h-4 w-4"
                    />

                  </button>

                </div>

              </div>

            </motion.div>

          </motion.div>

        )

      }

    </AnimatePresence>

  );

}