/**
 * It takes a function as an argument, and returns a new function that wraps the original function in a try/catch block
 * @param fn - The function that we want to wrap in a try/catch block.
 * @returns A function that takes in a function as an argument and returns a function that takes in
 * req, res, and next as arguments.
 */
const catchAsyncErrors = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

export default catchAsyncErrors;
