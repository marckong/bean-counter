import { AppShell, Burger, Flex, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCoffee } from "@tabler/icons-react";
import { Link, Outlet } from "react-router-dom";
import { NavBar } from "../comps/NavBar";

export function AdminLayout() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 240,
        breakpoint: "xs",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Flex align="center" h={60} gap="xs" pl="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="md" />
          <Link to="/admin" style={{ all: "unset", cursor: "pointer" }}>
            <Flex align="center" h={60} gap="xs" pl="md">
              <IconCoffee size="1.75rem" stroke={1.5} />
              <Title order={3}>Bean Counter</Title>
            </Flex>
          </Link>
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavBar />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
