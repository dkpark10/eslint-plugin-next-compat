'use client';

import ChildNoDirective from "@/app/nested-client/_components/child-no-directive";

export default function ClientParent() {
  const cloned = structuredClone({ parent: true });

  return (
    <div>
      {JSON.stringify(cloned)}
      <ChildNoDirective />
    </div>
  );
}
