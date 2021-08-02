import React, { useState } from 'react';
import LinkForm from '../components/LinkForm';
import { repoDetails } from '../interfaces/interfaces';
import { db } from '../utils/firebase'
import classes from '../styles/Home.module.css'


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
    <div className={classes.homeContainer}>
      <h1 className={classes.title}>GithubLinks</h1>
      <div className={classes.content}>
        <div>
          <h2>Create your link here!</h2>
          <div className="card">
            <LinkForm handleSubmit={handleSubmit} handleChangeValues={handleChangeValues} />
          </div>
        </div>
        <div>{'=>'}</div>
        <div>
          <h2>Preview</h2>
          <div className={`card ${values.color}`}>
            <div>
              <p>Repository Owner: {values.username}</p>
              <p>Repository Name: {values.repo}</p>
              <p>Stars: 150</p>
            </div>
            <div>
              <h5>Actions</h5>
              <div className={classes.buttonsContainer}>
                {values.follow && <button>Follow</button>}
                {values.star && <button>Star</button>}
                {values.fork && <button>Fork</button>}
              </div>
            </div>
            <div>
              <h5>Top 10 Contributors</h5>
              <ol>
                {[1,2,3,4,5,6,7,8,9,10].map( contributor => <li key={contributor}>name {contributor}</li>)}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
