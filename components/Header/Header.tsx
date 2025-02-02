'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import cx from 'clsx';
import {
  HoverCard,
  Group,
  Button,
  UnstyledButton,
  Text,
  SimpleGrid,
  ThemeIcon,
  Anchor,
  Divider,
  Center,
  Box,
  Burger,
  Drawer,
  Collapse,
  ScrollArea,
  Menu,
  Avatar,
  rem,
  useMantineTheme,
  useMantineColorScheme,
  useComputedColorScheme,
  ActionIcon,
  Tooltip
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconNotification,
  IconCode,
  IconBook,
  IconChartPie3,
  IconFingerprint,
  IconCoin,
  IconChevronDown,
  IconLogout,
  IconHeart,
  IconStar,
  IconMessage,
  IconSettings,
  IconSwitchHorizontal,
  IconPlayerPause,
  IconTrash,
  IconWebhook,
  IconAppWindow,
  IconSun,
  IconMoon,
} from '@tabler/icons-react';
import WalletConnectButton from '../WalletConnectButton';
import classes from './Header.module.css';
import { Logo } from '@/components/Logo/Logo';


const mockdata = [
  {
    icon: IconAppWindow,
    title: 'Agents',
    description: 'Use a fine-tuned LLMs as your developper to create fullstack web agents',
  },
  {
    icon: IconWebhook,
    title: 'Something',
    description: 'Bla bla',
  },
  // {
  //   icon: IconBook,
  //   title: 'Documentation',
  //   description: 'Yanma is capable of seeing 360 degrees without',
  // },
  // {
  //   icon: IconFingerprint,
  //   title: 'Security',
  //   description: 'The shell's rounded shape and the grooves on its.',
  // },
  // {
  //   icon: IconChartPie3,
  //   title: 'Analytics',
  //   description: 'This Pokémon uses its flying ability to quickly chase',
  // },
  // {
  //   icon: IconNotification,
  //   title: 'Notifications',
  //   description: 'Combusken battles with the intensely hot flames it spews',
  // },
];

const UserMenu = ({ user }: any) => {
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  return (
    <Menu
      width={260}
      position="bottom-end"
      transitionProps={{ transition: 'pop-top-right' }}
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton
          className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
        >
          <Group gap={7}>
            <Avatar src={user.image} alt={user.name!} radius="xl" size={20} />
            <Text fw={500} size="sm" lh={1} mr={3}>
              {user.name}
            </Text>
            <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        {/* <Menu.Item
          leftSection={
            <IconHeart
              style={{ width: rem(16), height: rem(16) }}
              color={theme.colors.red[6]}
              stroke={1.5}
            />
          }
        >
          Liked posts
        </Menu.Item> */}
        {/* <Menu.Item
          leftSection={
            <IconStar
              style={{ width: rem(16), height: rem(16) }}
              color={theme.colors.yellow[6]}
              stroke={1.5}
            />
          }
        >
          Saved posts
        </Menu.Item> */}
        {/* <Menu.Item
          leftSection={
            <IconMessage
              style={{ width: rem(16), height: rem(16) }}
              color={theme.colors.blue[6]}
              stroke={1.5}
            />
          }
        >
          Your comments
        </Menu.Item> */}

        {/* <Menu.Label>Projects</Menu.Label>
        {projectCtx.projects.map((prj: any) =>
        <Menu.Item
          key={prj}
          leftSection={
            <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          }
          onClick={() => router.push('/p/' + prj.projectId)}
        >
          {prj.projectName}
        </Menu.Item>)} */}

        <Menu.Label>Account</Menu.Label>
        <Menu.Item>
          {user.name}
        </Menu.Item>
        <Menu.Item>
          {user.email}
        </Menu.Item>

        <Menu.Label>Settings</Menu.Label>
        {/* <Menu.Item
          leftSection={
            <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          }
        >
          Account settings
        </Menu.Item> */}
        {/* <Menu.Item
          leftSection={
            <IconSwitchHorizontal style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          }
        >
          Change account
        </Menu.Item> */}
        <Menu.Item
          onClick={() => {}}
          leftSection={
            <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          }
        >
          Log out
        </Menu.Item>

        {/* <Menu.Divider />

        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item
          leftSection={
            <IconPlayerPause style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          }
        >
          Pause subscription
        </Menu.Item>
        <Menu.Item
          color="red"
          leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        >
          Delete account
        </Menu.Item> */}
      </Menu.Dropdown>
    </Menu>);
};

export const Header = () => {
  const router = useRouter();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  // Add state for NEAR wallet modal
  const [walletModalVisible, setWalletModalVisible] = useState(false);

  const links = mockdata.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon style={{ width: rem(22), height: rem(22) }} color={theme.colors.blue[6]} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  return (
    <Box pb={30}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">

          <a href="/" className={classes.link}>
            <Logo />
          </a>

          <Group h="100%" gap={0} visibleFrom="sm">
            <a href="/" className={classes.link}>
              Home
            </a>
            <HoverCard width={600} position="bottom" radius="md" shadow="md" withinPortal>
              <HoverCard.Target>
                <a href="/features" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Features
                    </Box>
                    <IconChevronDown
                      style={{ width: rem(16), height: rem(16) }}
                      color={theme.colors.blue[6]}
                    />
                  </Center>
                </a>
              </HoverCard.Target>

              <HoverCard.Dropdown style={{ overflow: 'hidden' }}>
                <Group justify="space-between" px="md">
                  <Text fw={500}>Features</Text>
                  <Anchor href="/features" fz="xs">
                    View all
                  </Anchor>
                </Group>

                <Divider my="sm" />

                <SimpleGrid cols={2} spacing={0}>
                  {links}
                </SimpleGrid>

                <div className={classes.dropdownFooter}>
                  <Group justify="space-between">
                    <div>
                      <Text fw={500} fz="sm">
                        Get started
                      </Text>
                      <Text size="xs" c="dimmed">
                        Start building
                      </Text>
                    </div>
                    <Button variant="default" onClick={() => {}}>
                      Sign up
                    </Button>
                  </Group>
                </div>
              </HoverCard.Dropdown>
            </HoverCard>
            {/* <a href="#" className={classes.link}>
              Learn
            </a>
            <a href="#" className={classes.link}>
              Academy
            </a> */}
          </Group>

          <Group visibleFrom="sm">
            <ActionIcon
                onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
                variant="default"
                size="lg"
                aria-label="Toggle color scheme"
              >
              <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
              <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
              </ActionIcon>

            <WalletConnectButton />
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />

          <a href="#" className={classes.link}>
            Home
          </a>
          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Features
              </Box>
              <IconChevronDown
                style={{ width: rem(16), height: rem(16) }}
                color={theme.colors.blue[6]}
              />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>
          {/* <a href="#" className={classes.link}>
            Learn
          </a>
          <a href="#" className={classes.link}>
            Academy
          </a> */}

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            <WalletConnectButton />
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
};