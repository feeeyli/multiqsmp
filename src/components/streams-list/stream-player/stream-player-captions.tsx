import levenshtein from 'fast-levenshtein';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Panel } from 'react-resizable-panels';
import { io } from 'socket.io-client';

function shuffle<T>(array: T[]) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

const socket = io('https://qsmp.dev', {
  transports: ['websocket'],
  path: '/socket.io',
  secure: true,
  rejectUnauthorized: false,
  query: {
    token:
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0OSwidXNlcm5hbWUiOiJRU01QVFYiLCJyb2xlIjoidXNlciIsImlhdCI6MTcwNDY2NTc3NX0.nI6nJd3ey-8OSfiwFrz0j9kyyq_KBTKtrChNRoI08hMypVAdTqr5wOiwhl4PWw7z9tz3XhFTBUv7NPV513_mSILZ4QmCufUjenxTPdcZ9TdSpuY2B6E3Bpm1Bn9q5lBANGFIhVz0la851ehBwi245-xn1Rd8XpgS7LQXdeLoBMqKmmyaZa3_LjU_KdkLUsD4HU8Nj4pONWZBwGFdEzc5QGCj9Juv9N9dF3I9GwiXt6IqPQVZ6GJDzkn32Vm9UMyV8-26uRgrn-GvbuqIBdle1F-Dtha3NFVnN4Lm-VYtCAYci5fNhvuiyr_nE2QS5unfhJZqg4J1iSgBFsE3xoJkPA',
  },
});

function getWordAt(str: string, pos: number) {
  // check ranges
  if (pos < 0 || pos > str.length) {
    return {
      word: '',
      start: 0,
      end: 0,
    };
  }
  // Perform type conversions.
  str = String(str);
  pos = Number(pos) >>> 0;

  // Search for the word's beginning and end.
  const left = str.slice(0, pos + 1).search(/\S+$/); // use /\S+\s*$/ to return the preceding word
  const right = str.slice(pos).search(/\s/);

  // The last word in the string is a special case.
  if (right < 0) {
    return {
      word: str.slice(left),
      start: left,
      end: str.length,
    };
  }

  // Return the word, using the located bounds to extract it from the string.
  return {
    word: str.slice(left, right + pos),
    start: left,
    end: right + pos,
  };
}

type StreamPlayerCaptionsProps = {
  streamer: string;
};

