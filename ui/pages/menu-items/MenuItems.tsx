import { Button, Flex, Input, Table } from "@mantine/core";
import { useMenuItems } from "../../hooks/menus-items";
import { useState } from "react";
import { useCreateMenuItem } from "../../hooks/create-menu-item";
import { queryClient } from "../../query-client";
import { useDeleteMenuItem } from "../../hooks/delete-menu-item";
import { IconTrash } from "@tabler/icons-react";

export function MenuItems() {
  const { menuItems, loading } = useMenuItems();
  const [newMenuItem, setNewMenuItem] = useState({ name: "" });
  const { createMenuItem } = useCreateMenuItem({
    onSuccess: () => {
      setNewMenuItem({ name: "" });
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    },
  });
  const { deleteMenuItem } = useDeleteMenuItem({
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["menu-items"] });
    },
  });
  return (
    <Flex direction="column" gap={10}>
      <h1>Menu Items</h1>
      <Flex gap={10}>
        <Input
          maw={300}
          required
          placeholder="New menu item"
          value={newMenuItem.name}
          onChange={(e) => {
            setNewMenuItem({ name: e.currentTarget.value });
          }}
        />
        <Button
          onClick={() => {
            createMenuItem({ ...newMenuItem });
          }}
        >
          Add
        </Button>
      </Flex>
      {loading ? (
        <b>loading...</b>
      ) : (
        <Table style={{ flexShrink: "1" }}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Item</Table.Th>
              {/* <Table.Th>Sold Out</Table.Th> */}
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {menuItems && menuItems.length > 0 ? (
              menuItems.map((menuItem) => (
                <Table.Tr key={menuItem.id}>
                  <Table.Td>{menuItem.name}</Table.Td>
                  {/* <Table.Td>
                    <Switch checked={menuItem.sold_out} />
                  </Table.Td> */}
                  <Table.Td>
                    <Button
                      variant="subtle"
                      color="red"
                      size="compact-sm"
                      onClick={() => {
                        deleteMenuItem(menuItem.id);
                      }}
                    >
                      <IconTrash size="1rem" stroke={1.5} />
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr style={{ height: 120, textAlign: "center" }}>
                <Table.Td colSpan={3}>
                  <span>no menu items</span>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      )}
    </Flex>
  );
}
