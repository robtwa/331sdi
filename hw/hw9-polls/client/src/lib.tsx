export type model = "polls" | "newPoll" | "vote" | "results";  // UI view
export type action = undefined| "new" | "edit" | "save" | "refresh" | "back"; // action

export type poll = {
  name: string,
  minutes: number,
  options: string[],
  createAt: Date
};

export type voteResult = {
  poll: poll,
  result: Map<string, number>,
  totalVotes: number
}

/**
 * Return the difference between two dates in minutes
 * @param src
 * @param tar
 */
export const diffTimeFunc = (src: Date, tar: Date):number =>{
  return (src.getTime() - tar.getTime()) / 1000 / 60
}

export const addMinutesFunc = (minutes: number, date: Date, ): Date => {
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  return newDate;
}