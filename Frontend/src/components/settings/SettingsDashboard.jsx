import { useState } from 'react';
import { Settings, Bell, Shield, CreditCard, Mail } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';

export function SettingsDashboard() {
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    company: ''
  });
  
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    marketingEmails: false,
    activityDigest: true
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    // Implement profile update logic
    console.log('Profile update:', profileForm);
  };

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 bg-gradient-to-br from-indigo-50 via-pink-50/40 to-yellow-50/30 min-h-screen p-4 md:p-8 rounded-xl">
      {/* Profile Settings */}
      <Card className="bg-gradient-to-r from-pink-100/60 via-yellow-100/40 to-indigo-100/30 shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-700">
            <Settings className="h-5 w-5 text-yellow-500" />
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-indigo-700">Full Name</Label>
                <Input
                  id="name"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                  className="border-pink-300 focus:border-indigo-400 bg-white/80"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-indigo-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                  className="border-yellow-300 focus:border-pink-400 bg-white/80"
                />
              </div>
              <div>
                <Label htmlFor="company" className="text-indigo-700">Company</Label>
                <Input
                  id="company"
                  value={profileForm.company}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Acme Inc"
                  className="border-indigo-300 focus:border-yellow-400 bg-white/80"
                />
              </div>
            </div>
            <Button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white">Save Changes</Button>
          </form>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-gradient-to-r from-yellow-100/60 via-pink-100/40 to-indigo-100/30 shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-700">
            <Bell className="h-5 w-5 text-pink-500" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-indigo-700">Email Notifications</p>
                <p className="text-sm text-pink-500">Receive notifications about your campaigns</p>
              </div>
              <Switch
                checked={notifications.emailNotifications}
                onCheckedChange={() => handleNotificationToggle('emailNotifications')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-indigo-700">Marketing Emails</p>
                <p className="text-sm text-pink-500">Receive updates about new features</p>
              </div>
              <Switch
                checked={notifications.marketingEmails}
                onCheckedChange={() => handleNotificationToggle('marketingEmails')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-indigo-700">Activity Digest</p>
                <p className="text-sm text-pink-500">Get weekly summary of your activity</p>
              </div>
              <Switch
                checked={notifications.activityDigest}
                onCheckedChange={() => handleNotificationToggle('activityDigest')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-gradient-to-r from-indigo-100/60 via-yellow-100/40 to-pink-100/30 shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-700">
            <Shield className="h-5 w-5 text-yellow-500" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline" className="border-pink-400 text-pink-700">Change Password</Button>
            <Button variant="outline" className="border-yellow-400 text-yellow-700">Enable Two-Factor Authentication</Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing Settings */}
      <Card className="bg-gradient-to-r from-pink-100/60 via-indigo-100/40 to-yellow-100/30 shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-700">
            <CreditCard className="h-5 w-5 text-indigo-500" />
            Billing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-indigo-700">Current Plan</p>
                <p className="text-sm text-pink-500">Free Tier</p>
              </div>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">Upgrade Plan</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}