import { Card } from "@/components/ui/card";
import { JobFilter } from "@/components/general/JobFilters";
import { JobListings } from "@/components/general/JobListings";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-cols-3 gap-8">
      <JobFilter />

      <div className="flex flex-col col-span-2 gap-6">
        <JobListings />
      </div>
    </div>
  );
}
