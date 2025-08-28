import React from "react";

type Props = React.HTMLAttributes<HTMLElement> & { as?: keyof JSX.IntrinsicElements };

/** Utility for screen-reader–only text. */
export default function VisuallyHidden({ as: Tag = "span", children, ...rest }: Props) {
  return (
    <Tag
      {...rest}
      className={"nv-vh" + (rest.className ? " " + rest.className : "")}
    >
      {children}
    </Tag>
  );
}
