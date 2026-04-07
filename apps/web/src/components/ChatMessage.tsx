import { Badge } from "@/components/ui/badge";

interface ChatMessageProps {
  username: string;
  message: string;
  level: number;
  isTip?: boolean;
  tipAmount?: number;
  isSystem?: boolean;
  /** Room assistant / hybrid LLM + phrase bank (demo) */
  isPresenter?: boolean;
  /** Show badge for fans holding this creator token symbol */
  holderSymbol?: string;
}

const getLevelColor = (level: number) => {
  if (level >= 20) return "text-amber-400";
  if (level >= 10) return "text-primary";
  if (level >= 5) return "text-blue-400";
  return "text-muted-foreground";
};

const ChatMessage = ({
  username,
  message,
  level,
  isTip,
  tipAmount,
  isSystem,
  isPresenter,
  holderSymbol,
}: ChatMessageProps) => {
  if (isSystem) {
    return (
      <div className="px-3 py-1.5 animate-slide-up">
        <p className="text-xs text-primary font-medium text-center">{message}</p>
      </div>
    );
  }

  if (isTip) {
    return (
      <div className="px-3 py-2 mx-2 mb-1 rounded-xl bg-primary/5 border border-primary/10 animate-slide-up">
        <p className="text-xs">
          <span className="font-semibold text-primary">🪙 {username}</span>
          <span className="text-muted-foreground"> tipped </span>
          <span className="font-semibold text-primary">{tipAmount} coins!</span>
        </p>
        {message && <p className="text-xs text-foreground mt-0.5">{message}</p>}
      </div>
    );
  }

  return (
    <div className="px-3 py-1 hover:bg-accent/50 transition-colors animate-slide-up">
      <p className="text-xs leading-relaxed">
        <span className="text-[10px] text-muted-foreground mr-1">Lv.{level}</span>
        {isPresenter && (
          <Badge variant="outline" className="mr-1 h-4 px-1 text-[9px] rounded-md font-normal border-primary/50 text-primary">
            AI
          </Badge>
        )}
        {holderSymbol && (
          <Badge variant="secondary" className="mr-1 h-4 px-1 text-[9px] rounded-md font-normal font-mono">
            {`$${holderSymbol}`}
          </Badge>
        )}
        <span className={`font-medium ${getLevelColor(level)} mr-1.5`}>{username}</span>
        <span className="text-foreground/70">{message}</span>
      </p>
    </div>
  );
};

export default ChatMessage;
