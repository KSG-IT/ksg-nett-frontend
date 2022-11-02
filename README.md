# KSG-nett frontend

[![StackBlitz](https://img.shields.io/badge/StackBlitz-Edit-blue?style=flat-square&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAABECAYAAAD+1gcLAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH5AINBw4X0bTGRQAABSxJREFUaN7VmVtsFFUYx//fmQW79bbd2QKpaIIaDcGoifFBEgMGqTTRRA01SgxE5Rbi7QG6S3lgo9J2twpeotxEQlCigLdoQwJ4ARN9QB9MRCNRDBdRzE7LJbTSmTl/H4BYStmd2Z3tDOdt5lzml/9833fO9x0gYi2xgom6Tt5aapyKEnRDlrVGPzfGT+G3SwZ87HLGT8f5uYD7jmSl99IAX80RfTY3A5wMqDVepoQPnqVKHtMbAN4PyJeFtPwafXBSknG9UoDHAIDQq7xODRU8mdc5Aeaeffy7O2F8GnnwZM5dKsCic88CrMU8sSMNbubdZwTIDnjlOoZa52eNYQc3c84sEK+d/1a6ji2UA5EFN3POw4C8fcYy/m+a3p1y2MGTOXsqIJsAxAZ1Hei53tgeSfBkBycK1McALrswJGIVHhE3cuD1ed4uorsAXD5Ed7/hqvXlrFtV8LpO3qKpdwJIDLn/AB/+s0SORgp8VJ43KK23AzAvNsagWlXu+lKV6LGc14itvyEwrsiwX6wWNQEijITiY9pYD1vvKAENAG+VC40hQlNlNt3Bq22lt4EYX2Jor6PVe5V8KzDFG7KsFXE/A3GHB/vcdHyx9IQPnuXI/ji3CuRuT+N1+U4ZHPhmGqk43yXY5C0ccE9hsfwQLjgp5n69hmCz9ylYGcRPrgg8ldfLIXjSx5RjNX3GB6GCm3m3ncDz/v4QNnjJ4KsGbubdVhAZ35YFtTaoKOY7jps5dwGIZf73aH7dnZa9QYH72vLNDmcmRNaX86eEnGvT2BoIdA0o3pV2HgRkS9C7bXnRDGlPypmd9r2AvB8FaAFetDJGvqTiyU7eJWeOp1cgfOo3rRbj6ZJRJdHB20TrrkhAAxutXvVsSedMtfEmGno3gNHhM8snVp80IytO0The18HraOgdkYCm7KyLy6MDoYdUfNQyjnZjeheAm8NXmt/FlDH16CI5dUHaN/DhypeZUqK/AkomAsMQ8fCjq41GKy0nim75ydd51UjX3QZgQgQccV/MUfcVSzYM4Mw1hnPa7QJkYgSgD2qqe6xWOVL8kLWaI3ptbgFkUgSgjwpUY09GDpY8ZJnH9UsExhPYH8CuVgtgTJlzC5pqipXxdpUSaF3FzLkdANJleOIJETWlkJbvh78glOVIM64PARjlc2afiGoqtMiuUMoTqRp3ehnQtpDNfqEDBdeC+T6nuELOLGRiXVVPJC5u2xwP6L0+1qOQ8wqZWNmpXECK6wV+RBCipRLoQBRvyLL2dFwfBlDnTWos7W4xXgi3IATg31p3hldoEG8EAR0IuEC8OuUGK62eCyoYVARutvNOL9VZQD6yxqmnKqmHB6u46PkejHp7XVxmlHOzVhXnTKxgwujXhzH0bdo56m9jymgcKhEITXFl61lFoYV7BMa0akCjkjqJEHOKdP/U7xhNJ1vlZLXOv2Upnmq3JxfJlH4XRzWebBWrmgf38hRXav5F4vSfjqGmHl8if1W/NuSzjWljvW3oQxh0Ly9AQRtqUvdC+Xk4UiXfpmLH9JzB0CBOQKtpwwXtHzxLJcTsQW97FdQDQVxIVc3GUzVuEyEDb4z7NTndysju4c6qfSlOOc8pXQof78nEtoVRDvDsnMlXeK04+o+ztRgSnNOdjq1DSM2z4uLoeecKSCQWhgntXfEsY2ZcHwDQAMESq8VoC7ty5EnxZK37EIAGAV6NArT3c3def2Hm3HdASlSYSipe384bAR6x+tTsIBOBqoMTzlirVz2BrOgoWcF/mizikfkwKiQAAAAASUVORK5CYII=)](https://stackblitz.com/github.com/KSG-IT/ksg-nett-frontend)

## Overview

This is the fontend repo containing source code for the webapplication KSG-nett. This is a [React](https://reactjs.org/) + [Typescript](https://www.typescriptlang.org/) application uses [vite](https://vitejs.dev/) as a bundler

### Support libraries

| Library         | Function                    | website                                            |
| --------------- | --------------------------- | -------------------------------------------------- |
| Apollo client   | Graphql queries and caching | [Apollo docs](https://www.apollographql.com/docs/) |
| Mantine         | Component library           | [Mantine docs](https://mantine.dev/)               |
| React hot toast | Toast component provider    | [Website](https://react-hot-toast.com/)            |
| React hook form | Form handling               | [Website](https://react-hook-form.com/)            |
| Yup             | Form validation             | [github](https://github.com/jquense/yup)           |

In order for this app to function the backend part of the application needs to be running in the background. Follow the instructions in this [repo](https://www.github.com/KSG-IT/ksg-nett).

## Quickstart

Dependencies are managed with `yarn`. To run the code do the following

1. [install](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) yarn on your computer
2. Clone and Navigate to this folder
3. Install the dependencies by running `yarn install`
4. Run the projects by running `yarn start`

## Branch formatting guidelines

Usually tasks are assigned through [Shortcut](https://app.shortcut.io/ksg-it/stories/space) stories, with a story type which is either a feature, bug or chore, and a story id. This is used to track progress on the task throughout development. A given branch will automatically get tracked if the branch includes `sc-<story-id>` anywhere in its name.

- Our branches follows a convention of `story-type/sc-<story-id>/branch-name`

So a story which is a bug type, with an id of 666 and a title of "Dashboard renders wrong data" would be named `bug/sc-666/dashboard-renders-wrong-data` or similar.

## Code-style guide

In order to keep this repository maintanable please strive to follow the following code-style guidelines.

### Functional components and Typescript

In most cases when creating a new component you would want to declare it in the following way

```ts
interface NewComponentProps {...}
const NewComponent = React.FC<NewComponentProps> = ({...}) => {}
```

### Named export

When creating a component which is imported outside its module/folder use ordinary exports (not default) and export it explicitly in the module/folder index file. If we have `src/modules/ProfilePage.tsx` and want to export it so we can import it for the router in `src/container/AuthRoutes.tsx` it is exported as follows.

```tsx
// ProfilePage.tsx
export const ProfilePage = () => {...}

//index.ts
export * from './ProfilePage`
```

### Module structure

When creating a new module, try to keep the structure as follows

```
src/modules
├── moduleName
│   ├── components/
│   │   ├── Component1.tsx
│   │   ├── Component2.tsx
│   │   ├── View2/
│   │   │   ├── View2Component1.tsx
│   │   │   ├── View2Component2.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── views/
│   │   ├── View1.tsx
│   │   ├── View2.tsx
│   │   └── index.ts
│   ├── enums.ts
│   ├── types.ts
│   ├── types.graphql.ts
│   ├── utils.ts
│   ├── queries.ts
│   ├── mutations.ts
│   └── mutations.hooks.ts
└── moduleName2/
```

Where the index files uses barrel export. Components can be isolated to their own folder if the components structure in a specific view becomes fairly large and is only scoped to that module.

### Apollo queries and mutations

All queries and mutations are to have their variables and returndata typed correctly where applicable. Types are to be declared in the module `types.ts` file where the query or mutation is defined in `queries.ts` or `mutations.ts` respectively.

#### Queries

Queries are defined the `gql` template tags in local `queries.ts` files. A query for a user with a specific id would look like

```ts
// queries.ts
import { gql } from ´@apollo/client`

const USER_QUERY = gql`
  query UserQuery($id: ID!) {
    User(id: $id) {
      id
      fullName
      balance
      ...
    }
  }
`

//types.graphql.ts
type UserNode = {
  id: string
  fullName: string
  ...
}


interface UserQueryVariables {
  id: string
}

interface UserQueryReturns {
  user: UserNode | null
}
```

Our backend schema works such that it returns `null` if something goes wrong. An example of this being giving a `id` which does not belong to any given user, so the lookup fails and the object resolves to `null`. Given all this a `UserProfile` view query would look something like this

```tsx
import { useQuery } from '@apollo/client'
import { USER_QUERY } from './queries'
import { UserQueryVariables, UserQueryReturns } from './types'

const UserProfile: React.FC = () => {
  const { data, loading, error } = useQuery<
    UserQueryReturns,
    UserQueryVariables
  >(USER_QUERY,
    { variables: id: userId }
  )

  if (error) return (<SomeErrorComponent />)

  if (loading | !data) return (<SomeLoadingComponent />)

  const { user } = data

  if (user === null) return (<SomeResourceNotFoundComponent />)

  return <h1>Hello {user.fullName}. Welcome!</h1>
}
```

The reason we add `!data` to the query loading check is that data is defined by apollo as `T | undefined` where `T` is the return type we defined (this case `UserQueryReturns`). The Typescript compiler does not perform a deep enough check to understand that if `error` and `loading` are `null` and `false` then `data` has to be defined, so we do this do make the TS compiler happy.

#### Mutations

Mutations are effectively identical to queries in how we approach typing. The most notable thing to keep in mind is that most of the mutations available from the backend are automatically generated based of django models. Each model in most cases have a `create`, `patch` and `delete` mutation available. Both `create` and `patch` accept a `<MutationVerb><ModelName>Input` object. Given the `User` we would have the following types.

```ts
// mutations.ts
const PATCH_USER = gql`
  mutation PatchUser($id: ID!, $input: PatchUserInput!) {
    patchUser(id: $id, input: $input) {
      user: {
        id
        firstName
        lastName
      }
    }
  }
`

// types.ts
type CreateUserInput = {
  firstName: string
  lastName: string
}

type PatchUserInput = {
  firstname: string
  lastname: string
}

interface CreateUserMutationVariables {
  input: CreateUserInput
}

interface PatchUserMutationVariables {
  id: string
  input: PatchUserInput
}
```

The greatest difference between `useMutation` and `useQeury` is the returnvalue of the hook. `useMutation` returns an array where the first item is the function to execute the mutation and the second is different state variables similar to what `useQuery` returns.

```tsx
// PatchUser.tsx
const PatchUser: React.FC = () => {
  const [patchUser, {data, loading} = useMutation<
    PatchUserMutationReturns,
    PatchUserMutationVariables
  >(PATCH_USER, {
    onCompleted(data){
      const { user } = data
      // Show a toast or something
    }
  }}
}

const handlePatchUser = () => {
  createUser({
    id: userId,
    input: {
      firstName: "Tormod",
      lastName: "Haugland"
    }
  })
}

return (
  <button onClick={handlePatchUser}>Create user</button>
)
```

This is a very simple mutation, in most cases we want do this in tandem with form handling which is covered in the next section (someday). Another thing to note is that triggering mutations also requries us to update the local state of data. This is done with the `refetchQueries` option in `useMutation`.

#### Mutations hooks

In order to make mutation use flexible we wrap them into hooks.

```ts

export function useUserMutations() {
  const [createUser, {loading: createUserLoading}] = useMutation<
    CreateUserMutationReturns,
    CreateUserMutationVariables
  >(CREATE_USER)

  const [patchUser, {loading: patchUserLoading}] = useMutation<
    PatchUserMutationReturns,
    PatchUserMutationVariables
  >(PATCH_USER)

  const [deleteUser, {loading: deleteUserLoading}] = useMutation<
    DeleteUserMutationReturns,
    DeleteUserMutationVariables
  >(DELETE_USER)

  return {
    createUser,
    createUserLoading,
    patchUser,
    patchUserLoading,
    deleteUser
    deleteUserLoading
  }
}
```

This way we can simply use them like this

```tsx
const { createUser, createUserLoading } = useUserMutations()
```

### Form handling

For most forms we try to make use of a 3-layered form design where we delegate different tasks to different layers. We have a visual form layer, a logic layer dealing with form state and validation and an API/data layer dealing with the mutation of data and fetching.

We use `react-hook-form` for form handling with `yup` as a schema validator.

A form component then has 3 files

```
- MyForm.tsx
- useMyFormLogic.ts
- useMyFormAPI.ts
- index.ts
```

index only exports the Form component giving us a simple import/export API

```tsx
// MyForm.tsx
import { useMyFormLogic } from './useMyFormLogic'
import { useMyFormAPI } from './useMyFormApi'

export const MyForm: React.FC = () => {
  const { formState, formErrors, handleFormChange, handleFormSubmit } =
    useMyFormLogic(useMyFormAPI())

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        name="firstName"
        value={formState.firstName}
        onChange={handleFormChange}
      />
      <input
        type="text"
        name="lastName"
        value={formState.lastName}
        onChange={handleFormChange}
      />
      <button type="submit">Create user</button>
    </form>
  )
}
```

The inspiration for this design is taken from this [article](https://dev.to/spencerpauly/the-1-best-design-pattern-for-managing-forms-in-react-4215).
