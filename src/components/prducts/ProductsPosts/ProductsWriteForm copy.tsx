import { ChangeEvent, FormEvent, useState } from 'react'
import { supabase } from '../../../api/supabase/supabaseClient';
import AddressBtn from './AddressBtn';
import { TextRadioValueType } from '../ProductsType';
import ProductsImage from './ProductsImage';
import { useNavigate } from 'react-router';

const productsPostsTextInit: TextRadioValueType = {
  title: "",
  contents: "",
  price: 0,
  count: 0, 
  exchange_product: "",
  tags: [],
  shipping_cost: "",
  deal_type: "",
  quality: "",
  changable: "",
  address: "",
  detailAddress: ""
}

const major = ['전체보기', '회화', '조소', '판화', '금속공예', '도예', '유리공예', '목공예', '섬유공예', '기타']
const shipping_cost = ['배송비 포함', '배송비 별도']
const deal_type = ['택배', '직거래', '협의 후 결정']
const changable = ['가능', '불가능']
const quality = [
  {
    condition: '새상품(미사용)',
    shape: '사용하지 않은 새 상품이에요'
  },
  {
    condition: '사용감 없음',
    shape: '사용은 했지만 눈에 띄는 흔적이나 얼룩이 없어요 / 아주 조금 사용했어요'
  },
  {
    condition: '사용감 적음',
    shape: '눈에 띄는 흔적이나 얼룩이 약간 있어요 / 절반정도 사용했어요'
  },
  {
    condition: '사용감 많음',
    shape: '눈에 띄는 흔적이나 얼룩이 많이 있어요 / 많이 사용했어요'
  },
  {
    condition: '고장/파손 상품',
    shape: '기능 이상이나 외관 손상 등으로 수리가 필요해요'
  },
]
const caveat = `
  불순한 의도는 처벌을 피할 수 없습니다.
  불순한 의도는 처벌을 피할 수 없습니다.
  불순한 의도는 처벌을 피할 수 없습니다.
  불순한 의도는 처벌을 피할 수 없습니다.
  불순한 의도는 처벌을 피할 수 없습니다.
  불순한 의도는 처벌을 피할 수 없습니다.
  불순한 의도는 처벌을 피할 수 없습니다.
  불순한 의도는 처벌을 피할 수 없습니다.
  불순한 의도는 처벌을 피할 수 없습니다.
  불순한 의도는 처벌을 피할 수 없습니다.
  불순한 의도는 처벌을 피할 수 없습니다.`

