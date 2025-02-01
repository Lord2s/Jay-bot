const { exec } = require('child_process');

function runBot() {
  const command = 'node Goat.js'; // Adjust this command to run your GoatBot script
  const botProcess = exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing bot: ${error}`);
      return;
    }
    console.log(`Bot output: ${stdout}`);
    console.error(`Bot error output: ${stderr}`);
  });

  botProcess.on('exit', (code) => {
    console.log(`Bot process exited with code ${code}`);
    // Restart the bot if it exits
    setTimeout(runBot, 1000); // Restart after 1 second
  });
}

// Run the bot continuously for 10 days
const tenDaysInMilliseconds = 10 * 24 * 60 * 60 * 1000;
setTimeout(() => {
  console.log('Stopping the bot after 10 days');
  process.exit(0);
}, tenDaysInMilliseconds);

// Start the bot
runBot();
