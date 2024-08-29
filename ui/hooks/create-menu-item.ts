import { MutationFunction, useMutation } from "@tanstack/react-query";
import { MenuItem, MenuItemRequest } from "../types";
import { queryClient } from "../query-client";

const postMenuItem: MutationFunction<MenuItem, MenuItemRequest> = async (
  menuItem: MenuItemRequest
) => {
  const res = await fetch("/api/menu-items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(menuItem),
  });
  return await res.json();
};

export function useCreateMenuItem({
  onSuccess,
}: {
  onSuccess: (data: MenuItem) => void;
}) {
  const { mutate: createMenuItem } = useMutation<
    MenuItem,
    Error,
    MenuItemRequest
  >({
    mutationFn: postMenuItem,
    onSuccess: (data) => {
      queryClient.setQueryData(["menu-items", data.id], data);
      queryClient.setQueryData(
        ["menu-items"],
        (old: MenuItem[] | undefined) => {
          if (!old) return [data];
          return [data, ...old];
        }
      );
      onSuccess(data);
    },
  });
  return {
    createMenuItem,
  };
}
