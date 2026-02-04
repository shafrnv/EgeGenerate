import { useState } from 'react';
import { Header } from '@/components/Header';
import { GeneratorForm } from '@/components/GeneratorForm';
import { ProblemCard } from '@/components/ProblemCard';
import { AboutSection } from '@/components/AboutSection';
import { generateProblems, type GeneratorSettings, type Problem } from '@/lib/problemGenerator';
import { FileText, AlertCircle } from 'lucide-react';

const Index = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = (settings: GeneratorSettings) => {
    setIsLoading(true);
    
    // Simulate slight delay for UX
    setTimeout(() => {
      const generated = generateProblems(settings);
      setProblems(generated);
      setHasGenerated(true);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[380px_1fr] gap-8">
          {/* Settings panel */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">Настройки генератора</h2>
              <p className="text-sm text-muted-foreground">
                Выберите параметры и нажмите «Сгенерировать»
              </p>
            </div>
            <GeneratorForm onGenerate={handleGenerate} isLoading={isLoading} />
            <AboutSection />
          </aside>

          {/* Results panel */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Сгенерированные задачи
              </h2>
              {problems.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  ({problems.length})
                </span>
              )}
            </div>

            {!hasGenerated ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Задачи ещё не сгенерированы
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Выберите настройки слева и нажмите «Сгенерировать», 
                  чтобы создать набор задач на проценты и вклады.
                </p>
              </div>
            ) : problems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Не удалось сгенерировать задачи
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Попробуйте изменить настройки или уменьшить количество задач.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {problems.map((problem, index) => (
                  <ProblemCard key={problem.id} problem={problem} index={index} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-sm text-muted-foreground text-center">
            Генератор задач ЕГЭ по математике • Задание №16 • 
            Алгоритмическая генерация без использования нейросетей
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
