// Next Imports
import { Button } from '@/components/ui/button';
import { useSettingsContext } from '@/contexts/settings-context';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Home() {
  const [settings, setSettings] = useSettingsContext();

  useEffect(() => {
    if (
      settings.appearance.theme.includes('default') ||
      !settings.streams.headerItems
    ) {
      setSettings((old) => {
        const newSettings = old;

        newSettings.appearance.theme = 'dark';
        newSettings.streams.headerItems = [
          'mute',
          'fullscreen',
          'chat',
          'reload',
        ];

        return newSettings;
      });

      window.location.reload();
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center py-24">
      <header>
        <h1 className="mb-2 text-3xl font-bold">
          MultiQSMP{' '}
          <strong className="text-primary underline decoration-wavy">
            Beta
          </strong>
        </h1>
        <div className="grid grid-cols-2 justify-items-center gap-4 gap-y-1">
          <h2 className="text-primary">Bem-vindo</h2>
          <h2 className="text-primary">Bienvenido</h2>
          <h2 className="text-primary">Welcome</h2>
          <h2 className="text-primary">Bienvenu</h2>
        </div>
      </header>
      <main className="mt-8 flex-1">
        <div className="grid grid-cols-2 gap-8 gap-y-4">
          <Button
            variant="ghost"
            asChild
            className="flex h-fit flex-col items-center p-4"
          >
            <Link href="/pt">
              <Image
                src="/br.svg"
                alt="Bandeira do Brasil"
                width={96}
                height={72}
                className="aspect-[4/3] w-24 rounded-md sm:w-32"
              />
              <span className="mt-2">Português</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="pointer-events-none flex h-fit flex-col items-center p-4 opacity-30"
            disabled
          >
            <Link href="" className="bg-transparent text-center">
              <div className="relative">
                <Image
                  src="/mx.svg"
                  alt="Bandeira do Mexico"
                  width={96}
                  height={72}
                  className="clip diag-bottom aspect-[4/3] w-24 rounded-md sm:w-32"
                />
                <Image
                  src="/es.svg"
                  alt="Bandeira da Espanha"
                  width={96}
                  height={72}
                  className="diag-top absolute inset-0 aspect-[4/3] w-24 rounded-md sm:w-32"
                />
              </div>
              <span className="mt-2 block">Español</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="pointer-events-none flex h-fit flex-col items-center p-4 opacity-30"
            disabled
          >
            <Link href="" className="bg-transparent text-center">
              <Image
                src="/us.svg"
                alt="Bandeira dos Estados Unidos"
                width={96}
                height={72}
                className="aspect-[4/3] w-24 rounded-md sm:w-32"
              />
              <span className="mt-2 block">English</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="pointer-events-none flex h-fit flex-col items-center p-4 opacity-30"
            disabled
          >
            <Link href="" className="bg-transparent text-center">
              <Image
                src="/fr.svg"
                alt="Bandeira da França"
                width={96}
                height={72}
                className="aspect-[4/3] w-24 rounded-md sm:w-32"
              />
              <span className="mt-2 block">Français</span>
            </Link>
          </Button>
        </div>
      </main>
      <footer className="w-full justify-center p-8">
        <p className="text-cold-purple-200 text-center text-sm [text-wrap:balance]">
          Feito com 💜 por{' '}
          <Link
            href="https://twitter.com/feeeyli"
            className="text-[#FFA4CF] underline"
          >
            Feyli
          </Link>
          , para toda comunidade do QSMP!
        </p>
      </footer>
    </div>
  );
}
