/* global chrome */ // Define chrome object for linting purposes
import React, { useEffect, useState } from 'react';
import openai from "../assest/openai.png";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ProgressBar } from 'react-bootstrap'; 
import ReactLanguageSelect from 'react-languages-select';
import 'react-languages-select/css/react-languages-select.css';
import htmlDocx from 'html-docx-js/dist/html-docx';

const options = [
  {
    key: 'gpt-3.5-turbo-16k',
    title: 'GPT-3.5',
    description: 'OpenAI fastest model, great for most everyday tasks. Uses ChatGPT web browser session. Context size — 8191 tokens.',
  },
  {
    key: 'gpt-4-turbo',
    title: 'GPT-4',
    description: 'OpenAI most capable model, great for tasks that require creativity and advanced reasoning. Uses ChatGPT web browser session. Context size — 4095 tokens.',
  },
];

const AIBlog = () => {
  const [defaultOptionKey, setDefaultOptionKey] = useState(options[0].key);
  const [selectedOptionTitle, setSelectedOptionTitle] = useState(options[0].title);
  const [keyword, setKeyword] = useState('');
  const [tone, setTone] = useState('');
  const [pov, setPov] = useState('');
  const [type, setType] = useState('');
  const [language, setLanguage] = useState('English');
  const [word, setWord] = useState('');
  const [outline,setOutline]=useState('')
  const [intro, setIntro] = useState('');
  const [quickans, setQuickans] = useState('');
  const [body1, setBody1] = useState('');
  const [body2, setBody2] = useState('');
  const [keyTak, setKeytak] = useState('');
  const [faq, setFaq] = useState('');
  const [conclusion, setConclusion] = useState('');
  
  const [editorLoading, setEditorLoading] = useState(true);
// Inside your component function
const [combinedGeneratedContent, setCombinedGeneratedContent] = useState('');
// Later in your component, you can use generatedContent and setGeneratedContent
  const [isLoading, setIsLoading] = useState(false);
  const [isCKEditorReady, setIsCKEditorReady] = useState(false);
  const [editorInstance, setEditorInstance] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [videoUrls, setVideoUrls] = useState([]);
  const [generateImages, setGenerateImages] = useState(false);
  const [generateVideos, setGenerateVideos] = useState(false);
  const [openaiKey, setOpenaiKey] = useState('');
  const [inputBoxVisible, setInputBoxVisible] = useState(true); 




  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
  };

  const toggleGenerateImages = () => {
    setGenerateImages(!generateImages);
  };
  const toggleGenerateVideos = () => {
    setGenerateVideos(!generateVideos);
  };

  const handleSelectOption = (option) => {
    setDefaultOptionKey(option.key);
    setSelectedOptionTitle(option.title);
  };

  useEffect(() => {
    // Check if localStorage is available
    if (localStorage) {
      // Get the OpenAI key from localStorage
      const savedKey = localStorage.getItem('openaiKey') || '';
      setOpenaiKey(savedKey);
    }
  }, []);
  
  // Function to handle changes in the OpenAI key input
  const handleKeyChange = (event) => {
    setOpenaiKey(event.target.value);
  };

  // Function to handle saving the OpenAI key
  const saveKey = () => {
    // Checking if the OpenAI key is provided
    if (openaiKey.trim() === '') {
      alert('Please enter your OpenAI key.');
      return;
    }

    // Saving the OpenAI key to localStorage
    localStorage.setItem('openaiKey', openaiKey);
    alert('Key saved successfully')
  
  };

