# KSG-nett frontend
## Overview
This is the fontend repo containing source code for the webapplication KSG-nett. This is a [React](https://reactjs.org/) + [Typescript](https://www.typescriptlang.org/) application made with [CRA](https://create-react-app.dev/).


### Support libraries
| Library  | Function | website |
| ------------- | ------------- | ------------- |
| Apollo client  | Graphql queries and caching  |[Apollo docs](https://www.apollographql.com/docs/) |
| Styled components  | Styling library | [Styled components basics](https://styled-components.com/docs/basics) |
| React hot toast  | Toast component provider  | [Website](https://react-hot-toast.com/) |
| AirBnB React outside click handler  | Outside click detection  | [github](https://github.com/airbnb/react-outside-click-handler) |
| React hook form  | Form handling  | [Website](https://react-hook-form.com/) |
| Yup  | Form validation  | [github](https://github.com/jquense/yup) 

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
const NewComponent = React.VFC<NewComponentProps> = ({...}) => {}
```

`React.VFC` is a functional component type which does not inject `children` implicitly, see [this](https://www.mydatahack.com/using-react-vfc-instead-of-react-fc/) for further details. Otherwise, if making a component making use of `children` replace `React.VFC` with `React.FC`.

### Named export
When creating a component which is imported outside its module/folder use ordinary exports (not default) and export it explicitly in the module/folder index file. If we have `src/modules/ProfilePage.tsx` and want to export it so we can import it for the router in `src/container/AuthRoutes.tsx` it is exported as follows. 



```tsx
// ProfilePage.tsx
export const ProfilePage = () => {...}

//index.ts
export * from './ProfilePage`
```



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

//types.ts
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

const UserProfile: React.VFC = () => {
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
const PatchUser: React.VFC = () => {
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

### Form handling
`ToDo`


