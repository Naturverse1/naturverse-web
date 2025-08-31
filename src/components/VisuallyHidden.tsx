import React from "react";

type Props<T extends keyof HTMLElementTagNameMap = "span"> = {
  as?: T;
} & React.HTMLAttributes<HTMLElementTagNameMap[T]>;

/** Utility for screen-reader–only text. */
export default function VisuallyHidden<
  T extends keyof HTMLElementTagNameMap = "span"
>({ as, children, ...rest }: Props<T>) {
  const Tag = (as || "span") as T;
  const { className, ...restProps } = rest as { className?: string };
  return (
    <Tag
      {...(restProps as any)}
      className={"nv-vh" + (className ? " " + className : "")}
    >
      {children}
    </Tag>
  );
}
