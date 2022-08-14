import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import _ from 'lodash';
import { Stats } from '../../../shared/types';
import { centerContent } from '../../shared/centerContent';
import { StyledCheckboxListItem } from './StyledCheckboxListItem';
import { StyledList } from './StyledList';

interface Props {
  stats: Stats | null;
  selected: string[];
  handleToggle: (stat: string) => () => void;
  primaryTextConverter?: (original: string) => string;
}

export function QueryCheckboxList({
  stats,
  handleToggle,
  selected,
  primaryTextConverter,
}: Props): JSX.Element {
  function render() {
    if (!stats || _.keys(stats).length === 0) {
      return (
        <Box sx={{ ...centerContent }}>
          <Typography variant="lg-grey-bg-text">None</Typography>
        </Box>
      );
    }

    return (
      <StyledList>
        {_.keys(stats).map((statName) => {
          const stat = stats[statName];

          return (
            <StyledCheckboxListItem
              key={statName}
              itemName={statName}
              selected={selected}
              handleToggle={handleToggle}
            >
              <Box sx={{ display: 'flex' }}>
                <Typography
                  color={selected.includes(statName) ? 'primary' : 'grey.100'}
                  variant="body1"
                >{`${
                  primaryTextConverter
                    ? primaryTextConverter(statName)
                    : statName
                }`}</Typography>
                <Typography
                  color={
                    selected.includes(statName) ? 'primary' : 'text.primary'
                  }
                  variant="caption"
                  sx={{ paddingLeft: '3px' }}
                >{`(${stat.amount} ♬)`}</Typography>
              </Box>
            </StyledCheckboxListItem>
          );
        })}
      </StyledList>
    );
  }

  return render();
}

QueryCheckboxList.defaultProps = {
  primaryTextConverter: undefined,
};
