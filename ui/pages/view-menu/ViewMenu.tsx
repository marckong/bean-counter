import { useNavigate, useParams } from "react-router-dom";
import { useDeleteMenu } from "../../hooks/delete-menu";
import { Button, Flex, Table, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Menu, MenuItem } from "../../types";
import { useMenuItems } from "../../hooks/menus-items";
import { useAssignMenuItem } from "../../hooks/assign-menu-item";
import { queryClient } from "../../query-client";
import { useDeleteMenuMenuItem } from "../../hooks/delete-menu-menu-item";

export function ViewMenu() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { deleteMenu } = useDeleteMenu({
    onSuccess: () => {
      navigate("/admin/");
    },
  });
  const { data: menu } = useQuery<Menu>({
    queryKey: ["menus", id],
    queryFn: async () => {
      const res = await fetch(`/api/menus/${id}`);
      if (!res.ok) {
        navigate("/admin/");
        return;
      }
      return await res.json();
    },
  });
  const { menuItems } = useMenuItems();
  const { data: menuMenuItems } = useQuery<MenuItem[]>({
    queryKey: ["menus", id, "items"],
    queryFn: async () => {
      const res = await fetch(`/api/menus/${id}/items`);
      return await res.json();
    },
  });
  const { assignMenuItem } = useAssignMenuItem({
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["menus", id] });
    },
  });

  const { deleteMenuMenuItem } = useDeleteMenuMenuItem({
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["menus", id, "items"] });
    },
  });

  const availableMenuItems = menuItems?.filter(
    (mi) =>
      !menuMenuItems?.find((mmi: MenuItem) => {
        return mmi.id === mi.id;
      })
  );
  return (
    <Flex direction="column" gap="md">
      <h1>View Menu: {menu?.name}</h1>
      <Flex gap="md">
        {id && (
          <Button
            onClick={() => {
              deleteMenu({ id });
            }}
          >
            Delete
          </Button>
        )}
        {menu?.public_id && menuMenuItems && menuMenuItems.length > 0 && (
          <Button
            onClick={() => {
              window.navigator.clipboard.writeText(
                `${window.location.origin}/menu/${menu?.public_id}`
              );
            }}
          >
            Copy Link
          </Button>
        )}
      </Flex>
      <Flex direction="column" gap="lg">
        <Title order={2}>Available Menu Items</Title>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {availableMenuItems && availableMenuItems.length > 0 ? (
              availableMenuItems.map((menu_item) => (
                <Table.Tr key={menu_item.id}>
                  <Table.Td>{menu_item.name}</Table.Td>
                  <Table.Td>
                    <Button
                      onClick={() =>
                        assignMenuItem({
                          menuId: `${menu?.id}`,
                          menuItemId: menu_item.id,
                        })
                      }
                    >
                      Assign
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr style={{ height: 120, textAlign: "center" }}>
                <Table.Td colSpan={2}>
                  <span>no more available menu items</span>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
        <Title order={2}>Selected Menu Items</Title>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Item Name</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {menuMenuItems && menuMenuItems.length > 0 ? (
              menuMenuItems.map((menu_item) => (
                <Table.Tr key={menu_item.id}>
                  <Table.Td>{menu_item.name}</Table.Td>
                  <Table.Td>
                    <Button
                      onClick={() =>
                        deleteMenuMenuItem({
                          menuId: `${menu?.id}`,
                          menuItemId: menu_item.id,
                        })
                      }
                    >
                      Delete
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr style={{ height: 120, textAlign: "center" }}>
                <Table.Td colSpan={2}>
                  select items from the list above
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Flex>
    </Flex>
  );
}
