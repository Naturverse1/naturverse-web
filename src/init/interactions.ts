import { burst } from "../utils/confetti";

/**
 * Initializes button ripple + confetti for checkout.
 * Call once from App.tsx after DOM is ready.
 */
export function initInteractions() {
  // Hard guard for SSR and very old browsers / bots
  if (
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    typeof MutationObserver === "undefined"
  ) {
    return;
  }
  try {
  // 1) Ripple on any button-like control
  const rippleTargets = () =>
    Array.from(
      document.querySelectorAll<HTMLButtonElement | HTMLElement>(
        'button, .btn, .button, [role="button"]'
      )
    );

  const onDown = (ev: Event) => {
    const e = ev as MouseEvent;
    const target = e.currentTarget as HTMLElement;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const span = document.createElement("span");
    span.className = "nv-ripple";
    span.style.left = `${e.clientX - rect.left}px`;
    span.style.top = `${e.clientY - rect.top}px`;
    target.appendChild(span);
    span.addEventListener("animationend", () => span.remove(), { once: true });
  };

  const attachRipple = (el: Element) => {
    el.removeEventListener("mousedown", onDown as any);
    el.addEventListener("mousedown", onDown as any);
    el.removeEventListener("touchstart", onDown as any);
    el.addEventListener("touchstart", onDown as any, { passive: true });
  };
  rippleTargets().forEach(attachRipple);

  // As routes/components mount later, keep observing for new buttons.
  const mo = new MutationObserver(() => {
    rippleTargets().forEach(attachRipple);
    tagCheckoutButtons(); // keep tagging if new buttons appear
    attachConfetti();
  });
  mo.observe(document.body, { childList: true, subtree: true });

  // 2) Confetti on "Checkout (stub)" — tag button automatically
  function tagCheckoutButtons() {
    const btns = document.querySelectorAll("button, .btn, .button");
    btns.forEach((b: any) => {
      const text = (b.textContent || "").toLowerCase();
      if (!b.dataset || b.dataset.confetti === "true") return;
      if (text.includes("checkout")) {
        (b as HTMLElement).setAttribute("data-confetti", "true");
      }
    });
  }
  tagCheckoutButtons();

  function attachConfetti() {
    const targets = document.querySelectorAll<HTMLElement>('[data-confetti="true"]');
    targets.forEach((btn) => {
      const handler = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        burst({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      };
      btn.removeEventListener("click", handler as any);
      btn.addEventListener("click", handler as any);
    });
  }
  attachConfetti();
  } catch (err) {
    // Never fail the app due to UI sugar
    console && console.warn && console.warn("[naturverse] interactions init skipped:", err);
  }
}
