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
import { ResizableHandle } from '@/components/ui/resizable';
import { useSettings } from '@/contexts/settings-context';
import { Layout } from 'react-grid-layout';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { StreamPlayerCaptions } from './stream-player-captions';
import { StreamPlayerHeader } from './stream-player-header';

interface Props {
  channel: string;
  isMoving: boolean;
  groupName?: string;
  layout: Layout[];
}

const DEBUG_MODE =
  typeof localStorage === 'undefined'
    ? false
    : localStorage.getItem('DEBUG_MODE') === 'true'
    ? true
    : false;

export const StreamPlayer = ({ channel, ...props }: Props) => {
  const streamPlayerControls = useContext(StreamPlayerControlsContext);
  const [
    {
      streams: { useHandleAsHeader: useHandleAsHeaderSet },
    },
  ] = useSettings();

  const playerStyleVariants = cva(
    'inset-0 flex-grow overflow-hidden w-full flex flex-col',
    {
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
    },
  );

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
        <PanelGroup direction="vertical" disablePointerEventsDuringResize>
          {!DEBUG_MODE && (
            <Panel className="flex h-full w-full items-center justify-center data-[is-resizing-captions=true]:pointer-events-none">
              <ReactPlayer
                className="!h-full !w-full"
                url={`https://player.twitch.tv/${channel}`}
                config={{
                  twitch: {
                    options: {
                      theme: 'dark',
                    },
                  },
                }}
                muted={streamPlayerControls.muted.value}
                playing
                controls
                key={streamPlayerControls.refresh.key}
              />
            </Panel>
          )}
          {DEBUG_MODE && (
            <Panel className="flex h-full w-full flex-col items-center justify-center border-t-2 border-border data-[is-resizing-captions=true]:pointer-events-none">
              {channel}
              <span>
                {(() => {
                  const lay = props.layout.find(
                    (l) => l.i === String(streamPlayerControls.index),
                  );

                  return `${lay?.w.toFixed(2) || '?'} x ${
                    lay?.h.toFixed(2) || '?'
                  }`;
                })()}
              </span>
            </Panel>
          )}
          {streamPlayerControls.captions.value && (
            <>
              <ResizableHandle withHandle />
              <StreamPlayerCaptions streamer={channel} />
            </>
          )}
        </PanelGroup>
      </div>
    </>
  );
};
