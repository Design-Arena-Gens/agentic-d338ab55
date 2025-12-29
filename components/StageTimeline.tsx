"use client";

import { workflowStages } from "@/lib/workflow";
import { motion } from "framer-motion";
import clsx from "classnames";

type StageTimelineProps = {
  currentStage: number;
  onStageSelect?: (index: number) => void;
};

export function StageTimeline({ currentStage, onStageSelect }: StageTimelineProps) {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Workflow Journey
        </h2>
        <p className="text-sm text-slate-500">
          Inspired by Middle&#39;s broker operating playbooks. Click a stage to jump context.
        </p>
      </header>
      <ol className="relative border-s border-slate-200">
        {workflowStages.map((stage, index) => {
          const active = index === currentStage;
          const complete = index < currentStage;
          return (
            <li key={stage.id} className="pl-6 pb-8 last:pb-0">
              <div className="absolute -left-[9px] mt-1 h-4 w-4 rounded-full border-2 border-white bg-slate-200 shadow">
                {active && (
                  <motion.span
                    layoutId="marker"
                    className="absolute inset-0 rounded-full border-[3px] border-primary-500"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}
                {complete && !active && (
                  <span className="absolute inset-1 rounded-full bg-primary-500" />
                )}
              </div>
              <button
                onClick={() => onStageSelect?.(index)}
                className={clsx(
                  "flex w-full flex-col items-start gap-1 text-left",
                  active && "text-primary-600",
                  complete && !active && "text-slate-700"
                )}
              >
                <span className="text-sm font-semibold">{stage.title}</span>
                <span className="text-xs text-slate-500">{stage.summary}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
