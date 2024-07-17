import { zodResolver } from '@hookform/resolvers/zod';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { ShortUrlEntry } from '@/types/shortURLentry';
import handleCopy from '@/utils/handleCopy';
import { useState } from 'react';
import { AlertDialogShort } from './AlertDialogShort';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ToastAction } from './ui/toast';
import { useToast } from './ui/use-toast';
const formSchema = z.object({
  url: z.string().min(2, {
    message: 'URL no válida',
  }),
});

export function FormSendURL() {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<Partial<ShortUrlEntry>>({});
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  });

  const handleCopyAndClose = () => {
    if (data.shortURL) {
      handleCopy(data.shortURL, toast);
    }
    setOpen(false);
  };

  const handleIconClick = () => {
    if (data.shortURL) {
      handleCopy(data.shortURL, toast);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'URL no encontrada',
      });
    }
  };

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      if (!values.url) throw new Error('URL no válida');
      const res = await fetch('http://localhost:8080/shorturl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      setData({ ...data, shortURL: `http://localhost:4321/${data.shortURL}` });
      toast({
        title: 'Enlace generado exitosamente',
        description: `${new Date().toLocaleDateString(
          'es-ES'
        )} - ${new Date().toLocaleTimeString()}`,
        // action: (
        //   <ToastAction
        //     altText="Copiar enlace"
        //     onClick={() => handleCopy(data.shortURL, toast)}
        //   >
        //     <CopyIcon />
        //   </ToastAction>
        // ),
      });
      setOpen(true);
      // action: {
      //     label: 'Undo',
      //     onClick: () => console.log('Undo'),
      //   },
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error al generar el enlace',
        description: 'Por favor, intenta de nuevo.',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url">Crear URL acortada</TabsTrigger>
          <TabsTrigger value="qr" disabled>
            Personalizar QR
          </TabsTrigger>
        </TabsList>
        <TabsContent value="url">
          <Card>
            <CardHeader>
              <CardTitle>Acorta tu URL</CardTitle>
              <CardDescription>
                Genera un enlace único para compartirlo fácilmente y con código
                QR.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <CardContent className="px-6 py-0">
                  <div className="grid w-full items-center gap-4">
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Escribe la url a acortar</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com"
                              {...field}
                              disabled={loading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={loading} className="relative">
                    {loading && (
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin absolute top-50 left-50 ml-3" />
                    )}
                    Generar enlace
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        <TabsContent value="qr">
          <Card>
            <CardHeader>
              <CardTitle>Crea un enlace único</CardTitle>
              <CardDescription>
                Genera un enlace único para compartirlo fácilmente.
              </CardDescription>
            </CardHeader>{' '}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <CardContent>
                  <div className="grid w-full items-center gap-4">
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Escribe la url a acortar</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit">Generar enlace</Button>
                  <Button
                    onClick={() =>
                      toast({
                        variant: 'destructive',
                        title: 'Error al generar el enlace',
                        description: 'Por favor, intenta de nuevo.',
                        action: (
                          <ToastAction altText="Try again">
                            Try again
                          </ToastAction>
                        ),
                      })
                    }
                  >
                    toast test
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
      <AlertDialogShort
        open={open}
        data={data}
        handleIconClick={handleIconClick}
        setOpen={setOpen}
        handleCopyAndClose={handleCopyAndClose}
      />
    </>
  );
}
