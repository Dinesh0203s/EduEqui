import { clsx, type ClassValue } from "clsx@^1.2.0";
import { twMerge } from "tailwind-merge@^1.1.0";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
