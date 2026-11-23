/** Records events dispatched on (or bubbling to) `target`, in order. */
export function recordEvents(target: EventTarget, names: string[]) {
  const log: { type: string; event: Event; targetValue: unknown }[] = [];
  const handler = (event: Event) => {
    const t = event.target as { value?: unknown; checked?: unknown } | null;
    log.push({ type: event.type, event, targetValue: t?.value ?? t?.checked });
  };
  for (const name of names) target.addEventListener(name, handler);
  return {
    log,
    types: () => log.map((e) => e.type),
    stop: () => names.forEach((name) => target.removeEventListener(name, handler)),
  };
}
