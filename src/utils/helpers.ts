export const filterByValue = (items, props: string[], value: string) => {
  const lowerCaseValue = value.toLowerCase();
  return items.filter((item) => {
    for (let i = 0; i < props.length; i += 1) {
      if (`${item[props[i]]}`.toLowerCase().includes(lowerCaseValue)) {
        return true;
      }
    }
    return false;
  });
};
