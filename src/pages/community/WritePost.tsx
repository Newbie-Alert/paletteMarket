import React, { useEffect, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import { supabase } from '../../api/supabase/supabaseClient';
import { ProfileObject } from './model';
const categoryArray = [
  '고민상담',
  '구인공고',
  '공동구매',
  '꿀팁공유',
  '일상생활'
];
const Write: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [category, setCategory] = useState('말머리 선택');
  const [files, setFiles] = useState<File[]>([]);
  const [profile, setProfile] = useState<ProfileObject>();
  const [userId, setUserId] = useState('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [anon, setAnon] = useState(false);
  const navigate = useNavigate();
  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      const filesArray = Array.from(fileList);
      // 각 파일을 개별적으로 처리 (필요한 경우)
      filesArray.forEach((file) => {
        handleFilesUpload(file);
      });
    }
  };
  const handleFilesUpload = async (file: File) => {
    try {
      // const newFileName = uuid();
      const { data, error } = await supabase.storage
        .from('files')
        .upload(`files/${file.name}${uuid()}`, file);
      if (error) {
        console.log('파일 안올라감ㅋ', error);
        return;
      }
      const res = supabase.storage.from('files').getPublicUrl(data.path);
      setFiles((prevFiles) => [...prevFiles, file]);
      setUploadedFileUrl(res.data.publicUrl);
      // file 객체를 저장하도록 수정
      console.log(res.data.publicUrl);
    } catch (error) {
      console.error('Error handling file upload:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user }
        } = await supabase.auth.getUser();
        setUserId(user!.id);

        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user!.id);

        if (error) {
          console.log(error);
        }

        if (profiles != null) {
          setProfile(profiles);
        }

        console.log(profiles);
      } catch (error: any) {
        console.log(error.message);
      }
    };

    fetchData();
  }, []);
  const addPost = async () => {
    try {
      // FileList를 배열로 변환
      const { data, error } = await supabase.from('community').insert([
        {
          title,
          content,
          category,
          post_user: profile![0].id,
          nickname: profile![0].username,
          files: files.map((file) => ({
            name: file.name,
            url: uploadedFileUrl
          })),
          main_image: mainImage,
          anon
        }
      ]);
      if (error) throw error;
      navigate('/community');
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  // 에디터 접근을 위한 ref return
  const quillRef = useRef<ReactQuill | null>(null);

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
          console.log(editor);
          console.log(range);

          //마우스 위치에 이미지를 넣고 다음 으로 커서 옮기기
          editor?.insertEmbed(range?.index || 0, 'image', postImageUrl);
          if (mainImage === '') {
            setMainImage(postImageUrl);
          }
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
  const modules = React.useMemo(
    () => ({
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
          parchment: Quill.import('parchment'),
          modules: ['Resize', 'DisplaySize']
        }
      }
    }),
    []
  );

  // 툴바에 사용되는 툴 포맷
  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'video',
    'image',
    'color',
    'background'
  ];

  return (
    <Container>
      <ContentContainer>
        <h1>커뮤니티 글 작성란데스</h1>

        <TitleInput
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          placeholder="제목을 입력해주세요"
        />
        <CategoryContainer>
          {categoryArray.map((item) => {
            return (
              <label key={item}>
                <input
                  type="radio"
                  name={category}
                  value={item}
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                />
                {item}
              </label>
            );
          })}
        </CategoryContainer>

        <FileUploader>
          {files.length !== 0
            ? files.map((file) => file.name)
            : '파일을 업로드하려면 클릭하세요'}

          <input type="file" onChange={handleFiles} multiple />
        </FileUploader>

        <div>
          <QuillEditor
            ref={quillRef}
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            theme="snow"
            placeholder="내용을 입력해주세요"
          />
        </div>
        <label>
          <CheckBoxInput
            type="checkbox"
            checked={anon}
            onChange={() => setAnon(!anon)}
          />{' '}
          익명으로 작성하기
        </label>

        <AddButton onClick={() => addPost()}>등록하기</AddButton>
      </ContentContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
`;
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 906px;
  width: 80%;
  & select {
    width: 100px;
    height: 40px;
  }
  & button {
    width: 100px;
    height: 40px;
  }
  & h1 {
    font-size: 30px;
    margin-top: 50px;
    text-align: center;
  }
`;
const CategoryContainer = styled.div`
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;
const CheckBoxInput = styled.input`
  height: 20px;
  width: 20px;
`;
const TitleInput = styled.input`
  height: 54px;
  width: 100%;
  background-color: #f3f3f3;
  border: none;
  border-radius: 5px;
  padding-left: 16px;
  &::placeholder {
    color: rgba(0, 0, 0, 0.6);
    font-size: 16px;
  }
`;
const AddButton = styled.button`
  margin-top: 30px;
`;
const FileUploader = styled.label`
  background-color: #f3f3f3;
  border-radius: 5px;
  height: 54px;
  display: flex;
  align-items: center;
  padding-left: 16px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 16px;
  & input {
    display: none;
  }
`;
const QuillEditor = styled(ReactQuill)`
  background-color: #f3f3f3;
  border-radius: 5px;
  .ql-container {
    height: 600px;
    border: none;
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
`;

export default Write;
