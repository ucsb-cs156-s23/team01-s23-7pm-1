import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import ClothEditPage from "main/pages/Cloths/ClothEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 3
    }),
    useNavigate: () => mockNavigate
}));

const mockUpdate = jest.fn();
jest.mock('main/utils/clothUtils', () => {
    return {
        __esModule: true,
        clothUtils: {
            update: (_cloth) => {return mockUpdate();},
            getById: (_id) => {
                return {
                    cloth: {
                        id: 3,
                        name: "Balenciaga Shoes",
                        type: "shoes",
                        brand: "Balenciaga"
                        
                    }
                }
            }
        }
    }
});


describe("ClothEditPage tests", () => {

    const queryClient = new QueryClient();

    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ClothEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ClothEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByTestId("ClothForm-name")).toBeInTheDocument();
        expect(screen.getByDisplayValue('Balenciaga Shoes')).toBeInTheDocument();
        expect(screen.getByDisplayValue('shoes')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Balenciaga')).toBeInTheDocument();
        
    });

    test("redirects to /cloths on submit", async () => {

        const restoreConsole = mockConsole();

        mockUpdate.mockReturnValue({
            "cloth": {
                id: 3,
                name: "Balenciaga Shoes",
                type: "shoes",
                brand: "Balenciaga",
               
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ClothEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();

        const typeInput = screen.getByLabelText("Type");
        expect(typeInput).toBeInTheDocument();

        const brandInput = screen.getByLabelText("Brand");
        expect(brandInput).toBeInTheDocument();

        const updateButton = screen.getByText("Update");
        expect(updateButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(nameInput, { target: { value: 'Balenciaga Shoes' } })
            fireEvent.change(typeInput, { target: { value: 'shoes' } })
            fireEvent.change(brandInput, { target: { value: 'Balenciaga' } })
            fireEvent.click(updateButton);
        });

        await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/cloths"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `updatedCloth: {"cloth":{"id":3,"name":"Balenciaga Shoes","type":"shoes","brand":"Balenciaga"}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});
