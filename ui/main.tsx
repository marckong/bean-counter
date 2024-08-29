import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "@mantine/core/styles.css";
import "./main.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./query-client.ts";

const theme = createTheme({
  // autoContrast: true,
  // primaryColor: "brown",
  // colors: {
  //   cream: [
  //     "#FFFDF5", // Shade 1
  //     "#FFFCEA", // Shade 2
  //     "#FFFADF", // Shade 3
  //     "#FFF8D4", // Shade 4
  //     "#FFF6C9", // Shade 5
  //     "#FFF5BE", // Shade 6
  //     "#FFF3B3", // Shade 7
  //     "#FFF1A8", // Shade 8
  //     "#FFEF9D", // Shade 9
  //     "#FFED92", // Shade 10
  //   ],
  //   brown: [
  //     "#EFEBE9", // Shade 10
  //     "#D7CCC8", // Shade 9
  //     "#BCAAA4", // Shade 8
  //     "#A1887F", // Shade 7
  //     "#8D6E63", // Shade 6
  //     "#795548", // Shade 5
  //     "#6D4C41", // Shade 4
  //     "#5D4037", // Shade 3
  //     "#4E342E", // Shade 2
  //     "#3E2723", // Shade 1
  //   ],
  // },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>
);
