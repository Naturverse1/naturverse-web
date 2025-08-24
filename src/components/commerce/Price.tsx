export default function Price({ amount }: { amount: number }) {
  return <span>${amount.toFixed(2)}</span>;
}
