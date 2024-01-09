import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, X } from 'lucide-react';
import { OrganizeStateGroups } from '..';
import { useOrganize } from '../organize-context';
import { GroupMemberListItem } from './group-member-list-item';

type GroupListItemProps = {
  group: OrganizeStateGroups;
  first: boolean;
};

export function GroupListItem(props: GroupListItemProps) {
  const {
    groupsList: [_, setGroupsList],
  } = useOrganize();

  return (
    <Collapsible
      className="flex flex-col rounded-md border border-border px-3"
      defaultOpen={props.first}
    >
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="ghost"
          className="h-auto p-1"
          onClick={() =>
            setGroupsList((old) =>
              old.filter(
                (group) => group.simple_name !== props.group.simple_name,
              ),
            )
          }
        >
          <X size="1rem" />
        </Button>
        <CollapsibleTrigger className="group flex w-full items-center justify-between py-2">
          {props.group.display_name}
          <ChevronDown
            size="1rem"
            className="text-foreground transition-transform group-data-[state=open]:rotate-180"
          />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="flex flex-1 gap-4 data-[state=open]:pt-2">
        <Separator
          orientation="vertical"
          className="ml-3 h-auto bg-primary/60"
        />
        <ul className="scrollbar max-h-64 w-full overflow-y-auto sm:max-h-none">
          {props.group.members.map((member) => (
            <GroupMemberListItem
              key={member.twitch_name}
              member={member}
              group={props.group.simple_name}
            />
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}
