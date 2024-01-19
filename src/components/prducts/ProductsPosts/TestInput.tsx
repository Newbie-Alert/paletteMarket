import { SubmitHandler, useForm } from 'react-hook-form'
import { supabase } from '../../../api/supabase/supabaseClient'

type TestType ={
  name: string
  age: number
  gender: string
  hobby: string
  greeting: string
}

const gender = ["여성", "남성"]
const hobby = ["운동", "그림", "영화", "음악"]

const TestInput = () => {

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: {errors, isSubmitSuccessful, isLoading, isValid}} = useForm<TestType>({
      mode: 'onChange',
    defaultValues: {
      name: "",
      gender: "여성",
      hobby: ""
    }
  })

  console.log("errors", errors, "isSubmitSuccessful", isSubmitSuccessful, "isLoading", isLoading, "isValid", isValid)
  
  const onSubmit: SubmitHandler<TestType> = async (Data) => {
    await new Promise((r: any) => setTimeout(r, 1000));

    const addPosts = async () => {
      try {
        const {data, error} = await supabase
          .from('test')
          .insert([{
            Data
          }])
  
        if (data) {
          console.log(data)
        }
        
        if (error) throw error;
        alert('내 정보가 등록되었습니다.')
      } catch (error) {
        alert('예상치 못한 문제가 발생하였습니다. 다시 시도하여 주십시오.')
      }
    }

    addPosts();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={{display: 'flex', flexDirection: 'column', marginBottom: '20px'}}>
        <div style={{display: 'flex', flexDirection: 'row', marginBottom: '20px'}}>
          <h2 style={{fontSize: '20px', fontWeight: 'bold', width: '200px'}}>Name*</h2>
          <input type='text' maxLength={8} {...register("name", {
            required: "필수값입니다.",
            minLength: {
              value: 2,
              message: "최소 2자이상 입력해야합니다."
            },
            maxLength: {
              value: 8,
              message: "최대 8자까지 입력할 수 있습니다."
            }
          })} />
          <span>{getValues("name").length}/8</span>
        </div>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <h2 style={{fontSize: '20px', fontWeight: 'bold', width: '200px'}}></h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <p>{watch("name")}</p>
            <p>{errors.name?.message}</p>
          </div>
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', marginBottom: '20px'}}>
        <div style={{display: 'flex', flexDirection: 'row', marginBottom: '20px'}}>
          <h2 style={{fontSize: '20px', fontWeight: 'bold', width: '200px'}}>Age*</h2>
          <input type='number' {...register("age", {
            required: "필수값입니다.",
            valueAsNumber: true,
            min: {
              value: 5,
              message: "나이를 입력해주세요."
            }
          })} />
        </div>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <h2 style={{fontSize: '20px', fontWeight: 'bold', width: '200px'}}></h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <p>{watch("age")}</p>
            <p>{errors.age?.message}</p>
          </div>
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', marginBottom: '20px'}}>
        <div style={{display: 'flex', flexDirection: 'row', marginBottom: '20px'}}>
          <h2 style={{fontSize: '20px', fontWeight: 'bold', width: '200px'}}>Gender*</h2>
          {gender.map(item => 
            <label key={item} htmlFor={item}>
              <input type='radio' value={item} id={item} {...register("gender")} />
            {item}</label>
          )}
          
        </div>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <h2 style={{fontSize: '20px', fontWeight: 'bold', width: '200px'}}></h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <p>{watch("gender")}</p>
            <p>{errors.gender?.message}</p>
          </div>
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', marginBottom: '20px'}}>
        <div style={{display: 'flex', flexDirection: 'row', marginBottom: '20px'}}>
          <h2 style={{fontSize: '20px', fontWeight: 'bold', width: '200px'}}>Hobby*</h2>
          {hobby.map(item => 
            <label key={item} htmlFor={item}>
              <input type='checkbox' value={item} id={item} {...register("hobby", {
            required: "취미를 선택해주세요.",
          })} />
            {item}</label>
          )}
          
        </div>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <h2 style={{fontSize: '20px', fontWeight: 'bold', width: '200px'}}></h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <p>{watch("hobby")}</p>
            <p>{errors.hobby?.message}</p>
          </div>
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', marginBottom: '20px'}}>
        <div style={{display: 'flex', flexDirection: 'row', marginBottom: '20px'}}>
          <h2 style={{fontSize: '20px', fontWeight: 'bold', width: '200px'}}>Greeting</h2>
          <textarea {...register("greeting")} />
          <span>0/2000</span>
        </div>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <h2 style={{fontSize: '20px', fontWeight: 'bold', width: '200px'}}></h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <p>{watch("greeting")}</p>
            <p>{errors.greeting?.message}</p>
          </div>
        </div>
      </div>
      <button type='submit' style={{margin: '0 0 20px 200px'}}>등록하기</button>
    </form>
  )
}

export default TestInput