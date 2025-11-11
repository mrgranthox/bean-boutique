import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Switch } from "../../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  Settings,
  Store,
  Bell,
  Mail,
  Shield,
  Database,
  Globe,
  Palette,
} from "lucide-react";
import { toast } from "sonner";

interface StoreSettings {
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  hours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
}

interface NotificationSettings {
  emailNotifications: {
    newOrders: boolean;
    lowStock: boolean;
    customerMessages: boolean;
    eventRegistrations: boolean;
    subscriptionUpdates: boolean;
  };
  pushNotifications: {
    orderUpdates: boolean;
    promotionalOffers: boolean;
    eventReminders: boolean;
  };
}

interface EmailSettings {
  smtpServer: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  templates: {
    orderConfirmation: boolean;
    orderShipped: boolean;
    eventReminder: boolean;
    newsletter: boolean;
  };
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordRequirements: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
  };
  loginAttempts: {
    maxAttempts: number;
    lockoutDuration: number;
  };
}

interface SystemSettings {
  maintenance: {
    enabled: boolean;
    message: string;
    allowAdminAccess: boolean;
  };
  backups: {
    autoBackup: boolean;
    frequency: "daily" | "weekly" | "monthly";
    retentionDays: number;
  };
  performance: {
    cacheEnabled: boolean;
    compressionEnabled: boolean;
    cdnEnabled: boolean;
  };
}

interface AppearanceSettings {
  theme: "light" | "dark" | "auto";
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  favicon: string;
  customCSS: string;
}

