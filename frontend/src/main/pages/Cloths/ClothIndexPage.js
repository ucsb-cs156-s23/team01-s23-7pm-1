import React from 'react'
import Button from 'react-bootstrap/Button';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ClothTable from 'main/components/Cloths/ClothTable';
import { clothUtils } from 'main/utils/clothUtils';
import { useNavigate, Link } from 'react-router-dom';

export default function ClothIndexPage() {

    const navigate = useNavigate();

    const clothCollection = clothUtils.get();
    const cloths = clothCollection.cloths;

    const showCell = (cell) => JSON.stringify(cell.row.values);

    const deleteCallback = async (cell) => {
        console.log(`ClothIndexPage deleteCallback: ${showCell(cell)})`);
        clothUtils.del(cell.row.values.id);
        navigate("/cloths");
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <Button style={{ float: "right" }} as={Link} to="/cloths/create">
                    Create Cloth
                </Button>
                <h1>Cloths</h1>
                <ClothTable cloths={cloths} deleteCallback={deleteCallback} />
            </div>
        </BasicLayout>
    )
}