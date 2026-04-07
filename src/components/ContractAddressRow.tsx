import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ContractAddressRowProps {
  label: string;
  address: string;
  className?: string;
}

export function ContractAddressRow({ label, address, className }: ContractAddressRowProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 rounded-xl border border-border/70 bg-secondary/20 px-3 py-2.5", className)}>
      <span className="text-xs font-medium text-muted-foreground shrink-0 w-36">{label}</span>
      <code className="text-[11px] sm:text-xs font-mono text-foreground break-all flex-1">{address}</code>
      <Button type="button" variant="outline" size="sm" className="shrink-0 rounded-lg h-8 gap-1.5" onClick={copy}>
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" /> Copied
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" /> Copy
          </>
        )}
      </Button>
    </div>
  );
}
