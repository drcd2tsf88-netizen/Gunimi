type Props = {
  label: string;
  children: React.ReactNode;
};

export default function GunimiField({
  label,
  children,
}: Props) {
  return (
    <div
      className="
        space-y-2
      "
    >
      <label
        className="
          text-xs
          uppercase
          tracking-[0.18em]
          text-zinc-500
        "
      >
        {label}
      </label>

      {children}
    </div>
  );
}