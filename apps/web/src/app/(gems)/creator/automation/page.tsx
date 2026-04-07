"use client";

import { CreatorStudioStub } from "@/views/CreatorStudioStub";

export default function CreatorAutomationPage() {
  return (
    <CreatorStudioStub
      title="Automation"
      description="Schedule drops, reminders, and campaign hooks. Execution runs server-side; fans see normal creator notifications."
    >
      <p>Connect workers (Node) to on-chain factories and your notification provider.</p>
    </CreatorStudioStub>
  );
}
