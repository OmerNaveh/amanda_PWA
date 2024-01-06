export const getErrorMessage = (err: any): string => {
  if (err?.response?.data?.message) {
    return err.response?.data?.message;
  } else if (err?.data?.message) {
    return err?.data?.message;
  } else if (err?.message) {
    return err.message;
  } else {
    return "אופס, משהו השתבש";
  }
};
