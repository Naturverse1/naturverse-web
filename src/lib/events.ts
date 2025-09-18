import { demoGrant } from "@/lib/naturbank";
import { demoAddStamp } from "@/lib/passport";

type NaturEventMap = {
  grant_natur: { amount: number; note?: string | null };
  passport_stamp: { world: string; note?: string | null };
};

export type NaturEventName = keyof NaturEventMap;

type NaturEventPayload = NaturEventMap[NaturEventName];
type GrantPayload = NaturEventMap["grant_natur"];
type StampPayload = NaturEventMap["passport_stamp"];
type NaturEventResult =
  | ReturnType<typeof demoGrant>
  | ReturnType<typeof demoAddStamp>
  | null;

function isGrantPayload(name: NaturEventName, payload: NaturEventPayload): payload is GrantPayload {
  return name === "grant_natur";
}

function isStampPayload(name: NaturEventName, payload: NaturEventPayload): payload is StampPayload {
  return name === "passport_stamp";
}

export function naturEvent(name: "grant_natur", payload: GrantPayload): NaturEventResult;
export function naturEvent(name: "passport_stamp", payload: StampPayload): NaturEventResult;
export function naturEvent(name: NaturEventName, payload: NaturEventPayload): NaturEventResult {
  if (isGrantPayload(name, payload)) {
    const amount = Number(payload.amount);
    if (!Number.isFinite(amount) || amount <= 0) return null;
    const note = (payload.note ?? "").toString().slice(0, 160);
    const wallet = demoGrant(amount, note);
    if (typeof window !== "undefined") {
      try {
        window.dispatchEvent(
          new CustomEvent("natur:bank-granted", {
            detail: { amount, note },
          }),
        );
      } catch {}
    }
    return wallet;
  }

  if (isStampPayload(name, payload)) {
    const world = (payload.world ?? "").toString().trim().slice(0, 80);
    if (!world) return null;
    const note = payload.note ? payload.note.toString().slice(0, 160) : undefined;
    return demoAddStamp(world, note);
  }

  return null;
}
