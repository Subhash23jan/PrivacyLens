# Terms & Conditions Red-Flag Summariser

**Author: Subhash**

A powerful Chrome extension that uses AI to analyze terms and conditions, detect privacy risks, and answer specific questions about data handling practices.

## 🚀 Features

### 🔍 **Automatic Detection**
- Automatically detects terms & conditions, privacy policy, and legal agreement links
- Works on any website with terms-related content
- Real-time link detection and analysis

### 🤖 **AI-Powered Analysis**
- **Risk Scoring**: 0-100 scale with realistic assessment
- **Red Flag Detection**: Identifies privacy concerns and data risks
- **Smart Filtering**: Focuses on relevant content to minimize AI tokens
- **Normalized Scoring**: Most websites score 20-50, only serious violations get 70+

### ❓ **Interactive Q&A**
- **Ask Specific Questions**: Get answers about data handling, privacy, security
- **Full Content Analysis**: Uses actual webpage content, not just summaries
- **Smart Filtering**: Finds relevant paragraphs based on your question
- **Natural Answers**: Human-like responses in 2-3 sentences

### ⚡ **Quick Hover Analysis**
- Hover over terms links for instant analysis
- Real-time risk assessment
- Non-intrusive popup interface

### 🎯 **Risk Categories**
- **Very Low (0-20)**: Standard privacy practices
- **Low (21-40)**: Minor concerns, common practices
- **Medium (41-60)**: Some concerning practices
- **High (61-80)**: Serious privacy issues
- **Very High (81-100)**: Major red flags, avoid

## 📋 Prerequisites

