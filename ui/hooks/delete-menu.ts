import { MutationFunction, useMutation } from "@tanstack/react-query";
import { queryClient } from "../query-client";
import { Menu, MenuDeleteRequest } from "../types";

const mutationFn: MutationFunction<string, MenuDeleteRequest> = async (
  menu: MenuDeleteRequest
) => {
  const res = await fetch(`/api/menus/${menu.id}`, {
    method: "DELETE",
  });
  return res.ok ? menu.id : "";
};

export function useDeleteMenu({
  onSuccess,
}: {
  onSuccess: (data: string) => void;
}) {
  const { mutate: deleteMenu } = useMutation<string, Error, MenuDeleteRequest>({
    mutationFn,
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.setQueryData(["menus"], (old: Menu[]) => {
        return old.filter((menu: Menu) => menu.id !== `${data}`);
      });
      // queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });
  return {
    deleteMenu,
  };
}
