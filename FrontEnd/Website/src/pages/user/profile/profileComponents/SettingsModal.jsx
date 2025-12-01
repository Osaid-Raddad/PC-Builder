import React, { useState } from 'react';
import { FiX, FiBell, FiLock, FiTrash2 } from 'react-icons/fi';
import colors from '../../../../config/colors';

const SettingsModal = ({ initialSettings, onClose, onSave, onDeleteAccount }) => {
  const [settings, setSettings] = useState(initialSettings);

  const notificationSettings = [
    { key: 'emailNotifications', label: 'Email Notifications' },
    { key: 'buildUpdates', label: 'Build Updates' },
    { key: 'priceAlerts', label: 'Price Drop Alerts' },
    { key: 'newsletter', label: 'Newsletter' }
  ];

  const handleSave = () => {
    onSave(settings);
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ border: `3px solid ${colors.mainYellow}` }}
      >
        {/* Modal Header */}
        <div 
          className="sticky top-0 bg-white p-6 border-b-2 flex items-center justify-between"
          style={{ borderColor: colors.platinum }}
        >
          <h2 className="text-2xl font-bold" style={{ color: colors.mainBlack }}>
            Account Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <FiX size={24} style={{ color: colors.jet }} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Notifications */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.mainBlack }}>
              <FiBell style={{ color: colors.mainYellow }} />
              Notifications
            </h3>
            <div className="space-y-3">
              {notificationSettings.map(setting => (
                <div 
                  key={setting.key}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ backgroundColor: colors.mainBeige }}
                >
                  <span style={{ color: colors.mainBlack }}>{setting.label}</span>
                  <label className="relative inline-block w-12 h-6 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings[setting.key]}
                      onChange={(e) => setSettings({ ...settings, [setting.key]: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div 
                      className="w-full h-full rounded-full transition-colors"
                      style={{ backgroundColor: settings[setting.key] ? colors.mainYellow : colors.platinum }}
                    >
                      <div 
                        className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform"
                        style={{ 
                          transform: settings[setting.key] ? 'translateX(24px)' : 'translateX(0)'
                        }}
                      />
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.mainBlack }}>
              <FiLock style={{ color: colors.mainYellow }} />
              Privacy
            </h3>
            <div className="space-y-3">
              <div 
                className="p-3 rounded-lg"
                style={{ backgroundColor: colors.mainBeige }}
              >
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                  Profile Visibility
                </label>
                <select
                  value={settings.profileVisibility}
                  onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none cursor-pointer"
                  style={{ borderColor: colors.platinum }}
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <div 
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: colors.mainBeige }}
              >
                <span style={{ color: colors.mainBlack }}>Show Email Publicly</span>
                <label className="relative inline-block w-12 h-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showEmail}
                    onChange={(e) => setSettings({ ...settings, showEmail: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div 
                    className="w-full h-full rounded-full transition-colors"
                    style={{ backgroundColor: settings.showEmail ? colors.mainYellow : colors.platinum }}
                  >
                    <div 
                      className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform"
                      style={{ 
                        transform: settings.showEmail ? 'translateX(24px)' : 'translateX(0)'
                      }}
                    />
                  </div>
                </label>
              </div>
              <div 
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: colors.mainBeige }}
              >
                <span style={{ color: colors.mainBlack }}>Show Phone Publicly</span>
                <label className="relative inline-block w-12 h-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showPhone}
                    onChange={(e) => setSettings({ ...settings, showPhone: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div 
                    className="w-full h-full rounded-full transition-colors"
                    style={{ backgroundColor: settings.showPhone ? colors.mainYellow : colors.platinum }}
                  >
                    <div 
                      className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform"
                      style={{ 
                        transform: settings.showPhone ? 'translateX(24px)' : 'translateX(0)'
                      }}
                    />
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-600">
              <FiTrash2 />
              Danger Zone
            </h3>
            <div 
              className="p-4 rounded-lg border-2 border-red-200"
              style={{ backgroundColor: '#fef2f2' }}
            >
              <p className="text-sm mb-3 text-red-600">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                onClick={onDeleteAccount}
                className="px-6 py-2 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg font-semibold transition-colors border-2 cursor-pointer"
              style={{ 
                borderColor: colors.platinum,
                color: colors.jet,
                backgroundColor: 'white'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer"
              style={{ backgroundColor: colors.mainYellow }}
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
