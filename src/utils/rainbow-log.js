import chalk from 'chalk';
const log = console.log;

export const blue = (...message) => log(chalk.bgBlue.black.underline.bold(...message));
export const red = (...message) => log(chalk.bgRed.white.underline.bold(...message));
export const green = (...message) => log(chalk.bgGreen.black.underline.bold(...message));
export const yellow = (...message) => log(chalk.bgYellow.black.underline.bold(...message));
export const custom = (color, ...message) => log(chalk.hex(color).underline.bold(...message));
