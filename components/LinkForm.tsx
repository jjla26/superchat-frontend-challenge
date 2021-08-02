import React, { FC } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';

import { repoDetails } from '../interfaces/interfaces';
import classes from '../styles/LinkForm.module.css'
import colors from '../constants/Colors'

interface Props {
  handleChangeValues: ( value: string | boolean, name: string) => void,
  handleSubmit: (values: repoDetails) => void
}

const LinkForm: FC<Props> = props => {
  const { handleSubmit, handleChangeValues } = props

  return (
    <Formik
      initialValues={{ username: '', repo: '', follow: false, star: false, fork: false, download: false, color: 'mustard' }}
      validate={values => {
        const errors: repoDetails = {};
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
        <Form
          className={classes.form}
        >
          <div className={classes.inputGroup}>
            <label>Username</label><br />
            <Field 
              className={classes.textInput}
              type="text" 
              name="username" 
              placeholder=":username"
              onChange={(e:any) => {
                handleChange(e)
                handleChangeValues(e.target.value, 'username')
              }}/>
            <ErrorMessage className="error" name="username" component="div"  />
          </div>

          <div className={classes.inputGroup}>
            <label>Repository Name</label><br />
            <Field 
              className={classes.textInput}
              type="text" 
              name="repo" 
              label="Repository Name"
              placeholder=":repo"
              onChange={(e:any) => {
                handleChange(e)
                handleChangeValues(e.target.value, 'repo')
              }} />
            <ErrorMessage className="error" name="repo" component="div" />
          </div>

          <div>
            <div>Options</div>
            <div className={classes.optionsGroup}>
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
              
              <Field 
                type="checkbox" 
                name="download" 
                onChange={(e:any) => {
                  handleChange(e)
                  handleChangeValues(e.target.checked, 'download')
                }}/>
              <label>Download button</label>

            </div>
          </div>
        
          <div>
            <div>Colors</div>
            <div role="group" aria-labelledby="my-radio-group" className={classes.optionsGroup}>
              {colors.map(color =>
              <label key={color.id} className={classes.optionsGroup}>
                <Field 
                  type="radio" 
                  name="color" 
                  value={color.name} 
                  onChange={(e:any) => {
                    handleChange(e)
                    handleChangeValues(e.target.value, 'color')
                  }} />
                <div className={`${classes.colorOption} ${color.name}`}>color</div>
              </label>)}
            </div>
          </div>
          <div className={classes.buttonContainer}>
            <button type="submit">
              Create Link
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default LinkForm
