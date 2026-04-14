import { structuredCloneFunc } from "@/utils/structed-clone";

export default function ChildNoDirective() {
  const cloned = structuredClone({ nested: true });

  const cloned2 = structuredCloneFunc(cloned);

  return (
    <div>
      <p>Cloned: {JSON.stringify(cloned)}</p>
      <p>Cloned: {JSON.stringify(cloned2)}</p>
    </div>
  );
}
