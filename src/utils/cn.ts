export default function cn(
  ...parts: (string | false | null | undefined)[]
) {
  return parts.filter(Boolean).join(" ");
}

