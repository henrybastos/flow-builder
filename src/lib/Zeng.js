import chalk from "chalk";

/**
 * @class
 * @classdesc Messenger of Shifu. Notifies information, warnings and errors, aswell as displaying complete structures like arrays and objects.
 */
export default class Zeng {
   /**
    * @method
    * @param {string} message - The message to be displayed.
    * @param {Object} options - Defines the error type and the suffix (optional).
    * @param {'warning'|'error'|'full-error'|'info'|'success'|'mystery'} options.type - Defines the type of the message.
    * @param {string} [options.suffix] - The suffix to be appended to the message.
    */
   static say (message, { type, suffix = '' } = {}) {
      switch (type) {
            case 'warning':
            console.warn(`${chalk.black.bgYellowBright.bold(` Warning${suffix && ` [${ suffix }]`}: `)} ${chalk.yellowBright(message)}`);
               break;
            case 'error':
               console.error(`${chalk.bgRedBright.bold(` Error${suffix && ` [${ suffix }]`}: `)} ${ chalk.redBright(message) }`);
               break;
            case 'full-error':
               console.error(`${chalk.bgRedBright.bold(` __Full_Error__${suffix && ` [${ suffix }]`}: `)} ${ chalk.redBright(message) }`);
               break;
            case 'info':
               console.log(`${chalk.bgBlue.bold(` Info${suffix && ` [${ suffix }]`}: `)} ${chalk.blue(message)}`);
               break;
            case 'success':
               console.log(`${chalk.bgGreen.bold(` Success${suffix && ` [${ suffix }]`}: `)} ${chalk.green(message)}`);
               break;
            case 'mystery':
               console.log(`${chalk.bgMagentaBright.bold(` ...${suffix && ` [${ suffix }]`}: `)} ${chalk.magentaBright(message)}`);
               break;
            default:
               console.log(`${chalk.bgBlue.bold(` Info${suffix && ` [${ suffix }]`}: `)} ${chalk.blue(message)}`);
               break;
      }
   }

   static dir (message) {
      console.dir(message, { depth: null });
   }
}