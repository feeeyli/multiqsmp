import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { usePathname, useRouter } from 'next/navigation';

interface ChatProps {
  chats: string[];
  chat: string;
}

export const Chat = (props: ChatProps) => {
  const pathname = usePathname();
  const router = useRouter();

  function handleRemoveChat(chat: string) {
    const newChatList = props.chats.filter((c) => c !== chat);

    const newSearchParams = new URLSearchParams(window.location.search);

    if (newChatList.length === 0) {
      newSearchParams.delete('chats');
    } else if (newSearchParams.get('chats')) {
      newSearchParams.set('chats', newChatList.join('/'));
    } else {
      newSearchParams.append('chats', newChatList.join('/'));
    }

    router.replace(
      pathname + '?' + newSearchParams.toString().replaceAll('%2F', '/'),
    );
  }

  return (
    <div className="bg-cold-purple-900 flex flex-grow flex-col items-center">
      <div className="flex w-full items-center justify-between px-3 py-1">
        <span className="text-white">{props.chat}</span>
        <div className="flex items-center space-x-1">
          <Button
            onClick={() => handleRemoveChat(props.chat)}
            variant="ghost"
            size="sm"
          >
            <X size={20} color="#fff" />
          </Button>
        </div>
      </div>
      {/* <TwitchChat channel={props.chat} className="!w-full !h-full" /> */}
      <iframe
        src={`https://www.twitch.tv/embed/${props.chat}/chat?parent=${window.location.hostname}&darkpopout`}
        className="!h-full !w-full"
      />
    </div>
  );
};
