// Shared Tailwind class string for supplementary panel input fields.
// Used by CreateContactPanel, CreateCompanyPanel, and CreateDealPanel.
export const panelInputClass = `
  w-full
  rounded-xl
  border
  border-white/10
  bg-white/[0.03]
  px-4
  py-3
  text-sm
  text-white
  outline-none
  placeholder:text-zinc-600
  focus:border-violet-500/30
  focus:bg-violet-500/5
  disabled:opacity-40
  transition-all
  duration-200
`;
