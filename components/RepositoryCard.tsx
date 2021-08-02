import React, { FC } from 'react'
import { repoDetails } from '../interfaces/interfaces'

import classes from '../styles/RepositoryCard.module.css'

const RepositoryCard: FC<repoDetails> = (props) => {
  const { username, repo, color, follow, star, fork, stars, contributors } = props
  return (
    <>
    <h2>Preview</h2>
      <div className={`card ${color}`}>
        <div>
          <p>Repository Owner: {username}</p>
          <p>Repository Name: {repo}</p>
          <p>Stars: {stars}</p>
        </div>
        <div>
          <h5>Actions</h5>
          <div className={classes.buttonsContainer}>
            {follow && <button className={`${color}`}>Follow</button>}
            {star && <button className={`${color}`}>Star</button>}
            {fork && <button className={`${color}`}>Fork</button>}
          </div>
        </div>
        <div>
          <h5>Top 10 Contributors</h5>
          <ol>
            {contributors.map(contributor => <li key={contributor.name}>{contributor.name} - {contributor.contributions}</li>)}
          </ol>
        </div>
      </div>
      
    </>
  )
}

export default RepositoryCard
