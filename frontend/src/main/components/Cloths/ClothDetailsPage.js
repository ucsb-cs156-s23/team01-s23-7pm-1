import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import ClothTable from 'main/components/Cloths/ClothTable';
import { clothUtils } from 'main/utils/clothUtils';

export default function ClothDetailsPage() {
  let { id } = useParams();

  const response = clothUtils.getById(id);

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Cloth Details</h1>
        <ClothTable cloths={[response.cloth]} showButtons={false} />
      </div>
    </BasicLayout>
  )
}