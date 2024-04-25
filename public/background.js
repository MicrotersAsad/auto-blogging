// // Service worker activation logic
// console.log('Service worker activated.');

// // Listen for install event
// chrome.runtime.onInstalled.addListener(() => {
//   console.log('Extension installed.');

//   // Fetch the API data
//   fetch('https://api.fastwpspeed.com/microUrl/MetaTitle')
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       return response.json();
//     })
//     .then(data => {
//       console.log('API response:', data);
//       // Perform additional tasks using the API response
//       chrome.tabs.create({ url: data.extensionInstallUrl });
//       chrome.runtime.setUninstallURL(data.extensionUnInstallUrl);
//     })
    
// });
// // chrome.action.onClicked.addListener((tab) => {
// //   chrome.windows.create({
// //     url: 'index.html',
// //     type: 'popup',
// //     width: 400,
// //     height: 600,
// //     left: 100,
// //     top: 100,
// //     focused: true,
// //     state: 'fullscreen' // Set the state to fullscreen
// //   });
// // });


// // background.js

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === 'getOpenaiKey') {
//     chrome.storage.sync.get(['openaiKey'], (result) => {
//       const savedKey = result.openaiKey || '';
//       sendResponse(savedKey);
//     });
//     return true; // Indicates that sendResponse will be called asynchronously
//   } else if (message.action === 'setOpenaiKey') {
//     chrome.storage.sync.set({ 'openaiKey': message.openaiKey }, () => {
//       sendResponse('Key saved successfully');
//     });
//     return true; // Indicates that sendResponse will be called asynchronously
//   }
// });
// background.js

// Function to save the OpenAI key to Chrome storage
const saveOpenaiKey = (openaiKey) => {
  chrome.storage.sync.set({ 'openaiKey': openaiKey }, () => {
    console.log('OpenAI key saved successfully:', openaiKey);
  });
};

// Function to load the OpenAI key from Chrome storage
const loadOpenaiKey = (callback) => {
  chrome.storage.sync.get(['openaiKey'], (result) => {
    const savedKey = result.openaiKey || '';
    callback(savedKey);
  });
};

// Listen for install event
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed.');
  // You can perform additional tasks here if needed
});

// Listen for messages from content scripts or other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getOpenaiKey') {
    loadOpenaiKey((savedKey) => {
      sendResponse(savedKey);
    });
    return true; // Indicates that sendResponse will be called asynchronously
  } else if (message.action === 'setOpenaiKey') {
    saveOpenaiKey(message.openaiKey);
    sendResponse('OpenAI key saved successfully');
    return true; // Indicates that sendResponse will be called asynchronously
  }
});
