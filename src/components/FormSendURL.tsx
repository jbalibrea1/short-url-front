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
import { useToast } from '@/hooks/use-toast';
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
const formSchema = z.object({
  url: z
    .string()
    .min(2, {
      message: 'URL no válida',
    })
    .url({
      message: 'URL no válida',
    }),
});

export function FormSendURL() {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<Partial<ShortUrlEntry>>({});
  const { toast } = useToast();

  const URL_API = 'http://localhost:8080/api/shorturl';

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
      const res = await fetch(URL_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al acortar la URL');
      setData({ ...data, shortURL: `http://localhost:4321/${data.shortURL}` });
      toast({
        title: 'Enlace generado exitosamente',
        description: `${new Date().toLocaleDateString(
          'es-ES'
        )} - ${new Date().toLocaleTimeString()}`,
      });
      setOpen(true);
      form.reset();
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      toast({
        variant: 'destructive',
        title: 'Error al generar el enlace',
        description: message,
        action: (
          <ToastAction
            altText="Reintentar"
            onClick={form.handleSubmit(onSubmit)}
          >
            Reintentar
          </ToastAction>
        ),
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
                method="POST"
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
            </CardHeader>
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
                  <Button type="submit">Personalizar QR</Button>
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
