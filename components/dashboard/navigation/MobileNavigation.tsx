"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NavItem } from "@/types/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

interface MobileNavProps {
  items: readonly NavItem[];
}

export const MobileNav: React.FC<MobileNavProps> = ({ items }) => {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { user, isLoading } = useAuthStore((s) => s);

  const userRole = user?.role;

  const filteredItems = useMemo(() => {
    if (!userRole) return [];
    return items.filter((item) => item.roles?.includes(userRole));
  }, [items, userRole]);

  const getActiveUrl = useCallback(() => {
    const exactMatch = filteredItems.find((item) => pathname === item.url);
    if (exactMatch) return exactMatch.url;

    const matchingItems = filteredItems.filter((item) =>
      pathname.startsWith(item.url + "/"),
    );

    if (matchingItems.length > 0) {
      return matchingItems.sort((a, b) => b.url.length - a.url.length)[0].url;
    }

    return null;
  }, [pathname, filteredItems]);

  const activeUrl = getActiveUrl();
  const isActive = (url: string) => url === activeUrl;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="block md:hidden">
      <motion.button
        onClick={() => setOpen((s) => !s)}
        initial={false}
        animate={{ rotate: open ? 90 : 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-[7rem] right-6 z-40 flex flex-col items-end gap-3"
          >
            {isLoading
              ? [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-full bg-black/60 px-4 py-3 animate-pulse shadow-md"
                  >
                    <div className="h-4 w-4 rounded-full bg-gray-400/40" />
                    <div className="h-3 w-16 rounded bg-gray-400/30" />
                  </div>
                ))
              : filteredItems.map((item, index) => {
                  const active = isActive(item.url);

                  return (
                    <motion.div
                      key={`${item.url || "item"}-${index}`}
                      initial={{ opacity: 0, scale: 0.8, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 30 }}
                      transition={{
                        delay: index * 0.08,
                        type: "spring",
                        stiffness: 300,
                      }}
                    >
                      <Link href={item.url}>
                        <motion.div
                          layout
                          initial={{ width: "3.5rem" }}
                          whileHover={{ width: "auto" }}
                          transition={{
                            type: "spring",
                            stiffness: 250,
                            damping: 20,
                          }}
                          className={cn(
                            "group flex items-center rounded-full shadow-md transition-colors text-InfraMuted cursor-pointer",
                            "hover:bg-neutral-800",
                            active && "bg-InfraGreen text-white",
                          )}
                        >
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center">
                            <item.icon className="h-4 w-4" />
                          </div>

                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            whileHover={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="pr-4 text-[13px] font-medium text-[#CAEAD4] whitespace-nowrap"
                          >
                            {item.title}
                          </motion.span>
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
