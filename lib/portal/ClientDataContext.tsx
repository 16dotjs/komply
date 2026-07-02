"use client";

import { createContext, useContext } from "react";
import type { Database } from "@/lib/supabase/database.types";

export type ClientRow = Database["public"]["Tables"]["clients"]["Row"];

const ClientDataContext = createContext<ClientRow | null>(null);

export function ClientDataProvider({
  client,
  children,
}: {
  client: ClientRow | null;
  children: React.ReactNode;
}) {
  return (
    <ClientDataContext.Provider value={client}>
      {children}
    </ClientDataContext.Provider>
  );
}

/**
 * Returns the logged-in client's row (company, stage, etc.), fetched once
 * server-side in the portal layout. Replaces the per-page
 * `db.from("clients").select("*").eq("user_id", ...).single()` call that
 * was duplicated in every portal page's init().
 */
export function useClientData() {
  return useContext(ClientDataContext);
}
