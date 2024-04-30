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

const Blogging = () => {
  const [defaultOptionKey, setDefaultOptionKey] = useState(options[0].key);
  const [selectedOptionTitle, setSelectedOptionTitle] = useState(options[0].title);
  const [keyword, setKeyword] = useState('');
  const [tone, setTone] = useState('');
  const [pov, setPov] = useState('');
  const [language, setLanguage] = useState('');
  const [word, setWord] = useState('');
  const [key, setKey] = useState('');
  const [outline,setOutline]=useState('')
  const [generate1, setGenerate1] = useState('');
  const [generate2, setGenerate2] = useState('');
  const [generate3, setGenerate3] = useState('');
  const [generate4, setGenerate4] = useState('');
  const [generate5, setGenerate5] = useState('');
  const [body2, setBody2] = useState('');
  const [body3, setBody3] = useState('');
  const [keyTak, setKeyTak] = useState('');
  const [editorLoading, setEditorLoading] = useState(true);
  const [loadingTimeExpired, setLoadingTimeExpired] = useState(false);
// Inside your component function
const [generatedContent, setGeneratedContent] = useState('');
const [combinedGeneratedContent, setCombinedGeneratedContent] = useState('');
// Later in your component, you can use generatedContent and setGeneratedContent
const [generatedKey, setGeneratedKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCKEditorReady, setIsCKEditorReady] = useState(false);
  const [editorInstance, setEditorInstance] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [generateImages, setGenerateImages] = useState(false);
  const [openaiKey, setOpenaiKey] = useState('');
  const [inputBoxVisible, setInputBoxVisible] = useState(true); 

  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
  };

  const toggleGenerateImages = () => {
    setGenerateImages(!generateImages);
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
  const generateOutline = async () => {
    setIsLoading(true);
    const introductionPrompt = `Act as a professional writer and `;
  
    // This is the setup where the system prompts the assistant to generate content based on the keyword.
    const messages = [
      {"role": "system", "content": "Act as a professional writer"},
      {"role": "user", "content": `write an introduction for the topic: this topic'. Then, the assistant will add its commentary on the topic.`},
      // Dynamically generate assistant's contribution based on the keyword or discussion.
   
    ];
  
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
        setIsLoading(false); // Ensure loading is stopped when data is successfully fetched and processed
  
        return generatedHtml;
      } else {
        throw new Error('Failed to generate text. No data returned.');
      }
    } catch (error) {
      console.error('Error in generating content:', error);
      alert(`Failed to generate content: ${error.message}`);
      setIsLoading(false); // Stop loading on error
    }
  };
  
  const generateIntroduction = async () => {
    setIsLoading(true);
   
  
    // This is the setup where the system prompts the assistant to generate content based on the keyword.
    const messages = [
     
      {"role": "assistant", "content": outline},
      {"role": "user", "content": `write an introduction for the topic:${keyword} this topic'. Then, the assistant will add its commentary on the topic.`},
      // Dynamically generate assistant's contribution based on the keyword or discussion.
   
    ];
  
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
        setGenerate1(generatedHtml);
        setIsCKEditorReady(true);
        setIsLoading(false); // Ensure loading is stopped when data is successfully fetched and processed
  
        return generatedHtml;
      } else {
        throw new Error('Failed to generate text. No data returned.');
      }
    } catch (error) {
      console.error('Error in generating content:', error);
      alert(`Failed to generate content: ${error.message}`);
      setIsLoading(false); // Stop loading on error
    }
  };
  
  const generateQuick = async () => {
    setIsLoading(true);
    const quickAnswerPrompt = `${generate1},now write 3 <h2> <h2/> heading and  write 2 <h3> <h3/>  heading under
     <h2> headings. each h2 heading write 3 paragraph <p> </p> and each h3 heading write 2 paragraph.`;
  


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
        
          {"role": "assistant", "content": generate1},
          {"role": "user", "content": keyword},
          {"role": "user", "content": 'now write 3 <h2> <h2/> heading and  write 2 <h3> <h3/>  heading under <h2> headings. each h2 heading write 3 paragraph <p> </p> and each h3 heading write 2 paragraph for this topic'},
         
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
        setGenerate2(generatedHtml);
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
  const generateBody = async () => {
   
    setIsLoading(true);
    const bodyPrompt = `Must Begin with an H2 heading with an intro, covering a unique aspect of this topic'. Do not Start with this heading:  this topic'. Must Include 4 To 5 sub-headings (H3 and H4), and integrate lists or tables if relevant. 
    
    Write Each H3 heading in 4 paragraphs with detailed information. Write Each H4 heading in 3 paragraphs with detailed information.
    """
    
    Then, 2nd, Please follow the below instructions Which are delimited by triple quotes For writing this article.  Maintain the previous writing flow...
    
    """
    Again, Start with a new H2 heading with intro, exploring a different dimension of this topic'.  Then, include 4 To 5 sub-headings (H3 and H4), with lists or tables as needed.
    
    Write Each H3 heading in 4 paragraphs with detailed information. Write Each H4 heading in 3 paragraphs with detailed information.
    """
  
    End the article with 1 relevant paragraph without a formal conclusion heading. 
    """
    2. Keyword Usage:
       - Use this topic' 3-5 times.
       - Include related secondary keywords for SEO.
    3. Readability:
       - Target an 8th-grade USA reader.
       - Use short sentences and avoid unnecessary jargon.
    4. Interactive Elements:
       - Utilize lists, bullet points, tables, or infographics where appropriate.
    5. SEO Practices:
       - Follow SEO best practices, including transition words and active voice.
    
    Exclusions:
    
    - Avoid a formal conclusion section or summary.
    - Eliminate redundant content.
    - Do not include introductory phrases unrelated to the main content.
    
    Content Format:
    
    - Use appropriate HTML comments for content blocks (e.g., paragraphs, headings, lists, tables).
    - Maintain coherence and logical flow.
    - Ensure originality and factual accuracy.
    `;
  


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
          
           
           
            {"role": "assistant", "content": generate2},
            {"role": "user", "content": keyword},
            {"role": "user", "content": `${bodyPrompt}`},
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
        setGenerate3(generatedHtml);
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
    setIsLoading(true);




    const faqprompt=`Write 5 engaging Questions and Answers related to the focus keyword". Structure the content using HTML tags, beginning with an '<h2>' heading titled "Frequently Asked Questions". This should be followed by each question framed with an '<h3>' HTML tag. Every answer should span two paragraphs. Do not include the specific question "{keyword}" in your list. Do not any word before the number.
    
    #Structure:
    - Start with an '<h2>' heading: "Frequently Asked Questions"  and Translate this heading in  Language.
    - Follow this with a brief, two-line introduction related to the topic.
    - For each question, use the '<h3>' HTML tag. and Add Numbered for each question. Do not any word before the number.
    - Each answer should be divided into two paragraphs.
    """
    
    Golden Rules for Every Article:
    
    """
    1. Engaging Tone: Your writing should be engaging, keeping readers glued to the content.
    2. SEO Mastery: Always prioritize search engine optimization. Aim for high-ranking articles on Google.
    3. Originality: Absorb information from online content, but never copy verbatim. Your main objective is to grasp key points and then create an improved article, uniquely written in your distinctive style.
    """
    
    #Writing Guidelines:
    1. Simplicity is Paramount: Write content that an 8th-grade student could easily comprehend. Use straightforward language and steer clear of technical jargon or intricate terms.
    2. Brevity in Sentences: Ensure every sentence is capped at 15 words. This maintains readability and ensures the content appeals to a broad audience.
    3. Break Down Complexity: If a topic is multifaceted, simplify it. Imagine explaining a topic to a young teen; it should be that clear.
    `
   

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
          
            {"role": "assistant", "content": generate3},
            {"role": "user", "content": keyword},
            {"role": "user", "content": faqprompt},
            
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
        setGenerate4(generatedHtml);
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
  const generateConclusion = async () => {
    setIsLoading(true);
    const Conclusion= `Write a Conclusion For this Topic 1 paragraph miimum 100 word 500 charcter `;
  
    // This is the setup where the system prompts the assistant to generate content based on the keyword.
    const messages = [
      {"role": "system", "content": "Act as a professional writer"},
      {"role": "user", "content": keyword},
      {"role": "user", "content": `${Conclusion}`},
      // Dynamically generate assistant's contribution based on the keyword or discussion.
   
    ];
  
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
        setGenerate5(generatedHtml);
        setIsCKEditorReady(true);
        setIsLoading(false); // Ensure loading is stopped when data is successfully fetched and processed
  
        return generatedHtml;
      } else {
        throw new Error('Failed to generate text. No data returned.');
      }
    } catch (error) {
      console.error('Error in generating content:', error);
      alert(`Failed to generate content: ${error.message}`);
      setIsLoading(false); // Stop loading on error
    }
  };

  const generateArticle = async () => {
    setIsLoading(true);  // Start loading
  
    try {
      // Generate content concurrently
      const contentPromises = [
        generateIntroduction(), 
        generateQuick(), 
        generateBody(), 
        generateFaq(),
        generateConclusion()
      ];
      const generatedContent = await Promise.all(contentPromises);
  
      // Await image generation if needed
      if (generateImages) {
        await fetchImageUrls();
      }
  
      // Check if all content is generated successfully
      if (generatedContent.every(content => content !== undefined)) {
        // Prepare image tags
        const imageTags = imageUrls.map((url, index) => `<img src="${url}" alt="Image ${index + 1}" />`).join('\n');
        console.log(imageTags);
        combineGeneratedContent(generatedContent, imageTags);
      } else {
        console.log('Not all content has been generated successfully.');
      }
    } catch (error) {
      console.error('Error generating article:', error);
      alert(`Failed to generate article: ${error.message}`);
    } finally {
      // Finally block should not set isLoading to false yet, move it to combineGeneratedContent
    }
  };
  
  // Helper function to combine all generated content and set it
  const combineGeneratedContent = (generatedContent, imageTags) => {
    const [introduction, quickAnswer, body, faq,conculation] = generatedContent;
    const combinedContent = `${introduction}n/${quickAnswer}n/${body}n/${faq}n/${conculation}`;
    console.log(`Combined Content: ${combinedContent}`);
  
    // Set the combined content in your state
    setCombinedGeneratedContent(combinedContent);
  
    // Now that content is combined and ready, set the editor as ready
    setIsCKEditorReady(true);
  
    // Stop loading only after all operations including image fetching and combining content are complete
    setIsLoading(false);
  };
  
  console.log(`Intro: ${generate1}`);
  console.log(`Quick: ${generate2}`);
  console.log(`Body: ${generate3}`);
  // // console.log(`Body: ${generate3}`);
  console.log(`FAQ: ${generate4}`);
  console.log(`Conclution: ${generate5}`);
  
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
            <button className='btn btn-primary rounded mt-3 me-4' onClick={handleCopyText} disabled={!editorInstance}>
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

export default Blogging