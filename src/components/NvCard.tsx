import React from "react";
import NvImg from "./NvImg";

type Props = {
  href: string;
  title: string;
  desc?: string;
  imgSrc?: string;
  imgAlt?: string;
  imgW?: number;
  imgH?: number;
  badge?: string;
  onClick?: () => void;
};

export default function NvCard({
  href, title, desc, imgSrc, imgAlt = "", imgW = 512, imgH = 512, badge, onClick,
}: Props) {
  const Cmp: any = href ? "a" : "div";
  return (
    <Cmp href={href} onClick={onClick} className="nvcard">
      {imgSrc && (
        <NvImg src={imgSrc} alt={imgAlt} width={imgW} height={imgH} />
      )}
      <div className="nvcard-body">
        <div className="nvcard-title">
          <span>{title}</span>
          {badge && <em className="nvcard-badge">{badge}</em>}
        </div>
        {desc && <p className="nvcard-desc">{desc}</p>}
      </div>
    </Cmp>
  );
}