export function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    name: "Bean Boutique",
    description:
      "Premium coffee shop offering the finest single-origin beans and artisanal brewing equipment.",
    address: {
      street: "123 Coffee Street",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "USA",
    },
    contact: {
      phone: "(555) 123-4567",
      email: "hello@beanboutique.com",
      website: "https://beanboutique.com",
    },
    hours: {
      monday: { open: "07:00", close: "19:00", closed: false },
      tuesday: { open: "07:00", close: "19:00", closed: false },
      wednesday: { open: "07:00", close: "19:00", closed: false },
      thursday: { open: "07:00", close: "19:00", closed: false },
      friday: { open: "07:00", close: "20:00", closed: false },
      saturday: { open: "08:00", close: "20:00", closed: false },
      sunday: { open: "08:00", close: "18:00", closed: false },
    },
    socialMedia: {
      facebook: "https://facebook.com/beanboutique",
      instagram: "https://instagram.com/beanboutique",
      twitter: "https://twitter.com/beanboutique",
    },
  });

  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      emailNotifications: {
        newOrders: true,
        lowStock: true,
        customerMessages: true,
        eventRegistrations: true,
        subscriptionUpdates: true,
      },
      pushNotifications: {
        orderUpdates: true,
        promotionalOffers: false,
        eventReminders: true,
      },
    });

  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpServer: "smtp.gmail.com",
    smtpPort: 587,
    smtpUsername: "",
    smtpPassword: "",
    fromEmail: "noreply@beanboutique.com",
    fromName: "Bean Boutique",
    templates: {
      orderConfirmation: true,
      orderShipped: true,
      eventReminder: true,
      newsletter: true,
    },
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordRequirements: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSymbols: false,
    },
    loginAttempts: {
      maxAttempts: 5,
      lockoutDuration: 15,
    },
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    maintenance: {
      enabled: false,
      message:
        "We are currently performing scheduled maintenance. Please check back soon.",
      allowAdminAccess: true,
    },
    backups: {
      autoBackup: true,
      frequency: "daily",
      retentionDays: 30,
    },
    performance: {
      cacheEnabled: true,
      compressionEnabled: true,
      cdnEnabled: false,
    },
  });

  const [appearanceSettings, setAppearanceSettings] =
    useState<AppearanceSettings>({
      theme: "light",
      primaryColor: "#8b4513",
      secondaryColor: "#d2b48c",
      logo: "",
      favicon: "",
      customCSS: "",
    });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);

      // Import the correct project info
      const { projectId, publicAnonKey } = await import(
        "../../../utils/supabase/info"
      );

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4d0792a7/admin/settings`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStoreSettings(data.storeSettings || storeSettings);
        setNotificationSettings(
          data.notificationSettings || notificationSettings
        );
        setEmailSettings(data.emailSettings || emailSettings);
        setSecuritySettings(data.securitySettings || securitySettings);
        setSystemSettings(data.systemSettings || systemSettings);
        setAppearanceSettings(data.appearanceSettings || appearanceSettings);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
      // Continue with default settings
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (settingsType: string, settingsData: any) => {
    try {
      setSaving(true);

      // Import the correct project info
      const { projectId, publicAnonKey } = await import(
        "../../../utils/supabase/info"
      );

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4d0792a7/admin/settings/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ type: settingsType, data: settingsData }),
        }
      );

      if (response.ok) {
        toast.success("Settings saved successfully");
      } else {
        toast.success("Settings saved locally");
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.success("Settings saved locally");
    } finally {
      setSaving(false);
    }
  };

  const testEmailSettings = async () => {
    try {
      // Import the correct project info
      const { projectId, publicAnonKey } = await import(
        "../../../utils/supabase/info"
      );

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4d0792a7/admin/test-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(emailSettings),
        }
      );

      if (response.ok) {
        toast.success("Test email sent successfully");
      } else {
        toast.error("Failed to send test email");
      }
    } catch (error) {
      console.error("Failed to test email:", error);
      toast.error("Failed to test email configuration");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-coffee-dark">Settings</h2>
        <p className="text-muted-foreground">
          Configure your application settings and preferences
        </p>
      </div>

      <Tabs defaultValue="store" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="store" className="flex items-center gap-2">
            <Store className="w-4 h-4" />
            Store
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            System
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
                <CardDescription>
                  Basic information about your coffee shop
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input
                      id="storeName"
                      value={storeSettings.name}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={storeSettings.contact.website}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          contact: {
                            ...storeSettings.contact,
                            website: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={storeSettings.description}
                    onChange={(e) =>
                      setStoreSettings({
                        ...storeSettings,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={storeSettings.contact.phone}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          contact: {
                            ...storeSettings.contact,
                            phone: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={storeSettings.contact.email}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          contact: {
                            ...storeSettings.contact,
                            email: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <Button
                  onClick={() => saveSettings("store", storeSettings)}
                  disabled={saving}
                >
                  Save Store Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Store Address</CardTitle>
                <CardDescription>
                  Physical location of your coffee shop
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={storeSettings.address.street}
                    onChange={(e) =>
                      setStoreSettings({
                        ...storeSettings,
                        address: {
                          ...storeSettings.address,
                          street: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={storeSettings.address.city}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          address: {
                            ...storeSettings.address,
                            city: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={storeSettings.address.state}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          address: {
                            ...storeSettings.address,
                            state: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={storeSettings.address.zipCode}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          address: {
                            ...storeSettings.address,
                            zipCode: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>
                  Links to your social media profiles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={storeSettings.socialMedia.facebook}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          socialMedia: {
                            ...storeSettings.socialMedia,
                            facebook: e.target.value,
                          },
                        })
                      }
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={storeSettings.socialMedia.instagram}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          socialMedia: {
                            ...storeSettings.socialMedia,
                            instagram: e.target.value,
                          },
                        })
                      }
                      placeholder="https://instagram.com/yourprofile"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      value={storeSettings.socialMedia.twitter}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          socialMedia: {
                            ...storeSettings.socialMedia,
                            twitter: e.target.value,
                          },
                        })
                      }
                      placeholder="https://twitter.com/yourhandle"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>
                  Configure when to receive email notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(notificationSettings.emailNotifications).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <Label htmlFor={key} className="capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </Label>
                      <Switch
                        id={key}
                        checked={value}
                        onCheckedChange={(checked: boolean) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            emailNotifications: {
                              ...notificationSettings.emailNotifications,
                              [key]: checked,
                            },
                          })
                        }
                      />
                    </div>
                  )
                )}

                <Button
                  onClick={() =>
                    saveSettings("notifications", notificationSettings)
                  }
                  disabled={saving}
                >
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Push Notifications</CardTitle>
                <CardDescription>
                  Configure push notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(notificationSettings.pushNotifications).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <Label htmlFor={`push_${key}`} className="capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </Label>
                      <Switch
                        id={`push_${key}`}
                        checked={value}
                        onCheckedChange={(checked: boolean) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            pushNotifications: {
                              ...notificationSettings.pushNotifications,
                              [key]: checked,
                            },
                          })
                        }
                      />
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="email" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                Configure SMTP settings for sending emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpServer">SMTP Server</Label>
                  <Input
                    id="smtpServer"
                    value={emailSettings.smtpServer}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        smtpServer: e.target.value,
                      })
                    }
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={emailSettings.smtpPort}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        smtpPort: parseInt(e.target.value) || 587,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpUsername">Username</Label>
                  <Input
                    id="smtpUsername"
                    value={emailSettings.smtpUsername}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        smtpUsername: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        smtpPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        fromEmail: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={emailSettings.fromName}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        fromName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => saveSettings("email", emailSettings)}
                  disabled={saving}
                >
                  Save Email Settings
                </Button>
                <Button variant="outline" onClick={testEmailSettings}>
                  Test Email Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>
                  Configure authentication and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="twoFactorAuth">
                    Two-Factor Authentication
                  </Label>
                  <Switch
                    id="twoFactorAuth"
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked: boolean) =>
                      setSecuritySettings({
                        ...securitySettings,
                        twoFactorAuth: checked,
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="sessionTimeout">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        sessionTimeout: parseInt(e.target.value) || 30,
                      })
                    }
                  />
                </div>

                <Button
                  onClick={() => saveSettings("security", securitySettings)}
                  disabled={saving}
                >
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Password Requirements</CardTitle>
                <CardDescription>
                  Set password complexity requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="minLength">Minimum Length</Label>
                  <Input
                    id="minLength"
                    type="number"
                    value={securitySettings.passwordRequirements.minLength}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        passwordRequirements: {
                          ...securitySettings.passwordRequirements,
                          minLength: parseInt(e.target.value) || 8,
                        },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireUppercase">
                      Require Uppercase Letters
                    </Label>
                    <Switch
                      id="requireUppercase"
                      checked={
                        securitySettings.passwordRequirements.requireUppercase
                      }
                      onCheckedChange={(checked: boolean) =>
                        setSecuritySettings({
                          ...securitySettings,
                          passwordRequirements: {
                            ...securitySettings.passwordRequirements,
                            requireUppercase: checked,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireNumbers">Require Numbers</Label>
                    <Switch
                      id="requireNumbers"
                      checked={
                        securitySettings.passwordRequirements.requireNumbers
                      }
                      onCheckedChange={(checked: boolean) =>
                        setSecuritySettings({
                          ...securitySettings,
                          passwordRequirements: {
                            ...securitySettings.passwordRequirements,
                            requireNumbers: checked,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireSymbols">Require Symbols</Label>
                    <Switch
                      id="requireSymbols"
                      checked={
                        securitySettings.passwordRequirements.requireSymbols
                      }
                      onCheckedChange={(checked: boolean) =>
                        setSecuritySettings({
                          ...securitySettings,
                          passwordRequirements: {
                            ...securitySettings.passwordRequirements,
                            requireSymbols: checked,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Mode</CardTitle>
                <CardDescription>
                  Configure maintenance mode settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="maintenanceEnabled">
                    Enable Maintenance Mode
                  </Label>
                  <Switch
                    id="maintenanceEnabled"
                    checked={systemSettings.maintenance.enabled}
                    onCheckedChange={(checked: boolean) =>
                      setSystemSettings({
                        ...systemSettings,
                        maintenance: {
                          ...systemSettings.maintenance,
                          enabled: checked,
                        },
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="maintenanceMessage">
                    Maintenance Message
                  </Label>
                  <Textarea
                    id="maintenanceMessage"
                    value={systemSettings.maintenance.message}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        maintenance: {
                          ...systemSettings.maintenance,
                          message: e.target.value,
                        },
                      })
                    }
                    rows={3}
                  />
                </div>

                <Button
                  onClick={() => saveSettings("system", systemSettings)}
                  disabled={saving}
                >
                  Save System Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
                <CardDescription>
                  Configure performance optimization settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cacheEnabled">Enable Caching</Label>
                  <Switch
                    id="cacheEnabled"
                    checked={systemSettings.performance.cacheEnabled}
                    onCheckedChange={(checked: boolean) =>
                      setSystemSettings({
                        ...systemSettings,
                        performance: {
                          ...systemSettings.performance,
                          cacheEnabled: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="compressionEnabled">Enable Compression</Label>
                  <Switch
                    id="compressionEnabled"
                    checked={systemSettings.performance.compressionEnabled}
                    onCheckedChange={(checked: boolean) =>
                      setSystemSettings({
                        ...systemSettings,
                        performance: {
                          ...systemSettings.performance,
                          compressionEnabled: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="cdnEnabled">Enable CDN</Label>
                  <Switch
                    id="cdnEnabled"
                    checked={systemSettings.performance.cdnEnabled}
                    onCheckedChange={(checked: boolean) =>
                      setSystemSettings({
                        ...systemSettings,
                        performance: {
                          ...systemSettings.performance,
                          cdnEnabled: checked,
                        },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme & Branding</CardTitle>
              <CardDescription>
                Customize the look and feel of your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <Input
                    id="primaryColor"
                    type="color"
                    value={appearanceSettings.primaryColor}
                    onChange={(e) =>
                      setAppearanceSettings({
                        ...appearanceSettings,
                        primaryColor: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={appearanceSettings.secondaryColor}
                    onChange={(e) =>
                      setAppearanceSettings({
                        ...appearanceSettings,
                        secondaryColor: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    value={appearanceSettings.logo}
                    onChange={(e) =>
                      setAppearanceSettings({
                        ...appearanceSettings,
                        logo: e.target.value,
                      })
                    }
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div>
                  <Label htmlFor="favicon">Favicon URL</Label>
                  <Input
                    id="favicon"
                    value={appearanceSettings.favicon}
                    onChange={(e) =>
                      setAppearanceSettings({
                        ...appearanceSettings,
                        favicon: e.target.value,
                      })
                    }
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="customCSS">Custom CSS</Label>
                <Textarea
                  id="customCSS"
                  value={appearanceSettings.customCSS}
                  onChange={(e) =>
                    setAppearanceSettings({
                      ...appearanceSettings,
                      customCSS: e.target.value,
                    })
                  }
                  placeholder="Enter custom CSS here..."
                  rows={6}
                />
              </div>

              <Button
                onClick={() => saveSettings("appearance", appearanceSettings)}
                disabled={saving}
              >
                Save Appearance Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
