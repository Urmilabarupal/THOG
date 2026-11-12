/**
 * @file src/admin/AdminUsers.tsx
 * @purpose Admin User Management module for backoffice staff roles and permissions.
 * @dependencies lucide-react, ../context/StoreContext.tsx.
 * @implementation Manages Super Admin, Store Manager, and Fitting Concierge role assignments.
 */

import React, { useState } from 'react';
import { UserCheck, Shield, Plus, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'store_manager' | 'fitting_specialist';
  studio: string;
  status: 'active' | 'inactive';
}

const INITIAL_STAFF: StaffUser[] = [
  {
    id: 'staff-1',
    name: 'CCDL Store Administrator',
    email: 'admin@fairwaylinks.ccdl.in',
    role: 'super_admin',
    studio: 'CCDL Bangalore HQ',
    status: 'active'
  },
  {
    id: 'staff-2',
    name: 'Gaurav Khanna',
    email: 'gaurav.khanna@ccdl.in',
    role: 'fitting_specialist',
    studio: 'Bangalore MG Road Lab',
    status: 'active'
  },
  {
    id: 'staff-3',
    name: 'Ananya Deshmukh',
    email: 'ananya.deshmukh@ccdl.in',
    role: 'store_manager',
    studio: 'Delhi NCR DLF Suite',
    status: 'active'
  }
];

export const AdminUsers: React.FC = () => {
  const { showToast } = useStore();
  const [staffList, setStaffList] = useState<StaffUser[]>(INITIAL_STAFF);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'super_admin' | 'store_manager' | 'fitting_specialist'>('store_manager');

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newStaff: StaffUser = {
      id: `staff-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role,
      studio: 'Bengaluru Studio',
      status: 'active'
    };

    setStaffList([...staffList, newStaff]);
    showToast(`Staff member ${newStaff.name} assigned.`);
    setName('');
    setEmail('');
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Access Control</span>
        <h1 className="text-2xl font-serif-display font-bold text-stone-900 mt-0.5">
          Admin Staff & Role Management
        </h1>
        <p className="text-xs text-stone-500">Configure administrative access levels for inventory, logistics, and fittings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Staff Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Studio Node</th>
                <th className="py-3 px-4">Role Access</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {staffList.map((s) => (
                <tr key={s.id} className="hover:bg-stone-50/70">
                  <td className="py-3 px-4 font-semibold text-stone-900">{s.name}</td>
                  <td className="py-3 px-4 text-stone-600">{s.email}</td>
                  <td className="py-3 px-4 text-stone-500">{s.studio}</td>
                  <td className="py-3 px-4 capitalize">
                    <span className="px-2 py-0.5 bg-stone-100 rounded text-stone-800 font-medium text-[10px]">
                      {s.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-700 font-semibold flex items-center justify-end gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white border border-stone-200 rounded p-6 space-y-4 text-xs text-stone-700">
          <h3 className="font-semibold text-stone-900 text-sm">Provision Staff Member</h3>
          <form onSubmit={handleAddStaff} className="space-y-3">
            <div>
              <label className="block text-stone-900 font-semibold mb-1">Staff Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vikram Malhotra"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                required
              />
            </div>

            <div>
              <label className="block text-stone-900 font-semibold mb-1">Corporate Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@ccdl.in"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                required
              />
            </div>

            <div>
              <label className="block text-stone-900 font-semibold mb-1">Role Authorization</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
              >
                <option value="store_manager">Store Manager (Products & Orders)</option>
                <option value="fitting_specialist">Fitting Specialist (Player Records)</option>
                <option value="super_admin">Super Administrator (Full System)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#0D3B2E] text-white font-semibold rounded hover:bg-[#092b21] transition-colors"
            >
              Add Staff Member
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
