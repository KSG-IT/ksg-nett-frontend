import { FC, useState } from 'react'
import styled from 'styled-components'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useApolloClient } from '@apollo/client'
import { LOGIN_MUTATION } from './mutations'
import { LoginMutationReturn, LoginMutationVariables } from './types'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { setLoginToken, getLoginToken } from 'util/auth'

const Button = styled.button``

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 450px;
`
const StyledInput = styled.input``

const LoginInput = styled.input`
  width: 100%;
  height: 75px;
  border-radius: 10px;
  color: red;
`

const LoginTitle = styled.h2`
  color: green;
`
const AuthenticateButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  cursor: pointer;
  color: white;
  width: 110px;
  height: 45px;
  border: 0;
  border-radius: 10px;

  &:hover {
    filter: brightness(0.9);
  }
`
const Form = styled.form`
  background-color: red;
`

type Inputs = {
  username: string
  password: string
}

export const Login: FC = () => {
  const client = useApolloClient()
  const history = useHistory()

  let schema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ resolver: yupResolver(schema) })

  const [login] = useMutation<LoginMutationReturn, LoginMutationVariables>(
    LOGIN_MUTATION,
    {
      onCompleted(data) {
        const { login } = data
        const { ok } = login

        if (!ok) {
          return
        }
        const { token } = login
        setLoginToken(token)
        client.resetStore()
        console.log(token)
        console.log(getLoginToken())
        history.push('/dashboard')
      },
      onError(error) {
        console.error(error)
      },
    }
  )

  const onSubmit: SubmitHandler<Inputs> = data => login({ variables: data })

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <LoginContainer>
          <LoginTitle>KSG-nett</LoginTitle>
          <StyledInput {...register('username', { required: true })} />
          {errors.username && <span>This field is required</span>}
          <StyledInput
            type="password"
            {...register('password', { required: true })}
          />
          {errors.password && <span>This field is required</span>}
          <Button type="submit">Authenticate</Button>
        </LoginContainer>
      </Form>
    </Wrapper>
  )
}
