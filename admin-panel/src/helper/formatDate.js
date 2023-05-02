import { format } from "date-fns";

export const formatDate = (date) => {
  const myDate = new Date(date);
  const formattedDate = format(myDate, "MM/dd/yyyy");
  return formattedDate;
};

export const formatDateTwo = (date) => {
  const myDate = new Date(date);
  const formattedDate = format(myDate, "yyyy-MM-dd");
  return formattedDate;
};
