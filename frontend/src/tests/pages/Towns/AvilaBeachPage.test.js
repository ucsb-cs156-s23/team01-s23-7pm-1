import { render } from "@testing-library/react";
import AvilaBeachPage from "main/pages/Towns/AvilaBeachPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

describe("ArroyoGrandePage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AvilaBeachPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

});


