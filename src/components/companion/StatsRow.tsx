import { cn } from "@/lib/utils";

interface StatsRowProps {
  items: { label: string; value: string }[];
  className?: string;
}

export function StatsRow({ items, className }: StatsRowProps) {
  return (
    <dl className={cn("grid grid-cols-3 gap-2", className)}>
      {items.map((item) => (
        <div key={item.label} className="soft-card rounded-2xl px-2.5 py-2 text-center">
          <dt className="text-[0.6rem] font-bold uppercase tracking-wide text-muted-foreground">
            {item.label}
          </dt>
          <dd className="font-display text-lg font-bold leading-tight">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
