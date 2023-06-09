import { render, screen, waitFor } from "@testing-library/react";
import ClothIndexPage from "main/pages/Cloths/ClothIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockDelete = jest.fn();
jest.mock('main/utils/clothUtils', () => {
    return {
        __esModule: true,
        clothUtils: {
            del: (id) => {
                return mockDelete(id);
            },
            get: () => {
                return {
                    nextId: 5,
                    cloths: [
                        {
                            id: 3,
                            name: "Balenciaga Shoes",
                            type: "shoes",
                            brand: "Balenciaga"
                            
                        },
                    ]
                }
            }
        }
    }
});


describe("ClothIndexPage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ClothIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders correct fields", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ClothIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const createClothButton = screen.getByText("Create Cloth");
        expect(createClothButton).toBeInTheDocument();
        expect(createClothButton).toHaveAttribute("style", "float: right;");

        const name = screen.getByText("Balenciaga Shoes");
        expect(name).toBeInTheDocument();

        const brand = screen.getByText("Balenciaga");
        expect(brand).toBeInTheDocument();

        expect(screen.getByTestId("ClothTable-cell-row-0-col-Delete-button")).toBeInTheDocument();
        expect(screen.getByTestId("ClothTable-cell-row-0-col-Details-button")).toBeInTheDocument();
        expect(screen.getByTestId("ClothTable-cell-row-0-col-Edit-button")).toBeInTheDocument();
    });

    test("delete button calls delete and reloads page", async () => {

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ClothIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const name = screen.getByText("Balenciaga Shoes");
        expect(name).toBeInTheDocument();

        const brand = screen.getByText("Balenciaga");
        expect(brand).toBeInTheDocument();

        const deleteButton = screen.getByTestId("ClothTable-cell-row-0-col-Delete-button");
        expect(deleteButton).toBeInTheDocument();

        deleteButton.click();

        expect(mockDelete).toHaveBeenCalledTimes(1);
        expect(mockDelete).toHaveBeenCalledWith(3);

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/cloths"));


        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = "ClothIndexPage deleteCallback: {\"id\":3,\"name\":\"Balenciaga Shoes\",\"type\":\"shoes\",\"brand\":\"Balenciaga\"})";
        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


