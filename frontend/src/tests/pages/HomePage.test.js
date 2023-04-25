import { render, screen, fireEvent } from "@testing-library/react";
import HomePage from "main/pages/HomePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

describe("HomePage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HomePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("localstorage button invokes clear function", () => {
         // arrange
         const clearSpy = jest.spyOn(Storage.prototype, 'clear');
         clearSpy.mockImplementation(() => null);

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HomePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const clearLocalStorage = screen.getByText(/Clear Local Storage/);
        fireEvent.click(clearLocalStorage);

        // assert
        expect(clearSpy).toHaveBeenCalled();
    });

});


