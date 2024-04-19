import * as React from 'react';
import { NotificationStatusesEnum } from 'types/generated/client';
import Card from 'components/cards/Card';

interface Props {
  status: NotificationStatusesEnum;
  children: React.ReactNode;
}

const CardNotification: React.FC<Props> = ({ status, children }) => {
  return (
    <Card
      backgroundColor={
        status === NotificationStatusesEnum.Read
          ? 'bg-color-bg-lightmode-inactive'
          : 'bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary'
      }
    >
      {children}
    </Card>
  );
};

export default CardNotification;
