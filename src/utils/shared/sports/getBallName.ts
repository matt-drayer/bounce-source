import { BallTypesEnum } from 'types/generated/server';

const ballTypeToName = {
  [BallTypesEnum.FranklinX_40Pickleball]: 'Franklin X-40',
  [BallTypesEnum.GammaPhotonPickleball]: 'Gamma Photon',
  [BallTypesEnum.OnixDuraFast_40Pickleball]: 'Onix Dura Fast 40',
  [BallTypesEnum.OnixFuseG2Pickleball]: 'Onix Fuse G2',
  [BallTypesEnum.SelkirkProS1Pickleball]: 'Selkirk Sport Pro S1',
};

export const getBallName = ({
  ballType,
  ballCustomName,
}: {
  ballType?: BallTypesEnum | null;
  ballCustomName?: string | null;
}) => {
  if (ballType === BallTypesEnum.Custom) {
    return ballCustomName || '';
  }

  if (!ballType || ballType === BallTypesEnum.NotSelected) {
    return '';
  }

  return ballTypeToName[ballType];
};
