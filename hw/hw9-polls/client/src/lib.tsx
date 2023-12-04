// Type for components
export type Comp = "polls" | "newPoll" | "vote" | "results";

// Type for the poll
export type Poll = {
  name: string,
  minutes: number,
  options: string[],
  createAt: Date
};

// Type for the vote result
export type VoteResult = {
  poll: Poll,
  result: Map<string, number>,
  totalVotes: number
}

// Type for the server response
export type ServerResponse = {msg: string}

/**
 * Return the minute difference between two dates
 * @param src The source date for comparing
 * @param tar the target date for comparing
 */
export const diffTimeFunc = (src: Date, tar: Date):number =>{
  return (src.getTime() - tar.getTime()) / 1000 / 60
}
/**
 * Add minutes to a Date
 * @param minutes The minutes in number
 * @param date The target date to add minutes
 */
export const addMinutesFunc = (minutes: number, date: Date, ): Date => {
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  return newDate;
}
