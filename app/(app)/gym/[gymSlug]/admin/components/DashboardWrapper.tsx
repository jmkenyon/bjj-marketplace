interface DashboardWrapperProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const DashboardWrapper = ({
  children,
  title,
  subtitle,
}: DashboardWrapperProps) => {
  return (
    <section className="flex flex-col h-full rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-6 shrink-0">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-slate-600">{subtitle}</p>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">{children}</div>
    </section>
  );
};

export default DashboardWrapper;
