declare module "*.md" {
  const content: string;
  export default content;
}

declare module "*.svg" {
  import * as React from "react";
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.webp";
declare module "*.gif";
declare module "*.mp3";

declare module "gray-matter" {
  export default function matter(source: string): {
    content: string;
    data: Record<string, unknown>;
  };
}

declare module "marked" {
  export const marked: {
    parse: (src: string) => string;
  };
}
