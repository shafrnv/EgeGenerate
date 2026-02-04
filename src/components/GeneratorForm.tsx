import { useState } from 'react';
import { Sparkles, Settings2, Hash, Gauge, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  type Difficulty,
  type Template,
  type GeneratorSettings,
  TEMPLATE_INFO,
  DIFFICULTY_INFO,
} from '@/lib/problemGenerator';

interface GeneratorFormProps {
  onGenerate: (settings: GeneratorSettings) => void;
  isLoading?: boolean;
}

export function GeneratorForm({ onGenerate, isLoading }: GeneratorFormProps) {
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [template, setTemplate] = useState<Template>('find_final');
  const [useSeed, setUseSeed] = useState(false);
  const [seed, setSeed] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const settings: GeneratorSettings = {
      count,
      difficulty,
      template,
      ...(useSeed && seed ? { seed: parseInt(seed, 10) } : {}),
    };
    onGenerate(settings);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Count selector */}
      <div className="settings-group">
        <div className="flex items-center gap-2 mb-4">
          <Hash className="w-4 h-4 text-primary" />
          <Label className="settings-label">Количество задач</Label>
        </div>
        <div className="space-y-3">
          <Slider
            value={[count]}
            onValueChange={(value) => setCount(value[0])}
            min={1}
            max={20}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>1</span>
            <span className="font-semibold text-foreground text-lg">{count}</span>
            <span>20</span>
          </div>
        </div>
      </div>

      {/* Difficulty selector */}
      <div className="settings-group">
        <div className="flex items-center gap-2 mb-4">
          <Gauge className="w-4 h-4 text-primary" />
          <Label className="settings-label">Сложность</Label>
        </div>
        <RadioGroup
          value={difficulty}
          onValueChange={(value) => setDifficulty(value as Difficulty)}
          className="grid gap-3"
        >
          {(Object.keys(DIFFICULTY_INFO) as Difficulty[]).map((diff) => {
            const info = DIFFICULTY_INFO[diff];
            return (
              <label
                key={diff}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  difficulty === diff
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                <RadioGroupItem value={diff} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{info.title}</span>
                    <span className={`difficulty-badge difficulty-${diff}`}>
                      {info.rates}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{info.description}</p>
                </div>
              </label>
            );
          })}
        </RadioGroup>
      </div>

      {/* Template selector */}
      <div className="settings-group">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-primary" />
          <Label className="settings-label">Тип задачи</Label>
        </div>
        <RadioGroup
          value={template}
          onValueChange={(value) => setTemplate(value as Template)}
          className="grid gap-3"
        >
          {(Object.keys(TEMPLATE_INFO) as Template[]).map((tmpl) => {
            const info = TEMPLATE_INFO[tmpl];
            return (
              <label
                key={tmpl}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  template === tmpl
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                <RadioGroupItem value={tmpl} />
                <div className="flex-1">
                  <span className="font-medium">{info.title}</span>
                  <p className="text-sm text-muted-foreground">{info.description}</p>
                </div>
              </label>
            );
          })}
        </RadioGroup>
      </div>

      {/* Advanced settings */}
      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleTrigger asChild>
          <Button type="button" variant="ghost" size="sm" className="w-full justify-start gap-2">
            <Settings2 className="w-4 h-4" />
            Дополнительные настройки
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          <div className="settings-group">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="useSeed"
                checked={useSeed}
                onChange={(e) => setUseSeed(e.target.checked)}
                className="rounded border-border"
              />
              <Label htmlFor="useSeed" className="settings-label cursor-pointer">
                Использовать seed для воспроизводимости
              </Label>
            </div>
            {useSeed && (
              <Input
                type="number"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="Введите число (seed)"
                className="mt-3"
              />
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Generate button */}
      <Button
        type="submit"
        size="lg"
        className="w-full gap-2"
        disabled={isLoading}
      >
        <Sparkles className="w-5 h-5" />
        {isLoading ? 'Генерация...' : 'Сгенерировать'}
      </Button>
    </form>
  );
}
