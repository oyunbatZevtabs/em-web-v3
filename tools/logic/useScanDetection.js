import { useCallback, useEffect, useRef } from "react";

const useScanDetection = ({
  timeToEvaluate = 100,
  averageWaitTime = 50,
  startCharacter = [],
  endCharacter = [13, 27],
  onComplete,
  onError,
  minLength = 1,
  ignoreIfFocusOn,
  stopPropagation = false,
  preventDefault = false,
  container = document,
}) => {
  const buffer = useRef([]);
  const timeout = useRef(false);

  const clearBuffer = () => {
    buffer.current = [];
  };
  const evaluateBuffer = () => {
    clearTimeout(timeout.current);
    const sum = buffer.current
      .map(({ time }, k, arr) => (k > 0 ? time - arr[k - 1].time : 0))
      .slice(1)
      .reduce((total, delta) => total + delta, 0);
    const avg = sum / (buffer.current.length - 1);

    const code = buffer.current
      .slice(startCharacter.length > 0 ? 1 : 0)
      .map(({ char }) => char)
      .join("");

    if (
      avg <= averageWaitTime &&
      buffer.current.slice(startCharacter.length > 0 ? 1 : 0).length >=
        minLength
    ) {
      onComplete(code);
    } else {
      avg <= averageWaitTime && !!onError && onError(code);
    }
    clearBuffer();
  };

  const onKeyDown = useCallback(
    (event) => {
      if (event.key !== "Backspace") {
        if (event.currentTarget !== ignoreIfFocusOn) {
          if (endCharacter.includes(event.keyCode)) {
            evaluateBuffer();
          }
          if (
            buffer.current.length > 0 ||
            startCharacter.includes(event.keyCode) ||
            startCharacter.length === 0
          ) {
            clearTimeout(timeout.current);
            timeout.current = setTimeout(evaluateBuffer, timeToEvaluate);
            buffer.current.push({ time: performance.now(), char: event.key });
          }
        }
        if (stopPropagation) {
          event.stopPropagation();
        }
        if (preventDefault) {
          event.preventDefault();
        }
      }
    },
    [
      startCharacter,
      endCharacter,
      timeToEvaluate,
      onComplete,
      onError,
      minLength,
      ignoreIfFocusOn,
      stopPropagation,
      preventDefault,
    ]
  );

  useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

  useEffect(() => {
    container.addEventListener("keydown", onKeyDown);
    return () => {
      container.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);
};

export default useScanDetection;
