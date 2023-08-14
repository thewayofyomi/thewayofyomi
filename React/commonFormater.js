const commonFormater = {};

commonFormater.getName = (cli) => {
  let name = `${cli.firstName} ${cli.lastName}`;
  if (cli.mi) {
    name = `${cli.firstName} ${cli.mi} ${cli.lastName}`;
  }
  return name;
};

commonFormater.formatUsd = (q) => {
  return q.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

export default commonFormater;
