import type { PropsWithChildren } from "react";
import { ShowEmployees } from "../../components/index";

export const OverviewPageList = ({ children }: PropsWithChildren) => {
  return (
    <>
      <ShowEmployees/>
      {children}
    </>
  );
};
