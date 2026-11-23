import axe from 'axe-core';
import { expect } from 'vitest';

/** WCAG tags required by a11y-checklist.md §5.1 (wcag22aa enables `target-size`). */
export const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/**
 * Runs axe-core on `context` and fails on serious/critical violations (UX criterion AC-<X>-00).
 * `incomplete` results (e.g. contrast on translucent glass) are returned for manual review, not passed.
 */
export async function expectNoA11yViolations(context: Element | Document = document, options: axe.RunOptions = {}) {
  const results = await axe.run(context, { runOnly: { type: 'tag', values: AXE_TAGS }, ...options });
  const blocking = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(blocking.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(', ')})`)).toEqual([]);
  return results;
}
