type OrbitEventHandler =
  (
    payload?: any
  ) => void;

const listeners =
  new Map<
    string,
    OrbitEventHandler[]
  >();

export function emitEvent(
  event: string,

  payload?: any
) {
  const handlers =
    listeners.get(event);

  if (!handlers) {
    return;
  }

  handlers.forEach(
    (handler) =>
      handler(payload)
  );
}

export function onEvent(
  event: string,

  handler: OrbitEventHandler
) {
  const existing =
    listeners.get(event) ||
    [];

  listeners.set(
    event,

    [...existing, handler]
  );

  return () => {
    const updated =
      (
        listeners.get(event) ||
        []
      ).filter(
        (h) => h !== handler
      );

    listeners.set(
      event,
      updated
    );
  };
}