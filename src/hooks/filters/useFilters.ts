import { compose } from "../../common/compose";
import { filters } from "./filters";

export type tFilters = Array<keyof typeof filters>;

export const useFilters = (list: tFilters = []) => {
  const builded = list.map(key => filters[key as keyof typeof filters]);

  return (value: string): string => {
    if(!builded.length) return value;
    const composed = compose(...builded);
    return composed(value);
  };
};