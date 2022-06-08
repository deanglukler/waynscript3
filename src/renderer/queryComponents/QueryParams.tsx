import { useQueryInit, useQueryUpdate } from '../queryHooks';
import { BPMList } from './BPMList';

export function QueryParams(): JSX.Element {
  useQueryInit();
  useQueryUpdate();
  return <BPMList />;
}
