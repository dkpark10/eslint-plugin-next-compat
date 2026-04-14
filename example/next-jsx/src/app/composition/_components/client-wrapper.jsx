"use client";

import { useEffect } from "react";

export default function ClientWrapper({ children }) {
  useEffect(() => {
    console.log("client wrapper mounted");
  }, []);

  return <div>{children}</div>;
}
