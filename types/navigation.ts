/* eslint-disable @typescript-eslint/no-explicit-any */

import { UserRole } from ".";

export interface NavItem {
  title: string;
  url: string;
  roles?: UserRole[];
  icon: React.ComponentType<any>;
  items?: {
    title: string;
    url: string;
  }[];
}

export interface AppSidebarData {
  navMain: readonly NavItem[];
  appName?: string;
  logoIcon?: React.ComponentType<any>;
}
