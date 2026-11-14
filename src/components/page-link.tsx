import type { AnchorHTMLAttributes } from "react";

/**
 * A plain link that loads the next page fully instead of Next's in-app navigation.
 * Every page load runs the Meta pixel snippet, which sends PageView from the browser and the
 * Conversions API with one shared event ID; in-app navigation would skip that pairing.
 */
export function PageLink(props: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return <a {...props} />;
}
