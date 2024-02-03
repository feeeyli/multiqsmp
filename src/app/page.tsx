'use client';

// Next Imports
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/settings-context';
import { getAppVariant } from '@/utils/getAppVariant';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

const textVariants = {
  qsmp: ['MultiQSMP', 'Bem-vindo', 'Bienvenido', 'Welcome', 'Bienvenu'],
  frogg: ['MultiFrogg', 'Bem-vindo', 'Bienvenido', 'Welcome', 'Bienvenu'],
  purgatory: [
    'MultiQSMP Purgatory',
    'Bem-vindo, pecador',
    'Bienvenido, pecador',
    'Welcome, sinner',
    'Bienvenue, pécheur',
  ],
};

export default function Home() {
  const [settings, setSettings] = useSettings();

  useEffect(() => {
    if (
      settings.appearance.theme.includes('default') ||
      !settings.streams.headerItems ||
      settings.streams.headerItems.some((h) => h.includes('move-'))
    ) {
      setSettings((old) => {
        const newSettings = old;

        newSettings.appearance.theme = 'dark';
        if (!settings.streams.headerItems)
          newSettings.streams.headerItems = [
            'mute',
            'fullscreen',
            'chat',
            'reload',
          ];

        if (settings.streams.headerItems.some((h) => h.includes('move-')))
          newSettings.streams.headerItems =
            newSettings.streams.headerItems.filter(
              (hi) => !hi.includes('move-'),
            );

        return newSettings;
      });

      window.location.reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const t = textVariants[getAppVariant()];

  const getHref = (locale: string) => {
    if (getAppVariant() !== 'purgatory') return locale;

    return getAppVariant() + locale;
  };

  return (
    <div className="flex min-h-dvh flex-col items-center py-24">
      <header className="text-center">
        <h1 className="mb-2 text-3xl font-bold">{t[0]}</h1>
        <div className="grid grid-cols-2 justify-items-center gap-4 gap-y-1">
          <span className="text-primary">{t[1]}</span>
          <span className="text-primary">{t[2]}</span>
          <span className="text-primary">{t[3]}</span>
          <span className="text-primary">{t[4]}</span>
        </div>
      </header>
      <main className="mt-8 flex flex-1 flex-col items-center gap-14">
        <div className="data-[of=false]:grid grid-cols-2 gap-8 gap-y-4" data-of={getAppVariant() !== "frogg"}>
          {getAppVariant() === "frogg" &&
            <>
              <Button
                variant="ghost"
                asChild
                className="flex h-fit flex-col items-center p-4"
              >
                <Link href={getHref('/pt')}>
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
                className="flex h-fit flex-col items-center p-4"
              >
                <Link href={getHref('/es')} className="bg-transparent text-center">
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
                className="flex h-fit flex-col items-center p-4"
              >
                <Link href={getHref('/en')} className="bg-transparent text-center">
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
            </>
          }
          <Button
            variant="ghost"
            asChild
            className="flex h-fit flex-col items-center p-4"
          >
            <Link href={getHref('/fr')} className="bg-transparent text-center">
              <Image
                src="/fr.svg"
                alt="Bandeira da França"
                width={96}
                height={72}
                className="aspect-[4/3] w-24 rounded-md data-[of=false]:sm:w-32 data-[of=true]:w-48"
                data-of={getAppVariant() !== "frogg"}
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
            target="_blank"
          >
            Feyli
          </Link>
          , para toda comunidade do QSMP e da Frogg!
        </p>
      </footer>
    </div>
  );
}
