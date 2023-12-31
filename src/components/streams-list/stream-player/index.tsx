// React Imports
import { useContext } from 'react';

// Next Imports
import { useSearchParams } from 'next/navigation';

// Libs Imports
import ReactPlayer from 'react-player';
import { cva } from 'class-variance-authority';
import { useMediaQuery } from 'usehooks-ts';

// Contexts Imports
import { StreamPlayerControlsContext } from './stream-player-controls-context';

// Scripts Imports
import { getStreamUrl } from '@/utils/getStreamUrl';
import { useSearchParamsStates } from '@/utils/useSearchParamsState';

// Components Imports
import { StreamPlayerHeader } from './stream-player-header';
import { getColumns } from '@/utils/getColumns';
import { getStreamsGridSize } from '@/utils/getStreamsGridSize';
import { useSettingsContext } from '@/contexts/settings-context';

interface Props {
  channel: string;
  isMoving: boolean;
  groupName?: string;
}

export const StreamPlayer = ({ channel, ...props }: Props) => {
  const searchParams = useSearchParams();
  const streamPlayerControls = useContext(StreamPlayerControlsContext);
  const { streams } = useSearchParamsStates();
  const isDesktop = !useMediaQuery('(max-width: 640px)');
  const [
    {
      streams: { movableMode, useHandleAsHeader: useHandleAsHeaderSet },
    },
  ] = useSettingsContext();

  const playerStyleVariants = cva('inset-0 flex-grow overflow-hidden', {
    variants: {
      fullScreen: {
        true: 'absolute z-20',
        false: 'relative z-0',
      },
      moving: {
        true: 'pointer-events-none',
      },
      movableMode: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      fullScreen: false,
    },
  });

  const useHandleAsHeader =
    streamPlayerControls.fullScreen.value || !movableMode
      ? false
      : useHandleAsHeaderSet;

  return (
    <>
      {movableMode && (
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
      )}
      <div
        className={playerStyleVariants({
          fullScreen: streamPlayerControls.fullScreen.value,
          moving: props.isMoving,
          movableMode,
        })}
        style={
          movableMode
            ? undefined
            : {
                width: streamPlayerControls.fullScreen.value
                  ? 'auto'
                  : `${
                      100 /
                      getColumns(
                        streams.length,
                        isDesktop,
                        !!searchParams.get('chats'),
                      )
                    }%`,
              }
        }
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
        <ReactPlayer
          className="!h-full !w-full"
          url={`https://player.twitch.tv/${channel}`}
          muted={streamPlayerControls.muted.value}
          playing
          controls
          key={streamPlayerControls.refresh.key}
        />
      </div>
    </>
  );
};
