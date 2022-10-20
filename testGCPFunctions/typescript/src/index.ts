import type {HttpFunction} from '@google-cloud/functions-framework/build/src/functions';

export const helloWorld: HttpFunction = (req, res) => {
  res.send('Hello, World');
};

export const helloWorld2: HttpFunction = (req, res) => {
  res.send('Hello, World 2');
};
