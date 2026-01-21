import DashboardWrapper from "@/app/(app)/gym/[gymSlug]/admin/components/DashboardWrapper";
import { StudentProfileForm } from "@/app/(app)/gym/[gymSlug]/admin/components/StudentProfile";
import EmptyState from "@/app/(app)/components/EmptyState";
import { getCurrentUser } from "@/app/hooks/getCurrentUser";

const Page = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return <EmptyState title="Please log in again" />;
  }
  return (
    <DashboardWrapper
      title="Your profile"
      subtitle="View and update your information below"
    >
      <StudentProfileForm user={user} />
    </DashboardWrapper>
  );
};

export default Page;
