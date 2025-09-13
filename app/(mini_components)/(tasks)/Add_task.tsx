"use client"
import React, { useEffect, useState } from 'react';
import { tasks, users } from '@/generated/prisma/client';
import { useError } from '@/app/(hooks)/useError';
import { useMemo } from 'react';


export default function Add_task() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState<Partial<tasks>>({
    address: '',
    description: '',
    priority: undefined,
    userId: undefined,
  });
  const user_id=localStorage.getItem('userid');
  const [users, setUsers] = useState<users[]>([]);
  const { error, setError, loading, setLoading, success, setSuccess } = useError();

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await fetch('/getallusers').then(res => res.json());
      setUsers(users);
    };
    fetchUsers();
  }, []);

  const filteredUsers  = useMemo(() => {

    if (!user_id) {
      return users;
    }
    return users.filter(user => Number(user.id) !== Number(user_id));
  }, [users, user_id]);



  const handleChange= (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name,value} = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    if (!newTask.userId) {
      setError('אנא בחר לקוח');
      return;
    }

    if (!newTask.address || !newTask.description) {
      setError('אנא מלא את כל השדות הנדרשים');
      return;
    }

    console.log('Sending task data:', newTask);

    try {
      const response = await fetch('/addTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      const result = await response.json();
      console.log('Response:', result);

      if (response.ok) {
        setSuccess(true);
        setNewTask({
          address: '',
          description: '',
          priority: undefined,
          userId: undefined,
        });
        setShowAddForm(false);
      } else {
        setError(result.error || 'שגיאה בהוספת המשימה');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      setError('שגיאה בהוספת המשימה');
    } finally {
      setLoading(false);
      setError(null);
    }
  };


  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">הוספת משימה</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {showAddForm ? 'ביטול' : 'הוסף משימה חדשה'}
        </button>
      </div>

      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">המשימה נוספה בהצלחה</div>}
      {/* Add Task Form */}
      {showAddForm && (
        <form onSubmit={handleAddTask}>
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">הוסף משימה חדשה</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">כתובת</label>
              <input
                type="text"
                name="address"
                value={newTask.address}
                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="הכנס כתובת"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">תיאור</label>
              <input
                type="text"
                name="description"
                value={newTask.description}
                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="הכנס תיאור"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">עדיפות</label>
              <select
                name="priority"
                value={newTask.priority}
                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLSelectElement>)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="LOW">נמוכה</option>
                <option value="MEDIUM">בינונית</option>
                <option value="HIGH">גבוהה</option>
              </select>
            </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">שם לקוח</label>
                <select
                  name="userId"
                  value={newTask.userId}
                  onChange={(e) => handleChange(e as React.ChangeEvent<HTMLSelectElement>)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">בחר שם לקוח</option>
                  {filteredUsers.map((user) => (
                    <option key={user.id}  value={user.id}>{user.firstName + ' ' + user.lastName}</option>
                  ))}
                </select>
              </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              ביטול
            </button>
            <button
            type="submit"
            disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {loading ? 'טוען...' : 'הוסף משימה'}
            </button>
          </div>
        </div>
        </form>
      )}

    </div>
  );
}
