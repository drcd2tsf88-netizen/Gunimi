type Props = {
  label: string;
  children: React.ReactNode;
  error?: string;
};

export default function GunimiField({ label, children, error }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-[11px] text-red-400">{error}</p>
      )}
    </div>
  );
}