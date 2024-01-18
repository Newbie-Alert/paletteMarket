import React, { useEffect, useState } from 'react'
import { supabase } from '../../../api/supabase/supabaseClient';
import { v4 as uuid } from 'uuid';

interface Props {
  uploadedFileUrl: string[],
  setUploadedFileUrl: React.Dispatch<React.SetStateAction<string[]>>
}

const ProductsImage = ({uploadedFileUrl, setUploadedFileUrl}: Props) => {

  const [files, setFiles] = useState<File[]>([]);
  
  // 웹 페이지에서 파일 등록하기
  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      const filesArray = Array.from(fileList);
      filesArray.forEach((file) => {
        handleAddImages(file);
      });
    }
  };

  if (uploadedFileUrl.length > 12 && files.length > 12) uploadedFileUrl.pop() && files.pop();

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
      setFiles((prevFiles) => [file, ...prevFiles]);
      setUploadedFileUrl((prev:any) => [...prev, res.data.publicUrl]);
    } catch (error) {
      console.error('알 수 없는 문제가 발생하였습니다. 다시 시도하여 주십시오.', error);
    }
  };

  // X 버튼 클릭 시 이미지 삭제
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
        {uploadedFileUrl.map((img:string, idx:number) => 
          <div key={idx} style={{ width: '200px', height: '200px', border: '2px solid darkgray', position: 'relative' }}>
            <img src={img} alt={`${img}-${idx}`}  style={{objectPosition: 'center', objectFit: 'contain', width: '100%', height: '100%'}} />
            <button onClick={() => handleDeleteImage(idx)} style={{position: 'absolute'}}>X</button>
          </div>
        )}
        {uploadedFileUrl.length >= 12 ? <></> : <label htmlFor='file' style={{textAlign: 'center', lineHeight: '1200%', width: '200px', height: '200px', backgroundColor: 'lightgray'}}>
          <input type='file' id='file' name='file' onChange={handleFiles} multiple hidden />+
        </label>}
      </div>
    </div>
  )
}

export default ProductsImage
