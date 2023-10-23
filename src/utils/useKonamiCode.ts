import { useEffect, useState } from 'react';

export function useKonamiCode(handler: () => void) {
  // State to hold array of recently pressed keys
  const [keys, setKeys] = useState<(string | undefined)[]>([]);

  // Convert stored keys to string and match against konami code string
  const isKonamiCode =
    keys.join(' ') === 'up up down down left right left right B A';

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    // When a key is pressed
    window.document.onkeydown = (e) => {
      // Update array of keys in state with new key
      setKeys((currentKeys) => [...currentKeys, getKeyName(e.keyCode)]);

      // Clear 5s timeout since key was just pressed
      clearTimeout(timeout);

      // Reset keys if 5s passes so user can try again
      timeout = setTimeout(() => setKeys([]), 5000);
    };
  }, []);

  // Once konami code is entered call handler function
  // and reset keys so user can do it again.
  useEffect(() => {
    if (isKonamiCode) {
      handler();
      setKeys([]);
    }
  }, [isKonamiCode, handler]);

  return isKonamiCode;
}

const getKeyName = (keyCode: number) => {
  return {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    65: 'A',
    66: 'B',
  }[keyCode];
};
