"use client";

import { useEffect } from "react";

interface DomainRedirectProps {
  targetDomain?: string;
}

export default function DomainRedirect({
  targetDomain = "https://yourdomain.ng",
}: DomainRedirectProps) {
  useEffect(() => {
    // Only execute client-side
    if (typeof window !== "undefined") {
      const currentHost = window.location.hostname;

      // Ensure we only redirect if the user is visiting the .com domain
      if (currentHost.endsWith(".com")) {
        const targetUrl = `${targetDomain}${window.location.pathname}${window.location.search}${window.location.hash}`;
        window.location.replace(targetUrl);
      }
    }
  }, [targetDomain]);

  return null;
}
