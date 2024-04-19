export interface Props {
  title: string;
  backUrl?: string;
  isPop?: boolean;
  right?: React.ReactNode;
  children?: React.ReactNode;
  isBackdropBlur?: boolean;
  isHideSidebar?: boolean;
  isShowTopNav?: boolean;
  isAutoHeightDesktop?: boolean;
  bottom?: React.ReactNode;
}
