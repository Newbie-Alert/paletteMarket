import { ImageActions } from '@xeger/quill-image-actions';
import { ImageFormats } from '@xeger/quill-image-formats';
import React, { useMemo, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import { supabase } from '../../api/supabase/supabaseClient';
import { QuillLayoutProps } from '../../pages/community/model';
Quill.register('modules/imageActions', ImageActions);
Quill.register('modules/imageFormats', ImageFormats);

const QuillLayout: React.FC<QuillLayoutProps> = ({ content, setContent }) => {
  // 에디터 접근을 위한 ref return
  const quillRef = useRef<ReactQuill | null>(null);
  console.log('quill이에요');
  const imageHandler = () => {
    try {
      // 1. 이미지를 저장할 input type=file DOM을 만든다.
      const input = document.createElement('input');
      // 속성 써주기
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click(); // 에디터 이미지버튼을 클릭하면 이 input이 클릭된다.
      input.addEventListener('change', async () => {
        console.log('온체인지');
        const file = input.files![0];
        const fileNewName = uuid();

        // console.log(fileNewName);
        // file을 서버에 업로드
        // TODO: 함수로 빼기
        const { data, error } = await supabase.storage
          .from('images')
          .upload(`quill_imgs/${fileNewName}.png`, file);
        if (error) {
          console.error('이미지 업로드 중 오류 발생:', error);
        } else {
          console.log('이미지가 성공적으로 업로드되었습니다:', data);
        }
        // 업로드된 이미지의 URL을 요청
        const response = supabase.storage
          .from('images')
          .getPublicUrl(`quill_imgs/${fileNewName}.png`);
        console.log(response);
        if (response.data) {
          const postImageUrl = response.data.publicUrl;
          console.log(response.data.publicUrl);
          // const editor = quillRef.current!.getEditor();
          const editor = quillRef.current?.getEditor();
          const range = editor?.getSelection(true);

          //마우스 위치에 이미지를 넣고 다음 으로 커서 옮기기
          editor?.insertEmbed(range?.index || 0, 'image', postImageUrl);
          // if (mainImage === '') {
          //   setMainImage(postImageUrl);
          // }
          editor?.setSelection((range?.index || 0) + 1, 0);
          console.log('가져왔다');
        } else {
          console.error('No public URL found in response data.');
        }
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  // 에디터 설정
  const modules = useMemo(
    () => ({
      imageActions: {},
      imageFormats: {},
      // 툴바 설정
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }], // header 설정
          ['bold', 'italic', 'underline', 'strike'], // 굵기, 기울기, 밑줄 등 부가 tool 설정
          ['image', 'video'], // 링크, 이미지, 비디오 업로드 설정
          [{ color: [] }, { background: [] }] // 정렬, 글자 색, 글자 배경색 설정
          // ["clean"], // toolbar 설정 초기화 설정
        ],

        // 핸들러 설정
        handlers: {
          image: imageHandler // 이미지 tool 사용에 대한 핸들러 설정
        },
        ImageResize: {
          modules: ['Resize']
        }
      }
    }),
    []
  );

  // 툴바에 사용되는 툴 포맷
  // TODO: 밖으로 뺴기
  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'video',
    'image',
    'color',
    'background',
    'height',
    'width'
  ];

  return (
    <Container>
      <QuillEditor
        ref={quillRef}
        value={content}
        onChange={setContent}
        modules={modules}
        formats={formats}
        theme="snow"
        placeholder="내용을 입력해주세요"
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  & strong {
    font-weight: bold;
  }
  & em {
    font-style: italic;
  }
  & p {
    display: flex;
  }
`;

const QuillEditor = styled(ReactQuill)`
  background-color: #f3f3f3;
  border-radius: 5px;
  width: 100%;
  max-width: 1116px;

  .ql-container {
    min-height: 600px;
    border: none;
    display: flex;
  }
  .ql-toolbar {
    border: none;
  }
  .ql-editor strong {
    font-weight: bold;
  }
  .ql-editor em {
    font-style: italic;
  }
  .ql-editor ::placeholder {
    font-style: normal;
  }
  .ql-editor p {
    display: flex;
    line-height: 30px;
    font-size: 16px;
  }
`;
export default React.memo(QuillLayout);
