interface Params {
  startItem: number;
  endItem: number;
  isDesc?: boolean;
}

export const getNumberRange = ({ startItem, endItem, isDesc }: Params) => {
  const list = [];

  for (let i = startItem; i <= endItem; i++) {
    list.push(i);
  }

  return isDesc ? list.reverse() : list;
};
