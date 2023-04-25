import { render } from "@testing-library/react";
import LosAlamosPage from "main/pages/Towns/LosAlamosPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

describe("ArroyoGrandePage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <LosAlamosPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

});