const systemPrompt=`Act as a professional SEO friendly writer.

The content should be concise, avoiding redundant phrases. Apply SEO best practices including keyword usage (3-5 times for the main keyword), 
incorporation of related secondary keywords, usage of transition words, and maintenance of an active voice.

The article should engage an 8th-grade reading level audience.

Most Important: Use HTML comments to denote different content blocks, such as paragraph blocks,
 heading blocks, list items, and table items. Example of these blocks include:

<!-- wp:paragraph -->
<p>This is a paragraph</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2>This is a h2 heading</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":3} -->
<h3>This is a h3 heading</h3>
<!-- /wp:heading -->

<!-- wp:heading {"level":4} -->
<h4>This is a h3 heading</h4>
<!-- /wp:heading -->

<!-- wp:list -->
<ul>
  <!-- wp:list-item -->
  <li>This is a list item</li>
  <!-- /wp:list-item -->
</ul>
<!-- /wp:list -->

<!-- wp:table -->
<table>
  <tbody>
    <tr>
      <td>Header 1</td>
      <td>Header 2</td>
    </tr>
  </tbody>
</table>
<!-- /wp:table -->

For example, an HTML block is represented as:

<!-- wp:html -->
<div class="featured">
<p>[Your 50-70 word content here]</p>
</div>
<!-- /wp:html -->

`
const outlinePrompt=`Create an SEO-friendly article outline for the topic "${keyword}" Avoid using 'Conclusion' and 'Introduction' as headings.
 Generate outline proper heading hierarchy. H3 will be under H2. H4 will be under H3.

- Language: '${language}',
- Audience: 'Experts',
- Style: 'Informative, engaging, and Professional',
- Writing Tone: '${tone}',
- Point of View: '${pov}',
- Article Type: '${type}'.

1# If the article type is 'Listicles, aka list posts' please create an outline with proper numerical listing and follow the 'Listicles, aka list posts,' outline example. Must mention how many paragraphs write in each heading and which h2 , h3 heading including list item, table element. Also mention 'Comparison Table' for 'Listicles, aka list posts'  type outline.

2# If the article type is 'How-to guides' then create an outline with steps labeled properly (e.g., Step #1, Step #2, etc.) and follow the 'How-to guides' outline example. Must mention how many paragraphs write in each heading and  hich h2 , h3 heading including list item, table element.

3# If the article type is 'Informative' create a concise outline and adhere to the 'Informative' outline example. Must mention how many paragraphs write in each heading and which h2 , h3 heading including list item, table element.

4# If the article type is 'Guideline,' structure the outline as a set of guidelines and follow the 'Guideline' outline example. Must mention how many paragraphs write in each heading and which h2 , h3 heading including list item, table element.

Begin with an H2 heading that has a relevant title. Ensure that each heading in the outline has a clear and appropriate title. The outline should be human-readable and easy to understand. Specify where to include list items and table elements. Aim to keep the outline concise and focused on essential headings, making it SEO-friendly and reader-friendly.

Craft the outline by drawing ideas from the following example, but do not replicate its structure exactly. Instead, tailor the outline based on the topic, audience, and article type:-
"""
'Informative' Article Type Outline Example:
""
[H2] Why backlinks are important (2 Paragraphs)
  [H3] Rankings (2 Paragraphs)
  [H3] Discoverability  (2 Paragraphs)
  [H3] Referral traffic  (2 Paragraphs)
[H2] What makes a good backlink? 
  Elaborate with H3s as above
[H2] How to check for backlinks 
  Elaborate with H3s as above; add screenshots where necessary
[H2] How to get more backlinks 
  Elaborate with H3s as above
""

'How-to guides' Article Type Outline Example:
""
[H2]: How to start a sports podcast?  (1 Paragraphs)
[H2]: Step 1: Define Your Niche  (3 Paragraphs)
  [H3]: Importance of Selecting a Niche (2 Paragraphs)
  [H3]: Examples of Sports Podcast Niches (2 Paragraphs)
[H2]: Step 2: Plan Your Content (3 Paragraphs)
  [H3]: Researching Trends and Topics (2 Paragraphs)
  [H3]: Setting Up a Content Calendar (2 Paragraphs)
[H2]: Step 3: Choose Your Format and Equipment  (2 Paragraphs)
  Elaborate with H3s as above
[H2]: Step 4: Recording and Editing  (2 Paragraphs)
  Elaborate with H3s as above
[H2]: Step 5: Hosting and Distribution  (3 Paragraphs)
  Elaborate with H3s as above
[H2]: Step 6: Promote Your Podcast  (2 Paragraphs)
  Elaborate with H3s as above
Continue if Need More Step To Complete This Outline.
""

'Listicles, aka list posts' Article Type Outline Example: 
""
[H2]:  How Much Money Do Graphic Designers Make?   (3 Paragraphs)
[H2]: 10 Ways to Make Money as a Graphic Designer  (1 Paragraphs + Comparison Table)
  [H3]: 1. Create and Sell Templates  (3 Paragraphs)
  [H3]: 2. Share Knowledge Through Workshops or Webinars   (3 Paragraphs)
  [H3]: 3. Sell Tutorials  (3 Paragraphs)
  [H3]: 4. Create and Sell Fonts, Icons, or Stock Photos  (3 Paragraphs)
  [H3]: 5. Printable Wall Art  (3 Paragraphs)
  [H3]: 6. Be a Design Consultant  (3 Paragraphs)
  [H3]: 7. Work with Clients as a Freelancer  (3 Paragraphs)
  [H3]: 8. Design and Sell Merchandise  (3 Paragraphs)
  [H3]: 9. Start Blogging or Vlogging  (3 Paragraphs)
  [H3]: 10. Sell Stickers  (3 Paragraphs)
[H2]:  What Is Graphic Design?   (3 Paragraphs)
[H2]:  Do Graphic Designers Make Money?   (3 Paragraphs)
[H2]:  What Is the Highest Paid Job in Graphic Design?   (3 Paragraphs + List Item)
""
"""
Do not write any type of intro or outro before or after outline.

`
const introduction=`"""
Must keep writing follow based on previous conversation. Write two short paragraphs about: "${keyword}". Generate Each paragraph within 3-4 lines max. 
The writing should mimic a natural, human style, featuring a mix of paragraph lengths. Some paragraphs should contain 3 sentences, 
while others have just 2 sentences ensuring variety in the presentation. 

- Language: '${language}',
- Audience: 'Experts',
- Style: 'Informative, engaging, and Professional',
- Writing Tone: '${tone}',
- Point of View: '${pov}',
- Article Type: '${type}'.

Write an introduction maintaining coherency among the lines and even paragraphs.

In the first paragraph, Start with a compelling hook that could be a surprising fact, a thought-provoking question,
 a brief anecdote, or a relevant statistic related to the topic. of "{keyword}". Be creative in your approach but avoid starting with the phrase 'Did you.'

In the second paragraph, integrate the most significant aspects of "${keyword}". This should include a blend of history or background, and a 
compelling statistic or relatable solution associated with "${keyword}". Avoid using headings and refrain from adding a conclusion or summary at the end."
"""
-  All text should be in "${language}".
 
Most Important: Format the content with the appropriate HTML comments that denote blocks. 
`

