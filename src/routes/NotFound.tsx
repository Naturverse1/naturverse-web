import { Link, useRouteError } from "react-router-dom";
export default function NotFound() {
  const err = useRouteError() as any;
  return (
    <>
      <h2>Not Found</h2>
      <p>{err?.status || 404} — {err?.statusText || "This page does not exist."}</p>
      <p><Link to="/">Go home</Link></p>
    </>
  );
}
