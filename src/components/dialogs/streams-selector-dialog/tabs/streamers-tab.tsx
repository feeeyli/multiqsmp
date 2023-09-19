// React Imports
import { useContext } from 'react';

// Data Imports
import { STREAMERS } from '@/data/streamers';

// Components Imports
import { TabsContent } from '@/components/ui/tabs';
import { Streamer } from '../streamer';

// Contexts Import
import { StreamsSelectorDialogContext } from '@/components/dialogs/streams-selector-dialog/streams-selector-dialog-context';

export const StreamersTab = () => {
  const { selectedStreamers } = useContext(StreamsSelectorDialogContext);

  return (
    <TabsContent
      value="streamers"
      className="flex max-h-80 flex-wrap justify-center gap-2 overflow-y-auto scrollbar"
    >
      {STREAMERS.map((streamer) => (
        <Streamer
          key={streamer.twitchName}
          streamer={streamer}
          selected={selectedStreamers.value.includes(streamer.twitchName)}
        />
      ))}
    </TabsContent>
  );
};
