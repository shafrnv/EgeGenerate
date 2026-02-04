import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { type Problem, DIFFICULTY_INFO } from '@/lib/problemGenerator';

interface ProblemCardProps {
  problem: Problem;
  index: number;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`copy-button ${copied ? 'copy-button-success' : ''}`}
      title={`Копировать ${label}`}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      <span>{copied ? 'Скопировано' : label}</span>
    </button>
  );
}

export function ProblemCard({ problem, index }: ProblemCardProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const diffInfo = DIFFICULTY_INFO[problem.difficulty];

  return (
    <div className="problem-card animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
      {/* Header */}
      <div className="flex items-start gap-3 p-4 border-b border-border">
        <span className="problem-number">{problem.id}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`difficulty-badge difficulty-${problem.difficulty}`}>
              {diffInfo.title}
            </span>
          </div>
          <p className="text-foreground leading-relaxed">{problem.condition}</p>
        </div>
        <CopyButton text={problem.condition} label="условие" />
      </div>

      {/* Answer section */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAnswer(!showAnswer)}
            className="gap-2"
          >
            {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showAnswer ? 'Скрыть ответ' : 'Показать ответ'}
          </Button>
          {showAnswer && <CopyButton text={problem.answer} label="ответ" />}
        </div>
        {showAnswer && (
          <div className="mt-3 p-3 bg-success/10 border border-success/20 rounded-lg animate-fade-in">
            <span className="text-sm font-medium text-muted-foreground">Ответ: </span>
            <span className="font-semibold text-foreground">{problem.answer}</span>
          </div>
        )}
      </div>

      {/* Solution section */}
      <Collapsible open={showSolution} onOpenChange={setShowSolution}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                {showSolution ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {showSolution ? 'Скрыть решение' : 'Показать решение'}
              </Button>
            </CollapsibleTrigger>
            {showSolution && (
              <CopyButton text={problem.solution.join('\n')} label="решение" />
            )}
          </div>
          <CollapsibleContent>
            <div className="mt-4 space-y-2 animate-fade-in">
              {problem.solution.map((step, i) => (
                <div key={i} className="solution-step">
                  <span className="solution-step-number">{i + 1}</span>
                  <p className="text-sm text-foreground font-mono whitespace-pre-wrap">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
}
