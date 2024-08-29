import { Box, Divider, NavLink } from "@mantine/core";
import {
  IconClipboard,
  IconClipboardPlus,
  IconCoffee,
  IconDashboard,
  IconPlus,
} from "@tabler/icons-react";
import { NavLink as RouterNavLink, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Menu } from "../types";
import { queryClient } from "../query-client";

export const Section = ({ children }: React.PropsWithChildren) => {
  return (
    <Box tt="uppercase" fz="xs" fw="bold" my="sm" ml="sm">
      {children}
    </Box>
  );
};

export function NavBar() {
  const navigate = useNavigate();
  const { data: menus } = useQuery<Menu[]>({
    queryKey: ["menus"],
    queryFn: async () => {
      const res = await fetch("/api/menus", { credentials: "include" });
      if (res.status === 401) {
        navigate("/login", { replace: true });
        return [];
      }
      const menus = (await res.json()) as Menu[];
      menus.forEach((menu) => {
        queryClient.setQueryData(["menus", menu.id], menu);
      });
      return menus;
    },
  });
  return (
    <>
      <NavLink
        component={RouterNavLink}
        to="/admin/dashboard"
        label="Order Dashboard"
        leftSection={<IconDashboard size="1rem" stroke={1.5} />}
      />
      <NavLink
        component={RouterNavLink}
        to="/admin/menu-items"
        label="Manage Menu Items"
        leftSection={<IconClipboardPlus size="1rem" stroke={1.5} />}
      />
      <Section>Menus</Section>
      {menus &&
        menus.map((menu) => (
          <NavLink
            component={RouterNavLink}
            key={menu.id}
            to={`/admin/menus/${menu.id}`}
            label={menu.name}
            leftSection={<IconClipboard size="1rem" stroke={1.5} />}
          />
        ))}
      <Divider m="xs" />
      <NavLink
        component={RouterNavLink}
        to="/admin/menus/new"
        label="New Menu"
        leftSection={<IconCoffee size="1rem" stroke={1.5} />}
        rightSection={<IconPlus size="1rem" stroke={1.5} />}
      />
    </>
  );
}
