export function readArgs() {
  const args = {};

  process.argv.forEach((arg) => {
    if (arg.includes("=")) {
      const [name, value] = arg.split("=");
      args[name] = value;
    } else {
      args[arg] = true;
    }
  });

  return args;
}