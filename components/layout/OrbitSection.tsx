import { cn }
from "@/lib/utils";

type OrbitSectionProps = {

  children:
    React.ReactNode;

  className?: string;
};

export default function OrbitSection({

  children,

  className = "",

}: OrbitSectionProps) {

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