export function StreamPlayerCaptions({ streamer }: StreamPlayerCaptionsProps) {
  const [translations, setTranslations] = useState<{
    text: string[];
    sentences: string[];
  }>({
    text: [],
    sentences: [],
  });

  const lastTranscriptionTime = useRef(0);

  function getSentenceSimilarity(sentence1 = '', sentence2 = '') {
    const distance = levenshtein.get(sentence1, sentence2);
    const similarityPercentage = distance / sentence1.length;

    return similarityPercentage < 0.6;
  }

  const addTranscription = useCallback((transcription = '') => {
    const LINE_BREAK_INTERVAL = 3000;
    const currentTime = Date.now();
    const timeSinceLastTranscription =
      currentTime - lastTranscriptionTime.current;
    const isLineBreak = timeSinceLastTranscription > LINE_BREAK_INTERVAL;

    setTranslations((prevTranslations) => {
      const lastItem = prevTranslations.text.at(-1) || '';
      const lastSentence = prevTranslations.sentences.at(-1) || '';
      // Check if the new transcription is the same as the last one
      const isSimilar = getSentenceSimilarity(
        lastItem,
        transcription?.slice(0, lastItem.length),
      );
      const { end, start } = getWordAt(transcription, lastSentence.length - 1);
      // const newSentence = transcription.slice(Math.max(start, 0));

      if (isSimilar) {
        return {
          text: [...prevTranslations.text.slice(0, -1), transcription],
          sentences: isLineBreak
            ? [
                ...prevTranslations.sentences,
                transcription.slice(Math.max(start, 0)),
              ]
            : [...prevTranslations.sentences.slice(0, -1), transcription],
        };
      }

      return {
        text: [...prevTranslations.text, transcription],
        sentences: isLineBreak
          ? [...prevTranslations.sentences, transcription.slice(end)]
          : [...prevTranslations.sentences, transcription],
      };
    });

    lastTranscriptionTime.current = currentTime;
  }, []);

  const index = useRef(0);

  const fake_translations = false;

  useEffect(() => {
    // lorem ipsum words
    // const wordList = sentences

    if (streamer.includes('quackity') || !fake_translations) return;

    const wordList = shuffle([
      'Mussum Ipsum, cacilds vidis litro abertis',
      'Mauris nec dolor in eros commodo tempor',
      'Aenean aliquam molestie leo, vitae iacuis nisl',
      'Todo mundo vê os porris que eu tomo, mas ninguém vê os tombis que eu levo! Pellentesque nec nulla ligula',
      'Donec gravida turpis a vulputate ultricies',
      'Delegadis gente finis, bibendum egestas augue arcu ut est',
      'Admodum accumsan disputationi eu sit',
      'Vide electram sadipscing et per',
      'Quem manda na minha terra sou euzis! Si u mundo tá muito paradis? Toma um mé que o mundo vai girarzis! Pellentesque nec nulla ligula',
      'Donec gravida turpis a vulputate ultricies',
      'Si u mundo tá muito paradis? Toma um mé que o mundo vai girarzis! A ordem dos tratores não altera o pão duris',
      'Praesent malesuada urna nisi, quis volutpat erat hendrerit non',
      'Nam vulputate dapibus',
      'Sapien in monti palavris qui num significa nadis i pareci latim',
      'Interessantiss quisso pudia ce receita de bolis, mais bolis eu num gostis',
      'Nec orci ornare consequat',
      'Praesent lacinia ultrices consectetur',
      'Sed non ipsum felis',
      'A ordem dos tratores não altera o pão duris',
      'Paisis, filhis, espiritis santis',
      'Nullam volutpat risus nec leo commodo, ut interdum diam laoreet',
      'Sed non consequat odio',
      'Mé faiz elementum girarzis, nisi eros vermeio',
      'Praesent malesuada urna nisi, quis volutpat erat hendrerit non',
      'Nam vulputate dapibus',
      'Praesent vel viverra nisi',
      'Mauris aliquet nunc non turpis scelerisque, eget.',
    ]);

    // time between 300ms and 4s
    const time = Math.floor(Math.random() * 3700) + 300;

    const id = setTimeout(() => {
      const word = wordList[index.current++ % wordList.length];
      addTranscription(word);
    }, time);

    return () => {
      clearTimeout(id);
    };
  }, [addTranscription, translations.text, streamer, fake_translations]);

  if (streamer.includes('quackity')) {
    socket.emit('joinLanguageRoom', streamer + '/pt');
  }

  const handleTranslations = (data: { [s: string]: string }) => {
    const translatedLanguage = data[streamer + '/pt'];

    addTranscription(translatedLanguage);
  };

  socket.on('translatedCaptions', handleTranslations);

  return (
    <Panel
      className="pointer-events-none min-h-14 px-3 py-2"
      defaultSize={10}
      maxSize={31.25}
    >
      <p className="flex h-full flex-col justify-end overflow-hidden text-xs leading-5">
        {translations.text.length === 0 && (
          <>
            <span className="block text-muted-foreground">
              {streamer.includes('quackity')
                ? 'Aguardando streamer...'
                : 'Esse streamer não possui traduções do QSMP.TV.'}
            </span>
            {streamer.includes('quackity') && (
              <span className="block text-muted-foreground">
                Powered by Quackity Studios
              </span>
            )}
          </>
        )}
        {translations.text.slice(-6).map((text, i) => (
          <span key={text.split(' ')[0] + i} className="block">
            {text}
          </span>
        ))}
      </p>
    </Panel>
  );
}
