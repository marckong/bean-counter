import { useQuery } from "@tanstack/react-query";
import { MenuItem } from "../types";
import { queryClient } from "../query-client";
import { useNavigate } from "react-router-dom";

export function useMenuItems() {
  const navigate = useNavigate();
  const { data: menuItems, isLoading: loading } = useQuery<MenuItem[]>({
    queryKey: ["menu-items"],
    queryFn: async () => {
      const res = await fetch("/api/menu-items", { credentials: "include" });
      if (res.status === 401) {
        navigate("/login", { replace: true });
        return [];
      }
      const menuItems = (await res.json()) as MenuItem[];
      menuItems.forEach((menuItem) => {
        queryClient.setQueryData(["menu-items", menuItem.id], menuItem);
      });
      return menuItems;
    },
  });

  return {
    menuItems,
    loading,
  };
}
