
import { GetSupplier } from '@/app/actions/GetSupplier';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import ChangePasswordForm from '@/components/ChangePasswordForm';
import EditCitiesClient from '@/components/EditCitiesClient';
import SupplierDetailsClient from '@/components/SupplierDetailsClient';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SupplierDeatiles({ params }: PageProps) {
  const { id } = await params;
  const session = await getSession();
  
  if (!session) {
    redirect('/client/AdminLogin');
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

  const isAdmin = session.role === 'ADMIN';
  
  // Calculate statistics
  const totalTasks = supplier.tasks.length;
  const completedTasks = supplier.tasks.filter(t => t.status === 'COMPLETED').length;
  const pendingTasks = supplier.tasks.filter(t => t.status === 'PENDING').length;
  const rejectedTasks = supplier.tasks.filter(t => t.status === 'REJECTED').length;

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
                  {supplier.firstName} {supplier.lastName}
                </h1>
                <p className="text-gray-500 mt-1">פרטי ספק</p>
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
                  <a href={`mailto:${supplier.email}`} className="text-lg text-blue-600 hover:text-blue-800">
                    {supplier.email}
                  </a>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">טלפון</label>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${supplier.phone}`} className="text-lg text-gray-900">
                    {supplier.phone || 'לא זמין'}
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">נוצר ב</label>
                <p className="text-lg text-gray-900">
                  {new Date(supplier.createdAt).toLocaleDateString('he-IL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">עודכן לאחרונה</label>
                <p className="text-lg text-gray-900">
                  {new Date(supplier.updatedAt).toLocaleDateString('he-IL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
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
              currentCities={supplier.cities || []}
            />
          ) : (
            supplier.cities && supplier.cities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {supplier.cities.map((city) => (
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

        {/* Tasks Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">משימות ({totalTasks})</h2>
          
          {supplier.tasks.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-4 text-gray-500">אין משימות עבור ספק זה</p>
            </div>
          ) : (
            <div className="space-y-4">
              {supplier.tasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/client/TaskDeatiles/${task.id}`}
                  className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{task.address}</h3>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          task.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {task.status === 'COMPLETED' ? 'הושלם' :
                           task.status === 'PENDING' ? 'ממתין' :
                           'נדחה'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{task.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {task.city}
                        </span>
                        {task.date && (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(task.date).toLocaleDateString('he-IL')}
                          </span>
                        )}
                        <span className="flex items-center">
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {new Date(task.createdAt).toLocaleDateString('he-IL')}
                        </span>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </SupplierDetailsClient>
  );
}