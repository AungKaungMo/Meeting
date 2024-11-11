import type { ButtonBaseProps } from '@mui/material/ButtonBase';
import { useState } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import { varAlpha } from '@/theme/styles';

// ----------------------------------------------------------------------

export function WorkspacesPopover({ sx, ...other }: ButtonBaseProps ) {

  const renderAvatar = (alt: string, src: string) => (
    <Box
      component="img"
      alt={alt}
      src={src}
      sx={{
        width: 24,
        height: 24,
        borderRadius: '50%',
      }}
    />
  );

  return (
    <ButtonBase
      disableRipple
      sx={{
        pl: 2,
        py: 3,
        pr: 1.5,
        width: 1,
        borderRadius: 1.5,
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        bgcolor: (theme) => varAlpha(theme.palette.grey['500Channel'], 0.08),
        ...sx,
      }}
      {...other}
    >
      {renderAvatar('Meeting System', 'assets/icons/workspaces/logo-2.webp')}

      <Box
        sx={{
          typography: 'body1',
          fontWeight: 'fontWeightSemiBold',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        Meeting System
      </Box>
    </ButtonBase>
  );
}
