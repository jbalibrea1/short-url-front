import { cn } from '@/utils/cn';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
const generateRandomWord = (length: number): string => {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

const generateRandomWords = (count: number, wordLength: number): string[] => {
  const words = [];
  for (let i = 0; i < count; i++) {
    words.push(generateRandomWord(wordLength));
  }
  return words;
};

export const FlipWords = ({
  duration = 3000,
  className,
}: {
  duration?: number;
  className?: string;
}) => {
  // const [currentWord, setCurrentWord] = useState(0);
  // const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const words = generateRandomWords(6, 8); // Genera 4 palabras aleatorias de 10 caracteres
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const startAnimation = useCallback(() => {
    setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
  }, [words.length]);
  useEffect(() => {
    const intervalId = setInterval(startAnimation, 3000);
    return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar
  }, [startAnimation]);
  generateRandomWords(4, 10);

  return (
    <AnimatePresence onExitComplete={() => {}}>
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
          ease: 'easeInOut',
          type: 'spring',
          stiffness: 100,
          damping: 10,
        }}
        exit={{
          opacity: 0,
          y: -40,
          x: 40,
          filter: 'blur(8px)',
          scale: 2,
          position: 'absolute',
        }}
        className={cn(
          'z-10 inline-block relative text-left text-neutral-900 dark:text-neutral-100',
          className
        )}
        key={words[currentWordIndex] + currentWordIndex}
      >
        <motion.span
          key={words[currentWordIndex]}
          initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            delay: currentWordIndex * 0.08,
            duration: 0.4,
          }}
          className="inline-block"
        >
          {words[currentWordIndex]}
        </motion.span>
      </motion.div>
    </AnimatePresence>
  );
};
