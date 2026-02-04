import { Calculator, BookOpen } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary-foreground/10 rounded-lg">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Генератор задач ЕГЭ
            </h1>
            <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
              <BookOpen className="w-4 h-4" />
              <span>Математика (база) • Задание №16 • Проценты и вклады</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
