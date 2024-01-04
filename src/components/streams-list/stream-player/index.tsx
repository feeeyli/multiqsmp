// React Imports
import { useContext } from 'react';

// Next Imports

// Libs Imports
import { cva } from 'class-variance-authority';
import ReactPlayer from 'react-player';

// Contexts Imports
import { StreamPlayerControlsContext } from './stream-player-controls-context';

// Scripts Imports

// Components Imports
import { useSettingsContext } from '@/contexts/settings-context';
import { StreamPlayerHeader } from './stream-player-header';

interface Props {
  channel: string;
  isMoving: boolean;
  groupName?: string;
}

const DEBUG_MODE = false;

export const StreamPlayer = ({ channel, ...props }: Props) => {
  const streamPlayerControls = useContext(StreamPlayerControlsContext);
  const [
    {
      streams: { useHandleAsHeader: useHandleAsHeaderSet },
    },
  ] = useSettingsContext();

  const playerStyleVariants = cva('inset-0 flex-grow overflow-hidden w-full', {
    variants: {
      fullScreen: {
        true: 'absolute z-20',
        false: 'relative z-0',
      },
      moving: {
        true: 'pointer-events-none',
      },
    },
    defaultVariants: {
      fullScreen: false,
    },
  });

  const useHandleAsHeader = streamPlayerControls.fullScreen.value
    ? false
    : useHandleAsHeaderSet;

  return (
    <>
      <div
        className={`flex h-7 w-full cursor-move data-[use-handle-as-header=true]:h-7 sm:h-3 ${
          useHandleAsHeader ? '' : 'handle'
        }`}
        data-use-handle-as-header={useHandleAsHeader}
      >
        {useHandleAsHeader && (
          <>
            <StreamPlayerHeader
              channel={channel}
              isYoutubeStream={`https://player.twitch.tv/${channel}`.includes(
                'youtube',
              )}
              groupName={props.groupName}
            />
            <div className="handle h-7 flex-grow"></div>
          </>
        )}
      </div>
      <div
        className={playerStyleVariants({
          fullScreen: streamPlayerControls.fullScreen.value,
          moving: props.isMoving,
        })}
      >
        {!useHandleAsHeader && (
          <StreamPlayerHeader
            channel={channel}
            isYoutubeStream={`https://player.twitch.tv/${channel}`.includes(
              'youtube',
            )}
            groupName={props.groupName}
          />
        )}
        {!DEBUG_MODE && (
          <ReactPlayer
            className="!h-full !w-full"
            url={`https://player.twitch.tv/${channel}`}
            muted={streamPlayerControls.muted.value}
            playing
            controls
            key={streamPlayerControls.refresh.key}
          />
        )}
        {DEBUG_MODE && (
          <div className="flex h-full w-full items-center justify-center">
            {channel}
          </div>
        )}
      </div>
    </>
  );
};
