import type { PropsWithChildren } from "react";
import { AddnewEmployee } from "../../components/index";
import { ShowEmployees } from "../../components/index";

export const OverviewPageList = ({ children }: PropsWithChildren) => {
  return (
    <>
      <ShowEmployees/>
      {children}
    </>
  );
};
