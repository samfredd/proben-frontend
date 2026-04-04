'use client';

import { useDeferredValue, useEffect, useEffectEvent, useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Building2,
  CalendarClock,
  LoaderCircle,
  Mail,
  PenSquare,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import Modal from '@/components/ui/Modal';
import api from '@/api/api';
import { useToast } from '@/context/ToastContext';

const VIEW_OPTIONS = [
  { value: 'all-staff', label: 'All Staff', icon: Users },
  { value: 'doctor-profiles', label: 'Profiles', icon: ShieldCheck },
  { value: 'departments', label: 'Departments', icon: Building2 },
  { value: 'shift-management', label: 'Shifts', icon: CalendarClock },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'on_leave', label: 'On leave' },
  { value: 'inactive', label: 'Inactive' },
];

const EMPTY_FORM = {
  full_name: '',
  role_title: '',
  department: '',
  email: '',
  phone: '',
  shift_pattern: '',
  status: 'active',
  bio: '',
};

async function requestStaffRecords() {
  const response = await api.get('/staff');
  return response.data.staff || [];
}

function formatStatusLabel(status = 'active') {
  return status.replace(/_/g, ' ');
}

function getInitials(fullName = '') {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'SM';
}

function Avatar({ member, size = 'md' }) {
  const sizeClass = size === 'lg' ? 'w-16 h-16 text-lg rounded-3xl' : 'w-12 h-12 text-sm rounded-2xl';

  if (member.avatar_url) {
    return (
      <div
        role="img"
        aria-label={`${member.full_name} avatar`}
        className={`${sizeClass} border border-gray-100 bg-gray-50 bg-cover bg-center`}
        style={{ backgroundImage: `url("${member.avatar_url}")` }}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} shrink-0 bg-navy-900 text-white flex items-center justify-center font-black tracking-tight shadow-sm`}
    >
      {getInitials(member.full_name)}
    </div>
  );
}

function StatusBadge({ status }) {
  const tone =
    status === 'active'
      ? 'bg-lime-50 text-lime-700 border-lime-100'
      : status === 'on_leave'
        ? 'bg-amber-50 text-amber-700 border-amber-100'
        : 'bg-gray-100 text-gray-600 border-gray-200';

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${tone}`}>
      {formatStatusLabel(status)}
    </span>
  );
}

