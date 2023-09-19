// Next Imports

// Components Import
import { StreamsSelectorDialog } from '@/components/dialogs/streams-selector-dialog';

// Contexts Import
import { StreamsSelectorDialogProvider } from '@/components/dialogs/streams-selector-dialog/streams-selector-dialog-context';
import { StreamsList } from '@/components/streams-list';

export default function Streams() {
  return (
    <main className="relative flex h-screen max-h-screen w-full pr-8">
      <aside className="absolute right-0 z-10 space-y-2 py-6">
        <StreamsSelectorDialogProvider>
          <StreamsSelectorDialog />
        </StreamsSelectorDialogProvider>
      </aside>
      <StreamsList />
    </main>
  );
}
