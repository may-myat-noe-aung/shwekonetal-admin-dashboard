import React from "react";
import { Clock3 } from "lucide-react";

export default function ActivityFeed({ feed = [] }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Activity Feed</h3>
        <Clock3 className="h-4 w-4 text-neutral-400" />
      </div>

      <div className="space-y-3 text-sm">
        {feed.length > 0 ? (
          feed.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-3 border-b border-neutral-800 pb-2 last:border-none"
            >
              <div className="text-yellow-400">{f.icon}</div>
              <div className="flex-1">
                <div>{f.text}</div>
                <div className="text-xs text-neutral-500">{f.time} ago</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-neutral-500 text-sm">No recent activity.</div>
        )}
      </div>
    </div>
  );
}
