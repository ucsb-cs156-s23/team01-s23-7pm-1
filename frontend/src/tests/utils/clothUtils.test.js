import { clothFixtures } from "fixtures/clothFixtures";
import { clothUtils } from "main/utils/clothUtils";

describe("clothUtils tests", () => {
    // return a function that can be used as a mock implementation of getItem
    // the value passed in will be convertd to JSON and returned as the value
    // for the key "cloths".  Any other key results in an error
    const createGetItemMock = (returnValue) => (key) => {
        if (key === "cloths") {
            return JSON.stringify(returnValue);
        } else {
            throw new Error("Unexpected key: " + key);
        }
    };

    describe("get", () => {

        test("When cloths is undefined in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(undefined));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = clothUtils.get();

            // assert
            const expected = { nextId: 1, cloths: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("cloths", expectedJSON);
        });

        test("When cloths is null in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(null));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = clothUtils.get();

            // assert
            const expected = { nextId: 1, cloths: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("cloths", expectedJSON);
        });

        test("When cloths is [] in local storage, should return []", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, cloths: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = clothUtils.get();

            // assert
            const expected = { nextId: 1, cloths: [] };
            expect(result).toEqual(expected);

            expect(setItemSpy).not.toHaveBeenCalled();
        });

        test("When cloths is JSON of three cloths, should return that JSON", () => {

            // arrange
            const threeCloths = clothFixtures.threeCloths;
            const mockclothCollection = { nextId: 10, cloths: threeCloths };

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(mockclothCollection));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = clothUtils.get();

            // assert
            expect(result).toEqual(mockclothCollection);
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });


    describe("getById", () => {
        test("Check that getting a cloth by id works", () => {

            // arrange
            const threeCloths = clothFixtures.threeCloths;
            const idToGet = threeCloths[1].id;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, cloths: threeCloths }));

            // act
            const result = clothUtils.getById(idToGet);

            // assert

            const expected = { cloth: threeCloths[1] };
            expect(result).toEqual(expected);
        });

        test("Check that getting a non-existing cloth returns an error", () => {

            // arrange
            const threeCloths = clothFixtures.threeCloths;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, cloths: threeCloths }));

            // act
            const result = clothUtils.getById(99);

            // assert
            const expectedError = `cloth with id 99 not found`
            expect(result).toEqual({ error: expectedError });
        });

        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeCloths = clothFixtures.threeCloths;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, cloths: threeCloths }));

            // act
            const result = clothUtils.getById();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });

    });
    describe("add", () => {
        test("Starting from [], check that adding one cloth works", () => {

            // arrange
            const cloth = clothFixtures.oneCloth[0];
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, cloths: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = clothUtils.add(cloth);

            // assert
            expect(result).toEqual(cloth);
            expect(setItemSpy).toHaveBeenCalledWith("cloths",
                JSON.stringify({ nextId: 2, cloths: clothFixtures.oneCloth }));
        });
    });

    describe("update", () => {
        test("Check that updating an existing cloth works", () => {

            // arrange
            const threeCloths = clothFixtures.threeCloths;
            const updatedcloth = {
                ...threeCloths[0],
                name: "Updated Name"
            };
            const threeClothsUpdated = [
                updatedcloth,
                threeCloths[1],
                threeCloths[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, cloths: threeCloths }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = clothUtils.update(updatedcloth);

            // assert
            const expected = { clothCollection: { nextId: 5, cloths: threeClothsUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("cloths", JSON.stringify(expected.clothCollection));
        });
        test("Check that updating an non-existing cloth returns an error", () => {

            // arrange
            const threeCloths = clothFixtures.threeCloths;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, cloths: threeCloths }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            const updatedcloth = {
                id: 99,
                name: "Fake Name",
                description: "Fake Description"
            }

            // act
            const result = clothUtils.update(updatedcloth);

            // assert
            const expectedError = `cloth with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });

    describe("del", () => {
        test("Check that deleting a cloth by id works", () => {

            // arrange
            const threeCloths = clothFixtures.threeCloths;
            const idToDelete = threeCloths[1].id;
            const threeClothsUpdated = [
                threeCloths[0],
                threeCloths[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, cloths: threeCloths }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = clothUtils.del(idToDelete);

            // assert

            const expected = { clothCollection: { nextId: 5, cloths: threeClothsUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("cloths", JSON.stringify(expected.clothCollection));
        });
        test("Check that deleting a non-existing cloth returns an error", () => {

            // arrange
            const threeCloths = clothFixtures.threeCloths;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, cloths: threeCloths }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = clothUtils.del(99);

            // assert
            const expectedError = `cloth with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeCloths = clothFixtures.threeCloths;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, cloths: threeCloths }));

            // act
            const result = clothUtils.del();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });
    });
});

