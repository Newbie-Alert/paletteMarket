import React, { ChangeEvent, useEffect, useState } from 'react'
import { supabase } from '../../../api/supabase/supabaseClient';
import { ProductsPostType } from '../ProductsType';
import { v4 as uuid } from 'uuid';

interface Props {
  uploadedFileUrl: string[],
  setUploadedFileUrl: React.Dispatch<React.SetStateAction<string[]>>
}

const ProductsImage = ({uploadedFileUrl, setUploadedFileUrl}: Props) => {

  const [files, setFiles] = useState<File[]>([]);
  
  // 파일 등록을 하면
  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      const filesArray = Array.from(fileList);
      // 각 파일을 개별적으로 처리 (필요한 경우)
      filesArray.forEach((file) => {
        handleAddImages(file);
      });
    }
    // if (fileList !==null) {
    //   const file = fileList[0].name;
    //   const reader = new FileReader();
    //   reader.readAsDataURL(file);
    //   reader.onloadend = () => {
    //     setUploadedFileUrl(reader.result)
    //   }
    //   console.log(file)
    // }
  };

  if (uploadedFileUrl.length > 12) uploadedFileUrl.pop();
  const handleAddImages = async (file: File) => {
    try {
      const newFileName = uuid();
      const {data, error} = await supabase
      .storage
      .from('Image')
      .upload(`products/${newFileName}`, file)
  
      if(error) {
        console.log('파일이 업로드 되지 않습니다.', error);
        return;
      }
      const res = supabase.storage.from('Image').getPublicUrl(data.path);
      setFiles((prevFiles) => [file, ...prevFiles ]);
      setUploadedFileUrl((prev:any) => [...prev, res.data.publicUrl]);
      // file 객체를 저장하도록 수정
    } catch (error) {
      console.error('알 수 없는 문제가 발생하였습니다. 다시 시도하여 주십시오.', error);
    }



    // 이미지를 supabase storage에 업로드 하기
    // const imageUrls = await Promise.all(
    //   Array.from(imageLists).map(async file => {
    //     const {data, error} = await supabase.storage
    //     .from('Image')
    //     .upload(`images/${file.name}`, file)

    //     if (error) {
    //       console.error('Error uploading image:', error)
    //       return null
    //     }
    //     return data?.path as string
    //   })
    // );

    // // 이미지 URL을 최대 12장까지 저장할 수 있도록 지정
    // const remainingSlots = 12 - showImages.length;
    // const finalImageUrls = imageUrls.slice(0, remainingSlots);

    // setShowImages((prevImages: any) => [...prevImages, ...finalImageUrls]);
    
    // 이미지 URL을 supabase table에 저장
//     if (finalImageUrls.length > 0)
//       const {data, error} = await supabase
//       .from('products')
//       .upsert(
//         finalImageUrls.map((imageUrl) => ({
//           image_url: imageUrl,
//         })),
//         { onConflict: 'image_url' }
//       );

//     if (error) {
//       console.error('Error inserting data:', error);
//       return;
//     }

//     console.log('Image uploaded and URL stored:', data);
// };

    // const file = input.files![0];
    //     const fileNewName = uuid();
    //     // console.log(fileNewName);
    //     // file을 서버에 업로드
    //     const { data, error } = await supabase.storage
    //       .from('images')
    //       .upload(`quill_imgs/${fileNewName}.png`, file);
    //     if (error) {
    //       console.error('이미지 업로드 중 오류 발생:', error);
    //     } else {
    //       console.log('이미지가 성공적으로 업로드되었습니다:', data);
    //     }

    //let imageUrlLists = [...showImages];

    // for (let i = 0; i < imageLists.length; i++) {
    //   const currentImageUrl = URL.createObjectURL(imageLists[i]);
    //   imageUrlLists.push(currentImageUrl);
    // }

    // if (imageUrlLists.length > 12) {
    //   imageUrlLists = imageUrlLists.slice(0, 12);
    // }

    //setShowImages(imageUrlLists);
  };
  
  // const addPosts = async () => {
  //   try {
  //     // FileList를 배열로 변환
  //     const { data, error } = await supabase
  //       .from('image')
  //       .insert([
  //         {
  //           image_url: uploadedFileUrl            
  //         }
  //     ]);
  //     if (error) throw error;
  //   } catch (error) {
  //     console.error('Error adding post:', error);
  //   }
  // };

  // X버튼 클릭 시 이미지 삭제
  const handleDeleteImage = (id:any) => {
    setUploadedFileUrl(uploadedFileUrl.filter((_, index) => index !== id));
    setFiles(files.filter((_, index) => index !== id));
  };

  useEffect(() => {
    console.log(files);
},[files])

  return (
    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '20px'}}>
      <div style={{display: 'flex', flexDirection: 'row', width: '200px'}}>
        <h2 style={{fontSize: '20px', fontWeight: 'bold'}}>상품이미지*</h2>
        <p>{files.length}/12</p>
      </div>
      <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px'}}>
        {uploadedFileUrl.map((img:string, i:number) => 
          <div key={i} style={{ width: '200px', height: '200px', border: '2px solid darkgray', position: 'relative' }}>
            <img src={img} alt={`${img}-${i}`}  style={{objectPosition: 'center', objectFit: 'contain', width: '100%', height: '100%'}} />
            <button onClick={() => handleDeleteImage(i)} style={{position: 'absolute'}}>X</button>
          </div>
        )}
        {uploadedFileUrl.length >= 12 ? <></> : <label htmlFor='file' style={{width: '200px', height: '200px', backgroundColor: 'skyblue'}}>
          <input type='file' id='file' name='file' onChange={handleFiles} multiple hidden />+
        </label>}
      </div>
    </div>
  )
}

export default ProductsImage

//  onClick={() => handleDeleteImage(i)}