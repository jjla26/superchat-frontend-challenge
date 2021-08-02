import React, { useState } from 'react';
import LinkForm from '../components/LinkForm';
import { repoDetails } from '../interfaces/interfaces';
import { db } from '../utils/firebase'


export default function Home() {
  const [ values, setValues ] = useState({ username: '', repo: '', follow: false, star: false, fork: false, color: 'mustard' })
  const [ link, setLink ] = useState('')

  const handleChangeValues = (value: string | boolean, name: string) => {
    setValues( prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  /** Function handles the form submit **/
  const handleSubmit = async (values: repoDetails) => {
    try {
      const response = await fetch(`https://api.github.com/repos/${values.username}/${values.repo}`)
      const result = await response.json()
      if(result.name) {
        // when the repository exists then add the details to firebase
        const link = await db.collection('repositories').add({
          username: result.owner.login, 
          reponame: result.name, 
          color: values.color, 
          icon: result.owner.avatar_url
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
      <h2>Create your link here!</h2>
      <div>
        <LinkForm handleSubmit={handleSubmit} handleChangeValues={handleChangeValues} />
      </div>
    </div>
  )
}
