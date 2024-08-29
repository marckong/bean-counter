import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { OrdersItems } from "../../types";
import { Button, Flex, Table, Title } from "@mantine/core";
import { queryClient } from "../../query-client";
import { useState } from "react";

export function Dashboard() {
  const navigate = useNavigate();
  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  const { data: orders, isLoading } = useQuery<OrdersItems[]>({
    queryKey: ["orders"],
    refetchOnMount: "always",
    refetchInterval: 5000,
    queryFn: async () => {
      const res = await fetch("/api/orders", { credentials: "include" });
      if (res.status === 401) {
        navigate("/login", { replace: true });
        return [];
      }
      return await res.json();
    },
  });

  const { mutate: updateOrder } = useMutation<
    unknown,
    Error,
    { order_id: string; order_status: string }
  >({
    mutationFn: async ({ order_id, order_status }) => {
      const res = await fetch(`/api/orders/${order_id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: order_status }),
      });
      return await res.json();
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onSettled(_, __, { order_id }) {
      setUpdating((prev) => ({
        ...prev,
        [order_id]: false,
      }));
    },
  });

  const activeOrders = orders
    ?.filter((order) => order.order_status !== "done")
    .sort((a, b) => {
      if (a.order_status === "created" && b.order_status === "processing") {
        return 1;
      }
      if (a.order_status === "processing" && b.order_status === "created") {
        return -1;
      }
      return 0;
    });

  const completedOrders = orders
    ?.filter((order) => order.order_status === "done")
    .reverse();

  return (
    <Flex direction="column" gap="lg">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Title order={2}>Active Orders</Title>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Customer</Table.Th>
                <Table.Th>Item</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {activeOrders && activeOrders.length > 0 ? (
                activeOrders?.map((order) => (
                  <Table.Tr key={order.order_id}>
                    <Table.Td>{order.customer_name}</Table.Td>
                    <Table.Td>{order.item_name}</Table.Td>
                    <Table.Td>
                      {order.order_status === "created" && "Received"}
                      {order.order_status === "processing" && "In Progress"}
                      {order.order_status === "done" && "Order Ready"}
                    </Table.Td>
                    <Table.Td>
                      {order.order_status === "created" ? (
                        <Button
                          size="compact-sm"
                          disabled={updating[order.order_id]}
                          onClick={() => {
                            setUpdating((prev) => ({
                              ...prev,
                              [order.order_id]: true,
                            }));
                            updateOrder({
                              order_id: order.order_id,
                              order_status: "processing",
                            });
                          }}
                        >
                          Start
                        </Button>
                      ) : order.order_status === "processing" ? (
                        <Button
                          size="compact-sm"
                          disabled={updating[order.order_id]}
                          onClick={() => {
                            setUpdating((prev) => ({
                              ...prev,
                              [order.order_id]: true,
                            }));
                            updateOrder({
                              order_id: order.order_id,
                              order_status: "done",
                            });
                          }}
                        >
                          Done
                        </Button>
                      ) : (
                        <span></span>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr style={{ height: 120, textAlign: "center" }}>
                  <Table.Td colSpan={4}>
                    <span>no more active orders</span>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </>
      )}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Title order={2}>Completed Orders</Title>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Customer</Table.Th>
                <Table.Th>Item</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {completedOrders?.map((order) => (
                <Table.Tr key={order.order_id}>
                  <Table.Td>{order.customer_name}</Table.Td>
                  <Table.Td>{order.item_name}</Table.Td>
                  <Table.Td>
                    {order.order_status === "created" && "Received"}
                    {order.order_status === "processing" && "In Progress"}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </>
      )}
    </Flex>
  );
}
