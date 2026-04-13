import ByteLogo from "@/public/assets/BYTE ANALYTICS.svg";
import { StaticImageData } from "next/image";

export type Environment = "development" | "demo" | "production";
export type ApiUrls = Record<Environment, string>;
export type EnvironmentConfig = {
  environment: Environment;
  apiBaseUrl: string;
  isDevelopment: boolean;
  isDemo: boolean;
  isProduction: boolean;
  brandLogo: StaticImageData;
};

export class EnvironmentHelper {
  static getCurrent(): Environment {
    const env = process.env.NEXT_PUBLIC_NODE_ENV as Environment;
    return env || "production";
  }

  static is(env: Environment): boolean {
    return EnvironmentHelper.getCurrent() === env;
  }

  static isDevelopment(): boolean {
    return EnvironmentHelper.is("development");
  }

  static isDemo(): boolean {
    return EnvironmentHelper.is("demo");
  }

  static isProduction(): boolean {
    return EnvironmentHelper.is("production");
  }

  static getApiBaseUrl(): string {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!apiUrl) {
      console.error("NEXT_PUBLIC_API_BASE_URL is not set!");
      return "https://api.byteanalytics.tech/api/v1";
    }

    return apiUrl;
  }

  static getConfig(): EnvironmentConfig {
    const env = EnvironmentHelper.getCurrent();

    return {
      environment: env,
      apiBaseUrl: EnvironmentHelper.getApiBaseUrl(),
      isDevelopment: env === "development",
      isDemo: env === "demo",
      isProduction: env === "production",
      brandLogo: EnvironmentHelper.getBrandLogo(),
    };
  }

  static getBrandLogo(): StaticImageData {
    return ByteLogo;
  }

  static getMetaDescription(baseDescription: string): string {
    const env = EnvironmentHelper.getCurrent();

    const prefixes: Record<Environment, string> = {
      development: "[DEV] ",
      demo: "[DEMO] ",
      production: "",
    };

    return `${prefixes[env]}${baseDescription}`;
  }

  static getMetaTitle(): string {
    return `Ray Process Automation`;
  }
}
