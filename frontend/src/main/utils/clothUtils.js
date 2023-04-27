// get cloths from local storage yes
const get = () => {
    const clothValue = localStorage.getItem("cloths");
    if (clothValue === undefined) {
        const clothCollection = { nextId: 1, cloths: [] }
        return set(clothCollection);
    }
    const clothCollection = JSON.parse(clothValue);
    if (clothCollection === null) {
        const clothCollection = { nextId: 1, cloths: [] }
        return set(clothCollection);
    }
    return clothCollection;
};

const getById = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const clothCollection = get();
    const cloths = clothCollection.cloths;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = cloths.findIndex((r) => r.id == id);
    if (index === -1) {
        return { "error": `cloth with id ${id} not found` };
    }
    return { cloth: cloths[index] };
}

// set cloths in local storage
const set = (clothCollection) => {
    localStorage.setItem("cloths", JSON.stringify(clothCollection));
    return clothCollection;
};

// add a cloth to local storage
const add = (cloth) => {
    const clothCollection = get();
    cloth = { ...cloth, id: clothCollection.nextId };
    clothCollection.nextId++;
    clothCollection.cloths.push(cloth);
    set(clothCollection);
    return cloth;
};

// update a cloth in local storage
const update = (cloth) => {
    const clothCollection = get();

    const cloths = clothCollection.cloths;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = cloths.findIndex((r) => r.id == cloth.id);
    if (index === -1) {
        return { "error": `cloth with id ${cloth.id} not found` };
    }
    cloths[index] = cloth;
    set(clothCollection);
    return { clothCollection: clothCollection };
};

// delete a cloth from local storage
const del = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const clothCollection = get();
    const cloths = clothCollection.cloths;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = cloths.findIndex((r) => r.id == id);
    if (index === -1) {
        return { "error": `cloth with id ${id} not found` };
    }
    cloths.splice(index, 1);
    set(clothCollection);
    return { clothCollection: clothCollection };
};

const clothUtils = {
    get,
    getById,
    add,
    update,
    del
};

export { clothUtils };
