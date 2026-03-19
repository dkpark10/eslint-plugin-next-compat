'use client';

import ChildNoDirective from './child-no-directive';

export default function ClientParent() {
  const cloned = structuredClone({ parent: true });

  return (
    <div>
      {JSON.stringify(cloned)}
      <ChildNoDirective />
    </div>
  );
}
