"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to default view (suppliers)
    router.replace('/client/Admin/Dashboard/suppliers');
  }, [router]);

  return null;
}
