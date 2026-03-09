import { redirect } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/admin-page-header';

export default function AdminDashboardRedirect() {
  redirect('/admin');
}
