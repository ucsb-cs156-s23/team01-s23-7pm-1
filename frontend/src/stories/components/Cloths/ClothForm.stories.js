import React from 'react';
import ClothForm from "main/components/Cloths/ClothForm"
import { clothFixtures } from 'fixtures/clothFixtures';

export default {
    title: 'components/Cloths/ClothForm',
    component: ClothForm
};

const Template = (args) => {
    return (
        <ClothForm {...args} />
    )
};

export const Default = Template.bind({});

Default.args = {
    submitText: "Create",
    submitAction: () => { console.log("Submit was clicked"); }
};

export const Show = Template.bind({});

Show.args = {
    Cloth: clothFixtures.oneCloth,
    submitText: "",
    submitAction: () => { }
};