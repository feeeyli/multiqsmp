import Link from 'next/link';
import {
  DiscardChangesDialog,
  DiscardChangesDialogTrigger,
  DiscardChangesDialogContent,
} from '../discard-changes-dialog';
import { UseFormReturn } from 'react-hook-form';
import { SettingsType } from '..';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface ChangeLanguageProps {
  form: UseFormReturn<SettingsType>;
  lang: 'pt' | 'en' | 'es' | 'fr';
}

const FLAGS = {
  pt: (
    <Image
      src="/br.svg"
      alt="Bandeira do Brasil"
      width={96}
      height={72}
      className="aspect-[4/3] w-6 rounded-sm"
    />
  ),
  es: (
    <div className="relative">
      <Image
        src="/mx.svg"
        alt="Bandeira do Mexico"
        width={96}
        height={72}
        className="aspect-[4/3] w-6 rounded-sm"
      />
      <Image
        src="/es.svg"
        alt="Bandeira da Espanha"
        width={96}
        height={72}
        className="diag-top absolute inset-0 aspect-[4/3] w-6 rounded-sm"
      />
    </div>
  ),
  en: (
    <Image
      src="/us.svg"
      alt="Bandeira dos Estados Unidos"
      width={96}
      height={72}
      className="aspect-[4/3] w-6 rounded-sm"
    />
  ),
  fr: (
    <Image
      src="/fr.svg"
      alt="Bandeira da França"
      width={96}
      height={72}
      className="aspect-[4/3] w-6 rounded-sm"
    />
  ),
};

export const ChangeLanguage = (props: ChangeLanguageProps) => {
  const t = useTranslations('change-language');

  return (
    <DiscardChangesDialog form={props.form}>
      <DiscardChangesDialogTrigger>
        <Button
          variant="ghost"
          className="gap-2"
          asChild={!props.form.formState.isDirty}
        >
          {props.form.formState.isDirty ? (
            <>
              {FLAGS[props.lang]}
              {t(props.lang)}
            </>
          ) : (
            <Link href={'/' + props.lang}>
              {FLAGS[props.lang]}
              {t(props.lang)}
            </Link>
          )}
        </Button>
      </DiscardChangesDialogTrigger>
      <DiscardChangesDialogContent
        confirm={<Link href={'/' + props.lang}>{t('confirm')}</Link>}
      >
        {t('description').replace('((language))', t(props.lang))}
      </DiscardChangesDialogContent>
    </DiscardChangesDialog>
  );
};
