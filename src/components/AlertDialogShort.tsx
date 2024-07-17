import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { ShortUrlEntry } from '@/types/shortURLentry';
import { CopyIcon } from '@radix-ui/react-icons';
import ImageFallback from './ImageFallback';
import InputWithCopyIcon from './InputWithCopy';
import QRCodeGenerator from './QRCode';

type AlertDialogDemoProps = {
  open: boolean;
  data: Partial<ShortUrlEntry>;
  handleIconClick: () => void;
  setOpen: (open: boolean) => void;
  handleCopyAndClose: () => void;
};

export function AlertDialogShort({
  open,
  data,
  handleIconClick,
  setOpen,
  handleCopyAndClose,
}: AlertDialogDemoProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Enlace generado exitosamente</AlertDialogTitle>
          <AlertDialogDescription className="flex items-center gap-4 ">
            {data.logo && (
              <ImageFallback
                data={{ logo: data.logo, title: data.title || '' }}
              />
            )}
            {data.description || 'Sin descripción'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <InputWithCopyIcon
          value={data.shortURL}
          readOnly
          iconClick={handleIconClick}
        />
        <AlertDialogFooter className="flex justify-between items-center  ">
          <QRCodeGenerator content={`http://localhost:4321/${data.shortURL}`} />
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cerrar
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleCopyAndClose}>
            <CopyIcon /> Copiar y cerrar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
