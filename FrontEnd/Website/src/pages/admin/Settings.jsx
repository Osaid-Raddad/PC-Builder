import { useState } from 'react';
import { MdSave } from 'react-icons/md';
import toast from 'react-hot-toast';
import colors from '../../config/colors';

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: 'PC Builder',
    siteEmail: 'admin@pcbuilder.com',
    maintenanceMode: false,
    allowRegistrations: true,
    requireEmailVerification: true,
    autoApproveShops: false,
    maxUploadSize: 5,
    postsPerPage: 20
  });

  const handleSave = () => {
    // Add your save logic here
    toast.success('Settings saved successfully!');
  };

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: colors.text }}>
          Settings
        </h1>
        <p className="text-gray-500 mt-1">Configure platform settings</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
        {/* Site Settings */}
        <div>
          <h3 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
            Site Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: colors.border }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                value={settings.siteEmail}
                onChange={(e) => setSettings({...settings, siteEmail: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: colors.border }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Upload Size (MB)
              </label>
              <input
                type="number"
                value={settings.maxUploadSize}
                onChange={(e) => setSettings({...settings, maxUploadSize: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: colors.border }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posts Per Page
              </label>
              <input
                type="number"
                value={settings.postsPerPage}
                onChange={(e) => setSettings({...settings, postsPerPage: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: colors.border }}
              />
            </div>
          </div>
        </div>

        {/* Platform Settings */}
        <div className="border-t pt-6" style={{ borderColor: colors.border }}>
          <h3 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
            Platform Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-700">Maintenance Mode</p>
                <p className="text-sm text-gray-500">Temporarily disable site access</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={() => handleToggle('maintenanceMode')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                  style={{ '--tw-ring-color': `${colors.primary}40` }}
                ></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-700">Allow Registrations</p>
                <p className="text-sm text-gray-500">Enable new user sign-ups</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowRegistrations}
                  onChange={() => handleToggle('allowRegistrations')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                  style={{ '--tw-ring-color': `${colors.primary}40` }}
                ></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-700">Require Email Verification</p>
                <p className="text-sm text-gray-500">Users must verify email to access</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.requireEmailVerification}
                  onChange={() => handleToggle('requireEmailVerification')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                  style={{ '--tw-ring-color': `${colors.primary}40` }}
                ></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-700">Auto-Approve Shop Requests</p>
                <p className="text-sm text-gray-500">Automatically approve new shops</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoApproveShops}
                  onChange={() => handleToggle('autoApproveShops')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                  style={{ '--tw-ring-color': `${colors.primary}40` }}
                ></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t" style={{ borderColor: colors.border }}>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity cursor-pointer"
            style={{ backgroundColor: colors.primary }}
          >
            <MdSave className="text-xl" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
