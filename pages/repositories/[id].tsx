import React, { useEffect, useState, useCallback } from 'react'

import { useRouter } from 'next/router'
import { db } from '../../utils/firebase'

export default function RepositoriesView() {
  const router = useRouter()
  const id = router.query['id']

  const [ repo, setRepo ] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      let repositoryDetailsDb = await db.collection('repositories').doc(id).get()
      const values = repositoryDetailsDb.data()
      if (values) {
        let repositoryDetailsApi = await fetch(`https://api.github.com/repos/${values.username}/${values.reponame}`)
        repositoryDetailsApi = await repositoryDetailsApi.json()
        let contributors = await fetch(repositoryDetailsApi.contributors_url + '?page=1&per_page=10')
        contributors = await contributors.json()
        contributors = contributors.map( contributor => {
          return {
            name: contributor.login,
            contributions: contributor.contributions,
          }
        })
        setRepo({
          author: repositoryDetailsApi.owner.login,
          name: repositoryDetailsApi.name,
          description: repositoryDetailsApi.description,
          created_at: repositoryDetailsApi.created_at,
          stars: repositoryDetailsApi.stargazers_count,
          contributors,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }, [ id ])

  useEffect(() => {
    if(router.isReady){
      fetchData()
    }
  },[ router.isReady, fetchData ])

  if(!id) return <div></div>

  return (
    <div>
      <p>{repo?.author}</p>
      <p>{repo?.name}</p>
      <p>{repo?.description}</p>
    </div>
  )
}
