import { type ClassValue, clsx } from "clsx";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type FormState = {
  message: string;
  description: string;
  success?: boolean;
};

export const initialState: FormState = {
  message: "",
  description: "",
  success: undefined,
};

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

export function formatTimeAgo(date: Date) {
  return timeAgo.format(date);
}

export function ensure(condition: any, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
