'use client';

export default function BlogSlug() {
  const cloned = structuredClone({ parent: true });

  return (
    <div>
      {cloned.parent}
    </div>
  );
}
