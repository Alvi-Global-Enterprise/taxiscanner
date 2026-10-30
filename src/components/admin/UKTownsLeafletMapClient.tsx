"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const UKTownsLeafletMapInner = dynamic(
  () =>
    import("./UKTownsLeafletMap").then((m) => m.UKTownsLeafletMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-[520px] w-full items-center justify-center gap-2 rounded-[14px] border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-600"
      >
        <Loader2 className="animate-spin" size={16} />
        Loading free UK map…
      </div>
    ),
  }
);

type Props = {
  selectedTownIds: string[];
  onToggleTown: (townId: string) => void;
  activeCompanyColor?: string;
  focusedZoneId?: string | null;
  height?: string;
};

export function UKTownsLeafletMapClient(props: Props) {
  return <UKTownsLeafletMapInner {...props} />;
}
