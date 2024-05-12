// Importing necessary modules using ESM syntax
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import WordsPerSentence from './src/wps.ts';  // Assuming this module is properly exported as an ES module

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 <command> [options]')
  .command('encode', 'Encode a secret message into the cover text', {
    secret: {
      describe: 'Secret message to encode',
      type: 'string',
      demandOption: true,
      alias: 's'
    }
  })
  .command('decode', 'Decode a secret message from text', {
    text: {
      describe: 'Text to decode the message from',
      type: 'string',
      demandOption: true,
      alias: 't'
    }
  })
  .help('h')
  .alias('h', 'help')
  .example('$0 encode --secret "Your secret message"', 'Encode a secret message into cover text')
  .example('$0 decode --text "Encoded cover text"', 'Decode a message from encoded text')
  .demandCommand(1, 'You must provide a command.')
  .strictCommands()
  .argv;

// Charset definition and instantiation of WordsPerSentence
const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789";
const wps = new WordsPerSentence(charset);

if (argv._.includes('encode') && argv.secret) {
  // Encode the secret message into the cover text
  console.log("Encoded Text:");
  console.log(await wps.encode(argv.secret));
} else if (argv._.includes('decode') && argv.text) {
  // Decode the message from the given text
  console.log("Decoded Message:");
  console.log(wps.decode(argv.text));
} else {
  console.error('Invalid command or missing necessary parameters.');
  process.exit(1);
}



