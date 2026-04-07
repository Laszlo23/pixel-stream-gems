"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CreatorStudioStub } from "@/views/CreatorStudioStub";

export default function CreatorCompetitionsPage() {
  return (
    <CreatorStudioStub
      title="Competitions"
      description="Run creator leaderboards and fan leagues. Scores typically come from tips, flows, LP, and NFT volume."
    >
      <Button asChild variant="secondary" className="rounded-xl">
        <Link href="/competitions">View public competitions</Link>
      </Button>
    </CreatorStudioStub>
  );
}
