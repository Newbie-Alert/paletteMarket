import { useDaumPostcodePopup } from 'react-daum-postcode';
import { TextRadioValueType } from '../ProductsType';

interface Props {
  scriptUrl?: string,
  textRadioValue: TextRadioValueType,
  setTextRadioValue: React.Dispatch<React.SetStateAction<TextRadioValueType>>
}

const AddressBtn = ({scriptUrl, textRadioValue, setTextRadioValue}: Props) => {

  const open = useDaumPostcodePopup(scriptUrl);

  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    //주소 값을 상태 값의 adress에 fullAddress로 바꿔 넣기
    setTextRadioValue(prev => ({ ...prev, address: fullAddress }));
  };

  const handleOnClickAddressBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    open({ onComplete: handleComplete });
    e.preventDefault();
  };
  
  /* 최근검색 필요없이 전에 쓴 검색이 그대로 유지되는 방향은? */
  return (
    <div className="adress_find">
      <button disabled={textRadioValue.deal_type === '택배' || textRadioValue.deal_type === '협의 후 결정'} onClick={handleOnClickAddressBtn}>주소 검색</button>
    </div>
  );
}

export default AddressBtn