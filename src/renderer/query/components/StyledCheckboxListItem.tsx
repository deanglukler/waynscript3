import {
  Checkbox,
  ListItem,
  ListItemButton,
  ListItemIcon,
} from '@mui/material';

interface Props {
  children: JSX.Element;
  itemName: string;
  selected: string[];
  handleToggle: (itemName: string) => () => void;
}

export function StyledCheckboxListItem({
  itemName,
  selected,
  handleToggle,
  children,
}: Props): JSX.Element {
  const labelId = `checkbox-list-label-${itemName}`;
  return (
    <ListItem
      key={itemName}
      disablePadding
      sx={{
        flex: '0 0 auto',
        width: 'max-content',
        '& .Mui-focusVisible': {
          backgroundColor: 'unset',
        },
      }}
    >
      <ListItemButton role={undefined} onClick={handleToggle(itemName)} dense>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={selected.includes(itemName)}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </ListItemIcon>
        {children}
      </ListItemButton>
    </ListItem>
  );
}
