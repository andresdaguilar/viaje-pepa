import { Suspense } from "react";
import { TravelersScreen } from "@/components/travelers-screen";

export default function TravelersPage() {
  return (
    <Suspense>
      <TravelersScreen />
    </Suspense>
  );
}
