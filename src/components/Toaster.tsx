import { useEffect } from "react";
import { useToast } from "./Toast";

export default function ToasterListener() {
  const toast = useToast();
  useEffect(() => {
    const onGrant = () => toast({ text: "Stamp earned!", kind: "ok" });
    window.addEventListener("natur:stamp-granted", onGrant);
    return () => window.removeEventListener("natur:stamp-granted", onGrant);
  }, [toast]);
  return null;
}
