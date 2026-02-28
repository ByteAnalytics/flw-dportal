"use client";

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "@/lib/react-query";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = getQueryClient();

  return (
    <QueryClientProvider client={client}>
      {children}
      {process.env.NEXT_PUBLIC_NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
