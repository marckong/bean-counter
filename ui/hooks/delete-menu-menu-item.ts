import { MutationFunction, useMutation } from "@tanstack/react-query";

const assignMenuItem: MutationFunction<
  boolean,
  { menuId: string; menuItemId: string }
> = async ({ menuId, menuItemId }) => {
  const res = await fetch(`/api/menus/${menuId}/items/${menuItemId}`, {
    method: "DELETE",
  });
  return res.ok;
};

export function useDeleteMenuMenuItem({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const { mutate: deleteMenuMenuItem } = useMutation<
    boolean,
    Error,
    { menuId: string; menuItemId: string }
  >({
    mutationFn: assignMenuItem,
    onSuccess: () => {
      onSuccess();
    },
  });
  return {
    deleteMenuMenuItem,
  };
}
