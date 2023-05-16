import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');


let loadInterval;
let isFormEnable = false;

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

//load test character by character
function typeText(element, text) {
  let index = 0

  let interval = setInterval(() => {
      if (index < text.length) {
          element.innerHTML += text.charAt(index);
          index++;
      } else {
          clearInterval(interval);
      }
  }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

// chatStripe => used for each message and show the corresponding user like user or chatgpt and icon
function chatStripe(isAi, value, uniqueId) {
  return (
      `
      <div class="wrapper ${isAi && 'ai'}">
          <div class="chat">
              <div class="profile">
                  <img class="${isAi ? '' : 'user-img'}"
                  src=${isAi ? bot : user} 
                  alt="${isAi ? 'bot' : 'user'}" 
                />
              </div>
              <div class="message" id=${uniqueId}>${value}</div>
          </div>
      </div>
  `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault()

  const data = new FormData(form)

  // user's chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

  // to clear the textarea input 
  form.reset()

  // bot's chatstripe
  const uniqueId = generateUniqueId()
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

  // to focus scroll to the bottom 
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // specific message div 
  const messageDiv = document.getElementById(uniqueId)

  // messageDiv.innerHTML = "..."
  loader(messageDiv)

//   const response = await fetch('https://api.openai.com/v1/completions', {
//       method: 'POST',
//       headers: {
//           'Content-Type': 'application/json; charset=utf-8',
//           'Authorization' : "Bearer " + "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"
//       },

//       body: JSON.stringify({
//       model: "text-davinci-003",
//       prompt:  data.get('prompt'),
//       temperature: 0.01, // Higher values means the model will take more risks.
//       max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
//       top_p: 0, // alternative to sampling with temperature, called nucleus sampling
//       frequency_penalty: 2, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
//       presence_penalty: 2, // 
//       }),
//   })


const request = await fetch("https://api.bardapi.dev/chat", {
  headers: { Authorization: "Bearer e3e8bc24-e913-4d6f-8f50-56535ff4883f",'Content-Type': 'application/json; charset=utf-8', },
  method: "POST",
  body: JSON.stringify({ input: "Who won the world cup last year?" }),
});
// const response = await request.json();

  clearInterval(loadInterval)
  messageDiv.innerHTML = " "

  if (response.ok) {
      const data = await response.json();
      console.log("response Data: ",data);
    //   const parsedData = data.choices[0].text.trim(); // trims any trailing spaces/'\n' 

    const parsedData = data.output;
      typeText(messageDiv, parsedData)
  } else {
      const err = await response.text()

      messageDiv.innerHTML = "Something went wrong"
      alert(err)
  }
}


form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})

var open = false;
var chatgpt_container = document.getElementById('chatgpt_container');

const widgetIcon = document.getElementById("widget__icon");
const closeIcon = document.getElementById("close__icon");

const toggle_btn = document.getElementById("toggle_btn");
toggle_btn.addEventListener("click", function() {
  console.log("handleToggle");
  // this.chatgpt_container.classList.add()
  // chatgpt_container.classList.add("widget__hidden");

  open = !open;
  if (open) {
    chatgpt_container.classList.add("widget__hidden");
  } else {
    chatgpt_container.classList.remove("widget__hidden");
}
});