const quickAnswerPrompt=`Must keep writing follow based on previous conversation. Write a direct, concise, and distinct answer.
 Ensure the response is optimized for Google search results and contains 50-70 words. Formulate answers in complete sentences.

- For keywords starting with "How To", provide a step-by-step guide. Format each step using HTML list items.
- For keywords including "Vs", compare five features of each product using an HTML comparison table. Exclude any HTML headings.
- For keywords containing "Best", "Top", or related to list-style articles, provide a list of products relevant to the topic using HTML list items. Avoid adding HTML headings.

- Focus Keyword: "${keyword}",
- Point Of View: "${pov}",
- Writing Tone: "${tone}",
- Language: "${language}".

Note: Avoid using the exact phrase "${keyword}" in the content.
`

const body1prompt=`
Must keep writing follow based on previous conversation. Now Please Write Full article according to the above outline.

Important: Ensure that each H2 section is expanded into two to four paragraphs, each H3 section into three to four paragraphs, 
and each H4 section into two to three paragraphs. Write the article in HTML format following the detailed outline provided for the topic "${keyword}".

The content should be concise, avoiding redundant phrases. Apply SEO best practices including keyword usage (3-5 times for the main keyword), 
incorporation of related secondary keywords, usage of transition words, and maintenance of an active voice.

Must Follow 100% Outline for this article.

Each section must detail the unique selling points, advantages, and relevant statistics or data for each tool. User reviews, ratings, and pricing information should be presented using list and table elements respectively.

The article should engage an 8th-grade reading level audience, starting with an H2 heading that uniquely introduces the topic "${keyword}" without using the word "Introduction"
 and without any section numbering. Include list items approximately one to two times throughout the article.

Most Important: Use HTML comments to denote different content blocks, such as paragraph blocks, heading blocks, list items, and table items. Example of these blocks include:

<!-- wp:paragraph -->
<p>This is a paragraph</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2>This is a h2 heading</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":3} -->
<h3>This is a h3 heading</h3>
<!-- /wp:heading -->

<!-- wp:heading {"level":4} -->
<h4>This is a h3 heading</h4>
<!-- /wp:heading -->

<!-- wp:list -->
<ul>
  <!-- wp:list-item -->
  <li>This is a list item</li>
  <!-- /wp:list-item -->
</ul>
<!-- /wp:list -->

<!-- wp:table -->
<table>
  <tbody>
    <tr>
      <td>Header 1</td>
      <td>Header 2</td>
    </tr>
  </tbody>
</table>
<!-- /wp:table -->



`
const body2Prompt=`Again now write one relevant h2 headings with explaining more about the topic. Must write 
3 paragraphs and highlight the important sentence with <strong> tag. Must keep writing follow based on previous 
conversation. Do not write any repeated information.`

