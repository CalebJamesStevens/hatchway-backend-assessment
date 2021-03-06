# Hatchway Backend Assesment

This project is a small api that accesses Hatchways post api, processes the request with some logic, and returns an object with an array of post object sorted by user specification.

The server itself is implemented in NodeJS using Express.

## Integration with the Hatchway API

This backend interacts directly with Hatchway's Blog Post API, specifically for the purpose of find posts posts by specified tags.

## Running the server

If you wish to run the server, you must:

1. [install Node](https://nodejs.org/en/).
2. Download and unzip the project from provided file or clone the [github repo](https://github.com/CalebJamesStevens/hatchway-backend-assessment).
3. Open a terminal and navigate to the project directory
4. Instal dependencies by typing this into the terminal:

```
npm install
```

5. Start the server by typing this into the terminal.

```
npm run start
```

The server should now be running which is indicated by a log in the terminal that looks like:

```
Server started on port 5000
```

## Testing the project

If you wich to run the test file provided by me you may simply navigate to the project directory in a terminal and run this command:

```
npm run test
```
