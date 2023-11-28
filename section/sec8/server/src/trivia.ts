import { List, explode_array } from "./list";


/** Record containing a question and its answer. */
export type QnA = {question: string, answer: string};

/** List of trivia questions available in the app. */
export const TRIVIA: List<QnA> = explode_array([
    {question: 'What is the largest animal?', answer: 'blue whale'},
    {question: 'What is the fastest land animal?', answer: 'cheetah'},
    {question: 'What is the tallest land animal?', answer: 'giraffe'},
  ]);
