import AdminSidebar from "./AdminSidebar";
import StudentSidebar from "./StudentSidebar";
import type { Session } from "next-auth";

interface OptionsPanelProps {
  session: Session;
}

const OptionsPanel = ({ session }: OptionsPanelProps) => {
  const gymSlug =
    session.user.role === "ADMIN" ? session.user.gymSlug : undefined;

  return (
    <aside className="shrink-0 border-r bg-white w-16 md:w-64 transition-[width] duration-200">
      {session.user.role === "ADMIN" && gymSlug ? (
        <AdminSidebar gymSlug={gymSlug} />
      ) : (
        <StudentSidebar />
      )}
    </aside>
  );
};

export default OptionsPanel;