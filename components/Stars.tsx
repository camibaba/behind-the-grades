export default function Stars({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <span className="stars" aria-label={`${Number(value.toFixed(1))} out of 5 stars`}>
      {"★".repeat(full)}
      <span className="stars-off">{"★".repeat(5 - full)}</span>
    </span>
  );
}
