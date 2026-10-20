import Link from "next/link";
import Icon from "./Icon";

// A card that leads one level deeper in the catalog. `index` drives the staggered reveal.
export default function LevelCard({
  href,
  kicker,
  title,
  description,
  meta,
  index = 0,
}: {
  href: string;
  kicker: string;
  title: string;
  description?: string;
  meta?: React.ReactNode;
  index?: number;
}) {
  return (
    <li className="reveal" style={{ "--i": index } as React.CSSProperties}>
      <Link href={href} className="level-card">
        <span className="kicker">{kicker}</span>
        <span className="level-title">{title}</span>
        {description && <span className="level-desc">{description}</span>}
        <span className="level-foot">
          <span className="level-meta">{meta}</span>
          <Icon name="arrow" size={18} />
        </span>
      </Link>
    </li>
  );
}
