import { FlipWords } from './ui/flip-words';

export function FlipWordsAcorta() {
  const words = ['tWCFTe5wIR', 'uxF1ewwIg'];

  return (
    <div className="flex items-center max-w-full pb-5 relative overflow-hidden">
      <div className="scroll-m-20 text-xl md:text-4xl lg:text-5xl font-extrabold tracking-tight tex2t-primary/80 dark:text2-primary/80  ">
        /
        <FlipWords
          words={words}
          duration={1000}
          className="text-amber-400 dark:text-amber-300"
        />
      </div>
    </div>
  );
}
