import type { PropsWithChildren } from "react";
import { AddnewEmployee } from "../../components/index";
import { ModalProvider } from '../../contexts/context-modal';
import { ShowEmployees } from "../../components/index";

export const OverviewPageList = ({ children }: PropsWithChildren) => {
  return (
    <>
      <ModalProvider>
        <ShowEmployees/>
        <AddnewEmployee/>
      </ModalProvider>
      {children}
    </>
  );
};
