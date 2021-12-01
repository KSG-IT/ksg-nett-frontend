import { FC } from 'react'
import styled from 'styled-components'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useApolloClient } from '@apollo/client'
import { LOGIN_MUTATION } from './mutations'
import { LoginMutationReturn, LoginMutationVariables } from './types'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { setLoginToken } from 'util/auth'

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  background-color: ${props => props.theme.colors.background};
  padding-top: 20%;
  ${props => props.theme.media.mobile} {
    padding-top: 50%;
  }
`

const Button = styled.button`
  width: 100%;
  height: 48px;
  font-size: 20px;
  font-weight: 700;
  background-color: #701fea; //${props => props.theme.colors.purple};
  color: ${props => props.theme.colors.white};
  box-shadow: ${props => props.theme.shadow.default};
  border-radius: 5px;
  border: 0;
`

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 330px;

  ${props => props.theme.media.mobile} {
    width: 90%;
  }
`
const StyledInput = styled.input`
  width: 100%;
  height: 45px;
  margin-bottom: 15px;
  border-radius: 2px;
  font-size: 18px;
  box-shadow: ${props => props.theme.shadow.default};
  border: 0;
  padding: 0 4px;
  &:focus {
  }
`

const LoginTitle = styled.h1`
  font-size: 46px;
  margin-bottom: 15px;
  color: #701fea;; //${props => props.theme.colors.purple};
  font-weight: 600;
`

const Form = styled.form`
  width: 330px;
  display: flex;
  flex-direction: column;

  align-items: center;
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
          <StyledInput
            placeholder="name@example.com"
            {...register('username', { required: true })}
          />
          {errors.username && <span>This field is required</span>}
          <StyledInput
            type="password"
            placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
            {...register('password', { required: true })}
          />
          {errors.password && <span>This field is required</span>}
          <Button type="submit">Log in</Button>
        </LoginContainer>
      </Form>
    </Wrapper>
  )
}
