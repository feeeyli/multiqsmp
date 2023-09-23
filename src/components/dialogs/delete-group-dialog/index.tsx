// Types Imports
import { GroupType } from '@/@types/data';

// Libs Imports
import { useTranslations } from 'next-intl';

// Icons Imports
import { Trash } from 'lucide-react';

// Components Imports
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
import { Button } from '@/components/ui/button';

// Contexts Imports
import { useCustomGroupsContext } from '@/contexts/custom-groups-context';
import { group } from 'console';

interface DeleteGroupDialogProps {
  group: GroupType;
}

export const DeleteGroupDialog = (props: DeleteGroupDialogProps) => {
  const t = useTranslations('delete-group-dialog');
  const [, setCustomGroups] = useCustomGroupsContext();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash size="1rem" />
          {t('trigger')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('description').replace('((group))', props.group.groupName)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setCustomGroups((old) =>
                old.filter(
                  (cg) => cg.simpleGroupName !== props.group.simpleGroupName,
                ),
              );
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t('confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
