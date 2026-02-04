// Problem Generator for EGE Math Task #16 (Compound Interest)
// No neural networks - pure algorithmic generation with integer results

export type Difficulty = 'easy' | 'medium' | 'hard';
export type Template = 'find_final' | 'find_initial' | 'find_rate';

export interface GeneratorSettings {
  count: number;
  difficulty: Difficulty;
  template: Template;
  seed?: number;
}

export interface Problem {
  id: number;
  condition: string;
  answer: string;
  solution: string[];
  difficulty: Difficulty;
  template: Template;
  params: {
    P: number;
    A: number;
    r: number;
    n: number;
  };
}

// Rate sets by difficulty
const RATE_SETS: Record<Difficulty, number[]> = {
  easy: [5, 10, 15],
  medium: [4, 6, 8, 12, 16],
  hard: [3, 5, 7, 9, 11, 13, 15],
};

// Year ranges by difficulty
const YEAR_RANGES: Record<Difficulty, { min: number; max: number }> = {
  easy: { min: 1, max: 2 },
  medium: { min: 1, max: 3 },
  hard: { min: 2, max: 4 },
};

// K multiplier ranges by difficulty (for principal amount)
const K_RANGES: Record<Difficulty, { min: number; max: number }> = {
  easy: { min: 1, max: 10 },
  medium: { min: 5, max: 50 },
  hard: { min: 10, max: 100 },
};

