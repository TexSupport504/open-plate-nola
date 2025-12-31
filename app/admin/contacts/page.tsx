'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Contact, ContactCategory, ContactStatus } from '@/lib/types';
import {
  CONTACT_CATEGORY_LABELS,
  CONTACT_STATUS_LABELS,
  CONTACT_STATUS_COLORS,
} from '@/lib/types';

const CATEGORIES: ContactCategory[] = [
  'restaurant',
  'hotel',
  'catering',
  'grocery',
  'food_bank',
  'volunteer',
  'tech_partner',
  'city_official',
  'nonprofit',
  'donor',
  'media',
  'community_leader',
  'other',
];

const STATUSES: ContactStatus[] = [
  'prospect',
  'contacted',
  'in_discussion',
  'committed',
  'active',
  'inactive',
  'declined',
];

interface ContactFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  category: ContactCategory;
  status: ContactStatus;
  address: string;
  neighborhood: string;
  notes: string;
  next_followup_date: string;
  can_provide_food: boolean;
  can_provide_space: boolean;
  can_provide_volunteers: boolean;
  can_provide_funding: boolean;
  can_provide_tech_help: boolean;
  can_provide_connections: boolean;
}

const initialFormData: ContactFormData = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  organization: '',
  role: '',
  category: 'other',
  status: 'prospect',
  address: '',
  neighborhood: '',
  notes: '',
  next_followup_date: '',
  can_provide_food: false,
  can_provide_space: false,
  can_provide_volunteers: false,
  can_provide_funding: false,
  can_provide_tech_help: false,
  can_provide_connections: false,
};

