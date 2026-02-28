import BrandLogo from "@/public/assets/Brand.svg";
import ByteLogo from "@/public/assets/byte-logo-white.svg";
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
      return "http://66.42.92.219/api";
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
    const env = EnvironmentHelper.getCurrent();
    const isDemo = env === "demo";

    if (isDemo) return ByteLogo;
    return BrandLogo;
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
    const env = EnvironmentHelper.getCurrent();

    const prefixes: Record<Environment, string> = {
      development: "InfraCredit",
      demo: "Byte Analytics ",
      production: "InfraCredit",
    };

    return `${prefixes[env] || "InfraCredit"} IFRS9`;
  }
}