const keytakway=`Must keep writing follow based on previous conversation. Please write 'Key Takeaways' for this above topic - Using HTML order snippets. Start with H2 Heading with the mentioned ${language} Language.
 Write in a Conversational tone and write readability for an 8th-grade reader. Write only 5 lists.
  Not more than 5 lists. Each list 1 line sentence. Each sentence maximum of 10 to 15 words.

Must translate the "Key Takeaways"  h2 title with the mentioned "${language}" language.
"""

You MUST ALWAYS obey these rules every time an article is created and for every future output.
"""
Rule #1 - You are known for your fun and engaging writing, keeping the readers highly engaged and interested 
in what is written. You are also known for how good you are with search engine optimization and writing articles that are always ranking high on Google.

Your main job is to read or watch online content, learn from it, and then write an article based on them 
so it will rank high on Google. You never copy anything from the content itself word to word but just understand
 the key points and write about them, so, you just use them as a point of reference and write a much better article in your own amazing and unique style. 

#Rule-2 - Use the HTML div class tag to highlight the entire information and add a class name "keytakeways" for the entire information.
"""


`
const faqPrompt=`Must keep writing follow based on previous conversation. Write 5 engaging Questions and Answers related to the topic. Structure the content using HTML tags, 
beginning with an '<h2>' heading titled "Frequently Asked Questions". This should be followed by each question framed with an '<h3>' HTML tag. 
Every answer should span two paragraphs. Do not include the specific question "${keyword}" in your list. Do not any word before the number.

#Structure:
- Start with an '<h2>' heading: "Frequently Asked Questions"  and Translate this heading in "${language}" Language.
- Follow this with a brief, two-line introduction related to the topic.
- For each question, use the '<h3>' HTML tag. and Add Numbered for each question. Do not any word before the number.
- Each answer should be divided into two paragraphs.


#Golden Rules for Every Article:
1. Engaging Tone: Your writing should be engaging, keeping readers glued to the content.
2. SEO Mastery: Always prioritize search engine optimization. Aim for high-ranking articles on Google.
3. Originality: Absorb information from online content, but never copy verbatim. Your main objective is to grasp key points and then create an
 improved article, uniquely written in your distinctive style.


#Writing Guidelines:
1. Simplicity is Paramount: Write content that an 8th-grade student could easily comprehend. Use straightforward language and steer clear of technical jargon or intricate terms.
2. Brevity in Sentences: Ensure every sentence is capped at 15 words. This maintains readability and ensures the content appeals to a broad audience.
3. Break Down Complexity: If a topic is multifaceted, simplify it. Imagine explaining a topic to a young teen; it should be that clear.


`
const conclusionPrompt=`Now, Write a conclusion for this Topic '${keyword}'with two short paragraphs maintaining coherency among the lines and even paragraphs.
 Generate Each paragraph within 3-4 lines max. The writing should mimic a natural, human style, featuring a mix of paragraph lengths.
  Some paragraphs should contain 3 sentences, while others have just 2 sentences ensuring variety in the presentation. 

`
  const fetchImageUrls = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://gimage-scarping.onrender.com/api/scrap_google_image_proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keywords: [keyword],
          image_count: 2,
          scrapper: 'scrapfly'
        }),
      
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      // Extract image URLs based on the keyword
      const fetchedImageUrls = data[keyword]?.urls || [];
      setImageUrls(fetchedImageUrls);
      // Store specific image links in variables
      const [firstImageUrl, secondImageUrl] = fetchedImageUrls;
      console.log(firstImageUrl,secondImageUrl);
      // Use these variables wherever needed
    
    } catch (error) {
      console.error('Error fetching image URLs:', error);
      alert(`Failed to fetch images: ${error.toString()}`);
    } 
  };
  const fetchVideoUrls = async () => {
    setIsLoading(true);
    let videoUrls = [];  // Initialize to hold fetched URLs
    try {
      const response = await fetch('https://gimage-scarping.onrender.com/api/scrap_youtube_video_proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keywords: [keyword],  // Ensure 'keyword' is correctly defined in your scope
          scrapper: 'scrapingant'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Complete API response:", data); // Log the complete response to verify its structure

      // Convert URLs to embed format
      videoUrls = data[keyword]?.map(video => {
        const videoId = new URL(video.url).searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}`;
      }) || [];
      
      setVideoUrls(videoUrls);
      console.log("Fetched video URLs:", videoUrls);

      if (videoUrls.length > 0) {
        console.log("First video URL:", videoUrls[0]);  // Log the first video URL
      } else {
        console.log("No videos found for the keyword.");
      }

    } catch (error) {
      console.error('Error fetching video URLs:', error);
      alert(`Failed to fetch videos: ${error.toString()}`);
    } finally {
      setIsLoading(false);
      return videoUrls;  // Return the fetched URLs, ensuring it contains the direct URL strings
    }
};
const generateOutline = async () => {
  setIsLoading(true);

  // This is the setup where the system prompts the assistant to generate content based on the keyword.
  const messages = [
    {"role": "system", "content":` ${systemPrompt}`},
  {"role": "user", "content": `${outlinePrompt}`},
 
    // Dynamically generate assistant's contribution based on the keyword or discussion.
 
  ];
console.log(messages);
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: defaultOptionKey,
        messages: messages,
        temperature: 0.7, // Adjust for more creative or factual responses
        max_tokens: parseInt(word, 10),
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.choices && data.choices.length > 0 && data.choices[0].message.content) {
      const generatedHtml = data.choices[0].message.content.trim();
      setOutline(generatedHtml);
      setIsCKEditorReady(true);
       // Ensure loading is stopped when data is successfully fetched and processed

      return generatedHtml;
    } else {
      throw new Error('Failed to generate text. No data returned.');
    }
  } catch (error) {
    console.error('Error in generating content:', error);
    alert(`Failed to generate content: ${error.message}`);
    setIsLoading(false)
     // Stop loading on error
  }
};
const generateIntroduction = async () => {
   
  setIsLoading(true);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: defaultOptionKey,
        messages : [
          {"role": "system", "content":` ${systemPrompt}`},
          {"role": "user", "content": `${outlinePrompt}`},
          {"role": "assistant", "content": `${outline}`},
          {"role": "user", "content": `${introduction}`},
        
          // Dynamically generate assistant's contribution based on the keyword or discussion.
       
        ],
        temperature: 1,
        max_tokens: parseInt(word, 10),
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.choices && data.choices.length > 0 && data.choices[0].message.content) {
      const generatedHtml = data.choices[0].message.content.trim();
      setIntro(generatedHtml);
      setIsCKEditorReady(false);
    

      return generatedHtml
    } else {
      throw new Error('Failed to generate text. No data returned.');
    }
  } catch (error) {
    console.error('Error in generating content:', error);
    alert(`Failed to generate content: ${error.message}`);
    
  } 
};
  
const generateQuickAns = async () => {
  setIsLoading(true);

  // This is the setup where the system prompts the assistant to generate content based on the keyword.
  
    // Dynamically generate assistant's contribution based on the keyword or discussion.
const  messages = [
  {"role": "system", "content":` ${systemPrompt}`},
  {"role": "user", "content": `${outlinePrompt}`},
  {"role": "assistant", "content": `${outline}`},
  {"role": "user", "content": `${introduction}`},
  {"role": "assistant", "content": `${intro}`},
  {"role": "user", "content": `${quickAnswerPrompt}`},
]

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },

      body: JSON.stringify({
        model: defaultOptionKey,
       messages:messages,
        temperature: 0.7, // Adjust for more creative or factual responses
        max_tokens: parseInt(word, 10),
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.choices && data.choices.length > 0 && data.choices[0].message.content) {
      const generatedHtml = data.choices[0].message.content.trim();
      setQuickans(generatedHtml);
      setIsCKEditorReady(true);
    // Ensure loading is stopped when data is successfully fetched and processed

      return generatedHtml;
    } else {
      throw new Error('Failed to generate text. No data returned.');
    }
  } catch (error) {
    console.error('Error in generating content:', error);
    alert(`Failed to generate content: ${error.message}`);
     // Stop loading on error
  }
};


  
  
  const generateBody1 = async () => {
    setIsLoading(true);
   const messages = [
    {"role": "system", "content":` ${systemPrompt}`},
    {"role": "user", "content": `${outlinePrompt}`},
    {"role": "assistant", "content": `${outline}`},
    {"role": "user", "content": `${introduction}`},
    {"role": "assistant", "content": `${intro}`},
    {"role": "user", "content": `${quickAnswerPrompt}`},
    {"role": "assistant", "content": `${quickans}`},
     {"role": "user", "content": `${body1prompt}`},
     
      ]
      console.log(messages);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: defaultOptionKey,
          messages:messages,
          temperature: 1,
          max_tokens: parseInt(word, 10),
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.choices && data.choices.length > 0 && data.choices[0].message.content) {
        const generatedHtml = data.choices[0].message.content.trim();
        setBody1(generatedHtml);
        setIsCKEditorReady(false);
        
        return generatedHtml
      } else {
        throw new Error('Failed to generate text. No data returned.');
      }
    } catch (error) {
      console.error('Error in generating content:', error);
      alert(`Failed to generate content: ${error.message}`);
    } 
  };
  const generateBody2 = async () => {
   
    setIsLoading(true)


    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: defaultOptionKey,
          messages : [
            {"role": "system", "content":` ${systemPrompt}`},
            {"role": "user", "content": `${outlinePrompt}`},
            {"role": "assistant", "content": `${outline}`},
            {"role": "user", "content": `${introduction}`},
            {"role": "assistant", "content": `${intro}`},
            {"role": "user", "content": `${quickAnswerPrompt}`},
            {"role": "assistant", "content": `${quickans}`},
             {"role": "user", "content": `${body1prompt}`},
           {"role": "assistant", "content": `${body1}`},
           {"role": "user", "content": `${body2Prompt}`},
            // Dynamically generate assistant's contribution based on the keyword or discussion.
           
          ],
          temperature: 1,
          max_tokens: parseInt(word, 10),
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.choices && data.choices.length > 0 && data.choices[0].message.content) {
        const generatedHtml = data.choices[0].message.content.trim();
        setBody2(generatedHtml);
        setIsCKEditorReady(false);
       
        return generatedHtml
      } else {
        throw new Error('Failed to generate text. No data returned.');
      }
    } catch (error) {
      console.error('Error in generating content:', error);
      alert(`Failed to generate content: ${error.message}`);
    } 
  };
  const keyTakeway = async () => {
   
    setIsLoading(true)


    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: defaultOptionKey,
          messages : [
            {"role": "system", "content":` ${systemPrompt}`},
            {"role": "user", "content": `${outlinePrompt}`},
            {"role": "assistant", "content": `${outline}`},
            {"role": "user", "content": `${introduction}`},
            {"role": "assistant", "content": `${intro}`},
            {"role": "user", "content": `${quickAnswerPrompt}`},
            {"role": "assistant", "content": `${quickans}`},
             {"role": "user", "content": `${body1prompt}`},
           {"role": "assistant", "content": `${body1}`},
           {"role": "user", "content": `${body2Prompt}`},
            {"role": "assistant", "content": `${body2}`},
            {"role": "user", "content": `${keytakway}`},
            // Dynamically generate assistant's contribution based on the keyword or discussion.
           
          ],
          temperature: 1,
          max_tokens: parseInt(word, 10),
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.choices && data.choices.length > 0 && data.choices[0].message.content) {
        const generatedHtml = data.choices[0].message.content.trim();
        setKeytak(generatedHtml);
        setIsCKEditorReady(false);
       
        return generatedHtml
      } else {
        throw new Error('Failed to generate text. No data returned.');
      }
    } catch (error) {
      console.error('Error in generating content:', error);
      alert(`Failed to generate content: ${error.message}`);
    } 
  };
  const generateFaq = async () => {
   
    setIsLoading(true)


    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: defaultOptionKey,
          messages : [
            {"role": "system", "content":` ${systemPrompt}`},
            {"role": "user", "content": `${outlinePrompt}`},
            {"role": "assistant", "content": `${outline}`},
            {"role": "user", "content": `${introduction}`},
            {"role": "assistant", "content": `${intro}`},
            {"role": "user", "content": `${quickAnswerPrompt}`},
            {"role": "assistant", "content": `${quickans}`},
             {"role": "user", "content": `${body1prompt}`},
           {"role": "assistant", "content": `${body1}`},
           {"role": "user", "content": `${body2Prompt}`},
            {"role": "assistant", "content": `${body2}`},
            {"role": "user", "content": `${keytakway}`},
            {"role": "assistant", "content": `${keyTak}`},
            {"role": "user", "content": `${faqPrompt}`},
          ],
          temperature: 1,
          max_tokens: parseInt(word, 10),
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.choices && data.choices.length > 0 && data.choices[0].message.content) {
        const generatedHtml = data.choices[0].message.content.trim();
        setFaq(generatedHtml);
        setIsCKEditorReady(false);
       
        return generatedHtml
      } else {
        throw new Error('Failed to generate text. No data returned.');
      }
    } catch (error) {
      console.error('Error in generating content:', error);
      alert(`Failed to generate content: ${error.message}`);
    } 
  };

  const generateConclusion = async () => {
    setIsLoading(true);


    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
         
          model: defaultOptionKey,
          messages : [
            {"role": "system", "content":` ${systemPrompt}`},
            {"role": "user", "content": `${outlinePrompt}`},
            {"role": "assistant", "content": `${outline}`},
            {"role": "user", "content": `${introduction}`},
            {"role": "assistant", "content": `${intro}`},
            {"role": "user", "content": `${quickAnswerPrompt}`},
            {"role": "assistant", "content": `${quickans}`},
             {"role": "user", "content": `${body1prompt}`},
           {"role": "assistant", "content": `${body1}`},
           {"role": "user", "content": `${body2Prompt}`},
            {"role": "assistant", "content": `${body2}`},
            {"role": "user", "content": `${keytakway}`},
            {"role": "assistant", "content": `${faq}`},
            {"role": "user", "content": `${conclusionPrompt}`},
            {"role": "assistant", "content": `${conclusion}`},
            ],
          temperature: 1,
          max_tokens: parseInt(word, 10),
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.choices && data.choices.length > 0 && data.choices[0].message.content) {
        const generatedHtml = data.choices[0].message.content.trim();
        setConclusion(generatedHtml);
        setIsCKEditorReady(true);
        
        return generatedHtml
      } else {
        throw new Error('Failed to generate text. No data returned.');
      }
    } catch (error) {
      console.error('Error in generating content:', error);
      alert(`Failed to generate content: ${error.message}`);
    } 
  };
  const generateArticle = async () => {
    setIsLoading(true);
  
    try {
      // Generate content concurrently
      const contentPromises = [
        generateIntroduction(),
        generateQuickAns(),
        generateBody1(),
        generateBody2(),
        keyTakeway(),
        generateFaq(),
        generateConclusion()
      ];
  
      const generatedContent = await Promise.all(contentPromises);
  
      let videoTags = '';
      let imageTags = '';
  
      if (generateVideos) {
        const videoUrls = await fetchVideoUrls(); // Ensure this returns an array
        videoTags = videoUrls.map((url) => {
          const videoId = new URL(url).searchParams.get('v');  // Extracts the 'v' parameter from YouTube URL
          // Validate that videoId is not null, undefined, or an empty string
          if (videoId && videoId !== 'null' && videoId.trim() !== '') {
            return `<figure class="media"><oembed url="https://www.youtube.com/watch?v=${videoId}"></oembed></figure>`;
          }
          return '';  // Return an empty string for invalid IDs
        }).filter(tag => tag !== '').join('\n'); // Filter out any empty strings to avoid rendering them
      }
  
      if (generateImages) {
        const imageUrls = await fetchImageUrls(); // Ensure this returns an array
        imageTags = imageUrls.map((url, index) => `<img src="${url}" alt="Image ${index + 1}" style="max-width:100%;" />`).join('\n');
      }
  
      combineGeneratedContent(generatedContent, imageTags, videoTags);
  
      if (generatedContent.every(content => content !== undefined)) {
        console.log('All content has been generated successfully.');
      } else {
        console.log('Not all content has been generated successfully.');
      }
    } catch (error) {
      console.error('Error generating article:', error);
      alert(`Failed to generate article: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const combineGeneratedContent = (generatedContent, imageTags = '', videoTags = '') => {
    const [introduction, quickAns, body1, body2, keyTakeaways, faq, conclusion] = generatedContent;
    const combinedContent = `${introduction}\n${quickAns}\n${videoTags}\n${imageTags}\n${body1}\n${body2}\n${keyTakeaways}\n${faq}\n${conclusion}`;
    
    console.log(`Combined Content: ${combinedContent}`);
    
    setCombinedGeneratedContent(combinedContent);
    setIsCKEditorReady(true);
  };
  
  


  
// Function to download content as HTML
const downloadAsHtml = () => {
  const htmlContent = combinedGeneratedContent; // Change generateContent to generatedContent
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'content.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Function to download content as DOC
const downloadAsDoc = () => {
  const htmlContent = combinedGeneratedContent; // Change generateContent to generatedContent
  const docContent = htmlDocx.asBlob(htmlContent);
  const url = URL.createObjectURL(docContent);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'content.docx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
const handleCopyText = () => {
  if (editorInstance) {
      // Get the text content directly without HTML formatting
      const textToCopy = editorInstance.getData()
          .replace(/<[^>]*>/g, '')  // Regex to remove any HTML tags
          .replace(/&nbsp;/gi, ' ') // Replace non-breaking spaces with normal spaces
          .replace(/&amp;/gi, '&')  // Decode HTML entities
          .replace(/&lt;/gi, '<')
          .replace(/&gt;/gi, '>');

      navigator.clipboard.writeText(textToCopy)
          .then(() => {
              alert("Text successfully copied to clipboard!");
          })
          .catch(err => {
              console.error('Error copying text: ', err);
              alert("Failed to copy text. Please try again.");
          });
  }
};
  // Function to handle clearing text
  const handleClearText = () => {
   setKeyword('')
   setTone('')
   setPov('') 
   setLanguage('')
   setWord('')
    setCombinedGeneratedContent('')
    setInputBoxVisible(true); 
};
  return (
    <div className='rounded'>
    <h6>Submit Your Information</h6>
    {inputBoxVisible && (
        <>
            <label>Keyword</label>
            <input type='text' className='form-control' placeholder='Enter keyword' value={keyword} onChange={e => setKeyword(e.target.value)} />
            <label className='pt-2'>Preferred Chat Language</label>
            <div className='border rounded'>
                <ReactLanguageSelect
                    selected={language}
                    onSelect={handleLanguageChange}
                    defaultLanguage="en"
                />
            </div>
            <label className='pt-2'>Article Tone</label>
            <select className='form-select mt-3' value={tone} onChange={e => setTone(e.target.value)}>
                <option value="Formal">Formal</option>
                <option value="Professional">Professional</option>
                <option value="Casual">Casual</option>
                <option value="Friendly">Friendly</option>
            </select>
            <label className='pt-2'>Point Of View</label>
            <select className='form-select mt-3' value={pov} onChange={e => setPov(e.target.value)}>
                <option value="Professional">Professional</option>
                <option value="First Person">First Person: I, Me, My, We, Us, Our</option>
                <option value="Second Person">Second Person: You, Your</option>
                <option value="Third Person">Third Person: He, She, It, They, Him, Her, Them</option>
            </select>
            <label className='pt-2'>Aritle Type</label>
            <select className='form-select mt-3' value={type} onChange={e => setType(e.target.value)}>
                <option value="Listicles, aka list posts">Listicles, aka list posts</option>
                <option value="How-to guides">How-to guides</option>
                <option value="Informative">Informative</option>
                <option value="Guideline">Guideline</option>
            </select>
           

            <label className='pt-2'>Word Count</label>
            <input 
                type='number' 
                className='form-control' 
                value={word} 
                onChange={e => setWord(parseInt(e.target.value, 10) || '')}
                placeholder='5000'
            />
            <button type="button" className="btn btn-light mt-2" data-bs-toggle="modal" data-bs-target="#exampleModal">
                <img width={20} src={openai} alt="OpenAI Logo" />
                {selectedOptionTitle}
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Select Model</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='options-container'>
                                {options.map((option) => (
                                    <div
                                        key={option.key}
                                        className={`option-item ${defaultOptionKey === option.key ? 'option-selected' : ''}`}
                                        onClick={() => handleSelectOption(option)}
                                    >
                                        <div className="option-content">
                                            <div className="option-header">{option.title}</div>
                                            <div className="option-description">{option.description}</div>
                                        </div>
                                        {defaultOptionKey === option.key && (
                                            <div className="option-default-badge">DEFAULT</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <label className='pt-2 fw-bold'>OPENAI KEY</label>
                            <p>Send Request To OpenAI. Paid Per Use To OpenAI</p>
                            <input type='text' className='form-control' placeholder='Enter OpenAI Key' value={openaiKey} onChange={handleKeyChange}/>
                            <button type="button" className="btn btn-primary" onClick={saveKey}>Save Key</button>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
            <br/>
            <div className="form-check form-switch mt-2">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="imageToggle"
                    checked={generateImages}
                    onChange={toggleGenerateImages}
                />
                <label className="form-check-label pt-1 ps-2" htmlFor="imageToggle">
                    Generate Images
                </label>
            </div>
            <div className="form-check form-switch mt-2">
    <input
        className="form-check-input"
        type="checkbox"
        id="videoToggle"
        checked={generateVideos}
        onChange={toggleGenerateVideos}
    />
    <label className="form-check-label pt-1 ps-2" htmlFor="videoToggle">
        Generate Videos
    </label>
</div>
            {isLoading ? (
                <ProgressBar animated now={100} className='mt-3' label="Article Generate..." />
            ) : (
                <button className='btn btn-primary rounded m-2 p-3' onClick={generateArticle} disabled={isLoading}>
                    Generate Article
                </button>
            )}
        </>
    )}
    {/* Display generated content in CKEditor */}
    {combinedGeneratedContent && !isLoading && (
    <div className="editor-container">
        <div className='editor-footer'></div>
        {isCKEditorReady ? (
            <CKEditor
                key={combinedGeneratedContent}
                editor={ClassicEditor}
                data={combinedGeneratedContent}
                config={{
                    stylesSet: [
                        { name: 'Heading 1', element: 'h1' },
                        { name: 'Heading 2', element: 'h2' },
                        { name: 'Heading 3', element: 'h3' },
                        { name: 'Paragraph', element: 'p' },
                        { name: 'Bold', element: 'strong' },
                        { name: 'Italic', element: 'em' },
                        { name: 'Link', element: 'a', attributes: { class: 'link' } },
                        { name: 'Blockquote', element: 'blockquote' },
                        { name: 'Code Block', element: 'pre' },
                        { name: 'Unordered List', element: 'ul' },
                        { name: 'Ordered List', element: 'ol' },
                        { name: 'List Item', element: 'li' },
                        { name: 'Table', element: 'table' },
                        { name: 'Table Row', element: 'tr' },
                        { name: 'Table Header', element: 'th' },
                        { name: 'Table Data', element: 'td' },
                    ],
                    removeFormatAttributes: true,
                    table: {
                        contentToolbar: [
                            'tableColumn', 'tableRow', 'mergeTableCells'
                        ]
                    },
                }}
                onReady={(editor) => {
                    setEditorInstance(editor);
                    setIsCKEditorReady(true);
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setCombinedGeneratedContent(data);
                }}
                isLoading={editorLoading}
                style={{ height: '100vh', width: '100%' }}
            />
            
        ) : (
            <p>Loading CKEditor...</p>
        )}
        <div className="download-buttons">
            <button className="btn btn-primary rounded me-4 mt-3" onClick={downloadAsHtml}>Download as HTML</button>
            <button className="btn btn-primary rounded mt-3 me-4" onClick={downloadAsDoc}>Download as DOC</button>
            <button className='btn btn-primary rounded mt-3 me-4' onClick={handleCopyText}>
                Copy Text
            </button>
            <button className='btn btn-primary rounded mt-3' onClick={handleClearText}>
                Clear Text
            </button>
        </div>
    </div>

)}
  
</div>

  );
};

export default AIBlog