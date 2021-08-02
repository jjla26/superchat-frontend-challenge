import React, { useState } from 'react';
import Link from 'next/link'
import LinkForm from '../components/LinkForm';
import { repoDetails } from '../interfaces/interfaces';
import { db } from '../utils/firebase'
import classes from '../styles/Home.module.css'
import RepositoryCard from '../components/RepositoryCard';
import contributors from '../constants/Contributors'

export default function Home() {
  const [ values, setValues ] = useState({ username: '', repo: '', follow: false, star: false, fork: false, download: false, color: 'gray' })
  const [ link, setLink ] = useState('')
  const [ path, setPath ] = useState('')
  const [ message, setMessage ] = useState('')
  const [ error, setError ] = useState('')

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
          icon: result.owner.avatar_url,
          ...values 
        })
        setPath(link.id)
        setLink(`${window.location.href}repositories/${link.id}`)
        setMessage('The link was created succesfully')
        setError('')
      }else{
        setMessage('')
        setLink('')
        setError('The username or repository doesn\'t exist')
      }
    } catch (error) {
      setMessage('')
      setLink('')
      setError('Ops! something happened')
    }
  }
  
  return (
    <div className={classes.homeContainer}>
      <h1 className={classes.title}>GithubLinks</h1>
      <div className={classes.content}>
        <div className={classes.cardContainer}>
          <h2>Create your link here!</h2>
          <div className="card">
            <LinkForm handleSubmit={handleSubmit} handleChangeValues={handleChangeValues} />

            {link && 
            <div className={classes.linkContainer}>
              <Link href={`/repositories/${path}`}><a>{link}</a></Link>
              <button onClick={() => navigator.clipboard.writeText(link)}>Copy link</button>
              {error && <div className="error">{error}</div>}
              {message && <div>{message}</div>}
            </div>}
          </div>
        </div>
        <div className={classes.arrow}>{'=>'}</div>
        <div className={classes.cardContainer}>
          <h2>Preview</h2>
          <RepositoryCard 
            preview={true}
            username={values.username}
            repo={values.repo}
            stars={10}
            star={values.star}
            follow={values.follow}
            fork={values.fork}
            color={values.color}
            download={values.download}
            contributors={contributors}
          />
        </div>
      </div>
    </div>
  )
}
