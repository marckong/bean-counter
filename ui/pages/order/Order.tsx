import { Button, Flex, Input, Radio } from "@mantine/core";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MenuItem } from "../../types";
import { useEffect, useState } from "react";

export const Order = () => {
  const { publicId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const { data: menu, isLoading: menuLoading } = useQuery({
    queryKey: ["menus", publicId],
    queryFn: async () => {
      const res = await fetch(`/api/menus/${publicId}`);
      if (!res.ok) {
        return [];
      }
      return await res.json();
    },
  });
  const { data: menuMenuItems, isLoading } = useQuery({
    queryKey: ["menus", publicId, "items"],
    queryFn: async () => {
      const res = await fetch(`/api/menus/${publicId}/items`);
      if (!res.ok) {
        return [];
      }
      return await res.json();
    },
  });

  useEffect(() => {
    const order = localStorage.getItem(`order_${publicId}`);
    if (order) {
      const details = JSON.parse(order);
      navigate(`/orders/${details.orderId}`);
    }
  }, [publicId, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!menuMenuItems?.length) {
    return <Navigate to="/" />;
  }

  const submitForm = async (e: React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const res = await fetch(`/api/menus/${publicId}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        item,
      }),
    });
    if (!res.ok) {
      alert("Failed to submit order");
    } else {
      const orderId = (await res.json()).id;
      localStorage.setItem(
        `order_${publicId}`,
        JSON.stringify({
          publicId,
          orderId,
        })
      );
      navigate(`/orders/${orderId}`);
    }
  };

  return (
    <form onSubmit={submitForm}>
      <Flex direction="column" gap="lg" maw={800} align="start">
        {menuLoading ? <h1>loading...</h1> : <h1>{menu.name} - Menu</h1>}
        <Input
          required
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Radio.Group value={item} onChange={(v) => setItem(v)}>
          <Flex gap="md" justify="space-evenly" wrap="wrap">
            {menuMenuItems.map((menuItem: MenuItem) => (
              <Radio.Card
                key={menuItem.id}
                value={menuItem.id}
                maw={250}
                p="md"
                style={{
                  width: "auto",
                  ...(menuItem.id === item
                    ? { borderColor: "var(--mantine-primary-color-filled)" }
                    : {}),
                }}
              >
                {menuItem.name}
              </Radio.Card>
            ))}
          </Flex>
        </Radio.Group>
        <Button type="submit">Submit Order</Button>
      </Flex>
    </form>
  );
};
