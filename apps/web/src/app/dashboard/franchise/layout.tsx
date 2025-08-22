import { ReactNode } from 'react';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function FranchiseLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    // Redirect unauthenticated users to sign-in, then back to franchise dashboard
    redirect('/sign-in?redirect_url=/dashboard/franchise');
  }

  const user = await currentUser();
  const role = (user?.publicMetadata as any)?.role as string | undefined;
  if (role !== 'franchise_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold mb-2">403 — Forbidden</h1>
          <p className="text-slate-600">
            You are signed in but do not have access to the franchise dashboard.
          </p>
          <p className="mt-2 text-slate-500 text-sm">Required role: <code>franchise_admin</code></p>
          <p className="mt-1 text-slate-500 text-xs">Detected role: <code>{String(role ?? 'none')}</code></p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
