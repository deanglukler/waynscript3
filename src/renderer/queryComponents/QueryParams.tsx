import { useQueryParamsInit, useQueryParamsUpdate } from '../queryHooks';
import { BPMList } from './BPMList';

export function QueryParams(): JSX.Element {
  useQueryParamsInit();
  useQueryParamsUpdate();
  return <BPMList />;
}
