import { render } from "@testing-library/react";
import ArroyoGrandePage from "main/pages/Towns/ArroyoGrandePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

describe("ArroyoGrandePage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArroyoGrandePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

});


