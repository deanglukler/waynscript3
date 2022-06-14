import { Box } from '@mui/material';
import { StoreProvider } from 'easy-peasy';
import { Filebrowse } from './queryComponents/FileBrowse';
import { QueryParams } from './queryComponents/QueryParams';
import { store } from './queryStore';

export default function QueryApp() {
  return (
    // https://stackoverflow.com/questions/72055436/easy-peasy-storeprovider-returns-the-error-property-children-does-not-exist-o
    // https://github.com/ctrlplusb/easy-peasy/issues/741
    // issue with react 18 apparently
    <StoreProvider store={store}>
      <Box display="flex">
        <Box flex="0 0 100px">
          <Filebrowse />
        </Box>
        <Box flex="1 0 500px">
          <QueryParams />
        </Box>
      </Box>
    </StoreProvider>
  );
}
