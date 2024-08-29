import { Button, Divider, Flex, Modal, TextInput, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Order } from "../../types";

export function Home() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [searchName, setSearchName] = useState<string>();

  const {
    data: searchResults,
    isLoading,
    refetch,
  } = useQuery<Order[]>({
    queryKey: ["orders", "search"],
    enabled: false,
    queryFn: async () => {
      const res = await fetch(`/api/ordersearch/${searchName}`);
      if (!res.ok) {
        return false;
      }
      return await res.json();
    },
  });

  return (
    <>
      <Flex direction="column" gap="lg" align="center">
        <Title order={4}>
          A coffee menu and ordering app for private events.
        </Title>
        <Button size="md" onClick={() => toggle()}>
          Find my Order
        </Button>
      </Flex>
      <Modal opened={opened} onClose={close} title="Find your order">
        <Flex direction="column" gap="lg">
          {searchResults ? (
            searchResults.length === 0 ? (
              <Title order={4}>No results found</Title>
            ) : (
              <Flex direction="column" gap="md">
                <Title order={4}>Results</Title>
                {searchResults.map((result) => (
                  <Link
                    key={result.id}
                    to={`/orders/${result.id}`}
                    onClick={() => {
                      close();
                    }}
                  >
                    {result.customer_name} -{" "}
                    {new Date(result.created_at * 1000).toLocaleString()}
                  </Link>
                ))}
              </Flex>
            )
          ) : null}
          <Divider />

          <TextInput
            label="Name on order"
            placeholder="Enter the name on your order"
            onChange={(e) => {
              setSearchName(e.currentTarget.value);
            }}
          />
          <Flex gap="md" justify="flex-end">
            <Button onClick={close} variant="subtle">
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={() => {
                refetch();
              }}
            >
              Find
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
}
