/* eslint-disable @typescript-eslint/no-explicit-any */

import { RATING_ORDER } from "@/constants/pd-model-config";


export const formatValue = (value: any, key: string): string | number => {
  if (typeof value === "number") {
    const isPDField =
      key.toLowerCase().includes("pd") ||
      key.toLowerCase().includes("probability");

    if (isPDField) {
      if (Math.abs(value) < 0.0001) {
        return `${(value * 100).toFixed(6)}%`;
      } else if (Math.abs(value) < 0.01) {
        return `${(value * 100).toFixed(4)}%`;
      } else {
        return `${(value * 100).toFixed(2)}%`;
      }
    }

    if (Number.isInteger(value)) {
      return value;
    }

    return Number(value.toFixed(4));
  }
  return value;
};

export const getRatingOrder = (rating: string): number => {
  const normalizedRating = rating?.toString().trim().toUpperCase();
  return RATING_ORDER[normalizedRating] ?? 999;
};
