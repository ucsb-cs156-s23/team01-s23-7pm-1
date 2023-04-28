import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import { clothUtils }  from 'main/utils/clothUtils';
import ClothForm from 'main/components/Cloths/ClothForm';
import { useNavigate } from 'react-router-dom'


export default function ClothEditPage() {
    let { id } = useParams();

    let navigate = useNavigate(); 

    const response = clothUtils.getById(id);

    const onSubmit = async (cloth) => {
        const updatedCloth = clothUtils.update(cloth);
        console.log("updatedCloth: " + JSON.stringify(updatedCloth));
        navigate("/cloths");
    }  

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Cloth</h1>
                <ClothForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={response.cloth}/>
            </div>
        </BasicLayout>
    )
}
