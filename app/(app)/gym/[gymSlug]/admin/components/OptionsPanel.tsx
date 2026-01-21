import AdminSidebar from "./AdminSidebar";
import StudentSidebar from "./StudentSidebar";
import type { Session } from "next-auth";

interface OptionsPanelProps {
  gymSlug: string;
  session: Session;
}

const OptionsPanel = ({ gymSlug, session }: OptionsPanelProps) => {
  return (
    <aside
      className="
        shrink-0
        border-r bg-white
        w-16 md:w-64
        transition-[width]
        duration-200
      "
    >
      {session.user.role === "ADMIN" ? (
        <AdminSidebar gymSlug={gymSlug} />
      ) : (
        <StudentSidebar gymSlug={gymSlug} />
      )}
    </aside>
  );
};

export default OptionsPanel;
