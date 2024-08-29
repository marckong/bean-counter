import { Flex, Paper, Table, Title } from "@mantine/core";
import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { OrderDetails } from "../../types";

export const ViewOrder = () => {
  const { orderId } = useParams();
  const { data: orderData, isLoading: loadingOrder } = useQuery<OrderDetails>({
    queryKey: ["orders", orderId],
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchInterval: 3500,
    queryFn: async () => {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) {
        return false;
      }
      return await res.json();
    },
  });

  if (loadingOrder) {
    return <div>Loading...</div>;
  }

  if (!orderData) {
    return <Navigate to="/" />;
  }

  return (
    <Flex direction="column" gap="lg">
      <Title order={2}>Order Status</Title>
      <Title order={6}>
        Last updated at{" "}
        {new Date(orderData.order.updated_at * 1000).toLocaleString()}
      </Title>
      <Paper withBorder p="md">
        <Title order={3}>
          {orderData.order.status === "created" && "Received"}
          {orderData.order.status === "processing" && "Working on it now"}
          {orderData.order.status === "done" &&
            `Your order is ready, ${orderData.order.customer_name}!`}
        </Title>
      </Paper>
      <Title order={2}>Order Details</Title>
      <Paper withBorder p="md">
        <Table variant="veritical" withColumnBorders>
          <Table.Tbody>
            <Table.Tr>
              <Table.Th>Order ID</Table.Th>
              <Table.Td>{orderId}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>Placed At</Table.Th>
              <Table.Td>
                {new Date(orderData.order.created_at * 1000).toLocaleString()}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Td>{orderData.order.customer_name}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>Item(s)</Table.Th>
              <Table.Td>
                {orderData.items.map((item, i) => (
                  <div key={i}>{item}</div>
                ))}
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Paper>
    </Flex>
  );
};
