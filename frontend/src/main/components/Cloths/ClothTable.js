import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useNavigate } from "react-router-dom";
import { clothUtils } from "main/utils/clothUtils";

const showCell = (cell) => JSON.stringify(cell.row.values);


const defaultDeleteCallback = async (cell) => {
    console.log(`deleteCallback: ${showCell(cell)})`);
    clothUtils.del(cell.row.values.id);
}

export default function ClothTable({
    cloths,
    deleteCallback = defaultDeleteCallback,
    showButtons = true,
    testIdPrefix = "ClothTable" }) {

    const navigate = useNavigate();
 
    const editCallback = (cell) => {
        console.log(`editCallback: ${showCell(cell)})`);
        navigate(`/cloths/edit/${cell.row.values.id}`)
    }

    const detailsCallback = (cell) => {
        console.log(`detailsCallback: ${showCell(cell)})`);
        navigate(`/cloths/details/${cell.row.values.id}`)
    }

    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Type',
            accessor: 'type',
        },
        {
            Header: 'Brand',
            accessor: 'brand',
        }
    ];

    const buttonColumns = [
        ...columns,
        ButtonColumn("Details", "primary", detailsCallback, testIdPrefix),
        ButtonColumn("Edit", "primary", editCallback, testIdPrefix),
        ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix),
    ]

    const columnsToDisplay = showButtons ? buttonColumns : columns;

    return <OurTable
        data={cloths}
        columns={columnsToDisplay}
        testid={testIdPrefix}
    />;
};

export { showCell };