const ProductsWriteForm = () => {

  const navigate = useNavigate();

  // image url
  const [uploadedFileUrl, setUploadedFileUrl]: any = useState([]);

  // input text, radio value
  const [textRadioValue, setTextRadioValue] = useState(productsPostsTextInit)
  const [titleCount, setTitleCount] = useState(0)
  const [contentsCount, setContentsCount] = useState(0)
  
  const handleOnChangeTextRadioValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, valueAsNumber } = e.target;
    if (name === 'tags') {
    setTextRadioValue({ ...textRadioValue, [name]: [...value.split(',', 9)] });
    } else if (name === 'price' || name === 'count') {
      setTextRadioValue({ ...textRadioValue, [name]: valueAsNumber });
    } else {
    setTextRadioValue({ ...textRadioValue, [name]: value });
    }
    if (name === 'title') {
      setTitleCount(value.length)
    } else if (name === 'contents') {
      setContentsCount(value.length)
    }
    // 디바운싱 적용시켜 input 값 입력마다 렌더링되지 않도록 리팩토링해보기
    // console.log(textRadioValue)
  };
  
  // input checkbox value
  const [majorCheckedList, setMajorCheckedList] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [agreementCheckedList, setAgreementCheckedList] = useState(false);

  const handleCheckedMajor = (value: string, isChecked: boolean) => {
    if (isChecked) {
      setMajorCheckedList((prev) => [...prev, value]);
      return;
    }
    if (!isChecked && majorCheckedList.includes(value)) {
      setMajorCheckedList(majorCheckedList.filter((item) => item !== value));
      return;
    }
    return;
  };

  const handleOnChangeCheckMajor = (e: ChangeEvent<HTMLInputElement>, value: string) => {
    setIsChecked(!isChecked);
    handleCheckedMajor(value, e.target.checked);
  }

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    }
    
  // 테이블 컬럼명과 일치하도록 바꾸기
  const category = majorCheckedList
  const agreement = agreementCheckedList
  const image_url = uploadedFileUrl

  // input값이 모두 들어있는 새로운 객체 만들어서 supabase insert
  const entireProductsPosts = {...textRadioValue, category, agreement, image_url}
  // console.log(entireProductsPosts)

  const addPosts = async () => {
    try {
      const {data, error} = await supabase
        .from('products')
        .insert([
          entireProductsPosts
        ])

      if (data) {
        console.log(data)
      }
      
      if (error) throw error;
      // window.location.reload();
      alert('중고거래 판매글이 등록되었습니다.')
      navigate('/products')
    } catch (error) {
      alert('예상치 못한 문제가 발생하였습니다. 다시 시도하여 주십시오.')
    }
  }

  return (
    <form onSubmit={handleOnSubmit}>
      <ProductsImage uploadedFileUrl={uploadedFileUrl} setUploadedFileUrl={setUploadedFileUrl} />
      <div style={{display: 'flex', flexDirection: 'row', marginBottom: '20px'}}>
        <h2 style={{fontSize: '20px', fontWeight: 'bold', width: '200px'}}>제목*</h2>
        <input type='text' name='title' value={textRadioValue.title} onChange={handleOnChangeTextRadioValue} maxLength={40} placeholder='상품명이 들어간 제목을 입력해주세요' />
        <span>{titleCount}/40</span>
      </div>
      <div style={{display: 'flex', flexDirection: 'row', marginBottom: '20px'}}>
        <h2 style={{fontSize: '20px', fontWeight: 'bold', width: '200px'}}>카테고리*</h2>
        <div>
          {major.map((major, i) => 
            <label key={i} htmlFor={major}><input type='checkbox' id={major} checked={majorCheckedList.includes(major)} onChange={(e) => handleOnChangeCheckMajor(e, major)} />{major}</label>
          )}
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'row', marginBottom: '20px'}}>
        <h2 style={{fontSize: '20px', fontWeight: 'bold', width: '200px'}}>가격*</h2>
        <input type='number' name='price' value={textRadioValue.price} onChange={handleOnChangeTextRadioValue} placeholder='가격을 입력해주세요'/>
        {shipping_cost.map((shipping_cost, i) => 
          <label key={i} htmlFor={shipping_cost}><input type='radio' id={shipping_cost} name='shipping_cost' value={shipping_cost} onChange={handleOnChangeTextRadioValue} />{shipping_cost}</label>
        )}
      </div>
      <div style={{display: 'flex', flexDirection: 'row', marginBottom: '20px'}}>
        <h2 style={{fontSize: '20px', fontWeight: 'bold', width: '200px'}}>수량*</h2>
        <input type='number' name='count' value={textRadioValue.count} onChange={handleOnChangeTextRadioValue} placeholder='수량을 입력해주세요'/>
      </div>
      <div style={{display: 'flex', flexDirection: 'row', marginBottom: '20px'}}>
        <h2 style={{fontSize: '20px', fontWeight: 'bold', width: '200px'}}>거래방식*</h2>
        {deal_type.map((deal_type, i) => 
          <label key={i} htmlFor={deal_type}><input type='radio' id={deal_type} name='deal_type' value={deal_type} onChange={handleOnChangeTextRadioValue} />{deal_type}</label>
        )}
      </div>
      <div style={{display: 'flex', flexDirection: 'row', marginBottom: '20px' }}>
        <h2 style={{fontSize: '20px', fontWeight: 'bold', width: '200px'}}>직거래 지역</h2>
        <AddressBtn textRadioValue={textRadioValue} setTextRadioValue={setTextRadioValue} />
        <input readOnly type='text' name='address' value={textRadioValue.address} disabled={textRadioValue.deal_type === '택배' || textRadioValue.deal_type === '협의 후 결정'} onChange={handleOnChangeTextRadioValue} placeholder='주소검색을 이용해주세요.' />
        <input type='text' name='detailAddress' value={textRadioValue.detailAddress} disabled={textRadioValue.deal_type === '택배' || textRadioValue.deal_type === '협의 후 결정'} onChange={handleOnChangeTextRadioValue} placeholder='상세주소를 입력해주세요.' />
      </div>
      <div style={{display: 'flex', flexDirection: 'row', marginBottom: '20px'}}>
        <h2 style={{fontSize: '20px', fontWeight: 'bold', width: '200px'}}>상품상태*</h2>
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginRight: '20px'}}>
          {quality.map((quality, i) => 
            <label key={i} htmlFor={quality.condition}><input type='radio' id={quality.condition} name='quality' value={quality.condition} onChange={handleOnChangeTextRadioValue} />{quality.condition}</label>
          )}
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
          {quality.map((quality) => 
                <p key={quality.shape}>{quality.shape}</p>
          )}
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'row', marginBottom: '20px'}}>
        <h2 style={{fontSize: '20px', fontWeight: 'bold', width: '200px'}}>교환*</h2>
          {changable.map((changable, i) => 
            <label key={i} htmlFor={changable}><input type='radio' id={changable} name='changable' value={changable} onChange={handleOnChangeTextRadioValue} />{changable}</label>
          )}
        <input type='text' name='exchange_product' value={textRadioValue.exchange_product} onChange={handleOnChangeTextRadioValue} disabled={textRadioValue.changable === '불가능'} placeholder='교환을 원하는 상품을 입력해주세요.' />
      </div>
      <div style={{display: 'flex', flexDirection: 'row', marginBottom: '20px'}}>
        <h2 style={{fontSize: '20px', fontWeight: 'bold', width: '200px'}}>설명*</h2>
        <textarea value={textRadioValue.contents} name='contents' onChange={(e: any) => handleOnChangeTextRadioValue(e)} style={{width: '75%', resize: 'none'}} placeholder='설명을 입력해 주세요' />
        <span>{contentsCount}/2000</span>
      </div>
      <div style={{display: 'flex', flexDirection: 'row', marginBottom: '20px'}}>
        <h2 style={{fontSize: '20px', fontWeight: 'bold', width: '200px'}}>태그</h2>
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
          <input type='text' name='tags' value={textRadioValue.tags} onChange={handleOnChangeTextRadioValue} placeholder='태그를 입력해주세요.' />
          <p style={{color: 'darkgray'}}>콤마(,)로 구분되며 최대 9개까지 입력할 수 있어요.</p>
          <p style={{color: 'darkgray'}}>사람들이 내 상품을 더 잘 찾을 수 있어요.</p>
          <p style={{color: 'darkgray'}}>상품과 관련 없는 태그를 입력할 경우, 판매에 제재를 받을 수 있어요.</p>
        </div>
      </div>
      <div style={{backgroundColor: 'lightgrey', padding: '15px'}}>
        <p style={{marginBottom: '20px'}}>{caveat}</p>
        <label htmlFor='agreement'><input type='checkbox' id='agreement' checked={agreementCheckedList} onChange={() => setAgreementCheckedList(!agreementCheckedList)} />동의합니다.</label>
      </div>
      <div style={{display: 'flex', justifyContent: 'flex-end', height: '50px', padding: '15px', gap: '10px'}}>
        <button onClick={() => addPosts()}>등록하기</button>
      </div>
    </form>
  )
}

export default ProductsWriteForm