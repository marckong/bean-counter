import { AppShell, Flex, Title } from "@mantine/core";
import { IconCoffee } from "@tabler/icons-react";
import { Link, Outlet } from "react-router-dom";

export function StandardLayout() {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Flex align="center" h={60} gap="xs" pl="md">
          <Link to="/" style={{ all: "unset", cursor: "pointer" }}>
            <Flex align="center" h={60} gap="xs" pl="md">
              <IconCoffee size="1.75rem" stroke={1.5} />
              <Title order={3}>Bean Counter</Title>
            </Flex>
          </Link>
        </Flex>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
