
import { GetSupplier } from '@/app/actions/GetSupplier';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import ChangePasswordForm from '@/components/admin/ChangePasswordForm';
import EditCitiesClient from '@/components/admin/EditCitiesClient';
import SupplierDetailsClient from '@/components/admin/suppliers/SupplierDetailsClient';
import { CLIENT_ROUTES } from '@/app/constans/constans';
import Link from 'next/link';
import { suppliers, tasks, cities } from '@/prisma/generated/client';

type SupplierWithRelations = suppliers & {
  tasks: tasks[];
  cities: cities[];
  users?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SupplierDeatiles({ params }: PageProps) {
  const { id } = await params;
  const session = await getSession();
  
  if (session && session.role !== "ADMIN") {
    redirect(CLIENT_ROUTES.AdminSignIn);
  }

  const { supplier, error } = await GetSupplier(id);

  if (error || !supplier) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || 'שגיאה בטעינת פרטי הספק'}</p>
          <Link
            href="/client/Admin/Dashboard"
            className="mt-4 text-blue-600 hover:text-blue-800 inline-block"
          >
            חזור לדף הבית
          </Link>
        </div>
      </div>
    );
  }

  const supplierWithRelations = supplier as SupplierWithRelations;
  const isAdmin = session && session.role === 'ADMIN';
  
  // Calculate statistics
  const totalTasks = supplierWithRelations.tasks?.length || 0;
  const completedTasks = supplierWithRelations.tasks?.filter((t: tasks) => t.status === 'COMPLETED').length || 0;
  const pendingTasks = supplierWithRelations.tasks?.filter((t: tasks) => t.status === 'PENDING').length || 0;
  const rejectedTasks = supplierWithRelations.tasks?.filter((t: tasks) => t.status === 'REJECTED').length || 0;

  return (
    <SupplierDetailsClient>
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/client/Admin/Dashboard"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            חזור
          </Link>
        </div>

        {/* Supplier Header Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-reverse space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {supplier.firstName.charAt(0)}{supplier.lastName.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {supplierWithRelations.firstName} {supplierWithRelations.lastName}
                </h1>
                <p className="text-sm text-gray-500 mt-1">מספר מזהה</p>
                <p className="text-sm text-blue-400 mt-1">{supplierWithRelations.id}</p>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">סה&quot;כ משימות</p>
              <p className="text-2xl font-bold text-blue-600">{totalTasks}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">הושלמו</p>
              <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">ממתינות</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingTasks}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">נדחו</p>
              <p className="text-2xl font-bold text-red-600">{rejectedTasks}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${supplierWithRelations.email}`} className="text-lg text-blue-600 hover:text-blue-800">
                    {supplierWithRelations.email}
                  </a>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">טלפון</label>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${supplierWithRelations.phone || ''}`} className="text-lg text-gray-900">
                    {supplierWithRelations.phone || 'לא זמין'}
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">תאריך יצירה</label>
                <p className="text-lg text-gray-900">
                  {new Date(supplierWithRelations.createdAt).toLocaleDateString('he-IL', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">עודכן לאחרונה</label>
                <p className="text-lg text-gray-900">
                  {new Date(supplierWithRelations.updatedAt).toLocaleDateString('he-IL', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Section - Only for Admin */}
        {isAdmin && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">שינוי סיסמה</h2>
            <ChangePasswordForm supplierId={id} />
          </div>
        )}

        {/* Cities Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">ערים</h2>
          </div>
          
          {isAdmin ? (
            <EditCitiesClient 
              supplierId={id} 
              currentCities={(supplierWithRelations.cities || []).map((city: cities) => ({
                id: String(city.id),
                city: city.city
              }))}
            />
          ) : (
            supplierWithRelations.cities && supplierWithRelations.cities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {supplierWithRelations.cities.map((city: cities) => (
                  <span
                    key={city.id}
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {city.city}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">אין ערים מוגדרות</p>
            )
          )}
        </div>
      </div>
    </div>
    </SupplierDetailsClient>
  );
}