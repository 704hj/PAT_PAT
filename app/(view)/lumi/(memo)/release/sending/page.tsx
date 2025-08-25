import { Suspense } from "react";
import ReleaseSending from "./releaseSending";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReleaseSending />
    </Suspense>
  );
}
