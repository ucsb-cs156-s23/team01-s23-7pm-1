import { clothesFixtures } from "fixtures/clothesFixtures";
import { clothesUtils } from "main/utils/clothesUtils";

describe("clothesUtils tests", () => {
    // return a function that can be used as a mock implementation of getItem
    // the value passed in will be convertd to JSON and returned as the value
    // for the key "clothess".  Any other key results in an error
    const createGetItemMock = (returnValue) => (key) => {
        if (key === "clothess") {
            return JSON.stringify(returnValue);
        } else {
            throw new Error("Unexpected key: " + key);
        }
    };

    describe("get", () => {

        test("When clothess is undefined in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(undefined));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = clothesUtils.get();

            // assert
            const expected = { nextId: 1, clothess: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("clothess", expectedJSON);
        });

        test("When clothess is null in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(null));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = clothesUtils.get();

            // assert
            const expected = { nextId: 1, clothess: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("clothess", expectedJSON);
        });

        test("When clothess is [] in local storage, should return []", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, clothess: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = clothesUtils.get();

            // assert
            const expected = { nextId: 1, clothess: [] };
            expect(result).toEqual(expected);

            expect(setItemSpy).not.toHaveBeenCalled();
        });

        test("When clothess is JSON of three clothess, should return that JSON", () => {

            // arrange
            const threeclothess = clothesFixtures.threeclothess;
            const mockclothesCollection = { nextId: 10, clothess: threeclothess };

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(mockclothesCollection));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = clothesUtils.get();

            // assert
            expect(result).toEqual(mockclothesCollection);
            expect(setItemSpy).not.toHaveBeenCalled();
        });
        
    });


    describe("getById", () => {
        test("Check that getting a clothes by id works", () => {

            // arrange
            const threeclothess = clothesFixtures.threeclothess;
            const idToGet = threeclothess[1].id;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, clothess: threeclothess }));

            // act
            const result = clothesUtils.getById(idToGet);

            // assert

            const expected = { clothes: threeclothess[1] };
            expect(result).toEqual(expected);
        });

        test("Check that getting a non-existing clothes returns an error", () => {

            // arrange
            const threeclothess = clothesFixtures.threeclothess;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, clothess: threeclothess }));

            // act
            const result = clothesUtils.getById(99);

            // assert
            const expectedError = `clothes with id 99 not found`
            expect(result).toEqual({ error: expectedError });
        });

        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeclothess = clothesFixtures.threeclothess;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, clothess: threeclothess }));

            // act
            const result = clothesUtils.getById();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });

    });
    describe("add", () => {
        test("Starting from [], check that adding one clothes works", () => {

            // arrange
            const clothes = clothesFixtures.oneclothes[0];
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, clothess: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = clothesUtils.add(clothes);

            // assert
            expect(result).toEqual(clothes);
            expect(setItemSpy).toHaveBeenCalledWith("clothess",
                JSON.stringify({ nextId: 2, clothess: clothesFixtures.oneclothes }));
        });
    });

    describe("update", () => {
        test("Check that updating an existing clothes works", () => {

            // arrange
            const threeclothess = clothesFixtures.threeclothess;
            const updatedclothes = {
                ...threeclothess[0],
                name: "Updated Name"
            };
            const threeclothessUpdated = [
                updatedclothes,
                threeclothess[1],
                threeclothess[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, clothess: threeclothess }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = clothesUtils.update(updatedclothes);

            // assert
            const expected = { clothesCollection: { nextId: 5, clothess: threeclothessUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("clothess", JSON.stringify(expected.clothesCollection));
        });
        test("Check that updating an non-existing clothes returns an error", () => {

            // arrange
            const threeclothess = clothesFixtures.threeclothess;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, clothess: threeclothess }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            const updatedclothes = {
                id: 99,
                name: "Fake Name",
                description: "Fake Description"
            }

            // act
            const result = clothesUtils.update(updatedclothes);

            // assert
            const expectedError = `clothes with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });

    describe("del", () => {
        test("Check that deleting a clothes by id works", () => {

            // arrange
            const threeclothess = clothesFixtures.threeclothess;
            const idToDelete = threeclothess[1].id;
            const threeclothessUpdated = [
                threeclothess[0],
                threeclothess[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, clothess: threeclothess }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = clothesUtils.del(idToDelete);

            // assert

            const expected = { clothesCollection: { nextId: 5, clothess: threeclothessUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("clothess", JSON.stringify(expected.clothesCollection));
        });
        test("Check that deleting a non-existing clothes returns an error", () => {

            // arrange
            const threeclothess = clothesFixtures.threeclothess;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, clothess: threeclothess }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = clothesUtils.del(99);

            // assert
            const expectedError = `clothes with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeclothess = clothesFixtures.threeclothess;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, clothess: threeclothess }));

            // act
            const result = clothesUtils.del();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });
    }); 
});