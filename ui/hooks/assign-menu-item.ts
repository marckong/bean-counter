import { MutationFunction, useMutation } from "@tanstack/react-query";

const assignMenuItem: MutationFunction<
  null,
  { menuId: string; menuItemId: string }
> = async ({ menuId, menuItemId }) => {
  const res = await fetch(`/api/menus/${menuId}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ menu_item_id: menuItemId }),
  });
  return await res.json();
};

export function useAssignMenuItem({ onSuccess }: { onSuccess: () => void }) {
  const { mutate: assignMenuItemMutation } = useMutation<
    null,
    Error,
    { menuId: string; menuItemId: string }
  >({
    mutationFn: assignMenuItem,
    onSuccess: () => {
      onSuccess();
    },
  });
  return {
    assignMenuItem: assignMenuItemMutation,
  };
}