// Seeded random number generator (mulberry32)
function createRandom(seed: number): () => number {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Get random integer in range [min, max]
function randInt(random: () => number, min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

// Pick random element from array
function pickRandom<T>(random: () => number, arr: T[]): T {
  return arr[Math.floor(random() * arr.length)];
}

// Format number with Russian thousands separator
function formatNumber(n: number): string {
  return n.toLocaleString('ru-RU');
}

// Get year word form in Russian
function getYearWord(n: number): string {
  const lastTwo = n % 100;
  const lastOne = n % 10;
  
  if (lastTwo >= 11 && lastTwo <= 14) return 'лет';
  if (lastOne === 1) return 'год';
  if (lastOne >= 2 && lastOne <= 4) return 'года';
  return 'лет';
}

// Calculate (100 + r)^n
function calcMultiplier(r: number, n: number): number {
  return Math.pow(100 + r, n);
}

// Calculate 100^n
function calcDivisor(n: number): number {
  return Math.pow(100, n);
}

// Generate problem for "Find final amount" template
function generateFindFinal(
  random: () => number,
  difficulty: Difficulty
): Problem['params'] & { valid: boolean } {
  const rates = RATE_SETS[difficulty];
  const yearRange = YEAR_RANGES[difficulty];
  const kRange = K_RANGES[difficulty];
  
  const n = randInt(random, yearRange.min, yearRange.max);
  const r = pickRandom(random, rates);
  const k = randInt(random, kRange.min, kRange.max);
  
  // P = k * 100^n ensures A = k * (100+r)^n is integer
  const P = k * calcDivisor(n);
  const A = k * calcMultiplier(r, n);
  
  return { P, A, r, n, valid: true };
}

// Generate problem for "Find initial amount" template
function generateFindInitial(
  random: () => number,
  difficulty: Difficulty
): Problem['params'] & { valid: boolean } {
  const rates = RATE_SETS[difficulty];
  const yearRange = YEAR_RANGES[difficulty];
  const kRange = K_RANGES[difficulty];
  
  const n = randInt(random, yearRange.min, yearRange.max);
  const r = pickRandom(random, rates);
  const k = randInt(random, kRange.min, kRange.max);
  
  // A = k * (100+r)^n, P = k * 100^n — both are integers
  const A = k * calcMultiplier(r, n);
  const P = k * calcDivisor(n);
  
  return { P, A, r, n, valid: true };
}

// Generate problem for "Find rate" template (hard mode)
function generateFindRate(
  random: () => number,
  difficulty: Difficulty
): Problem['params'] & { valid: boolean } {
  const rates = RATE_SETS[difficulty];
  const yearRange = YEAR_RANGES[difficulty];
  const kRange = K_RANGES[difficulty];
  
  const n = randInt(random, yearRange.min, yearRange.max);
  const targetRate = pickRandom(random, rates);
  const k = randInt(random, kRange.min, kRange.max);
  
  const P = k * calcDivisor(n);
  const A = k * calcMultiplier(targetRate, n);
  
  // Verify uniqueness: only one rate from the set should produce this A
  let matchingRates = 0;
  for (const r of rates) {
    const testA = k * calcMultiplier(r, n);
    if (testA === A) matchingRates++;
  }
  
  // Should match exactly one (the target rate)
  if (matchingRates !== 1) {
    return { P, A, r: targetRate, n, valid: false };
  }
  
  return { P, A, r: targetRate, n, valid: true };
}

// Build condition text
function buildCondition(template: Template, params: Problem['params']): string {
  const { P, A, r, n } = params;
  const yearWord = getYearWord(n);
  
  switch (template) {
    case 'find_final':
      return `В банк внесли ${formatNumber(P)} рублей под ${r}% годовых. Проценты начисляются один раз в конце года и присоединяются к вкладу. Какой станет сумма на счёте через ${n} ${yearWord}?`;
    
    case 'find_initial':
      return `Вкладчик положил в банк некоторую сумму под ${r}% годовых. Проценты начисляются один раз в конце года и присоединяются к вкладу. Через ${n} ${yearWord} сумма на счёте составила ${formatNumber(A)} рублей. Какую сумму вкладчик положил в банк первоначально?`;
    
    case 'find_rate':
      return `В банк внесли ${formatNumber(P)} рублей. Проценты начисляются один раз в конце года и присоединяются к вкладу. Через ${n} ${yearWord} сумма на счёте составила ${formatNumber(A)} рублей. Под какой процент годовых был открыт вклад?`;
  }
}

// Build answer text
function buildAnswer(template: Template, params: Problem['params']): string {
  const { P, A, r } = params;
  
  switch (template) {
    case 'find_final':
      return `${formatNumber(A)} рублей`;
    case 'find_initial':
      return `${formatNumber(P)} рублей`;
    case 'find_rate':
      return `${r}%`;
  }
}

// Build step-by-step solution
function buildSolution(template: Template, params: Problem['params']): string[] {
  const { P, A, r, n } = params;
  const steps: string[] = [];
  
  switch (template) {
    case 'find_final': {
      steps.push('Используем формулу сложных процентов: A = P × (1 + r/100)ⁿ');
      steps.push(`Где P = ${formatNumber(P)} руб., r = ${r}%, n = ${n}`);
      steps.push(`Подставляем: A = ${formatNumber(P)} × (1 + ${r}/100)^${n}`);
      steps.push(`A = ${formatNumber(P)} × (${(100 + r) / 100})^${n}`);
      
      // Show year-by-year calculation
      let current = P;
      for (let i = 1; i <= n; i++) {
        current = current * (100 + r) / 100;
        steps.push(`После ${i}-го года: ${formatNumber(P)} × (${100 + r}/100)^${i} = ${formatNumber(current)} руб.`);
      }
      
      steps.push(`Ответ: ${formatNumber(A)} рублей`);
      break;
    }
    
    case 'find_initial': {
      steps.push('Используем формулу сложных процентов: A = P × (1 + r/100)ⁿ');
      steps.push('Выразим P: P = A / (1 + r/100)ⁿ');
      steps.push(`Где A = ${formatNumber(A)} руб., r = ${r}%, n = ${n}`);
      steps.push(`Вычислим множитель: (1 + ${r}/100)^${n} = (${(100 + r) / 100})^${n}`);
      
      const multiplier = calcMultiplier(r, n);
      const divisor = calcDivisor(n);
      steps.push(`(${100 + r}/100)^${n} = ${formatNumber(multiplier)}/${formatNumber(divisor)}`);
      steps.push(`P = ${formatNumber(A)} × ${formatNumber(divisor)}/${formatNumber(multiplier)}`);
      steps.push(`P = ${formatNumber(A * divisor)}/${formatNumber(multiplier)}`);
      steps.push(`P = ${formatNumber(P)} рублей`);
      steps.push(`Ответ: ${formatNumber(P)} рублей`);
      break;
    }
    
    case 'find_rate': {
      steps.push('Используем формулу сложных процентов: A = P × (1 + r/100)ⁿ');
      steps.push(`Известно: P = ${formatNumber(P)} руб., A = ${formatNumber(A)} руб., n = ${n}`);
      steps.push('Найдём отношение: A/P = (1 + r/100)ⁿ');
      steps.push(`${formatNumber(A)}/${formatNumber(P)} = (1 + r/100)^${n}`);
      
      const ratio = A / P;
      steps.push(`${ratio} = (1 + r/100)^${n}`);
      steps.push(`Извлечём корень ${n}-й степени: ${Math.pow(ratio, 1/n).toFixed(2)} = 1 + r/100`);
      steps.push(`Или используем подбор из стандартных ставок:`);
      
      // Show check for different rates
      const rates = RATE_SETS.hard;
      for (const testR of rates) {
        const testA = P * calcMultiplier(testR, n) / calcDivisor(n);
        const match = testA === A ? ' ✓' : '';
        steps.push(`  При r = ${testR}%: A = ${formatNumber(P)} × (${100 + testR}/100)^${n} = ${formatNumber(testA)}${match}`);
      }
      
      steps.push(`Ответ: ${r}%`);
      break;
    }
  }
  
  return steps;
}

// Main generation function
export function generateProblems(settings: GeneratorSettings): Problem[] {
  const { count, difficulty, template, seed } = settings;
  
  // Use provided seed or generate random one
  const actualSeed = seed ?? Math.floor(Math.random() * 1000000);
  const random = createRandom(actualSeed);
  
  const problems: Problem[] = [];
  let attempts = 0;
  const maxAttempts = 200;
  
  while (problems.length < count && attempts < maxAttempts) {
    attempts++;
    
    let result: Problem['params'] & { valid: boolean };
    
    switch (template) {
      case 'find_final':
        result = generateFindFinal(random, difficulty);
        break;
      case 'find_initial':
        result = generateFindInitial(random, difficulty);
        break;
      case 'find_rate':
        result = generateFindRate(random, difficulty);
        break;
    }
    
    if (!result.valid) continue;
    
    const { P, A, r, n } = result;
    
    // Check for duplicates
    const isDuplicate = problems.some(
      p => p.params.P === P && p.params.A === A && 
           p.params.r === r && p.params.n === n
    );
    
    if (isDuplicate) continue;
    
    const problem: Problem = {
      id: problems.length + 1,
      condition: buildCondition(template, { P, A, r, n }),
      answer: buildAnswer(template, { P, A, r, n }),
      solution: buildSolution(template, { P, A, r, n }),
      difficulty,
      template,
      params: { P, A, r, n },
    };
    
    problems.push(problem);
  }
  
  return problems;
}

// Template descriptions for UI
export const TEMPLATE_INFO: Record<Template, { title: string; description: string }> = {
  find_final: {
    title: 'Найти сумму через n лет',
    description: 'Дано: начальная сумма P, ставка r%, срок n лет. Найти: конечную сумму A.',
  },
  find_initial: {
    title: 'Найти начальную сумму',
    description: 'Дано: конечная сумма A, ставка r%, срок n лет. Найти: начальную сумму P.',
  },
  find_rate: {
    title: 'Найти процентную ставку',
    description: 'Дано: начальная сумма P, конечная сумма A, срок n лет. Найти: ставку r%. (Сложный шаблон)',
  },
};

// Difficulty descriptions for UI
export const DIFFICULTY_INFO: Record<Difficulty, { title: string; description: string; rates: string }> = {
  easy: {
    title: 'Лёгкая',
    description: 'Простые числа, 1-2 года',
    rates: RATE_SETS.easy.join(', '),
  },
  medium: {
    title: 'Средняя',
    description: 'Умеренные числа, 1-3 года',
    rates: RATE_SETS.medium.join(', '),
  },
  hard: {
    title: 'Сложная',
    description: 'Большие числа, 2-4 года',
    rates: RATE_SETS.hard.join(', '),
  },
};
