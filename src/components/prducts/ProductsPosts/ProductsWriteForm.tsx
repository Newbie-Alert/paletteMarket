import { ChangeEvent, useEffect, useState } from 'react';
import { supabase } from '../../../api/supabase/supabaseClient';
import AddressBtn from './AddressBtn';
import { ProductsInputType, AddressValueType, ProductsInputFinalType } from '../ProductsType';
import ProductsImage from './ProductsImage';
import { useNavigate } from 'react-router';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as St from '../../../styles/products/ProductsPostsStyle'

const AddressInit: AddressValueType = {
  address: "",
  detailAddress: ""
}

// TODO: 이미 정해진 데이터는 MAJORS 와 같이 대문자로 표시
// EX)
// const MAJORS = [
//   '회화',
//   '조소',
//   '공예',
//   '기타'
// ];
// const SHIPPING_COST = ['배송비 포함', '배송비 별도'];
// const DEAL_TYPE = ['택배', '직거래', '협의 후 결정'];
// const CHANGEABLE = ['가능', '불가능'];
// const QUALITY = [
//   {
//     condition: '새상품(미사용)',
//     shape: '사용하지 않은 새 상품이에요'
//   },
//   {
//     condition: '사용감 없음',
//     shape:
//       '사용은 했지만 눈에 띄는 흔적이나 얼룩이 없어요 / 아주 조금 사용했어요'
//   },
//   {
//     condition: '사용감 적음',
//     shape: '눈에 띄는 흔적이나 얼룩이 약간 있어요 / 절반정도 사용했어요'
//   },
//   {
//     condition: '사용감 많음',
//     shape: '눈에 띄는 흔적이나 얼룩이 많이 있어요 / 많이 사용했어요'
//   },
//   {
//     condition: '고장/파손 상품',
//     shape: '기능 이상이나 외관 손상 등으로 수리가 필요해요'
//   }
// ];
// const CAVEAT = `
//   불순한 의도는 처벌을 피할 수 없습니다.
//   불순한 의도는 처벌을 피할 수 없습니다.
//   불순한 의도는 처벌을 피할 수 없습니다.
//   불순한 의도는 처벌을 피할 수 없습니다.
//   불순한 의도는 처벌을 피할 수 없습니다.
//   불순한 의도는 처벌을 피할 수 없습니다.
//   불순한 의도는 처벌을 피할 수 없습니다.
//   불순한 의도는 처벌을 피할 수 없습니다.
//   불순한 의도는 처벌을 피할 수 없습니다.
//   불순한 의도는 처벌을 피할 수 없습니다.
//   불순한 의도는 처벌을 피할 수 없습니다.`;
// TODO: 이런 데이터들은 DB에 있어야 코드 수정 없이 유동적으로 변경 가능할 듯
const major = [
  '회화',
  '조소',
  '공예',
  '기타'
];
const shipping_cost = ['배송비 포함', '배송비 별도'];
const deal_type = ['택배', '직거래', '협의 후 결정'];
const changable = ['가능', '불가능'];
const quality = [
  {
    condition: '새상품(미사용)',
    shape: '사용하지 않은 새 상품이에요'
  },
  {
    condition: '사용감 없음',
    shape:
      '사용은 했지만 눈에 띄는 흔적이나 얼룩이 없어요 / 아주 조금 사용했어요'
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
  }
];
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
  불순한 의도는 처벌을 피할 수 없습니다.`;

const InputDefaultValue = {
  title: '',
  category: [],
  shipping_cost: '',
  deal_type: '',
  address: '',
  detailAddress: '',
  quality: '',
  changable: '',
  exchange_product: '',
  contents: '',
  tags: '',
  image_url: ''
}

const initialState = {
  post_user_uid: "",
  post_user_name: "",
  nickname: "",
}

const ProductsWriteForm = () => {
  const navigate = useNavigate();

  // image url
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string[]>([]);

  // address value
  const [addressValue, setAddressValue] = useState(AddressInit)

  const handleOnChangeAddressValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressValue({ ...addressValue, [name]: value });
  };

  // react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setError,
    setValue,
    formState: { errors, isSubmitting } } = useForm<ProductsInputType>({
      mode: 'onBlur',
      defaultValues: InputDefaultValue
    });

  // 유저 테이블에서 같은 id 값 찾아서 원하는 유저정보 가져오기
  const [userState, setUserState] = useState(initialState)

  // TODO: react-query로 변경하기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user }
        } = await supabase.auth.getUser();
        setUserState(prevState => ({ ...prevState, post_user_uid: user!.id }));

        const { data: profiles, error } = await supabase
          .from('user')
          .select('*')
          .eq('id', user!.id);

        if (error) {
          console.log(error);
        }

        if (profiles != null && profiles.length > 0) {
          const userNickname = profiles[0].nickname;
          const userName = profiles[0].username;
          setUserState(prevState => ({ ...prevState, nickname: userNickname, post_user_name: userName }));
        }
      } catch (error: any) {
        console.log(error.message);
      }
    };

    fetchData();
  }, []);

  // TODO: 밖으로 빼기
  const addPosts = async (EntireData: ProductsInputFinalType) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([EntireData]);

      if (data) {
        console.log(data);
      }

      if (error) throw error;
      alert('중고거래 판매글이 등록되었습니다.');
      navigate('/products');
    } catch (error) {
      alert('예상치 못한 문제가 발생하였습니다. 다시 시도하여 주십시오.');
    }
  };


  const onSubmit: SubmitHandler<ProductsInputType> = async (data) => {
    // TODO: 잠시 시간을 멈추는 용도?
    await new Promise((r: any) => setTimeout(r, 1000));

    if (!uploadedFileUrl || uploadedFileUrl.length === 0) {
      alert('이미지를 업로드해주세요.');
      window.scrollTo({ top: 0 })
      return;
    }

    const tagsArray = data.tags.split(',', 9).map((tag) => tag.trim());
    // TODO: 이 작업은 없어도 될 것 같네요.
    const address = { address: addressValue.address }
    const detailAddress = { detailAddress: addressValue.detailAddress }
    const imgUrl = { image_url: uploadedFileUrl }

    const EntireData = {
      ...data,
      tags: tagsArray,
      address: address.address,

      detailAddress: detailAddress.detailAddress,
      // TODO: 혹은 이렇게
      // address: addressValue.address,
      // detailAddress: addressValue.detailAddress,
      // TODO: 혹은 spread operator
      // ...addressValue,
      image_url: imgUrl.image_url,
      post_user_uid: userState.post_user_uid,
      post_user_name: userState.post_user_name,
      nickname: userState.nickname,
      // TODO: spread operator
      // ...userState,
    };
    console.log(EntireData)
    addPosts(EntireData);

  };

  // 모바일 환경에서 물품 상태에 관한 내용 토글 State
  const [showQualityToggle, setShowQualityToggle] = useState<boolean>(false);
  const handleOnClickToggle = () => {
    setShowQualityToggle(prev => !prev);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ProductsImage uploadedFileUrl={uploadedFileUrl} setUploadedFileUrl={setUploadedFileUrl} />
      <St.WrapperStyle>
        <St.SemiTitle>제목<St.Required>*</St.Required></St.SemiTitle>
        <St.InputStyle type='text' maxLength={40} {...register("title", {
          required: "제목은 필수로 입력해야합니다.",
          maxLength: {
            value: 40,
            message: "최대 40자까지 입력할 수 있습니다."
          }
        })} placeholder='판매글의 제목을 입력해주세요' />
        <St.MobileTextValidationWrapper>
          <St.MobileTextValidation>
            <St.ValidationText>{errors.title?.message === undefined ? '' : '* ' + errors.title?.message}</St.ValidationText>
          </St.MobileTextValidation>
          <St.MobileTitleCount>{watch("title").length}/40</St.MobileTitleCount>
        </St.MobileTextValidationWrapper>
        <St.TitleCount>{watch("title").length}/40</St.TitleCount>
      </St.WrapperStyle>
      <St.TextValidation>
        <St.ValidationText>{errors.title?.message === undefined ? '' : '* ' + errors.title?.message}</St.ValidationText>
      </St.TextValidation>

      <St.WrapperStyle>
        <St.SemiTitle>카테고리<St.Required>*</St.Required></St.SemiTitle>
        <St.CategoryContainer>
          {major.map((major, idx) =>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <St.InputCheckBoxLabel key={idx} htmlFor={major}>
                <St.InputCheckBoxStyle type='checkbox' id={major} value={major}
                  {...register("category", { required: "카테고리를 선택해주세요." })} />{major}</St.InputCheckBoxLabel>
            </div>
          )}
        </St.CategoryContainer>
      </St.WrapperStyle>
      <St.MobileWrapperStyle>
        <St.Validation>
          <St.ValidationText>{errors.category === undefined ? '' : '* ' + errors.category?.message}</St.ValidationText>
        </St.Validation>
      </St.MobileWrapperStyle>

      <St.WrapperStyle>
        <St.SemiTitle>가격<St.Required>*</St.Required></St.SemiTitle>
        <St.InputWrapperStyle>
          <St.InputStyle2 type='number' min={0} {...register("price", {
            required: "가격을 입력해주세요.",
            valueAsNumber: true,
            min: {
              value: 1,
              message: "0 이하의 값은 입력할 수 없습니다."
            },
            max: 2147483648
          })} placeholder='가격을 입력해주세요' />
          <St.ShippingCostSelectWrapper>
            {shipping_cost.map((shipping_cost, idx) =>
              <St.InputCheckBoxLabel key={idx} htmlFor={shipping_cost}>
                <St.InputCheckBoxStyle type='radio' id={shipping_cost} value={shipping_cost}
                  {...register("shipping_cost", { required: "배송비 포함 여부를 선택해주세요." })} />{shipping_cost}</St.InputCheckBoxLabel>
            )}
          </St.ShippingCostSelectWrapper>
        </St.InputWrapperStyle>
      </St.WrapperStyle>
      <St.WrapperStyle>
        <St.RowValidation>
          <St.ValidationText>{errors.price === undefined ? '' : '* ' + errors.price?.message}</St.ValidationText>
          <St.ValidationText>{errors.shipping_cost === undefined ? '' : '* ' + errors.shipping_cost?.message}</St.ValidationText>
        </St.RowValidation>
      </St.WrapperStyle>

      <St.WrapperStyle>
        <St.SemiTitle>수량<St.Required>*</St.Required></St.SemiTitle>
        <St.InputWrapperStyle>
          <St.InputStyle2 type='number' {...register("count", {
            required: "수량을 입력해주세요.",
            valueAsNumber: true,
            min: 0,
            max: 2147483648
          })} placeholder='수량을 입력해주세요' />
        </St.InputWrapperStyle>
      </St.WrapperStyle>
      <St.MobileWrapperStyle>
        <St.Validation>
          <St.ValidationText>{errors.count === undefined ? '' : '* ' + errors.count?.message}</St.ValidationText>
        </St.Validation>
      </St.MobileWrapperStyle>

      <St.WrapperStyle>
        <St.SemiTitle>거래방식<St.Required>*</St.Required></St.SemiTitle>
        <St.InputWrapperStyle>
          <St.MobileDealTypeWrapper>
            {deal_type.map((deal_type, idx) =>
              <St.InputCheckBoxLabel key={idx} htmlFor={deal_type}>
                <St.InputCheckBoxStyle type='radio' id={deal_type} value={deal_type}
                  {...register("deal_type", { required: "거래방식을 선택해주세요." })} />{deal_type}</St.InputCheckBoxLabel>
            )}
          </St.MobileDealTypeWrapper>
        </St.InputWrapperStyle>
      </St.WrapperStyle>
      <St.MobileWrapperStyle>
        <St.Validation>
          <St.ValidationText>{errors.deal_type === undefined ? '' : '* ' + errors.deal_type?.message}</St.ValidationText>
        </St.Validation>
      </St.MobileWrapperStyle>

      <St.WrapperStyle>
        <St.SemiTitle>직거래 지역</St.SemiTitle>
        <St.InputWrapperStyle>
          <AddressBtn register={register} addressValue={addressValue} setAddressValue={setAddressValue} />
          <St.GapStyle />
          <St.AddressInputStyle readOnly type='text' name='address'
            required={getValues("deal_type") === '직거래' ? true : false}
            value={addressValue.address}
            disabled={getValues("deal_type") === '택배' || getValues("deal_type") === '협의 후 결정'}
            onChange={handleOnChangeAddressValue}
            placeholder={getValues("deal_type") === '직거래' ? '주소검색을 이용해주세요.' : ""} />
          <St.GapStyle />
          <St.AddressInputStyle type='text' name='detailAddress' value={addressValue.detailAddress}
            disabled={getValues("deal_type") === '택배' || getValues("deal_type") === '협의 후 결정'}
            onChange={handleOnChangeAddressValue}
            placeholder={getValues("deal_type") === '직거래' ? '상세주소를 기입해주세요.' : ""} />
          <St.GapStyle2 />
        </St.InputWrapperStyle>
      </St.WrapperStyle>

      <St.WrapperStyle>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <St.SemiTitle>물품상태<St.Required>*</St.Required></St.SemiTitle>
          </div>
          <St.QualityInfoBtn onClick={handleOnClickToggle}>
            <St.QualityInfoIcon />
          </St.QualityInfoBtn>
          {showQualityToggle && (
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <St.QualityInfoWrapper>
                {quality.map((quality) =>
                  <St.QualityDetail>
                    <p key={quality.condition}>{quality.condition}</p><span>{quality.shape}</span>
                  </St.QualityDetail>
                )}
              </St.QualityInfoWrapper>
            </div>
          )}
        </div>
        <St.QualityWrapper>
          {quality.map((quality, idx) =>
            <>
              <St.InputCheckBoxLabel key={idx} htmlFor={quality.condition}>
                <St.InputCheckBoxStyle type='radio' id={quality.condition} value={quality.condition}
                  {...register("quality", { required: "물품상태를 선택해주세요." })} />{quality.condition}</St.InputCheckBoxLabel>
              <St.QualityExplanation key={idx}>{quality.shape}</St.QualityExplanation>
            </>
          )}
        </St.QualityWrapper>
      </St.WrapperStyle>
      <St.MobileWrapperStyle>
        <St.Validation>
          <St.ValidationText>{errors.quality === undefined ? '' : '*' + errors.quality?.message}</St.ValidationText>
        </St.Validation>
      </St.MobileWrapperStyle>

      <St.WrapperStyle>
        <St.SemiTitle>교환<St.Required>*</St.Required></St.SemiTitle>
        <St.InputWrapperStyle>
          <St.ChangableSelectWrapper>
            {changable.map((changable, idx) =>
              <St.InputCheckBoxLabel key={idx} htmlFor={changable}>
                <St.InputCheckBoxStyle type='radio' id={changable} value={changable}
                  {...register("changable", { required: "교환 가능 여부를 선택해주세요." })} />{changable}</St.InputCheckBoxLabel>
            )}
          </St.ChangableSelectWrapper>
          <St.InputStyle2 type='text' disabled={getValues("changable") === "불가능" ? true : false} {...register("exchange_product", { required: getValues("changable") === "가능" ? "교환을 원하는 물품을 입력해주세요." : false })} placeholder='교환을 원하는 상품을 입력해주세요.' />
        </St.InputWrapperStyle>
      </St.WrapperStyle>
      <St.WrapperStyle>
        <St.RowValidation>
          <St.ValidationText>{errors.changable === undefined ? '' : '* ' + errors.changable?.message}</St.ValidationText>
          <St.ValidationText>{errors.exchange_product === undefined ? '' : '* ' + errors.exchange_product?.message}</St.ValidationText>
        </St.RowValidation>
      </St.WrapperStyle>

      <St.WrapperStyle>
        <St.SemiTitle>설명<St.Required>*</St.Required></St.SemiTitle>
        <St.InputWrapperStyle>
          <St.CountWrapper>
            <St.TextAreaStyle maxLength={2000} {...register("contents", {
              required: "내용을 입력해주세요.",
              maxLength: {
                value: 2000,
                message: "최대 2000자까지 입력할 수 있습니다."
              }
            })} placeholder='물품에 대한 구체적인 설명을 입력해주세요&#13;&#10;tip)설명이 구체적일수록 거래될 확률이 높아져요!' />
            <St.ContentsCount>{watch("contents").length}/2000</St.ContentsCount>
          </St.CountWrapper>
        </St.InputWrapperStyle>
      </St.WrapperStyle>
      <St.MobileTextValidationWrapper>
        <St.MobileTextValidation>
          <St.ValidationText>{errors.contents?.message === undefined ? '' : '* ' + errors.contents?.message}</St.ValidationText>
        </St.MobileTextValidation>
        <St.MobileTitleCount>{watch("contents").length}/2000</St.MobileTitleCount>
      </St.MobileTextValidationWrapper>
      <St.MobileTextAreaWrapperStyle>
        <St.Validation>
          <St.ValidationText>{errors.contents === undefined ? '' : '* ' + errors.contents?.message}</St.ValidationText>
        </St.Validation>
      </St.MobileTextAreaWrapperStyle>

      <St.WrapperStyle>
        <St.SemiTitle>태그</St.SemiTitle>
        <St.InputWrapperStyle>
          <St.InputStyle2 type='text' {...register("tags", {
            pattern: {
              value: /^[가-힣A-Za-z,]+$/i,
              message: "띄어쓰기와 숫자, 특수문자는 입력이 불가능합니다.",
            }
          })} placeholder='태그를 입력해주세요.' />
          <St.GapStyle />
          <St.TagsExplanation>콤마(,)로 구분되며 최대 9개까지 입력할 수 있어요.</St.TagsExplanation>
          <St.TagsExplanation>사람들이 내 상품을 더 잘 찾을 수 있어요.</St.TagsExplanation>
          <St.TagsExplanation>상품과 관련 없는 태그를 입력할 경우, 판매에 제재를 받을 수 있어요.</St.TagsExplanation>
        </St.InputWrapperStyle>
      </St.WrapperStyle>
      <St.TagsValidation>
        <St.ValidationText>{errors.tags === undefined ? '' : '* ' + errors.tags?.message}</St.ValidationText>
      </St.TagsValidation>

      <St.CaveatBox>
        <St.CaveatText>{caveat}</St.CaveatText>
        <St.AgreementCheckBoxWrapper>
          <St.InputCheckBoxLabel htmlFor='agreement'>
            <St.AgreementCheckBoxStyle type='checkbox' id='agreement' {...register("agreement", {
              required: "주의사항에 동의하셔야 게시물 등록이 가능해요."
            })} />동의합니다.</St.InputCheckBoxLabel>
        </St.AgreementCheckBoxWrapper>
      </St.CaveatBox>
      <St.WrapperStyle>
        <St.ValidationText>{errors.agreement === undefined ? '' : '* ' + errors.agreement?.message}</St.ValidationText>
      </St.WrapperStyle>

      <St.GapStyle />
      <St.BtnWrapper>
        <St.WriteBtn type='submit' disabled={isSubmitting}>등록하기</St.WriteBtn>
      </St.BtnWrapper>
    </form>
  );
};

export default ProductsWriteForm;
