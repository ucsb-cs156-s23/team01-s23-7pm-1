import { render, screen } from "@testing-library/react";
import ClothDetailsPage from "main/pages/Cloths/ClothDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 3
    }),
    useNavigate: () => mockNavigate
}));

jest.mock('main/utils/clothUtils', () => {
    return {
        __esModule: true,
        clothUtils: {
            getById: (_id) => {
                return {
                    restaurant: {
                        id: 3,
                        name: "Balenciaga Coat",
                        type: "coat",
                        brand: "Balenciaga",
                    }
                }
            }
        }
    }
});

describe("ClothDetailsPage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ClothDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields, and no buttons", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ClothDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(screen.getByText("Balenciaga Coat")).toBeInTheDocument();
        expect(screen.getByText("coat")).toBeInTheDocument();

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });

});

