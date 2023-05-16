

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval

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
                //   <img 
                //     src=${isAi ? bot : user} 
                //     alt="${isAi ? 'bot' : 'user'}" 
                //   />

                <p>${isAi ? 'bot' : 'user'}</p>
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
  this.chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

  // to clear the textarea input 
  this.form.reset()

  // bot's chatstripe
  const uniqueId = generateUniqueId()
  this.chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

  // to focus scroll to the bottom 
  this.chatContainer.scrollTop = this.chatContainer.scrollHeight;

  // specific message div 
  const messageDiv = document.getElementById(uniqueId)

  // messageDiv.innerHTML = "..."
  loader(messageDiv)

  const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization' : "Bearer " + "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"
      },

      body: JSON.stringify({
      model: "text-davinci-003",
      prompt:  data.get('prompt'),
      temperature: 0.01, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 0, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 2, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 2, // 
      }),
  })

  clearInterval(loadInterval)
  messageDiv.innerHTML = " "

  if (response.ok) {
      const data = await response.json();
      console.log("response Data: ",data);
      const parsedData = data.choices[0].text.trim(); // trims any trailing spaces/'\n' 

      typeText(messageDiv, parsedData)
  } else {
      const err = await response.text()

      messageDiv.innerHTML = "Something went wrong"
      alert(err)
  }
}


this.form.addEventListener('submit', handleSubmit)
this.form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})