- **Google Chrome** browser
- **Gemini API Key** from [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🛠️ Installation & Setup

### Step 1: Get API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key (starts with `AIza...`)

### Step 2: Install Extension
1. **Download/Clone** this repository
2. **Open Chrome** and go to `chrome://extensions/`
3. **Enable Developer Mode** (toggle in top right)
4. **Click "Load unpacked"** and select the extension folder
5. **Pin the extension** to your toolbar for easy access

### Step 3: Configure API Key
1. **Click the extension icon** in your toolbar
2. **Click the settings gear** (⚙️) in the bottom right
3. **Enter your Gemini API key** in the input field
4. **Click "Save Settings"**
5. **Test the API key** to ensure it works

## 🎯 How to Use

### Basic Analysis
1. **Navigate** to any website with terms & conditions
2. **Click the extension icon** in your toolbar
3. **Click "Analyze Current Page"**
4. **View results** with risk score and red flags
5. **Click "Ask Questions"** for specific inquiries

### Hover Analysis
1. **Hover over** any terms/privacy policy link
2. **Wait 300ms** for instant analysis popup
3. **View risk assessment** and key concerns
4. **Click "View Full Terms"** to open the page

### Ask Questions
1. **After analysis**, click "Ask Questions"
2. **Type your question** or click example questions:
   - "How do they handle my image data?"
   - "Can they sell my personal information?"
   - "What happens if there's a data breach?"
   - "Can I delete my data?"
3. **Get AI-powered answers** based on actual terms content

## 🔧 Technical Details

### Architecture
- **Manifest V3**: Modern Chrome extension architecture
- **Service Worker**: Background processing and API calls
- **Content Scripts**: Page interaction and link detection
- **AI Integration**: Google Gemini API for intelligent analysis

### Content Processing
- **Smart Filtering**: Extracts relevant content based on question keywords
- **Paragraph Scoring**: Ranks content by relevance to user questions
- **Token Optimization**: Minimizes AI usage while maximizing accuracy
- **Real-time Analysis**: Processes content as you browse

### AI Features
- **Risk Assessment**: Analyzes privacy and data protection practices
- **Red Flag Detection**: Identifies concerning terms and conditions
- **Question Answering**: Provides specific answers from actual content
- **Natural Language**: Human-like responses and explanations

## 📁 File Structure

```
terms_condition_reader/
├── manifest.json          # Extension configuration
├── popup.html            # Main extension interface
├── popup.js              # Popup functionality
├── popup.css             # Popup styling
├── content.js            # Page interaction and hover
├── content.css           # Hover popup styling
├── background.js         # Background processing
├── ai-service.js         # AI integration
├── content-analyzer.js   # Content processing
├── config.js             # Configuration and constants
├── test.html             # Testing page
└── README.md             # This file
```

## 🎨 UI Features

### Modern Design
- **Clean Interface**: Blue and white theme
- **Responsive Layout**: Works on different screen sizes
- **Smooth Animations**: Professional user experience
- **Intuitive Navigation**: Easy-to-use interface

### Interactive Elements
- **Hover Effects**: Visual feedback on interactions
- **Loading States**: Clear indication of processing
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Confirmation of actions

## 🔍 Supported Content Types

### Terms & Conditions Keywords
- Terms of service, terms and conditions, terms of use
- User agreement, privacy policy, service agreement
- Legal notice, conditions of use, disclaimer
- Policy, agreement, legal

### Question Categories
- **Data Handling**: Collection, storage, processing
- **Privacy Rights**: Access, deletion, portability
- **Security**: Breaches, protection, encryption
- **Sharing**: Third parties, partners, selling
- **Consent**: Opt-in, opt-out, permissions
- **Liability**: Responsibility, damages, claims

## 🚨 Privacy & Security

### Data Protection
- **No Data Storage**: Extension doesn't store personal information
- **Local Processing**: Analysis happens in your browser
- **Secure API**: Uses Google's secure Gemini API
- **No Tracking**: Extension doesn't track your browsing

### API Security
- **API Key Protection**: Stored securely in Chrome storage
- **HTTPS Only**: All API calls use secure connections
- **No Data Logging**: Extension doesn't log your questions or analysis

## 🐛 Troubleshooting

### Common Issues

#### Extension Not Working
- **Check API Key**: Ensure your Gemini API key is valid
- **Refresh Page**: Reload the page you're analyzing
- **Restart Browser**: Close and reopen Chrome
- **Reinstall Extension**: Remove and re-add the extension

#### Analysis Fails
- **Check Internet**: Ensure you have a stable connection
- **API Limits**: Check if you've exceeded API usage limits
- **Page Content**: Make sure the page has readable content
- **CORS Issues**: Some sites may block content access

#### Questions Not Working
- **Analyze First**: Make sure you've analyzed the page before asking questions
- **Clear Question**: Ensure your question is clear and specific
- **Check Content**: Verify the page has relevant terms content

### Error Messages
- **"API key not configured"**: Set up your Gemini API key in settings
- **"Analysis failed"**: Check internet connection and try again
- **"No content found"**: The page may not have readable terms content
- **"CORS error"**: External sites may block content access

## 🔄 Updates & Maintenance

### Version History
- **v1.0.0**: Initial release with basic analysis
- **v1.1.0**: Added interactive Q&A feature
- **v1.2.0**: Enhanced content filtering and natural answers

### Future Features
- **Batch Analysis**: Analyze multiple pages at once
- **Export Reports**: Save analysis results as PDF
- **Custom Keywords**: Add your own terms to detect
- **History**: Track analyzed pages and questions

## 📞 Support

### Getting Help
- **Check Troubleshooting**: Review the troubleshooting section above
- **Test API Key**: Ensure your Gemini API key is working
- **Clear Cache**: Clear browser cache and cookies
- **Update Extension**: Ensure you have the latest version

### Reporting Issues
- **Browser Console**: Check for error messages in Developer Tools
- **Extension Logs**: Look for console logs from the extension
- **Reproduce Steps**: Document how to reproduce the issue

## 📄 License

This project is created by **Subhash** for educational and privacy protection purposes.

## 🙏 Acknowledgments

- **Google Gemini API** for AI capabilities
- **Chrome Extension API** for browser integration
- **Privacy advocates** for inspiration and feedback

---

**Made with ❤️ by Subhash**

*Protecting your privacy, one terms & conditions at a time.*