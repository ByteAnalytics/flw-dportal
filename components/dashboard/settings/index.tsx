"use client";

import React, { useState } from "react";
import { Settings, Bell, Plug } from "lucide-react";
import ApiIntegrationsTab from "./ApiIntegrationsTab";
import NotificationsTab from "./NotificationsTab";
import GeneralSettingsTab from "./GeneralSettingsTab";

type SettingsTab = "api" | "notifications" | "general";

const NAV_ITEMS: {
  key: SettingsTab;
  label: string;
  icon: React.ReactNode;
}[] = [
  { key: "api", label: "API Integrations", icon: <Plug size={16} /> },
  { key: "notifications", label: "Notifications", icon: <Bell size={16} /> },
  { key: "general", label: "General", icon: <Settings size={16} /> },
];

const SettingsComponent = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("api");

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[1.5rem] font-[700] text-[#111827]">Settings</h2>
        <p className="font-[500] text-sm text-[#6B7280] mt-1">
          Manage integrations, notifications, and system preferences
        </p>
      </div>

      <div className="flex gap-8 flex-wrap lg:flex-nowrap">
        {/* Sidebar Nav */}
        <div className="w-[200px] flex-shrink-0">
          <p className="text-[11px] font-[700] text-[#9CA3AF] uppercase tracking-wider mb-3">
            Configuration
          </p>
          <nav className="space-y-1">
            {NAV_ITEMS.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-[13px] font-[600] transition-colors text-left ${
                  activeTab === key
                    ? "bg-[#F0FDF4] text-[#006F37]"
                    : "text-[#6B7280] hover:bg-[#F9FAFB]"
                }`}
              >
                <span
                  className={
                    activeTab === key ? "text-[#006F37]" : "text-[#9CA3AF]"
                  }
                >
                  {icon}
                </span>
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === "api" && <ApiIntegrationsTab />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "general" && <GeneralSettingsTab />}
        </div>
      </div>
    </div>
  );
};

export default SettingsComponent;
