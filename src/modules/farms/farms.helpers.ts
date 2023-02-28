import { FarmDto } from "./dto/farm.dto";

export const getSortFunction = (orderBy: string) => {
  if (orderBy === "name") return sortByName;
  if (orderBy === "drivingDistance") return sortByDrivingDistance;
}

const sortByName = (farm1: FarmDto, farm2: FarmDto): number => {
  if (farm1.name < farm2.name) {
    return -1;
  }
  if (farm1.name > farm2.name) {
    return 1;
  }
  return 0;
};

const sortByDrivingDistance = (farm1: FarmDto, farm2: FarmDto): number => {
  const drivingDistance1 = farm1.drivingDistance || Infinity;
  const drivingDistance2 = farm2.drivingDistance || Infinity;
  if (drivingDistance1 < drivingDistance2) {
    return -1;
  }
  if (drivingDistance1 > drivingDistance2) {
    return 1;
  }
  return 0;
};
