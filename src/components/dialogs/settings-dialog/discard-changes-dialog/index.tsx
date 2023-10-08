import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useTranslations } from 'next-intl';
import { MouseEventHandler, ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SettingsType } from '..';

interface DiscardChangesDialogProps {
  form: UseFormReturn<SettingsType>;
  children: ReactNode;
}

export const DiscardChangesDialog = (props: DiscardChangesDialogProps) => {
  const hasChanges = props.form.formState.isDirty;

  return (
    <AlertDialog open={hasChanges ? undefined : false}>
      {props.children}
    </AlertDialog>
  );
};

interface DiscardChangesDialogTriggerProps {
  children: ReactNode;
}

export const DiscardChangesDialogTrigger = (
  props: DiscardChangesDialogTriggerProps,
) => {
  return <AlertDialogTrigger asChild>{props.children}</AlertDialogTrigger>;
};

interface DiscardChangesDialogContentProps {
  children: ReactNode;
  cancel?: ReactNode;
  confirm: ReactNode;
}

export const DiscardChangesDialogContent = (
  props: DiscardChangesDialogContentProps,
) => {
  const t = useTranslations('discard-changes');

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{t('title')}</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogDescription>{props.children}</AlertDialogDescription>
      <AlertDialogFooter>
        <AlertDialogCancel asChild={!!props.cancel}>
          {props.cancel || t('cancel')}
        </AlertDialogCancel>
        <AlertDialogAction asChild>{props.confirm}</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
