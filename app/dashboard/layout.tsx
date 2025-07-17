import DashboardLayout from '@/components/DashboardLayout';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';


export default async function DashboardServerWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session
    // || session.user.role !== 'user'
  ) {
    redirect("/auth/signin");
  }

  return (
    <DashboardLayout session={session}>
      {children}
    </DashboardLayout>
  );
}