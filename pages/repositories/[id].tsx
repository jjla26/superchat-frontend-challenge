import React, { useEffect, useState, useCallback } from 'react'

import { useRouter } from 'next/router'
import { db } from '../../utils/firebase'
import RepositoryCard from '../../components/RepositoryCard'
import classes from '../../styles/RepositoryView.module.css'
import { repoDetails } from '../../interfaces/interfaces'
import Link from 'next/link'

export default function RepositoriesView() {
  const router = useRouter()
  const id: any = router.query['id']

  const [ repo, setRepo ] = useState<null | repoDetails>(null)
  const [ loading, setLoading ] = useState<boolean>(true)
  const [ error, setError ] = useState<string>('')

  const fetchData = useCallback(async () => {
    try {
      let repositoryDetailsDb = await db.collection('repositories').doc(id).get()
      const values = repositoryDetailsDb.data()
      if (values) {
        const responseRepositories = await fetch(`https://api.github.com/repos/${values.username}/${values.repo}`)
        const repositoryDetailsApi = await responseRepositories.json()
        const responseContributors = await fetch(repositoryDetailsApi.contributors_url + '?page=1&per_page=10')
        let contributors = await responseContributors.json()
        contributors = contributors.map( (contributor:{login: string, contributions: string}) => {
          return {
            name: contributor.login,
            contributions: contributor.contributions,
          }
        })
        setRepo({
          stars: repositoryDetailsApi.stargazers_count,
          contributors,
          ...values
        })
        setLoading(false)
      } else {
        setLoading(false)
        setError('This link has not been created before')
      }
    } catch (error) {
      setError('Oops! Something happened. Try again')
      setLoading(false)
    }
  }, [ id ])

  useEffect(() => {
    if(router.isReady){
      fetchData()
    }
  },[ router.isReady, fetchData ])

  if(!id) return <div></div>

  if(loading) return <div className={classes.container}>Loading...</div>

  return (
    <div className={classes.container}>
      <h1>GithubLinks</h1>  
      {repo?.username &&<RepositoryCard 
        username={repo?.username}
        repo={repo?.repo}
        stars={repo?.stars}
        star={repo?.star}
        color={repo?.color}
        follow={repo?.follow}
        fork={repo?.fork}
        download={repo?.download}
        contributors={repo?.contributors}
      />}
      {error && <div>{error}</div>}
      <div className={classes.link}>
        <Link href='/'>Create a new link</Link>
      </div>

    </div>
  )
}
