import React, { FC } from 'react'
import { repoDetails } from '../interfaces/interfaces'

import classes from '../styles/RepositoryCard.module.css'

interface Props {
  username: string | undefined, 
  repo: string | undefined, 
  color: string | undefined, 
  follow: boolean | undefined, 
  star: boolean | undefined, 
  fork: boolean | undefined, 
  stars: number | undefined, 
  contributors: Array<{name: string, contributions: number}> | undefined, 
  download: boolean | undefined, 
  preview?: boolean
}


const RepositoryCard: FC<Props> = (props) => {
  const { username, repo, color, follow, star, fork, stars, contributors, download, preview } = props

  const handleClick = (e:any) => {
    if(preview){
      e.preventDefault()
    }
  }

  return (
    <>
      <div className={`card ${color}`}>
        <div>
          <p>Repository Owner: {username}</p>
          <p>Repository Name: {repo}</p>
          <p>Stars: {stars}</p>
        </div>
        { (follow || star || fork || download) && <div>
          <h5>Actions</h5>
          <div className={classes.buttonsContainer}>
            {follow && 
              <a 
                onClick={handleClick}
                href={`https://github.com/${username}`} 
                className={`${classes.githubButton} ${color}`} 
                target="__blank">
                  Follow
              </a>}
            {star && 
              <a 
                onClick={handleClick}
                href={`https://github.com/${username}/${repo}`} 
                className={`${classes.githubButton} ${color}`} 
                target="__blank">
                  Star
              </a>}
            {fork && 
              <a 
                onClick={handleClick}
                href={`https://github.com/${username}/${repo}/fork`} 
                className={`${classes.githubButton} ${color}`} 
                target="__blank">
                  Fork
              </a>}
            {download && 
              <a 
                onClick={handleClick}
                href={`https://github.com/${username}/${repo}/archive/HEAD.zip`} 
                className={`${classes.githubButton} ${color}`} 
                target="__blank">
                  Download
              </a>}
          </div>
        </div>}
        <div>
          <h5>Top 10 Contributors</h5>
          <ol>
            {contributors?.map(contributor => <li key={contributor.name}>{contributor.name} - {contributor.contributions}</li>)}
          </ol>
        </div>
      </div>
      
    </>
  )
}

export default RepositoryCard
