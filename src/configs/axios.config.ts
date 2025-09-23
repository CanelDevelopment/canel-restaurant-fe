import ax, { AxiosError } from "axios";

export const envirnoment = import.meta.env.VITE_NODE_ENV;
export type ErrorWithMessage = AxiosError<WithMessage>;
export interface WithMessage {
  message: string;
}

const sanitizeDomain = (domain: string) =>
  domain.charAt(domain.length - 1) === "/"
    ? domain.slice(0, -1) + "/api"
    : domain + "/api";

export const backendDomain: Record<"production" | "development", string> = {
  production: import.meta.env.VITE_FRONTEND_URL,
  development: import.meta.env.VITE_BACKEND_URL,
};

const domain = backendDomain.development;
export const url = sanitizeDomain(domain);

export const axios = ax.create({
  baseURL: url,
  withCredentials: true,
});
