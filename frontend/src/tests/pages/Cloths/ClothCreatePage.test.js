import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import ClothCreatePage from "main/pages/Cloths/ClothCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockAdd = jest.fn();
jest.mock('main/utils/clothUtils', () => {
    return {
        __esModule: true,
        clothUtils: {
            add: () => { return mockAdd(); }
        }
    }
});

describe("ClothCreatePage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ClothCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("redirects to /cloths on submit", async () => {

        const restoreConsole = mockConsole();

        mockAdd.mockReturnValue({
            "cloth": {
                id: 3,
                name: "Balenciaga Shoes",
                type: "shoes",
                brand: "Balenciaga"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ClothCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();

        const typeInput = screen.getByLabelText("Type");
        expect(typeInput).toBeInTheDocument();

        const brandInput = screen.getByLabelText("Brand");
        expect(brandInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(nameInput, { target: { value: 'Balenciaga Shoes' } })
            fireEvent.change(typeInput, { target: { value: 'shoes' } })
            fireEvent.change(brandInput, { target: { value: 'Balenciaga' } })
            fireEvent.click(createButton);
        });

        await waitFor(() => expect(mockAdd).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/cloths"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `createdCloth: {"cloth":{"id":3,"name":"Balenciaga Shoes","type":"shoes","brand":"Balenciaga"}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});
