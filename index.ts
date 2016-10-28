import * as firebase from 'firebase';
import * as readline from 'readline';
import * as colors from 'colors';

firebase.initializeApp({
  apiKey: "AIzaSyDdbOngsxV9djoBRfnrx8hMvsskMCGzNaQ",
  authDomain: "chat-8208f.firebaseapp.com",
  databaseURL: "https://chat-8208f.firebaseio.com",
  storageBucket: "chat-8208f.appspot.com",
  messagingSenderId: "169961205841"
});
const chatsRef = firebase.database().ref('chats');


const rl = readline.createInterface(process.stdin, process.stdout);

// Logs a message keeping prompt on last line
function log(message: string) {
  readline.cursorTo(process.stdout, 0, undefined);
  console.log(message);
  rl.prompt(true);
}

function prompt(message: string) {
  return new Promise<string>(resolve => {
    rl.question(message, userInput => {
      resolve(userInput);
    });
  });
}

(async () => {
  // Get user name
  const userName = (await prompt('Your name (anonymous): ')).trim() || 'anonymous';

  // Write new messages to console
  chatsRef.limitToLast(100).on('child_added', snapshot => {
    const message = snapshot!.val();
    log(`${colors.yellow(message.user)}: ${message.text}`);
  });

  // Prompt for messages to send
  while (true) {
    chatsRef.push({
      text: await prompt('> '),
      user: userName,
    });
  }
})();
