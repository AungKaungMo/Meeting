import type { IconButtonProps } from '@mui/material/IconButton';

import { useState, useCallback, FormEventHandler } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { useForm, usePage } from '@inertiajs/react';

export type AccountPopoverProps = IconButtonProps & {
  data?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
  }[];
};

type CurrentUserType = {
  auth: {
    user: {
      name: string,
      email: string,
      profile_image_url: string;
      short_name: string;
      type: string
    }
  }
}

export function AccountPopover({ data = [], sx, ...other }: AccountPopoverProps) {
  const { post } = useForm();

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleClickItem = useCallback(
    (path: string) => {
      handleClosePopover();
      // router.push(path);
    },
    [handleClosePopover]
  );

  const { props } = usePage<CurrentUserType>()
  console.log(props.auth, 'fei')

  const handleLogout : FormEventHandler = (e) => {
    e.preventDefault();
    const current_type = props.auth.user.type;

    switch(current_type) {
      case "client" : 
        post(route('company.logout'))
      case "employee" :
        post(route('employee.logout'))
      case "owner" : 
        post(route('logout'))
    }
  }
   return (
    <>
      <IconButton
        onClick={handleOpenPopover}
        sx={{
          p: '2px',
          width: 40,
          height: 40,
          background: (theme) =>
            `conic-gradient(${theme.vars.palette.primary.light}, ${theme.vars.palette.warning.light}, ${theme.vars.palette.primary.light})`,
          ...sx,
        }}
        {...other}
      >
        <Avatar src={'/storage/' + props.auth?.user?.profile_image_url} alt={props.auth?.user?.name || 'Anonymous'} sx={{ width: 1, height: 1 }}>
          {props.auth?.user?.name?.charAt(0).toUpperCase() || 'Anonymous'.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { width: 200 },
          },
        }}
      >
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {props.auth?.user?.short_name || props.auth?.user?.name || 'Anonymous'}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {props.auth?.user?.email || props.auth?.user?.name || 'anonymous@gmail.com'}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuList
          disablePadding
          sx={{
            p: 1,
            gap: 0.5,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              color: 'text.secondary',
              '&:hover': { color: 'text.primary' },
              [`&.${menuItemClasses.selected}`]: {
                color: 'text.primary',
                bgcolor: 'action.selected',
                fontWeight: 'fontWeightSemiBold',
              },
            },
          }}
        >
          {data.map((option) => (
            <MenuItem
              key={option.label}
              // selected={option.href === pathname}
              onClick={() => handleClickItem(option.href)}
            >
              {option.icon}
              {option.label}
            </MenuItem>
          ))}
        </MenuList>

        <Divider sx={{ borderStyle: 'dashed' }} />

       <form onSubmit={handleLogout}>
       <Box sx={{ p: 1 }}>
          <Button type='submit' fullWidth color="error" size="medium" variant="text">
            Logout
          </Button>
        </Box>
       </form>
      </Popover>
    </>
  );
}
