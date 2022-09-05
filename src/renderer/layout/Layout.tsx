import { Box } from '@mui/system';
import { AppScanDialog } from '../AppScanDialog';
import DirectoryList from '../directoryList/DirectoryList';
import { SampleList } from '../list/components/SampleList';
import { useStoreActions, useStoreState } from '../providers/store';
import { Query } from '../query/Query';
import { ResizableBox } from '../shared/components/ResizableBox';

// styles
const mainContainer = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
};

const sampleListContainer = { border: '1px solid blue', flex: '1 0 auto' };
const directoryListContainer = { border: '1px solid green', flex: '1 0 auto' };
const queryContainer = { border: '1px solid red', flex: '0 1 100vw' };

export function Layout() {
  const layout = useStoreState((state) => state.layout);
  const updateLayout = useStoreActions((actions) => actions.updateLayout);

  const updateSampleListWidth = (width: string) => {
    updateLayout({ sampleList: { width } });
  };
  const updateDirectoryListWidth = (width: string) => {
    updateLayout({ directoryList: { width } });
  };

  return (
    <>
      <AppScanDialog />
      <Box sx={mainContainer}>
        <ResizableBox
          width={layout.sampleList.width}
          setWidth={updateSampleListWidth}
          sx={sampleListContainer}
        >
          <SampleList />
        </ResizableBox>
        <ResizableBox
          width={layout.directoryList.width}
          setWidth={updateDirectoryListWidth}
          sx={directoryListContainer}
        >
          <DirectoryList />
        </ResizableBox>
        <Box sx={queryContainer}>
          <Query />
        </Box>
      </Box>
    </>
  );
}
