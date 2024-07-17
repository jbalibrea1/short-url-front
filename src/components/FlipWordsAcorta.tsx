import { FlipWords } from '@/components/ui/flip-words';

export function FlipWordsAcorta() {
  const words2 = ['fácil', 'rápido', 'seguro', 'gratis', 'única'];
  const words = ['tWCFTe5wIR', 'bij-6cwIg', 'zvf1ntwIg', 'uxF1ewwIg'];

  return (
    <div className="flex items-center ">
      <div
        // className="text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400"
        className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl tex2t-primary/80 dark:text2-primary/80"
      >
        acorta.ly/
        <FlipWords
          words={words}
          duration={1000}
          className="text-amber-400 dark:text-amber-300"
        />
      </div>
    </div>
  );
}
