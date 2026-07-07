import { cn }
from "@/lib/utils";

type GunimiSectionProps = {

  children:
    React.ReactNode;

  className?: string;
};

export default function GunimiSection({

  children,

  className = "",

}: GunimiSectionProps) {

  return (

    <section

      className={cn(

        `
        mb-8
        space-y-6
        `,

        className

      )}
    >

      {children}

    </section>
  );
}