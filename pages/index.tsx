import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import colors from '../constants/Colors'
import { db } from '../utils/firebase'


export default function Home() {
  const [ values, setValues ] = useState({ username: '', repo: '', follow: false, star: false, fork: false, color: 'mustard' })
  const [ link, setLink ] = useState('')

  const handleChangeValues = (value:any, name:string) => {
    setValues( prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  /** Function handles the form submit **/
  const handleSubmit = async (values) => {
    try {
      let response= await fetch(`https://api.github.com/repos/${values.username}/${values.repo}`)
      response = await response.json()
      if(response.name) {
        // when the repository exists then add the details to firebase
        const link = await db.collection('repositories').add({
          username: response.owner.login, 
          reponame: response.name, 
          color: values.color, 
          icon: response.owner.avatar_url
        })
        setLink(`${window.location.href}repo/${link.id}`)
      }else{
        console.log('The username or repository doesn\'t exist')
      }
    } catch (error) {
      console.log('Ops! something happened')
    }
  }
  
  return (
    <div>
      <Formik
        initialValues={{ username: '', repo: '', follow: false, star: false, fork: false, color: 'mustard' }}
        validate={values => {
          const errors = {};
          if(!values.username){
            errors.username = "Required"
          }
          if(!values.repo){
            errors.repo = "Required"
          }
          return errors;
        }}
        onSubmit={handleSubmit}
     >
       {({ handleChange }) => (
         <Form>
          <Field 
            type="text" 
            name="username" 
            onChange={(e:any) => {
              handleChange(e)
              handleChangeValues(e.target.value, 'username')
            }}/>
          <ErrorMessage name="username" component="div"  />

          <Field 
            type="text" 
            name="repo" 
            onChange={(e:any) => {
              handleChange(e)
              handleChangeValues(e.target.value, 'repo')
            }} />
          <ErrorMessage name="repo" component="div" />

          <Field 
            type="checkbox" 
            name="follow" 
            onChange={(e:any) => {
              handleChange(e)
              handleChangeValues(e.target.checked, 'follow')
            }}/>
          <label>Follow button</label>

          <Field 
            type="checkbox" 
            name="star" 
            onChange={(e:any) => {
              handleChange(e)
              handleChangeValues(e.target.checked, 'star')
            }}/>
          <label>Star button</label>

          <Field 
            type="checkbox" 
            name="fork" 
            onChange={(e:any) => {
              handleChange(e)
              handleChangeValues(e.target.checked, 'fork')
            }}/>
          <label>Fork button</label>

          <div id="my-radio-group">Color</div>
          <div role="group" aria-labelledby="my-radio-group" >
            {colors.map(color =>
            <label key={color.id}>
              <Field 
                type="radio" 
                name="color" 
                value={color.name} 
                onChange={(e:any) => {
                  handleChange(e)
                  handleChangeValues(e.target.value, 'color')
                }} />
            </label>)}
          </div>

          <button type="submit">
            Create Link
          </button>
         </Form>
       )}
     </Formik>
    </div>
  )
}
