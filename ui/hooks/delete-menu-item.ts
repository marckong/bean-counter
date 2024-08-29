import { MutationFunction, useMutation } from "@tanstack/react-query";
import { queryClient } from "../query-client";

const deleteMenuItemCall: MutationFunction<string, string> = async (
  menuItemId: string
) => {
  const res = await fetch(`/api/menu-items/${menuItemId}`, {
    method: "DELETE",
  });
  return res.ok ? menuItemId : "";
};

export function useDeleteMenuItem({
  onSuccess,
}: {
  onSuccess: (data: string) => void;
}) {
  const { mutate: deleteMenuItem } = useMutation<string, Error, string>({
    mutationFn: deleteMenuItemCall,
    onSuccess: (id) => {
      queryClient.removeQueries({ queryKey: ["menu-items", id] });
      queryClient.removeQueries({ queryKey: ["menus"] });
      onSuccess(id);
    },
  });
  return {
    deleteMenuItem,
  };
}
