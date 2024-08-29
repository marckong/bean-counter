import { MutationFunction, useMutation } from "@tanstack/react-query";
import { queryClient } from "../query-client";
import { Menu, MenuRequest } from "../types";

const postMenu: MutationFunction<Menu, MenuRequest> = async (
  menu: MenuRequest
) => {
  const res = await fetch("/api/menus", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(menu),
  });
  return await res.json();
};

export function useCreateMenu({
  onSuccess,
}: {
  onSuccess: (data: Menu) => void;
}) {
  const { mutate: createMenu } = useMutation<Menu, Error, MenuRequest>({
    mutationFn: postMenu,
    onSuccess: (data) => {
      queryClient.setQueryData(["menus", data.id], data);
      queryClient.setQueryData(["menus"], (old: Menu[] | undefined) => {
        if (!old) return [data];
        return [data, ...old];
      });
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      onSuccess(data);
    },
  });
  return {
    createMenu,
  };
}
