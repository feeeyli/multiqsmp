import { Button } from '@/components/ui/button';
import { useOrganize } from './organize-context';

export function Test() {
  const {
    groupsList: [groupsList, setGroupsList],
  } = useOrganize();

  const gg = 'Grupo 1';
  const mm = 'Membro 1';

  return (
    <>
      <Button
        onClick={() =>
          setGroupsList((old) => {
            const groupIndex = old.findIndex((g) => g.name === gg);
            const memberIndex = old[groupIndex].members.findIndex(
              (m) => m.name === mm,
            );

            old[groupIndex].members[memberIndex].isHidden =
              !old[groupIndex].members[memberIndex].isHidden;

            return old;
          })
        }
      >
        toggle
      </Button>
      <pre>{JSON.stringify(groupsList, null, 2)}</pre>
    </>
  );
}
