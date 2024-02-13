import { Outlet, Link } from "react-router-dom";

export default function Root() {
  return (
    <>
      <nav>
        <Link to={"/"}>TOP</Link>
        <Link to={"/admin"}>Administrative Module</Link>
        <Link to={"/incident"}>Administrative Module</Link>
        <Link to={"/report"}>Incident Module</Link>
      </nav>
    </>
  );
}