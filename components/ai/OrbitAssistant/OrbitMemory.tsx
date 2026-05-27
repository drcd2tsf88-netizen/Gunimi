type OrbitMemoryProps = {
  aiMemory: {
    role: string;

    content: string;
  }[];
};

export default function OrbitMemory({
  aiMemory,
}: OrbitMemoryProps) {
  if (
    aiMemory.length === 0
  ) {
    return null;
  }

  return (
    <div>
      <p
        className="
          mb-3

          text-[10px]
          uppercase

          tracking-[0.2em]

          text-zinc-500
        "
      >
        Orbit Memory
      </p>

      <div
        className="
          flex
          flex-wrap
          gap-2
        "
      >
        {aiMemory
          .slice(-3)
          .map(
            (
              memory,
              index
            ) => (
              <div
                key={index}
                className="
                  max-w-full

                  truncate

                  rounded-full

                  border
                  border-violet-500/20

                  bg-violet-500/10

                  px-3
                  py-1.5

                  text-[11px]
                  text-violet-300
                "
              >
                {
                  memory.content
                }
              </div>
            )
          )}
      </div>
    </div>
  );
}