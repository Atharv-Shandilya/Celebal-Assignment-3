import { NavLink } from "react-router";

export default ({
  to,
  children,
}: {
  to: string;
  children: React.ReactElement;
}) => {
  return (
    <NavLink to={to}>
      <p className="w-[30px] h-[30px] flex rounded-full border justify-center items-center">
        {children}
      </p>
    </NavLink>
  );
};
