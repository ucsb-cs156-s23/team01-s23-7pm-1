import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import ClothTable, { showCell } from "main/components/Cloths/ClothTable";
import { clothFixtures } from "fixtures/clothFixtures";
import mockConsole from "jest-mock-console";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe("ClothTable tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = ["id", "Name", "Type", "Brand"];
  const expectedFields = ["id", "name", "type", "brand"];
  const testId = "ClothTable";

  test("showCell function works properly", () => {
    const cell = {
      row: {
        values: { a: 1, b: 2, c: 3 }
      },
    };
    expect(showCell(cell)).toBe(`{"a":1,"b":2,"c":3}`);
  });

  test("renders without crashing for empty table", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ClothTable cloths={[]} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });



  test("Has the expected column headers, content and buttons", () => {

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ClothTable cloths={clothFixtures.threeCloths} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Givenchy Shirt");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-name`)).toHaveTextContent("Balenciaga Shoes");

    const detailsButton = screen.getByTestId(`${testId}-cell-row-0-col-Details-button`); 
    expect(detailsButton).toBeInTheDocument();
    expect(detailsButton).toHaveClass("btn-primary");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");

  });

  test("Has the expected column headers, content and no buttons when showButtons=false", () => {

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ClothTable cloths={clothFixtures.threeCloths} showButtons={false} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Givenchy Shirt");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-name`)).toHaveTextContent("Balenciaga Shoes");

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Details")).not.toBeInTheDocument();
  });


  test("Edit button navigates to the edit page", async () => {
    // arrange
    const restoreConsole = mockConsole();

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ClothTable cloths={clothFixtures.threeCloths} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Givenchy Shirt");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();

    // act - click the edit button
    fireEvent.click(editButton);

    // assert - check that the navigate function was called with the expected path
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/cloths/edit/2'));

    // assert - check that the console.log was called with the expected message
    expect(console.log).toHaveBeenCalled();
    const message = console.log.mock.calls[0][0];
    const expectedMessage = "editCallback: {\"id\":2,\"name\":\"Givenchy Shirt\",\"type\":\"shirt\",\"brand\":\"Givenchy\"})";
    expect(message).toMatch(expectedMessage);
    restoreConsole();
  });

  test("Details button navigates to the details page", async () => {
    // arrange
    const restoreConsole = mockConsole();

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ClothTable cloths={clothFixtures.threeCloths} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Givenchy Shirt");

    const detailsButton = screen.getByTestId(`${testId}-cell-row-0-col-Details-button`);
    expect(detailsButton).toBeInTheDocument();

    // act - click the details button
    fireEvent.click(detailsButton);

    // assert - check that the navigate function was called with the expected path
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/cloths/details/2'));

    // assert - check that the console.log was called with the expected message
    expect(console.log).toHaveBeenCalled();
    const message = console.log.mock.calls[0][0];
    const expectedMessage = "detailsCallback: {\"id\":2,\"name\":\"Givenchy Shirt\",\"type\":\"shirt\",\"brand\":\"Givenchy\"})";
    expect(message).toMatch(expectedMessage);
    restoreConsole();
  });

  test("Delete button calls delete callback", async () => {
    // arrange
    const restoreConsole = mockConsole();

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ClothTable cloths={clothFixtures.threeCloths} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Givenchy Shirt");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();

     // act - click the delete button
    fireEvent.click(deleteButton);

     // assert - check that the console.log was called with the expected message
     await(waitFor(() => expect(console.log).toHaveBeenCalled()));
     const message = console.log.mock.calls[0][0];
     const expectedMessage = "deleteCallback: {\"id\":2,\"name\":\"Givenchy Shirt\",\"type\":\"shirt\",\"brand\":\"Givenchy\"})";
     expect(message).toMatch(expectedMessage);
     restoreConsole();
  });
});
