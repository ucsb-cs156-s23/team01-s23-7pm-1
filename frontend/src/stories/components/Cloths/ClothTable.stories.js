import React from 'react';
import ClothTable from 'main/components/Cloths/ClothTable';
import { clothFixtures } from 'fixtures/clothFixtures';

export default {
    title: 'components/Cloths/ClothTable',
    component: ClothTable
};

const Template = (args) => {
    return (
        <ClothTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    cloths: []
};

export const ThreeSubjectsNoButtons = Template.bind({});

ThreeSubjectsNoButtons.args = {
    cloths: clothFixtures.threeCloths,
    showButtons: false
};

export const ThreeSubjectsWithButtons = Template.bind({});
ThreeSubjectsWithButtons.args = {
    cloths: clothFixtures.threeCloths,
    showButtons: true
};
