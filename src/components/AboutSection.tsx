import { Info, Calculator, CheckCircle2, Lightbulb } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function AboutSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-8">
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full gap-2">
          <Info className="w-4 h-4" />
          О генераторе
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-4 p-6 bg-card rounded-lg border border-border space-y-6 animate-fade-in">
          {/* Task description */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Задание №16 — Проценты и вклады</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Это задание ЕГЭ по математике (базовый уровень) проверяет умение решать 
              практические задачи на проценты с использованием формулы сложных процентов. 
              Выбрано для генератора, потому что задачи строго алгоритмизируемы и легко 
              проверяются на корректность.
            </p>
          </section>

          {/* Math formula */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-warning" />
              <h3 className="font-semibold text-lg">Математическая основа</h3>
            </div>
            <div className="formula-block mb-3">
              A = P × (1 + r/100)ⁿ
            </div>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li><strong>P</strong> — начальная сумма вклада (руб.)</li>
              <li><strong>r</strong> — годовая процентная ставка (%)</li>
              <li><strong>n</strong> — срок вклада (лет)</li>
              <li><strong>A</strong> — итоговая сумма на счёте (руб.)</li>
            </ul>
          </section>

          {/* Integer guarantee */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <h3 className="font-semibold text-lg">Гарантия целочисленности</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Чтобы избежать дробных рублей в ответах, генератор использует специальный 
              алгоритм подбора параметров:
            </p>
            <div className="formula-block text-sm">
              P = k × 100ⁿ → A = k × (100+r)ⁿ
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              При таком выборе P и A всегда будут целыми числами.
            </p>
          </section>

          {/* Templates */}
          <section>
            <h3 className="font-semibold text-lg mb-3">Шаблоны задач</h3>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>
                <strong>Найти сумму через n лет</strong> — классическая задача на применение 
                формулы сложных процентов
              </li>
              <li>
                <strong>Найти начальную сумму</strong> — обратная задача, требует выражения P
              </li>
              <li>
                <strong>Найти процентную ставку</strong> — сложный шаблон с подбором ставки 
                из фиксированного набора; генератор гарантирует, что подходит только одна ставка
              </li>
            </ol>
          </section>

          {/* Rate sets */}
          <section>
            <h3 className="font-semibold text-lg mb-3">Наборы ставок по сложности</h3>
            <div className="grid gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="difficulty-badge difficulty-easy">Лёгкая</span>
                <span className="font-mono">5%, 10%, 15%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="difficulty-badge difficulty-medium">Средняя</span>
                <span className="font-mono">4%, 6%, 8%, 12%, 16%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="difficulty-badge difficulty-hard">Сложная</span>
                <span className="font-mono">3%, 5%, 7%, 9%, 11%, 13%, 15%</span>
              </div>
            </div>
          </section>

          {/* Reproducibility */}
          <section>
            <h3 className="font-semibold text-lg mb-3">Воспроизводимость</h3>
            <p className="text-sm text-muted-foreground">
              При использовании опции seed генератор выдаёт одинаковые задачи при одинаковых 
              настройках. Это полезно для создания вариантов контрольных работ или повторной 
              генерации тех же задач.
            </p>
          </section>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