export default function ContactsAdminPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [filterCategory, setFilterCategory] = useState<ContactCategory | ''>('');
  const [filterStatus, setFilterStatus] = useState<ContactStatus | ''>('');

  useEffect(() => {
    fetchContacts();
  }, [filterCategory, filterStatus]);

  async function fetchContacts() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterCategory) params.set('category', filterCategory);
      if (filterStatus) params.set('status', filterStatus);

      const res = await fetch(`/api/contacts?${params}`);
      const { data, error } = await res.json();

      if (error) throw new Error(error);
      setContacts(data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  }

  function contactToFormData(contact: Contact): ContactFormData {
    return {
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email || '',
      phone: contact.phone || '',
      organization: contact.organization || '',
      role: contact.role || '',
      category: contact.category,
      status: contact.status,
      address: contact.address || '',
      neighborhood: contact.neighborhood || '',
      notes: contact.notes || '',
      next_followup_date: contact.next_followup_date || '',
      can_provide_food: contact.can_provide_food,
      can_provide_space: contact.can_provide_space,
      can_provide_volunteers: contact.can_provide_volunteers,
      can_provide_funding: contact.can_provide_funding,
      can_provide_tech_help: contact.can_provide_tech_help,
      can_provide_connections: contact.can_provide_connections,
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const contactData = {
        ...formData,
        email: formData.email || null,
        phone: formData.phone || null,
        organization: formData.organization || null,
        role: formData.role || null,
        address: formData.address || null,
        neighborhood: formData.neighborhood || null,
        notes: formData.notes || null,
        next_followup_date: formData.next_followup_date || null,
      };

      if (editingId) {
        const res = await fetch(`/api/contacts/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contactData),
        });
        const { error } = await res.json();
        if (error) throw new Error(error);
      } else {
        const res = await fetch('/api/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contactData),
        });
        const { error } = await res.json();
        if (error) throw new Error(error);
      }

      setFormData(initialFormData);
      setEditingId(null);
      setShowForm(false);
      fetchContacts();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save contact');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      const { error } = await res.json();
      if (error) throw new Error(error);
      fetchContacts();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete contact');
    }
  }

  async function handleStatusUpdate(id: string, status: ContactStatus) {
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const { error } = await res.json();
      if (error) throw new Error(error);
      fetchContacts();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update status');
    }
  }

  function handleEdit(contact: Contact) {
    setFormData(contactToFormData(contact));
    setEditingId(contact.id);
    setShowForm(true);
  }

  function handleAddNew() {
    setFormData(initialFormData);
    setEditingId(null);
    setShowForm(true);
  }

  // Count contacts needing follow-up
  const today = new Date().toISOString().split('T')[0];
  const needsFollowup = contacts.filter(
    (c) => c.next_followup_date && c.next_followup_date <= today
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-4">
                <Link href="/admin" className="text-blue-600 hover:underline">
                  &larr; Resources
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">
                  Contacts & Partners
                </h1>
              </div>
              <p className="text-gray-600 mt-1">
                Track stakeholders, partners, and community connections
              </p>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Add Contact
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button onClick={() => setError(null)} className="float-right">
              &times;
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">{contacts.length}</div>
            <div className="text-gray-600">Total Contacts</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {contacts.filter((c) => c.status === 'active').length}
            </div>
            <div className="text-gray-600">Active Partners</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">
              {contacts.filter((c) => c.status === 'in_discussion').length}
            </div>
            <div className="text-gray-600">In Discussion</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-red-600">{needsFollowup}</div>
            <div className="text-gray-600">Need Follow-up</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as ContactCategory | '')}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CONTACT_CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as ContactStatus | '')}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">All Statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {CONTACT_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingId ? 'Edit Contact' : 'Add New Contact'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData({ ...formData, first_name: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData({ ...formData, last_name: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>

                {/* Organization */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Organization
                    </label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) =>
                        setFormData({ ...formData, organization: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role/Title
                    </label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>

                {/* Category & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as ContactCategory,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {CONTACT_CATEGORY_LABELS[cat]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as ContactStatus,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {CONTACT_STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Follow-up Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Next Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={formData.next_followup_date}
                    onChange={(e) =>
                      setFormData({ ...formData, next_followup_date: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                {/* What they can provide */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What can they provide?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'can_provide_food', label: 'Food/Meals' },
                      { key: 'can_provide_space', label: 'Space/Location' },
                      { key: 'can_provide_volunteers', label: 'Volunteers' },
                      { key: 'can_provide_funding', label: 'Funding' },
                      { key: 'can_provide_tech_help', label: 'Tech Help' },
                      { key: 'can_provide_connections', label: 'Connections' },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData[key as keyof ContactFormData] as boolean}
                          onChange={(e) =>
                            setFormData({ ...formData, [key]: e.target.checked })
                          }
                          className="mr-2"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Conversation notes, context, next steps..."
                  />
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Contacts Table */}
        {loading ? (
          <div className="text-center py-12">Loading contacts...</div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No contacts found. Add your first contact to get started!
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Can Provide
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {contact.first_name} {contact.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {contact.email || contact.phone || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{contact.organization || '-'}</div>
                      <div className="text-sm text-gray-500">{contact.role || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                        {CONTACT_CATEGORY_LABELS[contact.category]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={contact.status}
                        onChange={(e) =>
                          handleStatusUpdate(contact.id, e.target.value as ContactStatus)
                        }
                        className={`text-xs rounded-full px-2 py-1 ${CONTACT_STATUS_COLORS[contact.status]} text-white`}
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {CONTACT_STATUS_LABELS[status]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1 flex-wrap">
                        {contact.can_provide_food && (
                          <span className="text-xs bg-green-100 text-green-800 px-1 rounded">
                            Food
                          </span>
                        )}
                        {contact.can_provide_space && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
                            Space
                          </span>
                        )}
                        {contact.can_provide_volunteers && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-1 rounded">
                            Vol
                          </span>
                        )}
                        {contact.can_provide_funding && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded">
                            $
                          </span>
                        )}
                        {contact.can_provide_tech_help && (
                          <span className="text-xs bg-indigo-100 text-indigo-800 px-1 rounded">
                            Tech
                          </span>
                        )}
                        {contact.can_provide_connections && (
                          <span className="text-xs bg-pink-100 text-pink-800 px-1 rounded">
                            Net
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(contact)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
