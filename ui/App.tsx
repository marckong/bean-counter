import { Navigate, Route, Routes } from "react-router-dom";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { NewMenu } from "./pages/new-menu/NewMenu";
import { ViewMenu } from "./pages/view-menu/ViewMenu";
import { EditMenu } from "./pages/edit-menu/EditMenu";
import { MenuItems } from "./pages/menu-items/MenuItems";
import { Login } from "./pages/login/Login";
import { Order } from "./pages/order/Order";
import { ViewOrder } from "./pages/view-order/ViewOrder";
import { AdminLayout } from "./layouts/admin";
import { StandardLayout } from "./layouts/standard";
import { Home } from "./pages/home/Home";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<StandardLayout />}>
        <Route index element={<Home />} />
      </Route>
      <Route path="/login" element={<StandardLayout />}>
        <Route index element={<Login />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="menus/new" element={<NewMenu />} />
        <Route path="menus/edit/:id" element={<EditMenu />} />
        <Route path="menus/:id" element={<ViewMenu />} />
        <Route path="menu-items" element={<MenuItems />} />
      </Route>
      <Route path="orders" element={<StandardLayout />}>
        <Route path=":orderId" element={<ViewOrder />} />
      </Route>

      <Route path="menu" element={<StandardLayout />}>
        <Route index element={<Navigate to="/" />} />
        <Route path=":publicId" element={<Order />} />
      </Route>
    </Routes>
  );
}
