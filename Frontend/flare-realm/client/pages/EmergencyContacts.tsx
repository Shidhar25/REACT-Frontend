import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPhone, FaPlus, FaEdit, FaTrash, FaUser, FaHeart } from 'react-icons/fa';

interface Contact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isEmergency: boolean;
}

export default function EmergencyContacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Sarah Smith",
      relationship: "Spouse",
      phone: "+1 (555) 987-6543",
      isEmergency: true
    },
    {
      id: "2",
      name: "Dr. Michael Johnson",
      relationship: "Family Doctor",
      phone: "+1 (555) 456-7890",
      isEmergency: true
    },
    {
      id: "3",
      name: "John Smith",
      relationship: "Father",
      phone: "+1 (555) 123-4567",
      isEmergency: false
    },
    {
      id: "4",
      name: "Mary Smith",
      relationship: "Mother",
      phone: "+1 (555) 234-5678",
      isEmergency: false
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    phone: "",
    isEmergency: false
  });

  const handleAddContact = () => {
    if (formData.name && formData.phone) {
      const newContact: Contact = {
        id: Date.now().toString(),
        ...formData
      };
      setContacts([...contacts, newContact]);
      setFormData({ name: "", relationship: "", phone: "", isEmergency: false });
      setShowAddForm(false);
    }
  };

  const handleEditContact = () => {
    if (editingContact && formData.name && formData.phone) {
      setContacts(contacts.map(contact => 
        contact.id === editingContact.id 
          ? { ...contact, ...formData }
          : contact
      ));
      setFormData({ name: "", relationship: "", phone: "", isEmergency: false });
      setEditingContact(null);
    }
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const startEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
      isEmergency: contact.isEmergency
    });
  };

  const cancelEdit = () => {
    setEditingContact(null);
    setFormData({ name: "", relationship: "", phone: "", isEmergency: false });
    setShowAddForm(false);
  };

  const emergencyContacts = contacts.filter(contact => contact.isEmergency);
  const regularContacts = contacts.filter(contact => !contact.isEmergency);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/index')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Dashboard</span>
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <FaPhone className="text-blue-500 text-2xl" />
              <h1 className="text-2xl font-bold text-gray-900">Emergency Contacts</h1>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaPlus className="w-4 h-4" />
              <span>Add Contact</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add/Edit Form */}
        {(showAddForm || editingContact) && (
          <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingContact ? "Edit Contact" : "Add New Contact"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                <input
                  type="text"
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Spouse, Doctor, Friend"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isEmergency"
                  checked={formData.isEmergency}
                  onChange={(e) => setFormData({ ...formData, isEmergency: e.target.checked })}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isEmergency" className="text-sm font-medium text-gray-700">
                  Emergency Contact
                </label>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={editingContact ? handleEditContact : handleAddContact}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                {editingContact ? "Update Contact" : "Add Contact"}
              </button>
              <button
                onClick={cancelEdit}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Emergency Contacts */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <FaHeart className="text-red-500 text-xl" />
            <h2 className="text-2xl font-bold text-gray-900">Emergency Contacts</h2>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
              {emergencyContacts.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <FaUser className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                      <p className="text-sm text-gray-600">{contact.relationship}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEdit(contact)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                >
                  <FaPhone className="w-4 h-4" />
                  <span>{contact.phone}</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Regular Contacts */}
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <FaUser className="text-gray-500 text-xl" />
            <h2 className="text-2xl font-bold text-gray-900">All Contacts</h2>
            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm font-medium">
              {contacts.length}
            </span>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
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
                        <div>
                          <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                          <div className="text-sm text-gray-500">{contact.relationship}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={`tel:${contact.phone}`}
                          className="text-blue-600 hover:text-blue-800 font-mono"
                        >
                          {contact.phone}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          contact.isEmergency 
                            ? "bg-red-100 text-red-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {contact.isEmergency ? "Emergency" : "Regular"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <a
                            href={`tel:${contact.phone}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaPhone className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => startEdit(contact)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteContact(contact.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 