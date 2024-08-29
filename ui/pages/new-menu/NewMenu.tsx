import { Button, Flex, Input } from "@mantine/core";
import { useCreateMenu } from "../../hooks/create-menu";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu } from "../../types";

export function NewMenu() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const { createMenu } = useCreateMenu({
    onSuccess: (menu: Menu) => {
      navigate(`/admin/menus/${menu.id}`);
    },
  });
  return (
    <Flex direction="column" gap={10}>
      <h1>New Menu</h1>
      <Flex gap={10}>
        <Input
          placeholder="Menu Name"
          value={name}
          onChange={(e) => {
            setName(e.currentTarget.value);
          }}
        />
        <Button
          onClick={() => {
            createMenu({
              name,
            });
          }}
        >
          Create Menu
        </Button>
      </Flex>
    </Flex>
  );
}
