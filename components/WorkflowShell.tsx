"use client";

import { useState } from "react";
import { ChatPanel } from "./ChatPanel";
import { StageTimeline } from "./StageTimeline";
import { workflowStages } from "@/lib/workflow";

export function WorkflowShell() {
  const [stageIndex, setStageIndex] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>(workflowStages[0].prompts);

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <section className="w-full lg:w-7/12">
        <ChatPanel
          stageIndex={stageIndex}
          onStageChange={(index) => {
            setStageIndex(index);
            setSuggestions(workflowStages[index].prompts);
          }}
          suggestions={suggestions}
          onSuggestionsChange={(items) => {
            setSuggestions(items.length ? items : workflowStages[stageIndex].prompts);
          }}
        />
      </section>
      <aside className="w-full lg:w-5/12">
        <div className="sticky top-12 flex flex-col gap-8">
          <StageTimeline
            currentStage={stageIndex}
            onStageSelect={(index) => {
              setStageIndex(index);
              setSuggestions(workflowStages[index].prompts);
            }}
          />
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700">Operational Recipes</h3>
            <p className="mt-2 text-sm text-slate-500">
              Align brokers, processors, and assistants with a single source-of-truth. Mirror these plays inside your LOS, CRM, and borrower portal.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>• Borrower nudges keyed to document stack completion.</li>
              <li>• Instant pre-approval briefs with ratio alerts.</li>
              <li>• Processor kickoff packets with condition forecast.</li>
              <li>• Closing day orchestration and post-close nurture.</li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}
