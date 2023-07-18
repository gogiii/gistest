import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider, QueryClient } from "react-query";
import AppMain from "./AppMain";

const queryClient = new QueryClient();
const root = createRoot(document.getElementById("root"));
root.render(<QueryClientProvider client={queryClient}><AppMain/></QueryClientProvider>);