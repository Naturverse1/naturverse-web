import React, { Suspense } from "react";
import SkeletonGrid from "../../components/SkeletonGrid";
export default function WithSkeleton({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<SkeletonGrid />}>{children}</Suspense>;
}
