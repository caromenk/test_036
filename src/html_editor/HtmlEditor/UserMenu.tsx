import React, {
  Stack,
  Box,
  Badge,
  Avatar,
  Typography,
  useTheme,
} from '@mui/material'
import { mdiCheck, mdiGithub } from '@mdi/js'
import { DropdownMenu } from '../components/dropdown/DropdownMenu'
import CTextField from '../components/inputs/CTextField'
import { ServerControllerType } from './apiController/apiController'
import Icon from '@mdi/react'
import { Button } from '../components/buttons/Button/Button'
import { ButtonType } from '../components/buttons/Button/Types'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export type UserMenuProps = {
  open: boolean
  anchorEl?: HTMLElement | null
  serverController: ServerControllerType
  onClose: () => void
}

export const UserMenu = (props: UserMenuProps) => {
  const { serverController, anchorEl = null, open, onClose } = props
  const {
    login,
    logout,
    getLoggedInStatus,
    changeLoginEmail,
    changeLoginPassword,
  } = serverController.actions
  const navigate = useNavigate()
  const serverData = serverController.data

  const handleNavigateGithubLogin = useCallback(() => {
    const appClientId = import.meta.env.VITE_GITHUB_APP_CLIENT_ID
    console.log('appClientId', appClientId)
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${appClientId}`
  }, [])

  const theme = useTheme()

  return (
    <DropdownMenu anchorEl={anchorEl} open={open} onClose={onClose}>
      <Stack width={220} alignItems="center" p={2}>
        <Box mt={2}>
          {getLoggedInStatus().email ? (
            <Badge
              badgeContent={
                <Icon
                  path={mdiCheck}
                  size={1}
                  color={theme.palette.success.main}
                />
              }
            >
              <Avatar
                alt="User Image"
                src={serverData?.user?.avatar_url || undefined}
                sx={{ width: 84, height: 84, fontSize: 32 }}
              >
                {getLoggedInStatus().email?.charAt(0).toUpperCase()}
              </Avatar>
            </Badge>
          ) : (
            <Avatar alt="User Image" sx={{ width: 84, height: 84 }} />
          )}
        </Box>
        {getLoggedInStatus().email ? (
          <Box mt={2}>
            <Typography>{getLoggedInStatus().email}</Typography>
            <Stack direction="row" justifyContent="flex-end" mt={2}>
              <Button onClick={logout}>Logout</Button>
            </Stack>
          </Box>
        ) : (
          <Box>
            <Box sx={{ pt: 2 }}>
              <CTextField
                label="E-mail"
                value={serverData?.loginForm.email}
                name="email"
                onChange={changeLoginEmail as any}
              />
              <CTextField
                label="Passwort"
                value={serverData?.loginForm.password}
                name="password"
                onChange={changeLoginPassword as any}
              />
            </Box>
            <Stack direction="row" justifyContent="space-between">
              <Button
                icon={mdiGithub}
                type={ButtonType.text}
                onClick={handleNavigateGithubLogin}
              >
                via Github
              </Button>
              <Button type={ButtonType.text} onClick={login}>
                Login
              </Button>
            </Stack>
          </Box>
        )}
      </Stack>
    </DropdownMenu>
  )
}