function SummaryCard({ icon: Icon, label, value, detail }) {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-50 p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</p>
          <p className="text-3xl font-black text-navy-900 tracking-tight mt-3">{value}</p>
          <p className="text-xs font-bold text-gray-500 mt-2">{detail}</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-navy-900">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function ViewSwitcher({ currentView, onChange }) {
  return (
    <div className="inline-flex flex-wrap gap-2 rounded-[1.5rem] bg-gray-50 p-2 border border-gray-100">
      {VIEW_OPTIONS.map((view) => {
        const Icon = view.icon;
        const isActive = currentView === view.value;

        return (
          <button
            key={view.value}
            type="button"
            onClick={() => onChange(view.value)}
            className={`px-4 py-3 rounded-[1rem] text-sm font-black tracking-tight transition-all flex items-center gap-2 ${
              isActive ? 'bg-navy-900 text-white shadow-lg shadow-navy-900/10' : 'text-gray-500 hover:text-navy-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            {view.label}
          </button>
        );
      })}
    </div>
  );
}

function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="bg-gray-50/70 border border-dashed border-gray-200 rounded-[2rem] p-10 text-center">
      <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center mx-auto mb-5">
        <Users className="w-6 h-6 text-gray-400" />
      </div>
      <h3 className="text-xl font-black text-navy-900 tracking-tight">{title}</h3>
      <p className="text-sm text-gray-500 font-medium max-w-xl mx-auto mt-3">{description}</p>
      {onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 px-6 py-3 rounded-2xl bg-navy-900 text-white font-black text-sm inline-flex items-center gap-2 hover:bg-navy-800 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

function StaffFormModal({ isOpen, onClose, formState, onFieldChange, onSubmit, isSaving, isEditing }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Staff Member' : 'Add Staff Member'}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-navy-900">Full Name</span>
            <input
              required
              value={formState.full_name}
              onChange={(event) => onFieldChange('full_name', event.target.value)}
              placeholder="Dr. Ada Okafor"
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-navy-900">Role Title</span>
            <input
              required
              value={formState.role_title}
              onChange={(event) => onFieldChange('role_title', event.target.value)}
              placeholder="Senior Consultant"
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-navy-900">Department</span>
            <input
              required
              value={formState.department}
              onChange={(event) => onFieldChange('department', event.target.value)}
              placeholder="Cardiology"
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-navy-900">Status</span>
            <select
              value={formState.status}
              onChange={(event) => onFieldChange('status', event.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900"
            >
              {STATUS_OPTIONS.slice(1).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-navy-900">Email</span>
            <input
              required
              type="email"
              value={formState.email}
              onChange={(event) => onFieldChange('email', event.target.value)}
              placeholder="ada@probenn.com"
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-navy-900">Phone</span>
            <input
              value={formState.phone}
              onChange={(event) => onFieldChange('phone', event.target.value)}
              placeholder="+1 555 014 2233"
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900"
            />
          </label>
        </div>

        <label className="space-y-2 block">
          <span className="text-xs font-black uppercase tracking-widest text-navy-900">Shift Pattern</span>
          <input
            value={formState.shift_pattern}
            onChange={(event) => onFieldChange('shift_pattern', event.target.value)}
            placeholder="Mon-Fri, 9 AM - 5 PM"
            className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900"
          />
        </label>

        <label className="space-y-2 block">
          <span className="text-xs font-black uppercase tracking-widest text-navy-900">Profile Summary</span>
          <textarea
            rows="4"
            value={formState.bio}
            onChange={(event) => onFieldChange('bio', event.target.value)}
            placeholder="Clinical focus, responsibilities, or notes for internal operations."
            className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900 resize-none"
          />
        </label>

        <div className="flex flex-col-reverse md:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-5 py-4 rounded-2xl border border-gray-100 bg-white text-navy-900 font-black text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 px-5 py-4 rounded-2xl bg-navy-900 text-white font-black text-sm hover:bg-navy-800 transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSaving ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {isEditing ? 'Save Changes' : 'Create Staff Record'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function StaffMemberCard({ member, onEdit, onDelete, actionId }) {
  const deleting = actionId === member.id;

  return (
    <div className="bg-white rounded-[2rem] border border-gray-50 p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Avatar member={member} size="lg" />
          <div className="min-w-0">
            <h3 className="text-lg font-black text-navy-900 tracking-tight truncate">{member.full_name}</h3>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{member.role_title}</p>
          </div>
        </div>
        <StatusBadge status={member.status} />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Department</p>
          <p className="text-sm font-black text-navy-900 mt-2">{member.department}</p>
        </div>
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Shift</p>
          <p className="text-sm font-black text-navy-900 mt-2">{member.shift_pattern || 'Not assigned yet'}</p>
        </div>
      </div>

      <div className="space-y-3 mt-6 text-sm">
        <a href={`mailto:${member.email}`} className="flex items-center gap-3 text-navy-900 font-bold hover:text-navy-700 transition-colors">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="truncate">{member.email}</span>
        </a>
        <div className="flex items-center gap-3 text-gray-600 font-bold">
          <Phone className="w-4 h-4 text-gray-400" />
          <span>{member.phone || 'No phone number provided'}</span>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={() => onEdit(member)}
          className="flex-1 px-4 py-3 rounded-2xl bg-navy-900 text-white text-sm font-black hover:bg-navy-800 transition-colors inline-flex items-center justify-center gap-2"
        >
          <PenSquare className="w-4 h-4" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(member)}
          disabled={deleting}
          className="flex-1 px-4 py-3 rounded-2xl border border-gray-100 bg-white text-sm font-black text-navy-900 hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {deleting ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Remove
        </button>
      </div>
    </div>
  );
}

function StaffProfileCard({ member, onEdit }) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-50 p-8 shadow-sm flex flex-col lg:flex-row gap-6 lg:items-start">
      <Avatar member={member} size="lg" />
      <div className="flex-1 min-w-0">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black text-navy-900 tracking-tight">{member.full_name}</h3>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mt-2">
              {member.role_title} • {member.department}
            </p>
          </div>
          <StatusBadge status={member.status} />
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <div className="px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs font-bold text-gray-600 flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            {member.email}
          </div>
          <div className="px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs font-bold text-gray-600 flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            {member.phone || 'No phone listed'}
          </div>
          <div className="px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs font-bold text-gray-600 flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-gray-400" />
            {member.shift_pattern || 'Shift not assigned yet'}
          </div>
        </div>

        <p className="text-sm text-gray-500 font-medium leading-relaxed mt-6">
          {member.bio || 'No profile summary has been added for this staff member yet.'}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onEdit(member)}
        className="px-6 py-4 rounded-2xl bg-navy-900 text-white font-black text-sm hover:bg-navy-800 transition-colors self-start inline-flex items-center gap-2"
      >
        <PenSquare className="w-4 h-4" />
        Manage Record
      </button>
    </div>
  );
}

function DepartmentCard({ department, members, onAddStaff }) {
  const activeCount = members.filter((member) => member.status === 'active').length;
  const coveredShifts = members.filter((member) => member.shift_pattern).length;

  return (
    <div className="bg-white rounded-[2rem] border border-gray-50 p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Building2 className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          {members.length} {members.length === 1 ? 'member' : 'members'}
        </span>
      </div>

      <h3 className="text-xl font-black text-navy-900 tracking-tight mt-5">{department}</h3>
      <p className="text-sm text-gray-500 font-medium mt-2">
        {activeCount} active, {coveredShifts} with assigned shifts.
      </p>

      <div className="space-y-3 mt-6">
        {members.slice(0, 4).map((member) => (
          <div key={member.id} className="flex items-center justify-between gap-3 bg-gray-50 rounded-2xl border border-gray-100 p-3">
            <div className="min-w-0">
              <p className="text-sm font-black text-navy-900 truncate">{member.full_name}</p>
              <p className="text-[11px] font-bold text-gray-500 truncate">{member.role_title}</p>
            </div>
            <StatusBadge status={member.status} />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onAddStaff(department)}
        className="w-full mt-6 px-4 py-3 rounded-2xl border border-gray-100 bg-white text-navy-900 text-sm font-black hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Staff To {department}
      </button>
    </div>
  );
}

function ShiftTable({ staff, onEdit, onDelete, onQuickStatusChange, actionId }) {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/80 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">
              <th className="px-6 py-5">Staff Member</th>
              <th className="px-6 py-5">Role</th>
              <th className="px-6 py-5">Department</th>
              <th className="px-6 py-5">Shift Pattern</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {staff.map((member) => {
              const busy = actionId === member.id;

              return (
                <tr key={member.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3 min-w-[220px]">
                      <Avatar member={member} />
                      <div className="min-w-0">
                        <p className="text-sm font-black text-navy-900 truncate">{member.full_name}</p>
                        <p className="text-xs font-bold text-gray-500 truncate">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-600">{member.role_title}</td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-600">{member.department}</td>
                  <td className="px-6 py-5 text-sm font-black text-navy-900">{member.shift_pattern || 'Not assigned yet'}</td>
                  <td className="px-6 py-5">
                    <select
                      value={member.status}
                      onChange={(event) => onQuickStatusChange(member, event.target.value)}
                      disabled={busy}
                      className="px-4 py-2 rounded-xl border border-gray-100 bg-white text-xs font-black uppercase tracking-widest text-navy-900 disabled:opacity-60"
                    >
                      {STATUS_OPTIONS.slice(1).map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(member)}
                        className="px-4 py-2 rounded-xl bg-navy-900 text-white text-xs font-black hover:bg-navy-800 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(member)}
                        disabled={busy}
                        className="px-4 py-2 rounded-xl border border-gray-100 bg-white text-xs font-black text-navy-900 hover:bg-gray-50 transition-colors disabled:opacity-60 inline-flex items-center gap-2"
                      >
                        {busy ? <LoaderCircle className="w-3.5 h-3.5 animate-spin" /> : null}
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function StaffManagementPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const reportLoadError = useEffectEvent((message) => {
    toast.error(message);
  });

  const currentView = searchParams.get('view') || 'all-staff';

  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formState, setFormState] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [actionId, setActionId] = useState('');

  async function loadStaff({ initial = false } = {}) {
    if (initial) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const nextStaff = await requestStaffRecords();

      startTransition(() => {
        setStaff(nextStaff);
      });
    } catch (error) {
      toast.error(error.message || 'Failed to load staff records');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    let isActive = true;

    async function loadInitialStaff() {
      setLoading(true);

      try {
        const nextStaff = await requestStaffRecords();

        if (!isActive) {
          return;
        }

        startTransition(() => {
          setStaff(nextStaff);
        });
      } catch (error) {
        if (isActive) {
          reportLoadError(error.message || 'Failed to load staff records');
        }
      } finally {
        if (isActive) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    }

    loadInitialStaff();

    return () => {
      isActive = false;
    };
  }, [startTransition]);

  function handleViewChange(nextView) {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (nextView === 'all-staff') {
      nextParams.delete('view');
    } else {
      nextParams.set('view', nextView);
    }

    router.replace(`${pathname}${nextParams.toString() ? `?${nextParams}` : ''}`);
  }

  function openCreateModal(prefillDepartment = '') {
    setEditingStaff(null);
    setFormState({
      ...EMPTY_FORM,
      department: prefillDepartment || (departmentFilter !== 'all' ? departmentFilter : ''),
    });
    setIsModalOpen(true);
  }

  function openEditModal(member) {
    setEditingStaff(member);
    setFormState({
      full_name: member.full_name || '',
      role_title: member.role_title || '',
      department: member.department || '',
      email: member.email || '',
      phone: member.phone || '',
      shift_pattern: member.shift_pattern || '',
      status: member.status || 'active',
      bio: member.bio || '',
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingStaff(null);
    setFormState(EMPTY_FORM);
  }

  function updateFormField(field, value) {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);

    try {
      if (editingStaff) {
        await api.put(`/staff/${editingStaff.id}`, formState);
        toast.success(`${formState.full_name} updated successfully`);
      } else {
        await api.post('/staff', formState);
        toast.success(`${formState.full_name} added to staff`);
      }

      closeModal();
      await loadStaff();
    } catch (error) {
      toast.error(error.message || 'Failed to save staff member');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(member) {
    if (!window.confirm(`Remove ${member.full_name} from staff records?`)) {
      return;
    }

    setActionId(member.id);

    try {
      await api.delete(`/staff/${member.id}`);
      toast.success(`${member.full_name} removed`);
      await loadStaff();
    } catch (error) {
      toast.error(error.message || 'Failed to remove staff member');
    } finally {
      setActionId('');
    }
  }

  async function handleQuickStatusChange(member, nextStatus) {
    if (nextStatus === member.status) {
      return;
    }

    setActionId(member.id);

    try {
      await api.put(`/staff/${member.id}`, { status: nextStatus });
      toast.success(`${member.full_name} marked as ${formatStatusLabel(nextStatus)}`);
      await loadStaff();
    } catch (error) {
      toast.error(error.message || 'Failed to update staff status');
    } finally {
      setActionId('');
    }
  }

  const departments = [...new Set(staff.map((member) => member.department).filter(Boolean))].sort((left, right) =>
    left.localeCompare(right)
  );
  const normalizedQuery = deferredSearchTerm.trim().toLowerCase();

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      normalizedQuery.length === 0 ||
      [member.full_name, member.role_title, member.department, member.email, member.phone, member.shift_pattern]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery));

    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const departmentMap = new Map();
  for (const member of filteredStaff) {
    const key = member.department || 'Unassigned';
    const existing = departmentMap.get(key);

    if (existing) {
      existing.members.push(member);
    } else {
      departmentMap.set(key, { department: key, members: [member] });
    }
  }

  const departmentSummaries = [...departmentMap.values()].sort((left, right) =>
    left.department.localeCompare(right.department)
  );

  const totalStaff = staff.length;
  const activeStaff = staff.filter((member) => member.status === 'active').length;
  const onLeaveStaff = staff.filter((member) => member.status === 'on_leave').length;
  const unassignedShiftCount = staff.filter((member) => !member.shift_pattern).length;
  const hasFilters = normalizedQuery.length > 0 || statusFilter !== 'all' || departmentFilter !== 'all';

  let content = null;

  if (loading) {
    content = (
      <div className="py-24 flex items-center justify-center">
        <div className="inline-flex items-center gap-3 text-navy-900 font-black">
          <LoaderCircle className="w-5 h-5 animate-spin" />
          Loading staff records...
        </div>
      </div>
    );
  } else if (filteredStaff.length === 0) {
    content = staff.length === 0 ? (
      <EmptyState
        title="No staff records yet"
        description="Add your first staff member to start tracking departments, shifts, and internal profiles from one place."
        actionLabel="Add Staff Member"
        onAction={() => openCreateModal()}
      />
    ) : (
      <EmptyState
        title="No staff match these filters"
        description="Try a different search term or reset the department and status filters to see more records."
        actionLabel={hasFilters ? 'Clear Filters' : 'Add Staff Member'}
        onAction={() => {
          if (hasFilters) {
            setSearchTerm('');
            setStatusFilter('all');
            setDepartmentFilter('all');
            return;
          }

          openCreateModal();
        }}
      />
    );
  } else if (currentView === 'doctor-profiles') {
    content = (
      <div className="space-y-6">
        {filteredStaff.map((member) => (
          <StaffProfileCard key={member.id} member={member} onEdit={openEditModal} />
        ))}
      </div>
    );
  } else if (currentView === 'departments') {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {departmentSummaries.map((department) => (
          <DepartmentCard
            key={department.department}
            department={department.department}
            members={department.members}
            onAddStaff={openCreateModal}
          />
        ))}
      </div>
    );
  } else if (currentView === 'shift-management') {
    content = (
      <ShiftTable
        staff={filteredStaff}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onQuickStatusChange={handleQuickStatusChange}
        actionId={actionId}
      />
    );
  } else {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStaff.map((member) => (
          <StaffMemberCard
            key={member.id}
            member={member}
            onEdit={openEditModal}
            onDelete={handleDelete}
            actionId={actionId}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#fcfdfe] min-h-screen">
      <DashboardHeader title="Staff Management" subtitle="Manage real staff records, department coverage, and shift assignments" />

      <main className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <SummaryCard
            icon={Users}
            label="Total Staff"
            value={totalStaff}
            detail={totalStaff === 1 ? '1 active record in your roster.' : `${totalStaff} records currently tracked.`}
          />
          <SummaryCard
            icon={ShieldCheck}
            label="Active Staff"
            value={activeStaff}
            detail={activeStaff === 1 ? '1 staff member currently active.' : `${activeStaff} staff members currently active.`}
          />
          <SummaryCard
            icon={Building2}
            label="Departments"
            value={departments.length}
            detail={departments.length === 0 ? 'No departments created yet.' : `${departments.length} departments represented in roster.`}
          />
          <SummaryCard
            icon={CalendarClock}
            label="Shift Gaps"
            value={unassignedShiftCount}
            detail={onLeaveStaff === 0 ? 'No one is currently on leave.' : `${onLeaveStaff} staff members are on leave.`}
          />
        </div>

        <section className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex flex-col 2xl:flex-row 2xl:items-start 2xl:justify-between gap-5">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Roster Views</p>
                <h2 className="text-2xl font-black text-navy-900 tracking-tight mt-2">Operations Console</h2>
              </div>
              <ViewSwitcher currentView={currentView} onChange={handleViewChange} />
            </div>

            <div className="flex flex-col lg:flex-row gap-3 lg:items-center w-full 2xl:w-auto">
              <div className="relative flex-1 min-w-[260px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by name, role, email, or shift"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-sm text-navy-900"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-bold text-navy-900"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={departmentFilter}
                onChange={(event) => setDepartmentFilter(event.target.value)}
                className="px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-bold text-navy-900"
              >
                <option value="all">All departments</option>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>

              {hasFilters ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setDepartmentFilter('all');
                  }}
                  className="px-4 py-3 rounded-2xl border border-gray-100 bg-white text-sm font-black text-navy-900 hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => openCreateModal()}
                className="px-5 py-3 rounded-2xl bg-navy-900 text-white text-sm font-black hover:bg-navy-800 transition-colors inline-flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Add Staff
              </button>
            </div>
          </div>

          {(refreshing || isPending) && !loading ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-50 border border-gray-100 text-xs font-black uppercase tracking-widest text-gray-500">
              <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
              Refreshing roster
            </div>
          ) : null}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {content}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      <StaffFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        formState={formState}
        onFieldChange={updateFormField}
        onSubmit={handleSubmit}
        isSaving={isSaving}
        isEditing={Boolean(editingStaff)}
      />
    </div>
  );
}
