import React from 'react';

// Dashboard Header Component
export const DashboardHeader = ({ 
  title, 
  subtitle, 
  user, 
  onProfileClick, 
  children,
  showLogout = false,
  onLogout 
}) => (
  <div className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Welcome, {user?.name || 'User'}</p>
            <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
          </div>
          {children}
          {showLogout && (
            <button 
              onClick={onLogout}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Logout
            </button>
          )}
          <button 
            onClick={onProfileClick}
            className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold hover:bg-blue-700 transition"
          >
            {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Dashboard Navigation Tabs
export const DashboardTabs = ({ tabs, activeTab, onTabChange }) => (
  <div className="bg-white border-b">
    <div className="max-w-7xl mx-auto px-4">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  </div>
);

// Statistics Card Component
export const StatCard = ({ title, value, subtitle, color, icon }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      {icon && <div className="text-3xl opacity-50">{icon}</div>}
    </div>
  </div>
);

// Quick Action Card Component
export const QuickActionCard = ({ title, description, icon, onClick, color }) => (
  <div 
    onClick={onClick}
    className={`bg-white p-6 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${color}`}
  >
    <div className="flex items-center space-x-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </div>
);

// Dashboard Container
export const DashboardContainer = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    {children}
  </div>
);

// Main Content Area
export const DashboardContent = ({ children }) => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    {children}
  </div>
);

// Ranking Table Component
export const RankingTable = ({ title, data, columns }) => (
  <div className="card">
    <div className="card-header">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
