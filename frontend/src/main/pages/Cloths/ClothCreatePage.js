import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ClothForm from "main/components/Cloths/ClothForm";
import { useNavigate } from 'react-router-dom'
import { clothUtils } from 'main/utils/clothUtils';

export default function ClothCreatePage() {

  let navigate = useNavigate(); 

  const onSubmit = async (cloth) => {
    const createdCloth = clothUtils.add(cloth);
    console.log("createdCloth: " + JSON.stringify(createdCloth));
    navigate("/cloths");
  }  

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Cloth</h1>
        <ClothForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}
