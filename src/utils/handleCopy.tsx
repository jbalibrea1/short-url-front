import { ToastAction } from '../components/ui/toast';

const handleCopy = (urlToCopy: string, toast: any) => {
  navigator.clipboard
    .writeText(urlToCopy)
    .then(() => {
      toast({
        description: 'Enlace copiado',
      });
    })
    .catch((error) => {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error al copiar el enlace',
        description: 'Por favor, intenta de nuevo.',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    });
};

export default handleCopy;
