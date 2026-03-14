const guard = (func, shouldGuard) => {
  const _guard = (err) => {
    return void 0;
  };
  const isPromise2 = (result) => result instanceof Promise;
  try {
    const result = func();
    return isPromise2(result) ? result.catch(_guard) : result;
  } catch (err) {
    return _guard();
  }
};
export {
  guard as g
};
