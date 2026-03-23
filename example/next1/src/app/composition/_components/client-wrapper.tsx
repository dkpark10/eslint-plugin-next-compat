"use client";

import { useEffect, type PropsWithChildren } from "react";
import { range, filter, map } from "rxjs";

export default function ClientWrapper({ children }: PropsWithChildren) {
  useEffect(() => {
    range(1, 200)
      .pipe(
        filter((x) => x % 2 === 1),
        map((x) => x + x),
      )
      .subscribe((x) => console.log(x));
  }, []);

  return <div>{children}</div>;
}
