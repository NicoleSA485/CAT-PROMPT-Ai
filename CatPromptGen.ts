import React, { useState } from 'react';

// Main App component
const App = () => {
    const [prompt, setPrompt] = useState(''); // State to store the generated prompt
    const [isLoading, setIsLoading] = useState(false); // State to manage loading status for main prompt
    const [message, setMessage] = useState(''); // State for messages like 'Copied!'

    const [variations, setVariations] = useState([]); // State to store suggested prompt variations
    const [isVariationsLoading, setIsVariationsLoading] = useState(false); // Loading state for variations
    const [variationMessage, setVariationMessage] = useState(''); // Message for variations

    const [story, setStory] = useState(''); // State to store the generated story
    const [isStoryLoading, setIsStoryLoading] = useState(false); // Loading state for story
    const [storyMessage, setStoryMessage] = useState(''); // Message for story

    const [translatedPrompt, setTranslatedPrompt] = useState(''); // State for translated prompt
    const [isTranslateLoading, setIsTranslateLoading] = useState(false); // Loading state for translation
    const [translateMessage, setTranslateMessage] = useState(''); // Message for translation

    const [expandedPrompt, setExpandedPrompt] = useState(''); // State for expanded prompt
    const [isExpandLoading, setIsExpandLoading] = useState(false); // Loading state for expansion
    const [expandMessage, setExpandMessage] = useState(''); // Message for expansion

    const [hashtags, setHashtags] = useState([]); // State for generated hashtags
    const [isHashtagsLoading, setIsHashtagsLoading] = useState(false); // Loading state for hashtags
    const [hashtagMessage, setHashtagMessage] = useState(''); // Message for hashtags


    // Function to generate an Ai-friendly cat prompt using the Gemini API
    const generateCatPrompt = async () => {
        setIsLoading(true);
        setMessage('');
        setPrompt('');
        setVariations([]); // Clear previous variations
        setStory(''); // Clear previous story
        setTranslatedPrompt(''); // Clear previous translation
        setExpandedPrompt(''); // Clear previous expansion
        setHashtags([]); // Clear previous hashtags
        setVariationMessage('');
        setStoryMessage('');
        setTranslateMessage('');
        setExpandMessage('');
        setHashtagMessage('');

        const userPrompt = `Generate a highly detailed, imaginative, and Ai-friendly cat prompt for image and video generation.
        Focus on descriptive adjectives, actions, environments, and specific stylistic elements.
        The prompt should be suitable for generating diverse and creative cat imagery.
        Include elements like:
        - Cat's breed, color, or unique markings
        - Its expression or emotion
        - An action it's performing
        - The setting or environment
        - Lighting conditions
        - Artistic style (e.g., cyberpunk, watercolor, realistic, fantasy)
        - Camera angle or shot type (e.g., close-up, wide shot)

        Examples:
        - "A majestic fluffy Ragdoll cat with sapphire eyes, gracefully leaping through a sunlit field of lavender, hyperrealistic, golden hour, wide shot."
        - "A mischievous black Scottish Fold kitten, playfully batting at a glowing pixelated butterfly in a neon-lit cyberpunk alley, low angle, digital art, vibrant colors."
        - "An ancient, wise Siamese cat, meditating atop a snow-capped mountain peak under a starry night sky, mystical, highly detailed, dramatic lighting."
        - "A cute ginger tabby cat wearing a tiny wizard hat, casting a sparkling spell from a spellbook in a cozy, magical library, enchanted, soft lighting, depth of field."

        Generate only one prompt.`;

        const chatHistory = [{ role: "user", parts: [{ text: userPrompt }] }];
        const payload = { contents: chatHistory };
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const generatedText = result.candidates[0].content.parts[0].text;
                setPrompt(generatedText);
            } else {
                console.error('Unexpected Ai response structure:', result);
                setMessage('Failed to generate prompt. Please try again.');
            }
        } catch (error) {
            console.error('Error generating prompt:', error);
            setMessage('An error occurred. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Function to generate prompt variations using the Gemini API
    const generateVariations = async () => {
        if (!prompt) {
            setVariationMessage('Please generate a main prompt first.');
            return;
        }

        setIsVariationsLoading(true);
        setVariations([]);
        setVariationMessage('');

        const userPrompt = `Given the following Ai cat prompt: "${prompt}"
        
        Generate 3 distinct variations of this prompt. Each variation should offer a different artistic style, environment, or action, while keeping the core subject (a cat) consistent. Format the output as a JSON array of strings, where each string is a new prompt variation.
        
        Example:
        [
          "A sleek black cat with glowing emerald eyes, perched on a futuristic skyscraper overlooking a neon-drenched city, cyberpunk art, rainy night, cinematic shot.",
          "A fluffy Persian cat with a whimsical expression, floating amongst oversized glowing mushrooms in an enchanted forest, watercolor painting, soft ethereal light.",
          "An adventurous tabby cat exploring ancient ruins covered in lush vines, realistic, dappled sunlight, wide-angle lens."
        ]`;

        const chatHistory = [{ role: "user", parts: [{ text: userPrompt }] }];
        const payload = {
            contents: chatHistory,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "ARRAY",
                    items: { "type": "STRING" }
                }
            }
        };
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const jsonText = result.candidates[0].content.parts[0].text;
                try {
                    const parsedVariations = JSON.parse(jsonText);
                    if (Array.isArray(parsedVariations)) {
                        setVariations(parsedVariations);
                    } else {
                        setVariationMessage('Failed to parse variations. Please try again.');
                    }
                } catch (jsonError) {
                    console.error('Error parsing JSON:', jsonError);
                    setVariationMessage('Invalid response format from Ai. Please try again.');
                }
            } else {
                console.error('Unexpected Ai response structure:', result);
                setVariationMessage('Failed to generate variations. Please try again.');
            }
        } catch (error) {
            console.error('Error generating variations:', error);
            setVariationMessage('An error occurred. Please check your connection and try again.');
        } finally {
            setIsVariationsLoading(false);
        }
    };

    // Function to generate a short story based on the prompt
    const generateStory = async () => {
        if (!prompt) {
            setStoryMessage('Please generate a main prompt first.');
            return;
        }

        setIsStoryLoading(true);
        setStory('');
        setStoryMessage('');

        const userPrompt = `Write a short, imaginative, and engaging story (around 3-5 sentences) based on the following Ai cat prompt: "${prompt}"
        
        Focus on bringing the cat and its described environment/action to life in a narrative format.`;

        const chatHistory = [{ role: "user", parts: [{ text: userPrompt }] }];
        const payload = { contents: chatHistory };
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const generatedText = result.candidates[0].content.parts[0].text;
                setStory(generatedText);
            } else {
                console.error('Unexpected Ai response structure:', result);
                setStoryMessage('Failed to generate story. Please try again.');
            }
        } catch (error) {
            console.error('Error generating story:', error);
            setStoryMessage('An error occurred. Please check your connection and try again.');
        } finally {
            setIsStoryLoading(false);
        }
    };

    // Function to translate the current prompt
    const translatePrompt = async () => {
        if (!prompt) {
            setTranslateMessage('Please generate a main prompt first.');
            return;
        }

        setIsTranslateLoading(true);
        setTranslatedPrompt('');
        setTranslateMessage('');

        const userPrompt = `Translate the following Ai image prompt into Japanese: "${prompt}"`;
        const chatHistory = [{ role: "user", parts: [{ text: userPrompt }] }];
        const payload = { contents: chatHistory };
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const translatedText = result.candidates[0].content.parts[0].text;
                setTranslatedPrompt(translatedText);
            } else {
                console.error('Unexpected Ai response structure:', result);
                setTranslateMessage('Failed to translate prompt. Please try again.');
            }
        } catch (error) {
            console.error('Error translating prompt:', error);
            setTranslateMessage('An error occurred. Please check your connection and try again.');
        } finally {
            setIsTranslateLoading(false);
        }
    };

    // Function to expand the current prompt
    const expandPrompt = async () => {
        if (!prompt) {
            setExpandMessage('Please generate a main prompt first.');
            return;
        }

        setIsExpandLoading(true);
        setExpandedPrompt('');
        setExpandMessage('');

        const userPrompt = `Expand and elaborate on the following Ai image prompt, adding more descriptive details, elements, and potential artistic modifiers. Make it significantly longer and richer: "${prompt}"`;
        const chatHistory = [{ role: "user", parts: [{ text: userPrompt }] }];
        const payload = { contents: chatHistory };
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const expandedText = result.candidates[0].content.parts[0].text;
                setExpandedPrompt(expandedText);
            } else {
                console.error('Unexpected Ai response structure:', result);
                setExpandMessage('Failed to expand prompt. Please try again.');
            }
        } catch (error) {
            console.error('Error expanding prompt:', error);
            setExpandMessage('An error occurred. Please check your connection and try again.');
        } finally {
            setIsExpandLoading(false);
        }
    };

    // Function to generate hashtags based on the prompt
    const generateHashtags = async () => {
        if (!prompt) {
            setHashtagMessage('Please generate a main prompt first.');
            return;
        }

        setIsHashtagsLoading(true);
        setHashtags([]);
        setHashtagMessage('');

        const userPrompt = `Generate 5-7 relevant and popular hashtags for social media based on the following Ai image prompt: "${prompt}". Provide them as a JSON array of strings.`;
        const chatHistory = [{ role: "user", parts: [{ text: userPrompt }] }];
        const payload = {
            contents: chatHistory,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "ARRAY",
                    items: { "type": "STRING" }
                }
            }
        };
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const jsonText = result.candidates[0].content.parts[0].text;
                try {
                    const parsedHashtags = JSON.parse(jsonText);
                    if (Array.isArray(parsedHashtags)) {
                        setHashtags(parsedHashtags.map(tag => `#${tag.replace(/[^a-zA-Z0-9]/g, '')}`)); // Clean and format
                    } else {
                        setHashtagMessage('Failed to parse hashtags. Please try again.');
                    }
                } catch (jsonError) {
                    console.error('Error parsing JSON:', jsonError);
                    setHashtagMessage('Invalid response format from Ai. Please try again.');
                }
            } else {
                console.error('Unexpected Ai response structure:', result);
                setHashtagMessage('Failed to generate hashtags. Please try again.');
            }
        } catch (error) {
            console.error('Error generating hashtags:', error);
            setHashtagMessage('An error occurred. Please check your connection and try again.');
        } finally {
            setIsHashtagsLoading(false);
        }
    };


    // Function to copy the generated prompt to the clipboard
    const copyToClipboard = (textToCopy = prompt) => {
        if (textToCopy) {
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setMessage('Prompt copied to clipboard!');
            setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
        }
    };

    // Inline SVG for a simple pixel cat head
    const PixelCatHead = () => (
        <svg width="48" height="48" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block mx-2 align-middle">
            {/* Main Head */}
            <rect x="2" y="4" width="12" height="10" fill="#a8a29e"/> {/* Stone 400 */}
            {/* Ears */}
            <rect x="3" y="2" width="2" height="2" fill="#a8a29e"/> {/* Stone 400 */}
            <rect x="11" y="2" width="2" height="2" fill="#a8a29e"/> {/* Stone 400 */}
            {/* Inner Ears */}
            <rect x="4" y="3" width="1" height="1" fill="#d6d3d1"/> {/* Stone 200 */}
            <rect x="11" y="3" width="1" height="1" fill="#d6d3d1"/> {/* Stone 200 */}
            {/* Eyes */}
            <rect x="5" y="6" width="2" height="2" fill="#78350f"/> {/* Amber 900 for dark eyes */}
            <rect x="9" y="6" width="2" height="2" fill="#78350f"/> {/* Amber 900 for dark eyes */}
            {/* Nose */}
            <rect x="7" y="9" width="2" height="1" fill="#57534e"/> {/* Stone 700 */}
            {/* Mouth */}
            <rect x="6" y="10" width="1" height="1" fill="#57534e"/> {/* Stone 700 */}
            <rect x="9" y="10" width="1" height="1" fill="#57534e"/> {/* Stone 700 */}
        </svg>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-amber-100 p-4 font-inter">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center border-4 border-amber-300">
                {/* Updated header with Comfortaa font and PixelCatHead SVG on both sides */}
                <h1 className="text-4xl sm:text-5xl font-extrabold text-amber-800 mb-6 drop-shadow-md flex items-center justify-center" style={{ fontFamily: "'Comfortaa', cursive" }}>
                    <PixelCatHead />
                    Ai Cat Prompt Generator
                    <PixelCatHead />
                </h1>

                <p className="text-lg text-gray-700 mb-8">
                    Click the button below to generate a unique and inspiring Ai prompt for cat images and videos!
                </p>

                {/* Main Prompt Section */}
                <div className="mb-8 min-h-[100px] flex items-center justify-center bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner">
                    {isLoading ? (
                        <div className="flex items-center space-x-2 text-amber-500">
                            <svg className="animate-spin h-6 w-6 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Generating prompt...</span>
                        </div>
                    ) : (
                        prompt ? (
                            <p className="text-xl text-gray-800 italic leading-relaxed">{prompt}</p>
                        ) : (
                            <p className="text-lg text-gray-500">Your Ai cat prompt will appear here.</p>
                        )
                    )}
                </div>

                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                    <button
                        onClick={generateCatPrompt}
                        disabled={isLoading}
                        className="bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-amber-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Generating...' : '🐾 Generate New Prompt'}
                    </button>
                    <button
                        onClick={() => copyToClipboard(prompt)}
                        disabled={!prompt}
                        className="bg-stone-500 hover:bg-stone-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-stone-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        📋 Copy Prompt
                    </button>
                </div>
                {message && (
                    <p className="mt-4 text-sm text-gray-600">{message}</p>
                )}

                {/* Additional LLM Features Section */}
                {prompt && (
                    <div className="mt-10 pt-6 border-t-2 border-stone-200">
                        <h2 className="text-2xl font-bold text-amber-700 mb-6">Explore More Options</h2>

                        {/* Suggest Variations Button */}
                        <button
                            onClick={generateVariations}
                            disabled={isVariationsLoading || isLoading || !prompt}
                            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                        >
                            {isVariationsLoading ? 'Suggesting Variations...' : '💡 Suggest Variations'}
                        </button>

                        {/* Variations Display */}
                        {isVariationsLoading ? (
                            <div className="flex items-center justify-center space-x-2 text-gray-500 my-4">
                                <svg className="animate-spin h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Generating variations...</span>
                            </div>
                        ) : (
                            variations.length > 0 && (
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner mb-6 text-left">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Prompt Variations:</h3>
                                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                                        {variations.map((v, index) => (
                                            <li key={index} className="flex justify-between items-start">
                                                <span className="flex-1 pr-2">{v}</span>
                                                <button
                                                    onClick={() => copyToClipboard(v)}
                                                    className="text-sm text-gray-500 hover:underline ml-2 flex-shrink-0"
                                                >
                                                    📋 Copy
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        )}
                        {variationMessage && (
                            <p className="mt-2 text-sm text-red-500">{variationMessage}</p>
                        )}

                        {/* Generate Story Button */}
                        <button
                            onClick={generateStory}
                            disabled={isStoryLoading || isLoading || !prompt}
                            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                        >
                            {isStoryLoading ? 'Generating Story...' : '📖 Generate Story'}
                        </button>

                        {/* Story Display */}
                        {isStoryLoading ? (
                            <div className="flex items-center justify-center space-x-2 text-emerald-500 my-4">
                                <svg className="animate-spin h-6 w-6 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Crafting story...</span>
                            </div>
                        ) : (
                            story && (
                                <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200 shadow-inner text-left mb-6">
                                    <h3 className="text-lg font-semibold text-emerald-700 mb-3">The Cat's Tale:</h3>
                                    <p className="text-gray-800 italic leading-relaxed">{story}</p>
                                </div>
                            )
                        )}
                        {storyMessage && (
                            <p className="mt-2 text-sm text-red-500">{storyMessage}</p>
                        )}

                        {/* Expand Prompt Button */}
                        <button
                            onClick={expandPrompt}
                            disabled={isExpandLoading || isLoading || !prompt}
                            className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-amber-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                        >
                            {isExpandLoading ? 'Expanding...' : '➕ Expand Prompt'}
                        </button>

                        {/* Expanded Prompt Display */}
                        {isExpandLoading ? (
                            <div className="flex items-center justify-center space-x-2 text-amber-500 my-4">
                                <svg className="animate-spin h-6 w-6 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Expanding prompt...</span>
                            </div>
                        ) : (
                            expandedPrompt && (
                                <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 shadow-inner text-left">
                                    <h3 className="text-lg font-semibold text-amber-700 mb-3">Expanded Prompt:</h3>
                                    <p className="text-gray-800 italic leading-relaxed">{expandedPrompt}</p>
                                    <button
                                        onClick={() => copyToClipboard(expandedPrompt)}
                                        className="text-sm text-slate-500 hover:underline mt-3"
                                    >
                                        📋 Copy Expanded Prompt
                                    </button>
                                </div>
                            )
                        )}
                        {expandMessage && (
                            <p className="mt-2 text-sm text-red-500">{expandMessage}</p>
                        )}

                        {/* Generate Hashtags Button */}
                        <button
                            onClick={generateHashtags}
                            disabled={isHashtagsLoading || isLoading || !prompt}
                            className="w-full bg-orange-700 hover:bg-orange-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-orange-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                        >
                            {isHashtagsLoading ? 'Generating Hashtags...' : '🏷️ Generate Hashtags'}
                        </button>

                        {/* Hashtags Display */}
                        {isHashtagsLoading ? (
                            <div className="flex items-center justify-center space-x-2 text-orange-500 my-4">
                                <svg className="animate-spin h-6 w-6 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Generating hashtags...</span>
                            </div>
                        ) : (
                            hashtags.length > 0 && (
                                <div className="bg-orange-50 p-6 rounded-xl border border-orange-200 shadow-inner text-left mb-6">
                                    <h3 className="text-lg font-semibold text-orange-700 mb-3">Suggested Hashtags:</h3>
                                    <p className="text-gray-800 italic leading-relaxed">{hashtags.join(' ')}</p>
                                    <button
                                        onClick={() => copyToClipboard(hashtags.join(' '))}
                                        className="text-sm text-gray-500 hover:underline mt-3"
                                    >
                                        📋 Copy Hashtags
                                    </button>
                                </div>
                            )
                        )}
                        {hashtagMessage && (
                            <p className="mt-2 text-sm text-red-500">{hashtagMessage}</p>
                        )}


                        {/* Translate Prompt Button */}
                        <button
                            onClick={translatePrompt}
                            disabled={isTranslateLoading || isLoading || !prompt}
                            className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                        >
                            {isTranslateLoading ? 'Translating...' : '🌐 Translate Prompt (Japanese)'}
                        </button>

                        {/* Translated Prompt Display */}
                        {isTranslateLoading ? (
                            <div className="flex items-center justify-center space-x-2 text-slate-500 my-4">
                                <svg className="animate-spin h-6 w-6 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Translating prompt...</span>
                            </div>
                        ) : (
                            translatedPrompt && (
                                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner text-left mb-6">
                                    <h3 className="text-lg font-semibold text-slate-700 mb-3">Translated Prompt:</h3>
                                    <p className="text-gray-800 italic leading-relaxed">{translatedPrompt}</p>
                                    <button
                                        onClick={() => copyToClipboard(translatedPrompt)}
                                        className="text-sm text-slate-500 hover:underline mt-3"
                                    >
                                        📋 Copy Translated Prompt
                                    </button>
                                </div>
                            )
                        )}
                        {translateMessage && (
                            <p className="mt-2 text-sm text-red-500">{translateMessage}</p>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
