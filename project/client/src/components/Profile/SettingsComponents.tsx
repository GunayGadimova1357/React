export const SettingsSection = ({ title, description, children }: any) => (
  <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="mb-6">
      <h3 className="text-2xl font-black text-white mb-1">{title}</h3>
      <p className="text-zinc-500 text-sm">{description}</p>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </section>
);

export const DarkInput = ({ label, helper, className = "", disabled = false, ...props  }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-[14px] text-zinc-500 ml-1">{label}</label>
    <input 
      {...props}
      disabled={disabled}
      className={`bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-white/30 focus:bg-white/[0.06] transition-all placeholder:text-zinc-700 ${className}`}
    />
    {helper && <p className="text-[10px] text-zinc-600 ml-1">{helper}</p>}
  </div>
);