# Farms Task

*Important*:

- You can find the original contents of this README [below](#recruitment-node-private-1.2.0).
- I moved the "Small Code Exercises" to a separate repo that you can find [here](https://github.com/manugrandio/small-code-exercises).

Some other notes:

- I received the existing code in a zip file, so I added all the contents to this repository.
The initial commit contains the state of the code unmodified by me.
I think one of the best ways to read my changes is through [this link](https://github.com/manugrandio/farms-task/compare/8a5eb16...HEAD) (diff between initial commit and HEAD).
- I grouped related commits in pull requests and merged them to `main`.
I tried to make make those commits as self-contained as possible, but there are small unrelated changes in some of them.
- The description of this exercise said "jwt needs to be validated & checked against DB".
I think I implemented JWT authentication correctly, but I could not understand why I had to "check it against DB", since JWT are self-contained and there's no need to store them in the database to check its validity and decode its contents.
I saw there is a `AccessToken` entity, but since no description was provided, I couldn't figure out what to do with it.
- I used `cropYield` as property name instead of `yield` because it's a reserved word in some scenarios.
- I only added authentication to the endpoints I created (`/farm/`). I didn't add those to the rest of the endpoints (`/user/`) because I thought it was outside the scope of this task.
- improvements:
    - caching (or storing in database field) driving distance for "user - farm"; clear cache on user or farm address change; objective improve performance and reduce money spent
    - pagination on farms list
    - use factories in tests
    - set `DISTANCE_MATRIX_TOKEN`
- I used Distance Matrix to get coordinates and calculate driving distance.
When doing the latter with multiple destinations I got an error `{ "status": "MAX_DIMENSIONS_EXCEEDED", "error_message": "Element limit exceeded in the request: 2 > 1." }`, so to get multiple driving distances I perform multiple requests.
- Right before the delivery date of this exercise I discovered some mocks don't work when using `supertest`, so running tests that create a farm and get the list of farms calls the Distance Matrix API.
Their failure is handled correctly and tests pass, but I think those are errors that have to be fixed.

## Setup

Apart from the setup described in the original README, remember to set the `DISTANCE_MATRIX_TOKEN` environment variable with your token.

# recruitment-node-private 1.2.0

This task is to implement a “feature” **based on the current setup**. Is not really about show off, but about deliver a solid piece of work.<br/>
We will look into the whole code and how the current setup is used, not just if it is working or not.<br/>
If you disagree on conventions used by the setup. Please comment on them, instead of changing the given setup.

Please make sure to provide all data needed to start the app.

Good luck!

## Installation

- Install [NodeJS](https://nodejs.org/en/) lts or latest version
- Install [Docker](https://www.docker.com/get-started/)

- In root dir run `npm install`
- In root dir run `docker-compose up` to setup postgres docker image for local development

- Create a .env file with the content from .env.test

## Running the app

- To build the project, run `npm run build`
- To start the project, run `npm run start`

- To run the test, run `npm run test`
- To run the lint, run `npm run lint`

Application runs on [localhost:3000](http://localhost:3000) by default.

## Migrations

Migration scripts:

- `npm run migration:generate --path=moduleName --name=InitialMigration` - automatically generates migration files with
  schema changes made
- `npm run migration:create --path=moduleName --name=CreateTableUsers` - creates new empty migration file
- `npm run migration:run` - runs migration
- `npm run migration:revert` - reverts changes

# Small code exercises

1. Please write a function to transform array to containing number and strings.

    - e.g `['super', '20.5', 'test', '23' ]` -> `['super', 20.5, 'test', 23 ]`

2. Please write a function to return an array of all files with `csv` extension in folder `/files`

3. Please write a function to return if a string contains a digit
    - e.g `'test-string'` -> `false`
    - e.g `'test-string23'` -> `true`

# Farms Task - API

## Setup

- Use created app
- Free to add additional packages
- Use existing user authentication
- Make sure all added endpoints are only accessible for authenticated users (jwt needs to be validated & checked against DB)

## Requirements

### General

1. Need to have test

### Model

1. User should have following properties: `address` & `coordinates`. 
2. Farm should belong to specific user & have following properties: `name`,  `address`, `coordinates`, `size` (e.g 21.5) & `yield` (e.g. 8.5)

### API

_Add API that supports following requirements:_

- There should be versioning endpoints (f.e. /api/v1/..)

- As a user I want to be able to create my **own** farms
    - Coordinates can't be set manually, have to be populated automatically based on the address

- As a user I want to be able to delete my **own** farms

- As a user I want to be able to retrieve a list of all farms **of all users**.
    - The list should contain following properties: 
      - `name`
      - `address`
      - `owner` (email)
      - `size`
      - `yield`
      - `driving distance` (travel distance from farm to requesting user's address)<br/>
          For **driving distance** you can use Distance-Matrix API of *Google*, *Microsoft*, *here* or https://distancematrix.ai/nonprofit .
          You are also welcome to use other service.

    - The user should be able to get list **sorted** by
        - **name** (a to z)
        - **date** (newest first)
        - **driving distance** (closest first)

    - The user should be able to get list **filtered** by
        - **outliers** (Boolean) (outliers = the yield of a farm is 30% below or above of the average yield of all farms).

### Seed

- Add seed that will create 4 users and 30 farms each.

<br/>
<br/>
<br/>
