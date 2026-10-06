export const curriculumPhases = [
  {
    id: "phase-1",
    phaseNumber: 1,
    title: "Phase 1 - Student Profile & Course Portal (HTML Only)",
    subtitle: "Pure Structural HTML Multi-Page Website & Mini Projects",
    status: "active",
    icon: "Code2",
    badge: "HTML Only (No CSS/JS)",
    deadlineDays: 7,
    masterVideo: {
      title: "Phase 1 Masterclass: Complete HTML5 Crash Course",
      videoUrl: "https://www.youtube.com/embed/HcOc7P5BMi4",
      duration: "HTML Full Course",
      channel: "Web Dev Tutorial",
      description: "The official single best video tutorial explaining semantic HTML tags, document head/body, forms, tables, and multi-page site structure."
    },
    videos: [
      {
        title: "Phase 1 Masterclass: Complete HTML5 Crash Course",
        videoUrl: "https://www.youtube.com/embed/HcOc7P5BMi4",
        duration: "HTML Full Course",
        channel: "Web Dev Tutorial",
        description: "The official single best video tutorial explaining semantic HTML tags, document head/body, forms, tables, and multi-page site structure."
      }
    ],
    introduction: {
      title: "1. Introduction to the Project",
      welcomeMessage: "Welcome to your first major HTML project! You'll be building a 'Student Profile & Course Portal.' This is a multi-page website designed to act as a personal hub for a student, showcasing their profile, courses, grades, and more.",
      containedPages: [
        { name: "Home", desc: "The main landing page." },
        { name: "Profile", desc: "A page about the student." },
        { name: "Courses", desc: "A list of courses the student is enrolled in." },
        { name: "Feedback", desc: "A form for users to submit feedback." },
        { name: "Grades Table", desc: "A page displaying student grades in a tabular format." },
        { name: "Contact Us", desc: "A page with contact information." }
      ],
      objective: "The main goal of this project is to understand how websites are structured using only HTML. You'll learn to create different pages, link them together, and present various types of information using a range of HTML tags.",
      goldenRule: "Remember, for this phase, you are ONLY allowed to use HTML. No CSS for styling (making things look pretty) and no JavaScript for interactivity (making things dynamic). We are focusing purely on the structure and content. This will help you build a strong foundation."
    },
    pageBreakdown: [
      {
        pageNumber: 1,
        fileName: "index.html",
        icon: "🏠",
        title: "Page 1: Home Page (index.html)",
        desc: "Main portal landing page introducing the website structure and primary multi-page navigation.",
        conceptsToStudy: [
          "HTML5 Document Boilerplate: <!DOCTYPE html>, <html>, <head>, <meta charset='UTF-8'>, <title>",
          "Semantic Page Header & Navigation: <header>, <nav>, <ul>, <li>, <a href='...'>",
          "Hero Content Section: <main>, <section>, <h1>, <p>, <mark>, <strong>",
          "Page Footer Copyright: <footer>, <p>"
        ],
        tags: ["<!DOCTYPE>", "<html>", "<head>", "<title>", "<body>", "<header>", "<h1>", "<nav>", "<ul>", "<li>", "<a>", "<main>", "<section>", "<p>", "<footer>"],
        maxTime: "90 minutes"
      },
      {
        pageNumber: 2,
        fileName: "profile.html",
        icon: "👤",
        title: "Page 2: Student Profile Page (profile.html)",
        desc: "Personal 'About Me' profile displaying student avatar image, bio, hobbies, and target engineering role.",
        conceptsToStudy: [
          "Image Embedding & Attributes: <img> with required src, alt, width, and height",
          "Headings Hierarchy: <h1> for title, <h2> for bio section, <h3> for skills",
          "Semantic Article & Figure: <article>, <figure>, <figcaption>",
          "Unordered & Ordered Lists: <ul>, <ol>, <li> for listing hobbies and achievements"
        ],
        tags: ["<h1>", "<h2>", "<h3>", "<img>", "<figure>", "<figcaption>", "<article>", "<p>", "<ul>", "<ol>", "<li>", "<nav>", "<a>"],
        maxTime: "75 minutes"
      },
      {
        pageNumber: 3,
        fileName: "courses.html",
        icon: "📚",
        title: "Page 3: Courses Page (courses.html)",
        desc: "Structured list of current & completed courses with syllabus breakdowns and inline semantic formatting.",
        conceptsToStudy: [
          "Nested Lists: <ul> containing nested <ol> for course syllabus modules",
          "Description Lists: <dl>, <dt> (term), <dd> (definition) for course vocabulary",
          "Inline Semantic Formatting: <strong>, <em>, <code>, <kbd>, <mark>, <small>",
          "Relative Links & Anchors: <a href='...'> linking to course details"
        ],
        tags: ["<h1>", "<h2>", "<h3>", "<dl>", "<dt>", "<dd>", "<ul>", "<ol>", "<li>", "<code>", "<mark>", "<strong>", "<em>", "<nav>"],
        maxTime: "75 minutes"
      },
      {
        pageNumber: 4,
        fileName: "feedback.html",
        icon: "📝",
        title: "Page 4: Student Feedback Form Page (feedback.html)",
        desc: "Interactive HTML form structure for student feedback, ratings, and text reviews.",
        conceptsToStudy: [
          "Form Container & Attributes: <form action='#' method='POST'>",
          "Form Labels & Accessibility: <label for='id_name'> bound to input IDs",
          "Input Types: <input type='text|email|number|radio|checkbox|date'>",
          "Form Controls: Dropdown <select> & <option>, multiline <textarea>, and <button type='submit'>"
        ],
        tags: ["<form>", "<label>", "<input>", "<select>", "<option>", "<textarea>", "<fieldset>", "<legend>", "<button type='submit'>", "<nav>"],
        maxTime: "90 minutes"
      },
      {
        pageNumber: 5,
        fileName: "grades.html",
        icon: "📊",
        title: "Page 5: Grades Table Page (grades.html)",
        desc: "Tabular data display showing course grades, marks, credits, and semester GPA breakdown.",
        conceptsToStudy: [
          "Table Architecture: <table>, <caption> for table title",
          "Table Header, Body & Footer: <thead>, <tbody>, <tfoot>",
          "Table Rows & Cells: <tr>, <th> for column headers, <td> for data cells",
          "Cell Spanning: colspan='2' for merged headers, rowspan='2' for multi-row grades"
        ],
        tags: ["<table>", "<caption>", "<thead>", "<tbody>", "<tfoot>", "<tr>", "<th>", "<td>", "colspan", "rowspan", "<nav>"],
        maxTime: "60 minutes"
      },
      {
        pageNumber: 6,
        fileName: "contact.html",
        icon: "📞",
        title: "Page 6: Contact Us Page (contact.html)",
        desc: "Contact information page with address tags, email/phone action links, and embedded map frame.",
        conceptsToStudy: [
          "Semantic Address Block: <address> tag for contact info",
          "Action Links: <a href='mailto:email@domain.com'> and <a href='tel:+91...'>",
          "Embedded Media Frames: <iframe> for location map preview",
          "Interactive Collapsible Accordion: <details> and <summary> for FAQs"
        ],
        tags: ["<h1>", "<address>", "<a href='mailto:'>", "<a href='tel:'>", "<iframe>", "<details>", "<summary>", "<p>", "<nav>"],
        maxTime: "45 minutes"
      }
    ],
    videoSubmission: [
      "Explain the Purpose: Clearly state the purpose of the specific page you are presenting.",
      "List Tags Used: Show your HTML code and list all the unique HTML tags you used on that page.",
      "Describe Tag Usage: Explain how and why you used those specific tags to structure the content on that page.",
      "Show a Working Example: Open the HTML file in a web browser and show the rendered page.",
      "Independent Work: You must do all of this independently, without any external help during the recording."
    ],
    conceptVideos: [
      {
        title: "Video Title 1: Let's Build Your First Website: The Home Page",
        cover: "Walk through the process of creating a basic homepage using only HTML. Add a title, heading, some paragraph text, and navigation links.",
        questions: [
          "What is the purpose of the <head>, <body>, and <title> tags?",
          "How do we add links to other pages using <a> tags?",
          "What tags are necessary for structuring a home page?",
          "How do you create headings (<h1>, <h2>, etc.) and paragraphs (<p>)?"
        ]
      },
      {
        title: "Video Title 2: Creating Your Personal Profile Page with HTML",
        cover: "Build a student profile page with an image, an 'about me' section, and a list of hobbies.",
        questions: [
          "How do we embed an image with <img> and what are the essential attributes (src, alt)?",
          "What tags help organize sections like hobbies or personal details (e.g., <section>, <div>)?",
          "How do unordered lists <ul> and ordered lists <ol> work, and when would you use each?",
          "How can you add a line break (<br>) or a horizontal rule (<hr>)?"
        ]
      },
      {
        title: "Video Title 3: Listing Your Courses: The Course Page",
        cover: "Create a 'My Courses' page that lists all the courses a student is enrolled in.",
        questions: [
          "How do you structure a list of items that each have a title and a short description?",
          "How can you use <a> tags to create placeholder links for future pages?",
          "What is the difference between an absolute URL and a relative URL?",
          "How can you use heading tags to create a clear hierarchy on the page?"
        ]
      },
      {
        title: "Video Title 4: How to Make a Simple Feedback Form in HTML",
        cover: "Build an HTML form that allows students to submit feedback.",
        questions: [
          "What is the purpose of the <form> tag and what are the action and method attributes?",
          "How do you create a multi-line text input using <textarea>?",
          "What are the different types of <input> tags?",
          "How does the <label> tag improve accessibility?"
        ]
      },
      {
        title: "Video Title 5: Displaying Your Grades with HTML Tables",
        cover: "Create a 'Grades' page that displays course grades in a structured table format.",
        questions: [
          "What are the essential tags for creating a table (<table>, <tr>, <th>, <td>)?",
          "What is the difference between <th> and <td>?",
          "How do you define the header row of a table?",
          "How does the scope attribute in a <th> tag help accessibility?"
        ]
      },
      {
        title: "Video Title 6: Building a 'Contact Us' Page",
        cover: "Create a simple 'Contact Us' page with an address, a 'mailto' link for email, and a 'tel' link for phone.",
        questions: [
          "How do you create a link that opens default email client using mailto:?",
          "How do you create a clickable phone link using tel:?",
          "What is the best way to format a physical address in HTML?",
          "How can you use the <address> tag semantically?"
        ]
      },
      {
        title: "Video Title 7: Linking It All Together: Website Navigation",
        cover: "Create a consistent navigation bar using an unordered list within a <nav> tag.",
        questions: [
          "Why should you use the <nav> tag for main navigation?",
          "How do you create a list of links for a navigation menu?",
          "How do you ensure navigation links work from any page?",
          "How can you create a 'Home' link that takes the user back?"
        ]
      }
    ],
    learningOutcomes: [
      "Gain a solid understanding of basic HTML structure.",
      "Be proficient in using common HTML tags for text, lists, links, images, tables, and forms.",
      "Understand how to build a multi-page website.",
      "Develop foundational knowledge of semantic HTML.",
      "Build confidence in creating web pages from scratch."
    ],
    resources: [
      { name: "MDN Web Docs - HTML", url: "https://developer.mozilla.org/en-US/docs/Web/HTML", desc: "Gold standard official documentation." },
      { name: "YouTube Full Course Videos", search: "HTML full course for beginners", desc: "Traversy Media, freeCodeCamp, Programming with Mosh." },
      { name: "HTML CheatSheet by WebsiteSetup", url: "https://websitesetup.org/html5-cheat-sheet/", desc: "Visual guide and PDF cheat sheet." }
    ],
    miniProjects: [
      {
        title: "Mini Project 1: Simple Recipe Page",
        desc: "Create a single HTML page that displays a recipe for your favorite dish.",
        tags: ["<h1> (Recipe Name)", "<img> (Dish Picture)", "<h2>/<h3>", "<ul> (Ingredients)", "<ol> (Instructions)", "<strong>/<em>"],
        videoTitle: "Video Title 8: HTML Mini-Project: A Simple Recipe Page"
      },
      {
        title: "Mini Project 2: Basic Blog Post",
        desc: "Create a single HTML page that looks like a simple blog post.",
        tags: ["<h1>", "<p>", "<article>", "<h2>/<h3>", "<img>", "<a>", "<blockquote>"],
        videoTitle: "Video Title 9: HTML Mini-Project: Your First Blog Post"
      },
      {
        title: "Mini Project 3: Event Announcement",
        desc: "Create a single HTML page announcing a fictional event.",
        tags: ["<h1>", "<h2>/<h3>", "<p>", "<ul>/<ol>", "<strong>", "<a>", "<hr>"],
        videoTitle: "Video Title 10: HTML Mini-Project: An Event Announcement Page"
      }
    ],
    rubrics: [
      {
        parameter: "Understanding the Problem / Problem Articulation",
        weight: "15%",
        beginner: "Cannot clearly describe the purpose of the website; can name 1–2 pages.",
        intermediate: "Explains some pages and their purpose, but misses the connections.",
        advanced: "Explains all pages with purpose and basic connections.",
        expert: "Clearly explains all pages, connections, and why HTML-only is used."
      },
      {
        parameter: "Conceptual Clarity (HTML Semantics & Structure)",
        weight: "25%",
        beginner: "Uses tags randomly; cannot explain why a tag is used.",
        intermediate: "Shows partial understanding of HTML tags; misuses some semantic tags.",
        advanced: "Correctly uses semantic tags; explains why tags are chosen and hierarchy.",
        expert: "Fully explains semantic structure and tag choices; can teach others."
      },
      {
        parameter: "Structural Robustness (Completeness, Consistency, Functionality)",
        weight: "25%",
        beginner: "Many pages missing or incomplete; navigation broken.",
        intermediate: "Most pages exist and work, but minor navigation or nesting issues.",
        advanced: "All pages complete, properly linked, and structure is mostly correct.",
        expert: "Website fully complete, robust, and scalable; navigation flawless."
      },
      {
        parameter: "Visual Appeal (Structure-only readability)",
        weight: "20%",
        beginner: "Layout confusing or cluttered; headings, lists hard to follow.",
        intermediate: "Basic layout readable; some headings or lists misaligned.",
        advanced: "Layout clear and organized; headings, lists, paragraphs structured.",
        expert: "Layout highly readable and intuitive; semantic tags improve flow."
      },
      {
        parameter: "Solution Explanation / Communication Skills",
        weight: "15%",
        beginner: "Cannot explain code or tag choices.",
        intermediate: "Explains some tags and basic page flow but reasoning incomplete.",
        advanced: "Explains page flow and tag choices clearly.",
        expert: "Explains all pages, tag choices, and reasoning confidently."
      }
    ]
  },
  {
    id: "phase-2",
    phaseNumber: 2,
    title: "Phase 2 - Dressing Up Your Websites with CSS 👗🖌️",
    subtitle: "CSS Fundamentals, Styling Pages, Flexbox, Grid & Media Queries",
    status: "active",
    icon: "Palette",
    badge: "CSS3, Flexbox, Grid & Responsive",
    deadlineDays: 10,
    masterVideo: {
      title: "Phase 2 Masterclass: Complete CSS3 & Responsive Styling",
      videoUrl: "https://www.youtube.com/embed/wRNinF7YQqQ",
      duration: "CSS Full Course",
      channel: "Web Dev Tutorial",
      description: "The official single best video tutorial covering CSS selectors, box model, Flexbox, Grid, colors, and responsive styling."
    },
    videos: [
      {
        title: "Phase 2 Masterclass: Complete CSS3 & Responsive Styling",
        videoUrl: "https://www.youtube.com/embed/wRNinF7YQqQ",
        duration: "CSS Full Course",
        channel: "Web Dev Tutorial",
        description: "The official single best video tutorial covering CSS selectors, box model, Flexbox, Grid, colors, and responsive styling."
      }
    ],
    introduction: {
      title: "1. Project Introduction: Your CSS Learning Adventure",
      welcomeMessage: "Hey there, future web designer! You've successfully built the structure of your websites with HTML. Now, it's time to make them look amazing and truly shine! This phase is all about learning CSS fundamentals by styling your pages and creating visually appealing layouts.",
      containedPages: [
        { name: "Global Styles (style.css)", desc: "CSS Reset (* { box-sizing: border-box }), base typography, font family, line-height, and body colors." },
        { name: "🏠 Home Page Styling", desc: "Hero section styling, centered <h1> font-size, intro <p> container." },
        { name: "👤 Profile Page Styling", desc: "Circular profile image (border-radius: 50%), centered block image, heading border-bottom." },
        { name: "📚 Courses Page (Flexbox)", desc: "Modular course cards using display: flex; flex-wrap: wrap; gap: 20px; flex-basis: 300px." },
        { name: "📚 Courses Page (Grid)", desc: "2D card grid using display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px." },
        { name: "📝 Feedback Page Styling", desc: "Form card container, stacked <label> (display: block), full-width inputs, :hover and :focus feedback." },
        { name: "📊 Grades Table Styling", desc: "Table border-collapse: collapse, <th> header styles, and tr:nth-child(even) zebra striping." },
        { name: "📞 Contact Us Styling", desc: "Legible contact details, email (mailto:) and phone (tel:) interactive link states." }
      ],
      objective: "The main mission of this phase is to help you learn fundamental CSS concepts by turning plain HTML pages into beautiful, responsive web applications.",
      goldenRule: "Master the CSS Box Model (margin, padding, border), Flexbox (1D), CSS Grid (2D), and Media Queries for responsive screen adaptation."
    },
    globalCssRules: [
      {
        rule: "* { box-sizing: border-box; }",
        desc: "Makes width calculations include padding and borders for intuitive box sizing."
      },
      {
        rule: "body { margin: 0; padding: 0; font-family: sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; }",
        desc: "Resets browser default margins and establishes base typography and canvas color."
      },
      {
        rule: "nav ul { list-style-type: none; display: flex; justify-content: space-around; }",
        desc: "Removes list bullets and aligns navigation items horizontally with Flexbox."
      },
      {
        rule: "a { text-decoration: none; color: #0066cc; } a:hover { text-decoration: underline; }",
        desc: "Styles hyperlinked text with interactive hover states."
      }
    ],
    pageBreakdown: [
      {
        icon: "🏠",
        title: "Home Page Styling",
        desc: "Welcome Message / Hero Section: Center <h1> title, increase font-size, style introductory <p> with max-width and margin: auto.",
        tags: ["font-size", "text-align: center", "margin-bottom", "max-width", "margin: auto"],
        maxTime: "60 minutes"
      },
      {
        icon: "👤",
        title: "Profile Page Styling",
        desc: "Profile Image (<img>): Circular styling with border-radius: 50%; display: block; margin: 0 auto; object-fit: cover. Headings <h2> border-bottom.",
        tags: ["border-radius: 50%", "display: block", "margin: auto", "object-fit: cover", "border-bottom"],
        maxTime: "60 minutes"
      },
      {
        icon: "📚",
        title: "Courses Page (Flexbox Layout)",
        desc: "Style course <li> as modular cards: background-color, border, border-radius, padding, box-shadow. Parent container: display: flex; flex-wrap: wrap; gap: 20px; flex-basis: 300px.",
        tags: ["display: flex", "flex-wrap: wrap", "gap: 20px", "flex-basis: 300px", "flex-direction: column", "box-shadow"],
        maxTime: "75 minutes"
      },
      {
        icon: "📚",
        title: "Courses Page (Grid Layout)",
        desc: "Style parent container with display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; justify-items, align-items.",
        tags: ["display: grid", "grid-template-columns", "repeat(auto-fit, minmax(250px, 1fr))", "gap: 20px", "grid-column", "grid-row"],
        maxTime: "75 minutes"
      },
      {
        icon: "📝",
        title: "Feedback Form Styling",
        desc: "<form> max-width, margin: auto, padding, box-shadow. <label> display: block, font-weight: bold. <input>, <textarea>, <select> width: 100%, padding. Pseudo-classes input:focus and button:hover.",
        tags: ["display: block", "width: 100%", "padding", "border-radius", ":focus", ":hover", "cursor: pointer"],
        maxTime: "75 minutes"
      },
      {
        icon: "📊",
        title: "Grades Table Styling",
        desc: "<table> width: 100%, border-collapse: collapse. <th> background-color, color, padding. <td> padding. Zebra striping with tr:nth-child(even).",
        tags: ["border-collapse: collapse", "tr:nth-child(even)", "th background", "td padding", "tr:hover"],
        maxTime: "60 minutes"
      },
      {
        icon: "📞",
        title: "Contact Us Page Styling",
        desc: "Clear typographic hierarchy, distinct margin-bottom on paragraphs, and clear interactive hover colors on mailto: and tel: links.",
        tags: ["margin-bottom", "a:hover", "color", "line-height", "font-weight"],
        maxTime: "45 minutes"
      }
    ],
    responsiveMediaQueries: [
      {
        breakpoint: "@media (max-width: 768px)",
        desc: "Tablets: Change navigation flex-direction to column, adjust 2-column card layouts to 1-column, reduce heading font sizes."
      },
      {
        breakpoint: "@media (max-width: 480px)",
        desc: "Mobile Phones: Full width (100%) cards, decrease section padding, enable horizontal scroll for tables (overflow-x: auto)."
      }
    ],
    videoSubmission: [
      "Show & Tell: Briefly show the 'before' (HTML-only) version and then the 'after' (CSS-styled) version of the page.",
      "Explain Styles: Walk through your style.css file and point out the key CSS rules added for that page.",
      "Explain 'Why': Describe why you made certain styling choices (color scheme, Flexbox layout, spacing).",
      "Demonstrate: Show how the CSS rules affect the page in the browser and test responsiveness.",
      "Independent Work: All styling and explanation should be your own."
    ],
    conceptVideos: [
      {
        title: "Video Title 1: Your First Stylesheet: Global CSS for Your Website",
        cover: "Create a style.css file, link it to all pages, apply global styles like font, background color, spacing resets, and box-sizing.",
        questions: [
          "How do you link an external CSS file using <link>?",
          "What is box-sizing: border-box; and why is it a best practice?",
          "Why do developers apply margin: 0 and padding: 0 to the * universal selector?",
          "How do you set default font-family and background-color on the body tag?"
        ]
      },
      {
        title: "Video Title 2: Styling Your Profile Page: Images and Text",
        cover: "Style the student profile page by customizing the profile image (making it circular), headings, and text formatting.",
        questions: [
          "How do you target specific HTML elements with CSS selectors (class vs ID vs tag)?",
          "How can you make a square image appear as a circle using border-radius: 50%?",
          "What are the common CSS properties for text appearance (color, font-size, text-align)?",
          "What is the difference between a class selector (.) and an ID selector (#)?"
        ]
      },
      {
        title: "Video Title 3: Creating Course 'Cards' with Flexbox",
        cover: "Style the 'My Courses' page by turning each course into a card and using Flexbox to arrange cards in a responsive layout.",
        questions: [
          "What is display: flex; and what does it do to child elements?",
          "How do you use justify-content and align-items along main and cross axes?",
          "What is the purpose of the flex-wrap property?",
          "How can you give each card a border, padding, and box shadow?"
        ]
      },
      {
        title: "Video Title 4: Making Forms Look Good: Styling the Feedback Page",
        cover: "Style the feedback form by customizing labels, inputs, textarea, and submit button with hover and focus effects.",
        questions: [
          "How do you style <input> and <textarea> to have consistent width and padding?",
          "How can you change button background color, text color, and border?",
          "What are the :hover and :focus pseudo-classes and how do they improve usability?",
          "How do you use display: block; on labels to stack them above input fields?"
        ]
      },
      {
        title: "Video Title 5: How to Style Tables for Readability",
        cover: "Style the grades table by adding borders, spacing, text alignment, and zebra striping for clear readability.",
        questions: [
          "How do you add borders to a table using the border property?",
          "What is border-collapse: collapse; and why is it useful?",
          "How do you use tr:nth-child(even) to create zebra stripes?",
          "How can you align text within table cells using text-align?"
        ]
      },
      {
        title: "Video Title 6: Responsive Design 101: Media Queries",
        cover: "Use media queries to make the portal responsive across desktop, tablet, and mobile screens.",
        questions: [
          "What is a media query and what is its syntax (@media)?",
          "How do you define a breakpoint for a specific screen width?",
          "How would you change flexbox direction from row to column on smaller screens?",
          "Why is the viewport meta tag essential?"
        ]
      },
      {
        title: "Video Title 7: CSS Mini-Project: A Stylish Online Resume",
        cover: "Build and style a one-page online resume using CSS two-column layout, typography, and section spacing.",
        questions: [
          "How can you create a two-column layout using Flexbox or CSS Grid?",
          "How do you use CSS to create visual separation between resume sections?",
          "What are good font choices for a professional resume?",
          "How can you use padding and margin to create clean white space?"
        ]
      },
      {
        title: "Video Title 8: Using the CSS Box Model to Improve Your Resume Layout",
        cover: "Apply the CSS Box Model (margin, padding, border, content) to your online resume layout.",
        questions: [
          "What are the four parts of the CSS box model?",
          "What is the difference between padding and margin?",
          "How does the border property add to the total size of an element?",
          "How does box-sizing: border-box; change box model calculation?"
        ]
      },
      {
        title: "Video Title 9: Building a Responsive Product Card with CSS Layouts",
        cover: "Build and style a responsive product card with image, details, price, and CTA button using Flexbox vs Grid.",
        questions: [
          "What is the main difference between Flexbox (1D) and Grid (2D)?",
          "When is Flexbox the better choice for layout?",
          "When is Grid the better choice for layout?",
          "Show a simple layout created with both Flexbox and Grid."
        ]
      },
      {
        title: "Video Title 10: CSS Form Styling Using CSS Transitions & Animations",
        cover: "Design and style a feedback form enhanced with CSS transitions, hover effects, and @keyframes animations.",
        questions: [
          "What is the transition property and how does it work?",
          "How do you specify which property to animate and duration?",
          "What is the difference between a transition and a @keyframes animation?",
          "How can you create a simple fade-in effect using @keyframes and opacity?"
        ]
      }
    ],
    learningOutcomes: [
      "Understand the role of CSS in web development and separating presentation from HTML structure.",
      "Confidently use a wide range of CSS selectors (IDs, classes, tags) to target elements.",
      "Master the CSS Box Model (margin, padding, border, width, height) to control spacing.",
      "Apply CSS for typography (fonts, colors, text alignment) and background canvas.",
      "Utilize Flexbox and CSS Grid to create flexible and responsive layouts.",
      "Style complex common elements like lists, tables, and form controls.",
      "Use pseudo-classes (:hover, :focus, :nth-child) to add interactive visual polish.",
      "Write Media Queries (@media) to make websites adapt seamlessly to mobile and desktop viewports."
    ],
    resources: [
      { name: "MDN Web Docs – CSS Guide", url: "https://developer.mozilla.org/en-US/docs/Web/CSS", desc: "Official CSS documentation and property reference." },
      { name: "CSS Battle – CSS Coding Game", url: "https://cssbattle.dev/learn", desc: "Fun coding game to create shapes and targets using CSS." },
      { name: "Flexbox Froggy – Interactive Flexbox Game", url: "https://flexboxfroggy.com/", desc: "Move frogs to lily pads using display flex, justify-content, align-items." },
      { name: "CSS Grid Garden – Interactive Grid Game", url: "https://cssgridgarden.com/", desc: "Water your garden using CSS Grid rules." },
      { name: "FreeCodeCamp – Responsive Web Design", url: "https://www.freecodecamp.org/learn/responsive-web-design/", desc: "Interactive lessons on CSS basics, Flexbox, Grid, and media queries." }
    ],
    miniProjects: [
      {
        title: "Mini Project 1: Stylish Online Resume",
        desc: "Create and style a professional 2-column online resume with education, experience, and skill badges.",
        tags: ["Box Model", "Typography", "Flexbox 2-Column", "box-sizing: border-box", "Color Scheme"],
        videoTitle: "Video Title 8: Using the CSS Box Model to Improve Your Resume Layout"
      },
      {
        title: "Mini Project 2: Responsive Product Card UI",
        desc: "Design a single product card with image, title, price, description, and 'Add to Cart' button styled with Flexbox vs Grid.",
        tags: ["Flexbox vs Grid", "border-radius", "box-shadow", "button:hover", "@media responsive"],
        videoTitle: "Video Title 9: Building a Responsive Product Card with CSS Layouts"
      },
      {
        title: "Mini Project 3: Feedback Form UI Makeover",
        desc: "Give a basic HTML form a complete visual makeover using CSS transitions, focus states, and @keyframes animations.",
        tags: ["Form Styling", ":focus", ":hover", "transition", "@keyframes fade-in", "box-shadow"],
        videoTitle: "Video Title 10: CSS Form Styling Using CSS Transitions & Animations"
      }
    ],
    rubrics: [
      {
        parameter: "Understanding the problem",
        weight: "15%",
        beginner: "Added CSS inline or repeating rules without structure. Cannot explain why CSS is separate.",
        intermediate: "Used external CSS file. Layout partly consistent. Knows CSS is for design but struggles with cascade/specificity.",
        advanced: "Good CSS structure: consistent classes, external file, responsive with media queries. Explains Flexbox/Grid choices.",
        expert: "Scalable professional CSS: clear naming, modular, hover/focus states, accessible colors and contrast ratios."
      },
      {
        parameter: "Robustness",
        weight: "20%",
        beginner: "Layouts break on different screens; inconsistent styles; excessive !important usage.",
        intermediate: "Some layouts work; partial responsive understanding; tries Flexbox/Grid but elements misalign.",
        advanced: "Layouts work consistently across pages; responsive behavior mostly correct; uses Flexbox/Grid effectively.",
        expert: "Fully robust layout: handles all screen sizes and edge cases; modular clean CSS structure; anticipates errors."
      },
      {
        parameter: "Conceptual Clarity & Understanding of CSS",
        weight: "20%",
        beginner: "Weak understanding. Cannot explain box model, Flexbox/Grid, or media queries. Misuses units (px vs %).",
        intermediate: "Knows box model basics (padding, margin, border). Uses Flex/Grid with minor errors. Inconsistent media queries.",
        advanced: "Good understanding of box model, Flexbox, Grid, and media queries; can explain positioning (relative vs absolute).",
        expert: "Deep understanding of CSS; modular structure; advanced Flexbox & Grid; handles specificity and media queries expertly."
      },
      {
        parameter: "Visual Appeal",
        weight: "30%",
        beginner: "Design is messy; clashing colors; unaligned elements; buttons blend into background.",
        intermediate: "Design simple but functional; headings slightly larger; buttons colored; spacing uneven.",
        advanced: "Design clean and professional; clear headings; button hover effects; consistent margins and padding.",
        expert: "Design polished and thoughtful; clear hierarchy (h1 > h2 > h3); uniform spacing; contrast ratio meets standards."
      },
      {
        parameter: "Solution Explanation (Design & Visual)",
        weight: "15%",
        beginner: "Cannot explain design or spacing choices.",
        intermediate: "Gives basic reasons for choices like making important things bigger.",
        advanced: "Explains clearly how design choices improve user experience.",
        expert: "Explains how design decisions solve user problems and adapt across devices."
      }
    ]
  },
  {
    id: "phase-2-5",
    phaseNumber: 2.5,
    title: "Phase 2.5: JavaScript Foundations 🧠",
    subtitle: "Console-Based Programs, Logic, Algorithms, Data Structures & Problem Solving",
    status: "active",
    icon: "Brain",
    badge: "JS Logic & Terminal Programs",
    deadlineDays: 7,
    masterVideo: {
      title: "Phase 2.5 Masterclass: JavaScript Programming & Logic Foundations",
      videoUrl: "https://www.youtube.com/embed/htznIeWKgg8",
      duration: "JS Logic Course",
      channel: "Web Dev Tutorial",
      description: "The official single best video tutorial covering JS variables, data types, operators, conditionals, loops, functions, and programmatic problem solving."
    },
    videos: [
      {
        title: "Phase 2.5 Masterclass: JavaScript Programming & Logic Foundations",
        videoUrl: "https://www.youtube.com/embed/htznIeWKgg8",
        duration: "JS Logic Course",
        channel: "Web Dev Tutorial",
        description: "The official single best video tutorial covering JS variables, data types, operators, conditionals, loops, functions, and programmatic problem solving."
      }
    ],
    introduction: {
      title: "Welcome to Phase 2.5: Giving Your Applications a Brain",
      welcomeMessage: "Welcome to the next step in your journey! So far, you have mastered the 'skeleton' (HTML) and the 'skin' (CSS) of the web. Now, it's time to give your applications a brain. In Phase 2.5, we dive into JavaScript logic, data structures, and problem-solving before touching DOM manipulation in Phase 3.",
      containedPages: [
        { name: "Variables & Data Types", desc: "Strings, Numbers, Booleans, let vs const, and memory storage." },
        { name: "Operators & Math", desc: "Arithmetic (+, -, *, /) and strict comparison (===, !==, >, <)." },
        { name: "Conditional Logic", desc: "Decision making using if, else if, else, and switch statements." },
        { name: "Loops & Iteration", desc: "Repeating tasks efficiently with for and while loops." },
        { name: "Arrays & Objects", desc: "Managing lists of data and key-value pair data structures." },
        { name: "Functions & Parameters", desc: "Building reusable, modular logic recipes." },
        { name: "Debugging & Logging", desc: "Using console.log() and interpreting terminal execution errors." }
      ],
      objective: "Move from a 'Web Designer' to a 'Web Developer' by writing console-based JavaScript programs that manipulate data and solve logical problems.",
      goldenRule: "Experiment constantly in the browser console / Node terminal. Treat error messages as feedback, not failure!"
    },
    topicMatrix: [
      {
        topic: "Variables & Data Types",
        learn: "How to store strings, numbers, and booleans with let and const.",
        why: "Programs need a way to 'remember' information in memory.",
        apply: "Creating student user profiles and config variables."
      },
      {
        topic: "Operators",
        learn: "Math (+, -, *, /) and Comparison (>, <, ===, !==).",
        why: "To calculate values and compare data points.",
        apply: "Calculating total cart price or grade averages."
      },
      {
        topic: "Conditional Logic",
        learn: "if, else if, and else statements.",
        why: "Allows your program to make decisions based on dynamic data.",
        apply: "Checking if a student passed a test (score > 70)."
      },
      {
        topic: "Loops",
        learn: "for and while loops.",
        why: "To repeat tasks efficiently without code duplication.",
        apply: "Iterating through an array of test scores automatically."
      },
      {
        topic: "Arrays",
        learn: "Creating and manipulating ordered lists of data.",
        why: "Real-world data comes in the form of lists.",
        apply: "Managing a list of student grades or shopping items."
      },
      {
        topic: "Objects",
        learn: "Key-Value pair data structures ({ name: 'Coffee', price: 5 }).",
        why: "To represent real-world entities cleanly.",
        apply: "Creating a User object or Product object with properties."
      },
      {
        topic: "Functions",
        learn: "Writing reusable blocks of parameterized code.",
        why: "Prevents repetition and organizes program execution.",
        apply: "Building a calculateTax(amount) or calculateAverage(scores) function."
      },
      {
        topic: "Debugging",
        learn: "Reading error tracebacks and using console.log().",
        why: "To find and fix logical bugs in execution.",
        apply: "Tracing why a grade average returns NaN."
      }
    ],
    logicPuzzles: [
      {
        id: "puz-1",
        title: "1. Even or Odd Checker",
        desc: "Write a script that checks a variable num and logs whether it is even or odd.",
        code: "const num = 42;\nif (num % 2 === 0) {\n  console.log(`${num} is Even`);\n} else {\n  console.log(`${num} is Odd`);\n}",
        output: "42 is Even"
      },
      {
        id: "puz-2",
        title: "2. Vowel Counter Algorithm",
        desc: "Create a string and write logic to count how many vowels (a, e, i, o, u) are inside it.",
        code: "const str = 'JavaScript Foundations';\nconst vowels = 'aeiouAEIOU';\nlet count = 0;\nfor (let char of str) {\n  if (vowels.includes(char)) count++;\n}\nconsole.log(`Vowel count: ${count}`);",
        output: "Vowel count: 7"
      },
      {
        id: "puz-3",
        title: "3. The Word Reverser",
        desc: "Take a word like 'JavaScript' and write code to print it backwards.",
        code: "const word = 'JavaScript';\nconst reversed = word.split('').reverse().join('');\nconsole.log(`Reversed: ${reversed}`);",
        output: "Reversed: tpircSavaJ"
      },
      {
        id: "puz-4",
        title: "4. Array Max Finder",
        desc: "Create an array of 5 numbers and write a script to find and log the largest number.",
        code: "const scores = [88, 94, 72, 99, 85];\nlet max = scores[0];\nfor (let score of scores) {\n  if (score > max) max = score;\n}\nconsole.log(`Highest Score: ${max}`);",
        output: "Highest Score: 99"
      },
      {
        id: "puz-5",
        title: "5. Palindrome Checker",
        desc: "Write a script that checks if a word (like 'radar') is the same forwards and backwards.",
        code: "function isPalindrome(word) {\n  const clean = word.toLowerCase();\n  const rev = clean.split('').reverse().join('');\n  return clean === rev;\n}\nconsole.log('radar is palindrome:', isPalindrome('radar'));",
        output: "radar is palindrome: true"
      }
    ],
    miniProjects: [
      {
        title: "1. Student Grade Analyzer",
        desc: "A program that takes an array of test scores, calculates the average grade, the highest grade, and checks if the class passed (average > 70).",
        concepts: ["Arrays", "for loops", "Variables", "Conditionals", "Math.max"],
        starterCode: "function analyzeGrades(scores) {\n  const total = scores.reduce((sum, s) => sum + s, 0);\n  const average = total / scores.length;\n  const highest = Math.max(...scores);\n  const passed = average >= 70;\n  return { average: average.toFixed(1), highest, passed };\n}\nconsole.log(analyzeGrades([85, 92, 78, 65, 88]));"
      },
      {
        title: "2. Simple Calculator Engine",
        desc: "Create a function calculate(num1, num2, operation) returning results for addition, subtraction, multiplication, or division.",
        concepts: ["Functions", "Parameters", "switch/case or if/else", "Error Handling"],
        starterCode: "function calculate(num1, num2, operation) {\n  switch(operation) {\n    case '+': return num1 + num2;\n    case '-': return num1 - num2;\n    case '*': return num1 * num2;\n    case '/': return num2 !== 0 ? num1 / num2 : 'Error: Division by zero';\n    default: return 'Invalid operation';\n  }\n}\nconsole.log('10 * 5 =', calculate(10, 5, '*'));"
      },
      {
        title: "3. Expense Tracker (Console Version)",
        desc: "Store an array of expense objects ({ name: 'Coffee', price: 5 }). Calculate total spent and identify the most expensive item.",
        concepts: ["Objects", "Arrays of Objects", "Accumulator Pattern", "Iteration"],
        starterCode: "const expenses = [\n  { name: 'Coffee', price: 5 },\n  { name: 'Textbook', price: 45 },\n  { name: 'Lunch', price: 15 }\n];\nconst total = expenses.reduce((sum, item) => sum + item.price, 0);\nconst priciest = expenses.reduce((max, item) => item.price > max.price ? item : max, expenses[0]);\nconsole.log(`Total Spent: $${total}, Most Expensive: ${priciest.name} ($${priciest.price})`);"
      },
      {
        title: "4. Number Guessing Game (Console State)",
        desc: "Game logic where computer picks a target number and evaluates a guess variable (too high, too low, or correct).",
        concepts: ["Comparison Operators", "Conditionals", "Math.random", "State Check"],
        starterCode: "function checkGuess(secret, guess) {\n  if (guess === secret) return '🎉 Correct! You guessed the number!';\n  if (guess > secret) return '📈 Too high! Try a lower number.';\n  return '📉 Too low! Try a higher number.';\n}\nconsole.log(checkGuess(42, 42));"
      }
    ],
    videoSubmission: [
      "Walkthrough: Show your code in VS Code / Editor and explain what the program is intended to do.",
      "Concept Check: Identify at least three concepts used (e.g. 'I used a for loop to iterate through this array').",
      "The Execution: Run the code in your terminal (node script.js) or browser console and show the output.",
      "The 'Why': Explain the logic behind your most difficult if statement or function return value."
    ],
    learningOutcomes: [
      "Use Variables (let, const) to store and update application state in memory.",
      "Write Conditional Logic (if/else, switch) to create smart decision-making programs.",
      "Utilize Loops (for, while, for...of) to iterate over datasets efficiently.",
      "Organize complex information using Arrays and Key-Value Objects.",
      "Build Reusable Functions with arguments and return values.",
      "Debug logical execution errors using console.log() and error tracebacks."
    ],
    resources: [
      { name: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", desc: "The gold standard documentation for everything JavaScript." },
      { name: "FreeCodeCamp JS Algorithms", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/", desc: "Interactive practice on basic syntax and data structures." },
      { name: "JavaScript.info", url: "https://javascript.info/", desc: "Excellent deep-dives into how the language works under the hood." },
      { name: "Scrimba (Learn JS)", url: "https://scrimba.com/learn/learnjavascript", desc: "Interactive video format letting you edit code inside the player." }
    ]
  },
  {
    id: "phase-3",
    phaseNumber: 3,
    title: "Phase 3: Bringing Your Websites to Life with JavaScript! 🧠⚡",
    subtitle: "Interactive Quiz Master App, DOM Manipulation, Events, Functions & Dynamic UI",
    status: "active",
    icon: "Zap",
    badge: "DOM Manipulation & Event Handling",
    deadlineDays: 12,
    masterVideo: {
      title: "Phase 3 Masterclass: JS DOM Interactivity & Event Handling",
      videoUrl: "https://www.youtube.com/embed/2IPEp_4obGw",
      duration: "JS DOM & Events Course",
      channel: "Web Dev Tutorial",
      description: "The official single best video tutorial covering querySelector, addEventListener, dynamic DOM updates, and building dynamic single-page applications."
    },
    videos: [
      {
        title: "Phase 3 Masterclass: JS DOM Interactivity & Event Handling",
        videoUrl: "https://www.youtube.com/embed/2IPEp_4obGw",
        duration: "JS DOM & Events Course",
        channel: "Web Dev Tutorial",
        description: "The official single best video tutorial covering querySelector, addEventListener, dynamic DOM updates, and building dynamic single-page applications."
      }
    ],
    introduction: {
      title: "1. Project Introduction: Your JavaScript Learning Adventure",
      welcomeMessage: "Welcome to Phase 3! You've successfully built the structure (HTML) and style (CSS) of websites. Now, get ready for the exciting part: making them interactive and smart! JavaScript (JS) is the programming language that makes websites dynamic by providing brains and the ability to react.",
      containedPages: [
        { name: "Start Page (index.html)", desc: "Welcome screen with 'Start Quiz' button using JS DOM events to initialize the quiz." },
        { name: "Quiz Page (quiz.html)", desc: "JS dynamically loads questions, presents multiple-choice answers, detects clicks, and navigates." },
        { name: "Results Page (results.html)", desc: "JS calculates & displays final score ('You got 7 out of 10 correct!') with 'Restart Quiz' button." }
      ],
      objective: "Build an interactive multi-page 'Interactive Quiz Master' application using DOM manipulation, event listeners, array of objects data structures, and conditional logic.",
      goldenRule: "Learn-then-apply cycle: Use F12 browser console and console.log() to debug state transitions, event triggers, and score counters."
    },
    quizFeatures: [
      {
        feature: "1. Starting the Quiz (Start Page / quiz.html)",
        concepts: "Variables, Functions, DOM Manipulation, Click Events",
        guidance: "Write a JS function that runs when 'Start Quiz' button is clicked to hide start screen and show question area.",
        resourceHint: "W3Schools: JS Variables, Functions, HTML DOM, Events"
      },
      {
        feature: "2. Storing Quiz Questions & Answers",
        concepts: "Arrays, Objects",
        guidance: "Create a JS Array where each item is an Object representing a question (text, choices, correctAnswer).",
        resourceHint: "MDN JS Guide: Arrays and Objects; freeCodeCamp"
      },
      {
        feature: "3. Displaying Questions & Options (quiz.html)",
        concepts: "Loops, Strings, Functions, DOM Manipulation",
        guidance: "Write a function that takes a question object from your array and dynamically updates HTML element text via .textContent.",
        resourceHint: "JavaScript.info: Loops: while & for, Strings, DOM Manipulation"
      },
      {
        feature: "4. Handling User Answers & Navigation",
        concepts: "Variables, Comparison Operators, Conditionals (if/else), Events",
        guidance: "Add click event listeners to answer choices. Compare selected answer to correctAnswer, update score, and advance question.",
        resourceHint: "W3Schools: JS If...Else, JS Operators, addEventListener"
      },
      {
        feature: "5. Calculating & Displaying Results (results.html)",
        concepts: "Variables, Strings, DOM Manipulation, Functions",
        guidance: "On results page, read final score and total questions to display 'You scored [score] out of [total]!' message.",
        resourceHint: "JS read URL parameters, DOM manipulation"
      },
      {
        feature: "6. Restarting the Quiz",
        concepts: "Functions, Variables, DOM Manipulation, Events",
        guidance: "Add a 'Restart Quiz' button that resets score and question index variables back to zero.",
        resourceHint: "Review Functions and DOM Manipulation"
      }
    ],
    conceptVideos: [
      {
        title: "Video Title 1: Your First JavaScript Project: A Simple Quiz App",
        cover: "Set up Quiz Master layout with HTML/CSS, link script file with <script>, select DOM elements with getElementById(), test with console.log().",
        questions: [
          "How do you link a JavaScript file using <script src='...'>?",
          "What is the Document Object Model (DOM)?",
          "How do you select an HTML element by ID using document.getElementById()?",
          "How can you test if JavaScript is working using console.log()?"
        ]
      },
      {
        title: "Video Title 2: Storing Quiz Questions with JavaScript Arrays and Objects",
        cover: "Create and organize quiz data using JavaScript arrays of question objects with key-value pairs.",
        questions: [
          "How do you declare an array in JavaScript?",
          "How do you create an object with key-value pairs?",
          "How can you store multiple question objects inside a single array?",
          "How do you access a specific question or answer choice?"
        ]
      },
      {
        title: "Video Title 3: Dynamically Displaying Questions with JavaScript",
        cover: "Create a function retrieving questions from data array and updating textContent/innerText on the page.",
        questions: [
          "How do you create a function in JavaScript?",
          "How do you change text content using .innerText or .textContent?",
          "How can you loop through an array of choices to render buttons?",
          "How do you call a function to execute it?"
        ]
      },
      {
        title: "Video Title 4: Checking User Answers and Keeping Score",
        cover: "Add click event listeners to answer choices, compare selected answer with if/else, update score counter, and give visual feedback.",
        questions: [
          "How do you add a click event listener using .addEventListener()?",
          "How do you use an if/else statement to check if an answer is correct?",
          "How do you declare and update a score variable?",
          "How can you give visual feedback (e.g. button color change) on click?"
        ]
      },
      {
        title: "Video Title 5: Calculating and Displaying Final Quiz Results",
        cover: "Track question index progress, display final score screen after last question, and add a 'Try Again' restart button.",
        questions: [
          "How do you keep track of current question index?",
          "How can you change CSS display property (none/block) to show/hide sections?",
          "How do you display final score on results screen?",
          "How can you add a 'Try Again' button to reset variables?"
        ]
      },
      {
        title: "Video Title 6: JavaScript Events: Adding Interactive Events to Your Quiz App",
        cover: "Enhance Quiz Master with click, mouseover, mouseout, and submit events.",
        questions: [
          "What is an event listener and how does it work?",
          "What is the difference between a 'click' event and a 'submit' event?",
          "How can you use 'mouseover' to change styling on hover?",
          "What is the event object passed to an event listener callback?"
        ]
      },
      {
        title: "Video Title 7: Enhancing Your Quiz App with DOM Manipulation",
        cover: "Dynamically create, update, and remove elements using document.createElement(), .appendChild(), and .classList.add()/remove().",
        questions: [
          "How do you create a new element using document.createElement()?",
          "How do you append a newly created element using .appendChild()?",
          "How can you add or remove CSS classes using .classList?",
          "How do you remove an element from the DOM?"
        ]
      }
    ],
    miniProjects: [
      {
        title: "1. Simple To-Do List App",
        desc: "Users type a task into an input field, add it to an <ul> list, click to toggle completion (line-through), and click a delete button.",
        concepts: ["Arrays", "Objects", "Functions", "DOM Manipulation", "event.preventDefault()"],
        tags: ["createElement", "appendChild", "event.preventDefault()", "classList.toggle"],
        videoTitle: "Video Title 8: JavaScript Mini-Project: A To-Do List App"
      },
      {
        title: "2. Building a Tip Calculator with JS Functions",
        desc: "Inputs for bill amount, tip percentage (15%, 20%), and number of people. Calculates tip per person and total cost per person.",
        concepts: ["Variables", "Data Types", "Math Operators", "Functions with Return Values", "DOM Inputs"],
        tags: ["Parameters vs Arguments", "return statement", "parseFloat", "toFixed(2)"],
        videoTitle: "Video Title 9: Understanding JavaScript Functions"
      },
      {
        title: "3. Building a Random Quote Generator",
        desc: "Clicking a button displays a random quote from an array using Math.random() and updates DOM text.",
        concepts: ["Arrays", "Math.random()", "Math.floor", "DOM Manipulation", "Debugging"],
        tags: ["Math.random()", "console.log()", "DevTools Debugging", "textContent"],
        videoTitle: "Video Title 10: How to Debug Your JavaScript Code"
      }
    ],
    videoSubmission: [
      "What you built: Briefly show the interactive part of the quiz demonstrated.",
      "Which JS concepts learned: Clearly state concepts used (Arrays, Objects, DOM manipulation, Events).",
      "Why techniques were used: Explain thought process behind score tracking and event handlers.",
      "Live Demonstration: Show feature working live in browser without notes during recording."
    ],
    learningOutcomes: [
      "Confidently write basic JavaScript code with good modular structure.",
      "Understand variables, data types, operators, strings, loops, arrays, objects, and functions.",
      "Manipulate the DOM dynamically to update text, HTML, and CSS classes.",
      "Create reusable functions to organize code.",
      "Handle user events like button clicks, form submissions, and mouse hovers.",
      "Perform basic debugging using browser DevTools F12 console and breakpoints."
    ],
    resources: [
      { name: "MDN Web Docs - JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", desc: "The official comprehensive documentation." },
      { name: "FreeCodeCamp - JS Algorithms", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/", desc: "Step-by-step interactive coding exercises." },
      { name: "JavaScript.info (Modern JS)", url: "https://javascript.info/", desc: "Detailed tutorials from basic syntax to advanced async JS." },
      { name: "Scrimba - Free JavaScript Course", url: "https://scrimba.com/learn/learnjavascript", desc: "Interactive video tutorials where you code inside the lesson player." }
    ],
    rubrics: [
      {
        parameter: "Understanding the Problem / Problem Articulation",
        weight: "10%",
        beginner: "Cannot clearly describe project; mixes up quiz flow; cannot say why JS is needed.",
        intermediate: "States main goal and mentions some JS role (buttons, navigation) but misses details.",
        advanced: "Explains project goal and feature roles; describes how JS makes pages interactive.",
        expert: "Connects project to learning outcomes; explains why JS concepts were chosen for usability."
      },
      {
        parameter: "Robustness",
        weight: "40%",
        beginner: "Quiz incomplete: only one page works; no score calculation; errors break app.",
        intermediate: "Quiz runs partially; Start/Next work inconsistently; partial score calculation.",
        advanced: "Quiz runs for all questions; Start, Next, Restart work; score updates accurately.",
        expert: "Fully functional: all features work smoothly; handles skipped or invalid answers gracefully; clean maintainable code."
      },
      {
        parameter: "Visual Appeal",
        weight: "10%",
        beginner: "Layout confusing or cluttered; text hard to read; buttons unaligned.",
        intermediate: "Basic layout with some consistency; buttons mostly readable; minor spacing issues.",
        advanced: "Layout consistent and organized; text/buttons clear; uniform spacing and colors.",
        expert: "Polished and intuitive UI/UX; color scheme and spacing enhance readability; interactive elements distinct."
      },
      {
        parameter: "Solution Explanation / Communication",
        weight: "10%",
        beginner: "Can only read code without explaining functionality; struggles to describe quiz flow.",
        intermediate: "Explains parts of code and basic flow (Start, Next, Results) with shallow reasoning.",
        advanced: "Explains project flow clearly; describes JS concepts applied (arrays, objects, DOM, events) and why.",
        expert: "Explains project comprehensively as if teaching a peer; describes score calculation, DOM manipulation, and edge cases."
      },
      {
        parameter: "Conceptual Clarity & Understanding of JS Concepts",
        weight: "30%",
        beginner: "Cannot explain purpose of variables, functions, arrays, objects; confused about DOM updates.",
        intermediate: "Explains some concepts like variables and functions; simple DOM updates.",
        advanced: "Explains most JS concepts clearly; understands arrays/objects storage and event handling.",
        expert: "Deep understanding of variables, arrays, objects, loops, functions, events, and DOM manipulation."
      }
    ]
  },
  {
    id: "phase-4",
    phaseNumber: 4,
    title: "Phase 4: AI-Powered Content Generator with Modern JS & Gemini API",
    subtitle: "Modern ES6+ JavaScript, Asynchronous fetch(), Promises & Google Gemini API Integration",
    status: "active",
    icon: "Sparkles",
    badge: "ES6+ & Gemini API",
    deadlineDays: 14,
    masterVideo: {
      title: "Phase 4 Video 1: Modern ES6+ JavaScript & Async Programming",
      videoUrl: "https://www.youtube.com/embed/D8HyB-W7ToI",
      duration: "ES6+ Full Course",
      channel: "Web Dev Tutorial",
      description: "The official video tutorial covering arrow functions, promises, async/await, and modern ES6+ JavaScript."
    },
    videos: [
      {
        title: "Phase 4 Video 1: Modern ES6+ JavaScript & Async Programming",
        videoUrl: "https://www.youtube.com/embed/D8HyB-W7ToI",
        duration: "ES6+ Full Course",
        channel: "Web Dev Tutorial",
        description: "The official video tutorial covering arrow functions, promises, async/await, and modern ES6+ JavaScript."
      },
      {
        title: "Phase 4 Video 2: Google Gemini AI API Integration & Full Tutorial",
        videoUrl: "https://www.youtube.com/embed/o5CfXCZoQhg",
        duration: "Gemini API Tutorial",
        channel: "Google Gemini Tutorial",
        description: "The official video tutorial on connecting frontend applications to Google Gemini AI API."
      }
    ],
    introduction: {
      title: "1. Project Introduction: Modern JS & Gemini AI Integration",
      welcomeMessage: "Welcome to Phase 4! You've built a solid foundation with HTML, CSS, and JavaScript. Now, it's time to supercharge your skills by exploring modern JavaScript (ES6+) and diving into the fascinating world of Artificial Intelligence by learning to interact with the Gemini API.",
      es6Explanation: "Why ES6? Think of ES6 (and later versions) as the modern toolkit for JavaScript developers. It introduces features that make your code more powerful, easier to read, and more efficient to write. Mastering ES6 is essential for building professional, up-to-date web applications. It's like upgrading from a basic toolbox to a state-of-the-art workshop!",
      apiExplanation: "What are APIs and how does Gemini fit in? APIs (Application Programming Interfaces) are like special messengers that allow different software applications to communicate and share information. The Gemini API is a powerful AI tool from Google that allows your applications to tap into advanced AI models for Q&A, text summarization, idea generation, and definition finding.",
      containedFeatures: [
        { name: "Ask Me Anything (Q&A)", desc: "Users can type a question, and your app fetches and displays an answer from Gemini in real-time." },
        { name: "Quick Summarizer", desc: "Users paste a block of text, and Gemini provides a concise summary with a 1-click clipboard copy feature." },
        { name: "Idea Spark", desc: "Users request creative suggestions (e.g. blog post ideas, story prompts) rendered as clean HTML lists." },
        { name: "Definition Finder", desc: "Users type a term, and Gemini provides a structured definition, code example, or explanation." }
      ],
      objective: "Combine your knowledge of modern JavaScript (ES6+) with the Gemini API to build an interactive web application that fetches and displays AI-generated content."
    },
    es6ConceptsTable: [
      { feature: "Declaring variables for UI elements, API keys, data", concept: "let, const", why: "For safer, block-scoped variable declarations. const for values that won't change, let for those that might." },
      { feature: "Writing event handlers (e.g. button clicks), helper functions", concept: "Arrow Functions (() => {})", why: "For a shorter syntax for functions, and predictable lexical scoping." },
      { feature: "Constructing prompt/query to send to Gemini, displaying responses", concept: "Template Literals (`${var}`)", why: "To easily embed variables and expressions into strings, making dynamic content creation clean and readable." },
      { feature: "Extracting specific data (e.g. answer text) from Gemini JSON response", concept: "Destructuring ({ text }, [first])", why: "To neatly pull out properties from objects or elements from arrays into their own variables." },
      { feature: "Handling multiple pieces of data or function arguments", concept: "Spread/Rest Operators (...args)", why: "Spread: expanding iterables (arrays/objects). Rest: collecting multiple function arguments into an array." },
      { feature: "Processing lists of suggestions from Gemini or transforming data", concept: "Array Methods (map, filter, reduce)", why: "For powerful and concise data manipulation without traditional for loops. map to transform, filter to select, reduce to aggregate." },
      { feature: "Managing asynchronous API calls without freezing the browser", concept: "Promises, fetch()", why: "fetch() returns a Promise representing eventual completion/failure, allowing your app to stay responsive." },
      { feature: "Sending requests to Gemini API and receiving AI content", concept: "fetch() with Gemini API", why: "The standard modern way to make network requests in JavaScript to get data from AI servers." }
    ],
    pageBreakdown: [
      {
        icon: "🤖",
        title: "Ask Me Anything (Q&A Module)",
        desc: "Interactive prompt input where users type any question and receive real-time AI answers with loading states and error fallbacks.",
        tags: ["const key", "arrow functions", "fetch()", "template literals", "async/await", "loading spinner"],
        maxTime: "90 minutes"
      },
      {
        icon: "📝",
        title: "Quick Text Summarizer",
        desc: "Large text input for pasting articles or notes, sending to Gemini with custom prompts, and copying summaries to clipboard.",
        tags: ["<textarea>", "navigator.clipboard", "prompt engineering", ".then() / .catch()", "DOM innerText"],
        maxTime: "90 minutes"
      },
      {
        icon: "💡",
        title: "Idea Spark Generator",
        desc: "Topic-based brainstorming tool that requests bulleted ideas from Gemini and parses them into dynamic HTML lists.",
        tags: ["Array.from()", "split() / map()", "destructuring", "DOM list injection", "refresh prompt"],
        maxTime: "75 minutes"
      },
      {
        icon: "📖",
        title: "Definition & Concept Finder",
        desc: "Technical dictionary powered by Gemini providing concise definitions, code snippets, and key takeaways.",
        tags: ["let query", "Spread operator", "try/catch block", "empty state check"],
        maxTime: "60 minutes"
      }
    ],
    miniProjects: [
      {
        title: "1. AI Joke Generator",
        desc: "Create a page with a button that fetches a short, clean joke from Gemini and displays it dynamically.",
        concepts: ["const for API endpoint", "Arrow function for click handler", "Template literal for prompt", "fetch()"],
        tags: ["const", "arrow functions", "template literals", "fetch()"],
        videoTitle: "Video Title 7: Building an AI Joke Generator with Modern JavaScript"
      },
      {
        title: "2. Gemini-Powered Quiz Helper",
        desc: "Input a topic (e.g. Photosynthesis) to fetch a custom question and answer generated by Gemini.",
        concepts: ["let for user input", "Template literals for prompt", "fetch()", "Destructuring question/answer"],
        tags: ["template literals", "destructuring", "array destructuring", "object parsing"],
        videoTitle: "Video Title 8: Building a Gemini-Powered Quiz Helper with Template Literals & Destructuring"
      },
      {
        title: "3. Daily Positive Affirmation Fetcher",
        desc: "Automatically fetch a positive affirmation from Gemini on page load and display it inside a card.",
        concepts: ["Arrow function for load listener", "fetch()", "Template literals", "const for display element"],
        tags: ["window.onload", "Math.random()", "const affirmations", "template literals"],
        videoTitle: "Video Title 9: ES6 Mini-Project: Daily Affirmation Generator"
      },
      {
        title: "4. Weather App with a Public API",
        desc: "Search city names to retrieve current temperature, weather conditions, and icons using a free public weather API.",
        concepts: ["Free public API sign-up", "API keys", "fetch() Promises", "Object destructuring", "Dynamic icons"],
        tags: ["public API key", "JSON parsing", "destructuring", "error fallbacks"],
        videoTitle: "Video Title 10: Building a Weather App with a Public API"
      }
    ],
    conceptVideos: [
      {
        title: "Video Title 1: What is an API? Your First Gemini API Call",
        cover: "Learn what APIs are and why they are used in web apps. Set up a Gemini API key and make your first successful fetch() request to display an AI-generated response.",
        questions: [
          "What is an API and why is it useful?",
          "What is an API key and why do you need one?",
          "What is the basic syntax of a fetch() request?",
          "How do you handle the response from an API call?"
        ]
      },
      {
        title: "Video Title 2: Building an AI-Powered 'Ask Me Anything' App",
        cover: "Build an AI-powered Q&A application where users enter a question, send it to Gemini, and display answers with loading states.",
        questions: [
          "How do you send user input to an API?",
          "How do you parse the JSON response from the Gemini API?",
          "How do you display the API's response on your webpage?",
          "How can you show a 'loading' message while waiting for the API response?"
        ]
      },
      {
        title: "Video Title 3: Creating a Quick Summarizer with the Gemini API",
        cover: "Build a text summarizer where users paste content into a textarea, send it to Gemini, and copy the concise summary to clipboard.",
        questions: [
          "How do you structure a prompt for the Gemini API to request a summary?",
          "How do you handle larger amounts of text being sent to the API?",
          "What are some ways to display the summarized text clearly to the user?",
          "How can you add a button to copy the summary to the clipboard?"
        ]
      },
      {
        title: "Video Title 4: Let's Build an 'Idea Spark' App with Gemini",
        cover: "Create an Idea Spark app where users enter a topic, send it to Gemini, and receive bulleted ideas rendered as an HTML list.",
        questions: [
          "How do you design a prompt that asks for creative ideas in a list format?",
          "How can you parse the API response to display the ideas as an HTML list?",
          "How can you add a feature to get new ideas on the same topic?",
          "What are the key components of the request body for the Gemini API?"
        ]
      },
      {
        title: "Video Title 5: ES6+ Features You Need to Know: let, const, and Arrow Functions",
        cover: "Explore modern JS features used throughout Gemini apps. Learn scope differences (var vs let/const) and arrow function syntax with implicit returns.",
        questions: [
          "What is the difference in scope between var, let, and const?",
          "When should you use let vs. const?",
          "How do you convert a regular function into an arrow function?",
          "What is the 'implicit return' feature of arrow functions?"
        ]
      },
      {
        title: "Video Title 6: Working with API Data: fetch(), Promises, and Array Methods",
        cover: "Deep dive into async requests with fetch() and Promises. Handle errors with .catch(), and transform API data using map(), filter(), and reduce().",
        questions: [
          "What does it mean for code to be 'asynchronous'?",
          "What is a Promise in JavaScript?",
          "How do you chain multiple .then() blocks to process a fetch() response?",
          "How does .catch() help you handle errors when an API call fails?",
          "What is the purpose of map(), filter(), and reduce() with API data?"
        ]
      },
      {
        title: "Video Title 7: Building an AI Joke Generator with Modern JavaScript",
        cover: "Build an AI Joke Generator where users click a button to request a joke from Gemini and display it using const, arrow functions, template literals, and fetch().",
        questions: [
          "How can you use const to store values such as API endpoints or DOM elements?",
          "How do you write an arrow function for a button click event listener?",
          "How can template literals be used to create dynamic prompts for Gemini?",
          "How do you use fetch() to send a request to Gemini and display the joke?"
        ]
      },
      {
        title: "Video Title 8: Building a Gemini-Powered Quiz Helper with Template Literals & Destructuring",
        cover: "Build a Quiz Helper app where users enter a topic and receive a generated question and answer using template literals and destructuring.",
        questions: [
          "What is the syntax for template literals and how do you embed variables in them?",
          "How does destructuring make it easier to access properties from an object?",
          "How can you destructure an array?",
          "How can template literals and destructuring be used together to format API responses?"
        ]
      },
      {
        title: "Video Title 9: ES6 Mini-Project: Daily Affirmation Generator",
        cover: "Build a simple page that automatically fetches a positive affirmation from Gemini when loaded and displays it using modern JS features.",
        questions: [
          "How can you use const to store an array of affirmations?",
          "How do you write an arrow function for your event listener?",
          "How do you select a random item from an array?",
          "How can you use template literals to display the affirmation in a sentence?"
        ]
      },
      {
        title: "Video Title 10: Building a Weather App with a Public API",
        cover: "Build a weather app where users enter a city name to fetch current temperature, conditions, and weather icons from a public REST API.",
        questions: [
          "How do you find and sign up for a free public API?",
          "How do you include an API key in your request securely?",
          "How do you parse weather data to find the information you need?",
          "How do you display weather information, including a weather icon?"
        ]
      }
    ],
    videoSubmission: [
      "Explain What You Built: Clearly describe the feature you're demonstrating (e.g. AI-powered Q&A feature).",
      "Identify ES6 Concepts Used: Point out specific ES6 concepts applied (let/const, arrow functions, template literals, destructuring). Explain why you chose them.",
      "Detail the Gemini API Call: Walk through how you made the call to Gemini using fetch(), structured the request body, and processed JSON.",
      "Live Demonstration: Show the feature working live in your browser without notes or external scripts during recording."
    ],
    learningOutcomes: [
      "Confidently use modern ES6+ JavaScript syntax (let/const, arrow functions, template literals, destructuring, spread/rest) for cleaner, efficient code.",
      "Effectively manipulate and transform data using ES6 array methods (map, filter, reduce).",
      "Understand and implement asynchronous JavaScript using Promises, async/await, and the fetch() API.",
      "Successfully integrate a third-party API (Google Gemini AI) into a frontend application to create dynamic interactive user experiences.",
      "Grasp the fundamentals of the client-server request/response cycle and JSON parsing.",
      "Build a functional, real-world application that leverages the power of Artificial Intelligence."
    ],
    resources: [
      { name: "Google AI for Developers - Gemini API", url: "https://ai.google.dev/docs/gemini_api_overview", desc: "Start here to understand how to make requests to Gemini models." },
      { name: "Gemini API Quickstart for Web", url: "https://ai.google.dev/tutorials/get_started_web", desc: "Official web quickstart guide for integrating Gemini." },
      { name: "MDN Web Docs - ES6+ Features", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", desc: "Guides on let/const, arrow functions, template literals, destructuring, and spread syntax." },
      { name: "MDN Web Docs - Using fetch() & Promises", url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API", desc: "Reference manual for making asynchronous HTTP requests in JavaScript." }
    ],
    rubrics: [
      {
        parameter: "Understanding the Problem",
        weight: "20%",
        beginner: "Uses ES6 and fetch() in a basic or incorrect way. Cannot clearly explain async code, Promises, or request-response-UI data flow.",
        intermediate: "Shows partial understanding of modern JS and API calls. Uses let/const and template literals but cannot fully justify choices or async behavior.",
        advanced: "Demonstrates clear understanding of ES6 and request/response cycle. Explains prompt engineering, fetch(), async/await, and parsing with confidence.",
        expert: "Deeply understands JS architecture, async design patterns, trade-offs (Promises vs async/await), error handling strategies, and scalability."
      },
      {
        parameter: "Technical Robustness",
        weight: "60%",
        beginner: "Code works only in ideal conditions. No input validation or error handling. Async code handled inconsistently; breaks on empty inputs or network issues.",
        intermediate: "Improving organizational skills with basic error handling and async/await. App works for normal cases but breaks under edge cases or invalid API responses.",
        advanced: "Stable, reliable app with thoughtful async handling, clean ES6 use, modular functions, loading states, error fallbacks, and safe destructuring.",
        expert: "Robust, scalable, professional implementation. Uses modular architecture, strict error handling, defensive validation, and elegant ES6 (spread/rest, map/filter/reduce)."
      },
      {
        parameter: "Solution Explanation",
        weight: "20%",
        beginner: "Cannot clearly explain why code was written the way it was. Reasoning is unclear or struggles to describe JS decisions.",
        intermediate: "Provides basic explanation of what was built and some reasoning behind choices, but lacks flow or user-centered thinking.",
        advanced: "Clearly explains technical and design decisions, connecting ES6 choices, async logic, and UI behavior. Articulates readability and UX improvements.",
        expert: "Offers thoughtful, precise, intuitive explanations. Justifies architectural choices, async handling, user flows, error handling, and UI design like a senior engineer."
      }
    ]
  },
  {
    id: "phase-5",
    phaseNumber: 5,
    title: "Phase 5: Your First Backend with Node.js, Express & Gemini AI 🚀",
    subtitle: "Server-Side JavaScript Runtime, Express REST Routing, Middleware, .env Security & Gemini AI Server Integration",
    status: "active",
    icon: "Server",
    badge: "Node.js & Express.js Backend",
    deadlineDays: 14,
    masterVideo: {
      title: "Phase 5 Masterclass: Node.js & Express.js Server Backend",
      videoUrl: "https://www.youtube.com/embed/pKJ4GGyDgJo",
      duration: "Node & Express Course",
      channel: "Web Dev Tutorial",
      description: "The official single best video tutorial covering Express servers, REST endpoints, CORS, dotenv environment security, and backend API integration."
    },
    videos: [
      {
        title: "Phase 5 Masterclass: Node.js & Express.js Server Backend",
        videoUrl: "https://www.youtube.com/embed/pKJ4GGyDgJo",
        duration: "Node & Express Course",
        channel: "Web Dev Tutorial",
        description: "The official single best video tutorial covering Express servers, REST endpoints, CORS, dotenv environment security, and backend API integration."
      }
    ],
    introduction: {
      title: "1. 📌 Project Introduction: The Server-Side Kitchen",
      welcomeMessage: "Welcome to Phase 5! You've done an amazing job mastering the frontend with HTML, CSS, and JavaScript. Now, get ready to explore the 'other side' of web development: the backend! In this phase, you'll learn how to build your own server using Node.js and Express.js, and even power it up with the Gemini AI API.",
      backendAnalogy: "What's 'Backend' Anyway? Think of a website like a restaurant. The frontend is everything customer-facing – the menu, tables, decor. The backend is the kitchen and staff working behind the scenes where food is prepared, orders managed, and ingredients stored.",
      toolsExplanation: "Node.js lets you write backend code in JavaScript. Express.js is a lightweight, flexible web framework offering a chef's toolkit for building APIs. Communication with Gemini AI is handled securely on the server so secret API keys are never exposed on client browsers.",
      containedFeatures: [
        { name: "'Ask Gemini' Full Stack App", desc: "User submits prompt on frontend -> Express backend receives request -> Backend calls Gemini API securely -> Returns AI answer to frontend." },
        { name: "Secure .env Configuration", desc: "API keys and environment variables are strictly isolated on Node.js server via dotenv package." },
        { name: "Express Middleware Pipeline", desc: "Built-in body-parser (express.json), CORS handling, and custom request logging middleware." },
        { name: "REST API Endpoint Design", desc: "Clean GET and POST endpoints (/api/ask-gemini, /fun-fact, /journal-prompt, /joke, /motivation)." }
      ],
      objective: "Build a full-stack web application 'Ask Gemini' featuring a custom Node.js/Express.js backend server that securely communicates with Google's Gemini AI API."
    },
    backendConceptsTable: [
      { feature: "Setting up your backend server", concept: "express() (initializing Express app)", why: "The starting point for creating your web server application." },
      { feature: "Handling requests from frontend (form submissions/queries)", concept: "Express routes (app.get(), app.post())", why: "Defines how server responds to URLs & HTTP verbs (GET for fetching data, POST for sending data)." },
      { feature: "Communicating with Gemini AI from server", concept: "fetch() / axios on Node.js backend", why: "Makes HTTP requests from your server to external APIs like Gemini without exposing keys to clients." },
      { feature: "Serving HTML, CSS, and frontend JS files", concept: "res.sendFile() / express.static", why: "Allows users' browsers to access and display frontend assets directly from your Express server." },
      { feature: "Keeping Gemini API key secret and secure", concept: ".env file & dotenv package", why: "Prevents exposing sensitive credentials in client-side code or public version control." },
      { feature: "Reading JSON payload sent from frontend", concept: "express.json() (middleware)", why: "Parses incoming HTTP request bodies (e.g. JSON payloads sent from frontend)." }
    ],
    pageBreakdown: [
      {
        icon: "⚡",
        title: "Node.js & Express Server Setup",
        desc: "Initialize project with `npm init -y`, install dependencies (`express`, `dotenv`, `cors`), and create a listening server on port 3000.",
        tags: ["express()", "app.listen(3000)", "require()", "npm scripts"],
        maxTime: "60 minutes"
      },
      {
        icon: "🔒",
        title: "Environment Security & API Protection",
        desc: "Store GEMINI_API_KEY inside `.env`, load configuration with `dotenv.config()`, and prevent key leaks to the client browser.",
        tags: [".env", "process.env.GEMINI_API_KEY", "dotenv", ".gitignore"],
        maxTime: "45 minutes"
      },
      {
        icon: "🔄",
        title: "Express REST Routes & Middleware",
        desc: "Implement POST /api/ask-gemini and GET endpoints using `express.json()`, `cors()`, and custom error handling middleware.",
        tags: ["app.post('/api/ask-gemini')", "req.body", "res.json()", "cors()"],
        maxTime: "90 minutes"
      },
      {
        icon: "🌐",
        title: "Frontend-Backend Integration",
        desc: "Connect frontend `fetch('http://localhost:3000/api/ask-gemini')` to backend server, rendering dynamic AI responses.",
        tags: ["fetch()", "async/await", "loading UI", "JSON parsing"],
        maxTime: "75 minutes"
      }
    ],
    miniProjects: [
      {
        title: "1. AI Fun Facts API",
        desc: "Express server with a GET `/fun-fact` endpoint. Calls Gemini API to fetch a random interesting fact and return JSON `{ \"fact\": \"...\" }`.",
        concepts: ["Express app.get()", "Custom logger middleware", "Gemini API integration", "Postman / Insomnia testing"],
        tags: ["app.get('/fun-fact')", "custom logger middleware", "res.json()", "Postman"],
        videoTitle: "Video Title 8: Introduction to Middleware in Express with an AI Fun Facts API"
      },
      {
        title: "2. AI Daily Journal Prompter",
        desc: "Frontend form sends user mood ('happy', 'stressed') via POST `/journal-prompt`. Express backend generates tailored journal prompts via Gemini.",
        concepts: ["express.static() for frontend files", "POST route body parsing", "Prompt engineering with req.body", "Dynamic DOM display"],
        tags: ["express.static('public')", "req.body.mood", "POST route", "res.json()"],
        videoTitle: "Video Title 9: Building an AI Daily Journal Prompter"
      },
      {
        title: "3. AI Helper Bot Backend",
        desc: "Multi-endpoint Express backend featuring `/joke` (GET), `/motivation` (GET), and `/tip-of-the-day` (GET) powered by Gemini AI.",
        concepts: ["Multi-route architecture", "process.env.PORT", "Render deployment preparation", "CORS & production setup"],
        tags: ["/joke", "/motivation", "/tip-of-the-day", "process.env.PORT", "Render"],
        videoTitle: "Video Title 10: Deploying an AI Helper Bot Backend"
      }
    ],
    conceptVideos: [
      {
        title: "Video Title 1: Your First Backend Server with Node.js and Express",
        cover: "Learn what Node.js and Express are. Set up a new Node project, install dependencies, organize directory structure, and launch a 'Hello World' server.",
        questions: [
          "What is Node.js and how does it allow JavaScript to run outside the browser?",
          "What is Express and why is it useful for building backend applications?",
          "How do you initialize a Node.js project using npm init -y?",
          "How do you install Express using npm install express?",
          "How do you create a basic Express server and make it listen on a port?",
          "What is the purpose of require('express'), const app = express(), and app.listen()?",
          "How should you organize project structure (server files, frontend files, config)?",
          "How can you verify that your Express server is running successfully?"
        ]
      },
      {
        title: "Video Title 2: Creating Your First API Endpoint",
        cover: "Expose server data through API endpoints. Build Express routes returning JSON data and test them via browser and Postman.",
        questions: [
          "What is an API endpoint (or route) and why is it important?",
          "How do you create a GET route in Express using app.get()?",
          "What is the purpose of the request (req) and response (res) objects?",
          "How do you send JSON data from an Express route using res.json()?",
          "What is the difference between sending plain text and JSON responses?",
          "How can you organize API endpoints using paths like /api/courses?",
          "How do you test an API endpoint in a browser vs Postman/Insomnia?"
        ]
      },
      {
        title: "Video Title 3: Connecting Your Frontend to Your Backend",
        cover: "Modify frontend code to call local Express backend endpoints instead of third-party URLs. Resolve CORS policies using cors middleware.",
        questions: [
          "How do you use fetch() in frontend code to call your own backend (http://localhost:3000/api)?",
          "What is CORS (Cross-Origin Resource Sharing) and why does it occur?",
          "How do you enable CORS in Express using cors middleware?",
          "How do you display data fetched from your backend on your frontend page?"
        ]
      },
      {
        title: "Video Title 4: Building an 'Ask Gemini' Web App with a Backend",
        cover: "Move Gemini API calls to the Express backend. Securely store secret keys in .env and create a POST route handling frontend prompts.",
        questions: [
          "Why is it more secure to call external APIs with secret keys from the backend?",
          "How do you set up a POST route in Express to receive data from frontend?",
          "How do you securely store your API key using environment variables (.env)?",
          "How do you make a fetch() request from within Node.js to communicate with Gemini?",
          "How do you process the Gemini response before returning it to frontend?",
          "What is the complete data flow: Frontend -> Backend -> Gemini -> Backend -> Frontend?"
        ]
      },
      {
        title: "Video Title 5: How to Handle User Input on the Backend",
        cover: "Parse incoming JSON request bodies, access parameters via req.body, and use input data to customize backend route logic.",
        questions: [
          "How do you configure Express to parse JSON bodies using express.json()?",
          "How do you access data sent from frontend using req.body?",
          "How can you use req.body data to customize logic in route handlers?",
          "What is the full flow from user submitting a form to backend processing?"
        ]
      },
      {
        title: "Video Title 6: Making API Calls from Your Node.js Server",
        cover: "Execute external HTTP requests directly from Node.js with async/await, handle errors gracefully, and return JSON responses.",
        questions: [
          "How does fetch() in Node.js compare to the browser environment?",
          "How do you use async/await to handle asynchronous API calls on the backend?",
          "How do you process and extract data from an external API response?",
          "How do you properly handle errors from an external API call within Express routes?",
          "How do you send data received from an external API back to frontend using res.json()?"
        ]
      },
      {
        title: "Video Title 7: Understanding Express Routes: GET and POST Requests",
        cover: "Compare GET vs POST HTTP verbs, inspect URL route parameters (req.params), and debug client-server communications.",
        questions: [
          "What is the fundamental difference between GET and POST requests?",
          "When should you use GET vs POST?",
          "What are URL parameters (/users/:id) and how do you access them via req.params?",
          "How can you use DevTools and server logs to inspect request/response payloads?"
        ]
      },
      {
        title: "Video Title 8: Introduction to Middleware in Express with an AI Fun Facts API",
        cover: "Understand Express middleware pipelines by building custom request loggers and a /fun-fact GET route calling Gemini AI.",
        questions: [
          "What is middleware in the context of Express?",
          "What are req, res, and next parameters in a middleware function?",
          "How do you tell Express to use middleware with app.use()?",
          "What happens if you forget to call next() in a middleware function?",
          "How do you create a GET endpoint returning random AI fun facts?"
        ]
      },
      {
        title: "Video Title 9: Building an AI Daily Journal Prompter",
        cover: "Serve static HTML/CSS/JS files via express.static(), receive user mood via POST /journal-prompt, and return AI journal prompts.",
        questions: [
          "What are 'static files' in a web application?",
          "How do you use express.static() built-in middleware?",
          "How does serving static files allow running frontend & backend from one server?",
          "How does backend generate journal prompts based on submitted mood?"
        ]
      },
      {
        title: "Video Title 10: Deploying an AI Helper Bot Backend",
        cover: "Prepare Node.js backend for cloud deployment on platforms like Render using package.json start scripts and process.env.PORT.",
        questions: [
          "What is deployment and why is it important for backend APIs?",
          "How do you prepare package.json start scripts for production?",
          "How do you handle port binding with process.env.PORT?",
          "How do you securely configure environment variables in cloud platforms like Render?"
        ]
      }
    ],
    videoSubmission: [
      "Show Your Code: Walk through your Node.js and Express server files, explaining route handlers and middleware.",
      "Live Demonstration: Run your server, make HTTP requests from frontend/Postman, and show live responses.",
      "Security & Environment Check: Demonstrate .env file usage and verify secret API keys are never exposed to the frontend.",
      "Independent Recording: Complete code walkthrough and live demo without reading from external notes or scripts."
    ],
    learningOutcomes: [
      "Build a functional web server using Node.js and Express.js.",
      "Understand client-server architecture and HTTP request/response lifecycles.",
      "Create RESTful API routes (GET, POST) handling JSON payloads and parameters.",
      "Connect backend servers to third-party services (Google Gemini API) using fetch/axios.",
      "Handle asynchronous operations safely with async/await and try/catch blocks.",
      "Securely manage sensitive credentials and API keys using .env files and dotenv.",
      "Gain confidence building full-stack web applications with Node.js and Express."
    ],
    resources: [
      { name: "Node.js Official Documentation", url: "https://nodejs.org/en/docs/", desc: "Official reference for Node.js runtime and modules." },
      { name: "Express.js Getting Started", url: "https://expressjs.com/en/starter/installing.html", desc: "Fast, unopinionated, minimalist web framework for Node.js." },
      { name: "Google AI Gemini API Node Quickstart", url: "https://ai.google.dev/tutorials/get_started_nodejs", desc: "Guide for making Gemini API calls from Node.js servers." },
      { name: "dotenv - Environment Variables Guide", url: "https://www.freecodecamp.org/news/how-to-use-node-environment-variables-with-a-dotenv-file/", desc: "Best practices for managing secret keys in Node.js." }
    ],
    rubrics: [
      {
        parameter: "Understanding the Problem / Backend Architecture Awareness",
        weight: "15%",
        beginner: "Cannot clearly explain why backend exists; thinks it is just another JS file (e.g. 'Frontend sends data... backend gives response').",
        intermediate: "Explains basic frontend -> backend flow but lacks deeper reasoning on client vs server responsibilities.",
        advanced: "Clearly explains client-server separation, why responsibilities must be distinct, and why API keys must stay on backend for security.",
        expert: "Fully understands backend architecture; confidently explains scalability, security, API protection, and real-world server responsibility."
      },
      {
        parameter: "Technical Robustness (Functionality, Stability & Structure)",
        weight: "40%",
        beginner: "Application breaks easily; no error handling; poor folder structure; API key exposed or mismanaged.",
        intermediate: "Basic error handling implemented; works in normal cases but fails in edge cases or network timeouts.",
        advanced: "Proper error handling, input validation, organized folder structure, and secure environment configuration.",
        expert: "Modular architecture, centralized error handling, graceful failure responses, production-level robust non-blocking I/O pipeline."
      },
      {
        parameter: "Conceptual Implementation (Backend Concepts & Async Logic)",
        weight: "30%",
        beginner: "Cannot clearly explain async/await, routing, or middleware; relies on copy-paste code.",
        intermediate: "Basic understanding of async/await, routing, and express middleware, but explanations are incomplete.",
        advanced: "Clearly explains request lifecycle, middleware flow, async behavior, HTTP verbs (GET/POST), and environment variables.",
        expert: "Deep technical mastery of Express request pipelines, event loop, middleware execution order, REST standards, and environment isolation."
      },
      {
        parameter: "Solution Explanation",
        weight: "15%",
        beginner: "Struggles to explain system flow; reads code line-by-line without high-level logic.",
        intermediate: "Explains basic request-response flow but lacks structured architectural reasoning.",
        advanced: "Clearly explains full frontend -> backend -> external API -> response cycle with confidence.",
        expert: "Explains system like a backend engineer; discusses scalability, deployment (Render), security, and future enhancements."
      }
    ]
  },
  {
    id: "phase-6",
    phaseNumber: 6,
    title: "Phase 6: Your First Database with MongoDB & Mongoose! 💾",
    subtitle: "NoSQL Database Engineering, Mongoose Schemas & Models, Atlas Cloud Cluster, CRUD Operations & Full-Stack Integration",
    status: "active",
    icon: "Database",
    badge: "MongoDB & Mongoose Database",
    deadlineDays: 14,
    masterVideo: {
      title: "Phase 6 Masterclass: MongoDB & Mongoose Database Engineering",
      videoUrl: "https://www.youtube.com/embed/30p9QfybWZg",
      duration: "MongoDB Full Course",
      channel: "Web Dev Tutorial",
      description: "The official single best video tutorial covering MongoDB Atlas cloud setup, Mongoose schemas, document models, and full CRUD operations."
    },
    videos: [
      {
        title: "Phase 6 Masterclass: MongoDB & Mongoose Database Engineering",
        videoUrl: "https://www.youtube.com/embed/30p9QfybWZg",
        duration: "MongoDB Full Course",
        channel: "Web Dev Tutorial",
        description: "The official single best video tutorial covering MongoDB Atlas cloud setup, Mongoose schemas, document models, and full CRUD operations."
      }
    ],
    introduction: {
      title: "1. 📌 Project Introduction: Persistent Data with MongoDB & Mongoose",
      welcomeMessage: "Welcome to Phase 6! You've come so far, building frontends and even your own backend servers with Node.js and Express. Now, it's time to tackle one of the most crucial parts of almost any web application: databases! In this phase, you'll learn how to store, retrieve, and manage data using MongoDB and Mongoose.",
      backendAnalogy: "What are Databases and Why Are They So Important? Imagine any useful app you use – a social media site, an online store, a to-do list. They all need to remember information! This information is stored in a database. A database is an organized collection of data, making it easy to manage, access, and update.",
      toolsExplanation: "MongoDB is a NoSQL document database storing data in JSON-like documents. Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js that manages relationships between data, provides schema validation, and translates code to database operations.",
      containedFeatures: [
        { name: "Student Feedback Manager", desc: "Full stack CRUD app allowing students to submit feedback, view all submissions, update comments, and delete records persistent in MongoDB." },
        { name: "Mongoose Schema & Model", desc: "Define structured schemas with field types, required validations, default values, and timestamps." },
        { name: "MongoDB Atlas Cloud Cluster", desc: "Connect Express backend to hosted MongoDB Atlas cluster securely using connection strings in .env." },
        { name: "Complete CRUD Endpoints", desc: "Implement Create (.save()), Read (.find()), Update (.findByIdAndUpdate()), and Delete (.findByIdAndDelete()) routes." }
      ],
      objective: "Build a full-stack web application 'Student Feedback Manager' using Express, Mongoose, and MongoDB Atlas to master database persistence."
    },
    backendConceptsTable: [
      { feature: "Connecting Node/Express to MongoDB", concept: "mongoose.connect(process.env.MONGODB_URI)", why: "Establishes a persistent connection stream to your local or cloud database." },
      { feature: "Defining data structure and field rules", concept: "new mongoose.Schema({...})", why: "Enforces data validation, default values, required fields, and data types before saving." },
      { feature: "Creating document interface for querying", concept: "mongoose.model('Feedback', schema)", why: "Provides built-in query methods like find(), save(), update, and delete." },
      { feature: "Saving new records to database", concept: "const doc = new Model(...); await doc.save();", why: "Persists new documents to the database collection asynchronously." },
      { feature: "Fetching stored records", concept: "await Model.find() / await Model.findById()", why: "Retrieves matching documents from MongoDB to send back to client/frontend." },
      { feature: "Updating or deleting documents", concept: "await Model.findByIdAndUpdate() / findByIdAndDelete()", why: "Modifies existing database entries or removes them cleanly by unique _id." }
    ],
    mainProject: {
      title: "Main Project: Student Feedback Manager",
      desc: "A full-stack feedback portal using Express and Mongoose where users create, read, update, and delete feedback items stored in MongoDB.",
      pages: [
        { name: "Submit Feedback Form", desc: "Form with fields for student name, topic, rating (1-5), and feedback comments." },
        { name: "Feedback Feed & Filter", desc: "Displays list of stored feedbacks fetched from GET /api/feedback with real-time updates." },
        { name: "Edit & Delete Controls", desc: "Allows updating feedback ratings/text or deleting feedback entries permanently." }
      ]
    },
    miniProjects: [
      {
        title: "Mini Project 1: Simple Contact Form Collector",
        desc: "Build a contact form backend endpoint POST /submit-contact and GET /contacts storing entries in a Contact Mongoose schema.",
        tasks: [
          "Create Contact schema with name (String, required), email (String, required), message (String).",
          "Create POST /submit-contact endpoint to validate and save entries with .save().",
          "Create GET /contacts endpoint returning all submitted contact requests."
        ]
      },
      {
        title: "Mini Project 2: Basic Student Progress Tracker",
        desc: "Create a Progress model storing student phase status and completion percentages.",
        tasks: [
          "Design ProgressSchema with studentName, phaseNumber (Number), isCompleted (Boolean), score (Number).",
          "Implement GET /api/progress and POST /api/progress endpoints.",
          "Add route PUT /api/progress/:id to update completion status when student passes a phase."
        ]
      },
      {
        title: "Mini Project 3: Quick Notes Saver App",
        desc: "Build a persistent notes app backend with title, content, tags, and createdAt timestamps.",
        tasks: [
          "Create NoteSchema with title, body, category tags, and timestamps.",
          "Implement GET /notes and POST /notes endpoints.",
          "Add DELETE /notes/:id route using findByIdAndDelete()."
        ]
      }
    ],
    videoAssignments: [
      {
        title: "Video Title 1: What is MongoDB & Setting Up MongoDB Atlas Cloud",
        cover: "Explain NoSQL databases vs SQL databases, set up a free MongoDB Atlas cloud cluster, and get your connection URI.",
        questions: [
          "What is the core difference between SQL (relational) and NoSQL (document) databases?",
          "What is MongoDB Atlas and why is cloud hosting beneficial?",
          "How do you obtain your MongoDB connection string from Atlas?",
          "Why must you store your MongoDB connection string in a .env file?"
        ]
      },
      {
        title: "Video Title 2: Connecting Express to MongoDB with Mongoose",
        cover: "Install Mongoose in your Node.js project and establish a connection using mongoose.connect() with environment variables.",
        questions: [
          "What is Mongoose and what role does it play between Express and MongoDB?",
          "How do you install mongoose and dotenv via npm?",
          "How do you handle connection success and connection error events in Mongoose?",
          "Why is process.env.MONGODB_URI used instead of hardcoding database credentials?"
        ]
      },
      {
        title: "Video Title 3: Creating Your First Mongoose Schema & Model",
        cover: "Define a Mongoose Schema with validation (required, type, default) and compile it into a Mongoose Model.",
        questions: [
          "What is the difference between a Mongoose Schema and a Mongoose Model?",
          "How do you define data types like String, Number, Boolean, and Date in a Schema?",
          "How do you mark a field as required or specify a default value?",
          "Why is schema validation important before saving data to MongoDB?"
        ]
      },
      {
        title: "Video Title 4: Implementing Create (C) - Saving New Data with .save()",
        cover: "Build a POST endpoint in Express that extracts body data and saves a new document to MongoDB using .save().",
        questions: [
          "How do you extract JSON body data sent from a frontend form in Express?",
          "How do you instantiate a new model object with req.body data?",
          "Why must database operation .save() be awaited inside an async route handler?",
          "How do you catch and return validation errors if required fields are missing?"
        ]
      },
      {
        title: "Video Title 5: Implementing Read (R) - Querying Data with .find()",
        cover: "Build GET endpoints in Express to retrieve all documents with .find() or specific items with .findById().",
        questions: [
          "How does await Model.find() retrieve documents from a collection?",
          "How do you filter documents by specific conditions (e.g. category or status)?",
          "How does Mongoose handle querying by ID using req.params.id?",
          "What JSON response format should be sent back to the client?"
        ]
      },
      {
        title: "Video Title 6: Implementing Update (U) - Modifying Data with .findByIdAndUpdate()",
        cover: "Build a PUT or PATCH endpoint to update existing MongoDB documents cleanly.",
        questions: [
          "What is the purpose of findByIdAndUpdate() in Mongoose?",
          "Why is the { new: true } option important when updating a document?",
          "How do you pass updated field data from req.body to the database?",
          "How do you return a 404 status code if the document ID does not exist?"
        ]
      },
      {
        title: "Video Title 7: Implementing Delete (D) - Removing Data with .findByIdAndDelete()",
        cover: "Build a DELETE endpoint to remove records from MongoDB by ID and return confirmation response.",
        questions: [
          "How does findByIdAndDelete() remove a document from MongoDB?",
          "What status code (e.g. 200 or 204) is appropriate after successful deletion?",
          "How do you handle attempts to delete non-existent IDs gracefully?",
          "How does deleting data impact frontend UI state updates?"
        ]
      },
      {
        title: "Video Title 8: Mini Project 1 - Simple Contact Form Collector with MongoDB",
        cover: "Build a dedicated contact form submission pipeline storing records persistent in MongoDB.",
        questions: [
          "How do you design a Contact model with name, email, and message fields?",
          "How do you validate email formats or required fields in Mongoose?",
          "How do you test your contact endpoints using Postman or frontend form?",
          "How does database persistence prevent data loss on server restarts?"
        ]
      },
      {
        title: "Video Title 9: Mini Project 2 - Student Progress Tracker",
        cover: "Create a student progress tracking system storing phase completion data in database records.",
        questions: [
          "How do you structure schema fields for tracking progress and scores?",
          "How do you update student progress records when a phase is marked complete?",
          "How do you calculate overall completion statistics from stored documents?",
          "How do frontend dashboards consume database REST API endpoints?"
        ]
      },
      {
        title: "Video Title 10: Mini Project 3 - Quick Notes Saver App Backend",
        cover: "Build a complete CRUD notes application backend with title, body, timestamps, and delete features.",
        questions: [
          "How do schema timestamps ({ timestamps: true }) automatically add createdAt and updatedAt?",
          "How do you implement full CRUD operations (Create, Read, Update, Delete) for notes?",
          "How do you secure connection URI credentials when pushing code to GitHub?",
          "What best practices ensure clean Mongoose error handling across all API routes?"
        ]
      }
    ],
    videoSubmission: [
      "Show Your Database Connection: Demonstrate connecting your Express server to MongoDB Atlas cloud via process.env.MONGODB_URI.",
      "Schema & Model Code Walkthrough: Explain your Mongoose schemas, data validation rules, and exported models.",
      "Live CRUD Operations Demo: Demonstrate Creating, Reading, Updating, and Deleting records via Postman or your frontend app.",
      "Independent Explanation: Walk through backend code and live MongoDB Atlas dashboard data updates without reading from external notes."
    ],
    learningOutcomes: [
      "Understand NoSQL database concepts and document-based data storage.",
      "Connect Express backend applications to MongoDB Atlas cloud database clusters.",
      "Design structured Mongoose Schemas with field types, required constraints, and defaults.",
      "Master complete CRUD operations (Create, Read, Update, Delete) using Mongoose methods.",
      "Build production-ready RESTful APIs backed by persistent database storage.",
      "Secure sensitive database URIs and credentials with environment variables.",
      "Connect frontend interfaces seamlessly to backend database REST endpoints."
    ],
    resources: [
      { name: "MongoDB Official Documentation", url: "https://www.mongodb.com/docs/", desc: "Official reference manual for MongoDB database." },
      { name: "Mongoose ODM Documentation", url: "https://mongoosejs.com/docs/guide.html", desc: "Complete guide for Mongoose schema creation and query models." },
      { name: "MongoDB Atlas Cloud Setup Guide", url: "https://www.mongodb.com/docs/atlas/getting-started/", desc: "Step-by-step tutorial on creating free cluster in MongoDB Atlas." },
      { name: "Express + MongoDB REST API Tutorial", url: "https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose", desc: "MDN guide on using Express with Mongoose for database engineering." }
    ],
    rubrics: [
      {
        parameter: "Understanding the Problem / Database Architecture Awareness",
        weight: "15%",
        beginner: "Struggles to explain why databases are needed; confuses local variables/arrays with persistent database storage.",
        intermediate: "Understands database basic concept but cannot explain NoSQL vs SQL or MongoDB Atlas connection setup clearly.",
        advanced: "Clearly explains document databases, Mongoose ODM role, Atlas cloud hosting, and why URI credentials must be protected in .env.",
        expert: "Deeply articulates database architecture, schema design choices, indexing, connection pooling, and scalable full-stack data flow."
      },
      {
        parameter: "Technical Robustness (Functionality, Schema Validation & Stability)",
        weight: "40%",
        beginner: "Database connection fails frequently; no schema validation; CRUD endpoints crash server on invalid input or bad IDs.",
        intermediate: "Schema exists with basic types; CRUD operations work for ideal cases but fail on missing fields or invalid ObjectId formats.",
        advanced: "Proper schema validations (required, default), robust error handling for bad IDs/invalid payloads, clean connection handling.",
        expert: "Production-grade schema design, centralized Mongoose error handling middleware, graceful fallback on database disconnects."
      },
      {
        parameter: "Conceptual Implementation (Mongoose CRUD & Async Database Logic)",
        weight: "30%",
        beginner: "Cannot explain difference between Schema and Model; struggles to write async/await calls for .save() or .find().",
        intermediate: "Can write basic Mongoose queries but relies heavily on copy-paste; unclear on findByIdAndUpdate options like { new: true }.",
        advanced: "Confidently implements and explains .save(), .find(), findByIdAndUpdate(), and findByIdAndDelete() with async/await.",
        expert: "Mastery of Mongoose querying, schema middlewares, timestamps, population, and error handling pattern best practices."
      },
      {
        parameter: "Solution Explanation",
        weight: "15%",
        beginner: "Cannot explain full cycle from frontend form submission to database storage in MongoDB Atlas.",
        intermediate: "Explains basic backend route to database flow but lacks clarity on model methods or asynchronous execution.",
        advanced: "Clearly explains full data lifecycle: Frontend UI -> Express REST API -> Mongoose Model -> MongoDB Atlas -> Response.",
        expert: "Explains system like a database/backend engineer, highlighting security, persistence, scalability, and API robustness."
      }
    ]
  },
  {
    id: "phase-7",
    phaseNumber: 7,
    title: "Phase 7: Final Full-Stack Capstone Project with AI Integration 🚀",
    subtitle: "CollabSphere - AI-Powered Developer Collaboration Platform (Full-Stack MERN + Gemini AI + JWT + Multer + Deployment)",
    status: "active",
    icon: "Sparkles",
    badge: "Full-Stack Capstone + Gemini AI",
    deadlineDays: 21,
    masterVideo: {
      title: "Phase 7 Masterclass: Full-Stack SaaS & Gemini AI Architecture",
      videoUrl: "https://www.youtube.com/embed/pKJ4GGyDgJo",
      duration: "Full-Stack Capstone",
      channel: "Web Dev Tutorial",
      description: "The complete capstone guide explaining full-stack SaaS architecture, JWT authentication, Mongoose relations, Multer file processing, and Google Gemini AI endpoints."
    },
    videos: [
      {
        title: "Phase 7 Masterclass: Full-Stack SaaS & Gemini AI Architecture",
        videoUrl: "https://www.youtube.com/embed/pKJ4GGyDgJo",
        duration: "Full-Stack Capstone",
        channel: "Web Dev Tutorial",
        description: "The complete capstone guide explaining full-stack SaaS architecture, JWT authentication, Mongoose relations, Multer file processing, and Google Gemini AI endpoints."
      }
    ],
    introduction: {
      title: "1. 📌 Project Introduction: CollabSphere – AI-Powered Developer Collaboration Platform",
      welcomeMessage: "Welcome to Phase 7, your final capstone project! You've built frontends, backends, and databases. Now it's time to assemble everything into a production-grade SaaS platform: CollabSphere. CollabSphere combines features of GitHub and Notion, supercharged with Google's Gemini AI.",
      backendAnalogy: "Why This Project Is Placement Worthy: Building CollabSphere proves you can engineer a complete real-world SaaS app from scratch: user auth (JWT + bcrypt), project permissions, database schemas, file uploads (Multer), markdown documentation, and direct Gemini AI API endpoints.",
      toolsExplanation: "CollabSphere leverages Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcrypt, SimpleMDE, Multer, and Google Gemini AI (/api/gemini/explain, /docs, /readme).",
      containedFeatures: [
        { name: "User Auth System (JWT & bcrypt)", desc: "Secure registration, salted password hashing, JWT sessions, and protected route middleware." },
        { name: "Project Collaboration Dashboard", desc: "Create projects, define scopes, invite team members, and manage access levels." },
        { name: "Markdown Notes with Gemini AI", desc: "SimpleMDE editor storing notes in MongoDB with one-click Gemini AI explanations & suggestions." },
        { name: "File Upload & Code Preview", desc: "Upload code files and assets with Multer, preview code, and generate Gemini AI code explanations." },
        { name: "Contribution Analytics & Public Share", desc: "Track project member activity and generate public read-only project pages with Gemini auto-generated READMEs." }
      ],
      objective: "Build and deploy CollabSphere — a placement-worthy full-stack developer collaboration platform with Gemini AI integration."
    },
    backendConceptsTable: [
      { feature: "User Authentication & Authorization", concept: "bcrypt.js + jsonwebtoken (JWT)", why: "Hashes passwords securely and issues signed JWT tokens for protected route access." },
      { feature: "Multi-User Project Relationships", concept: "Mongoose Ref & Populate (User & Project Models)", why: "Links projects to owner and invited member IDs for collaboration permissions." },
      { feature: "Markdown Notes Storage & AI Enhancement", concept: "SimpleMDE + /api/gemini/explain & /suggest", why: "Provides rich document creation with inline AI assistance for note optimization." },
      { feature: "File Uploads & Code Parsing", concept: "Multer Middleware + File Storage", why: "Handles multipart file uploads and sends raw code snippets to Gemini for AI analysis." },
      { feature: "Gemini AI Endpoint Suite", concept: "Express Controller -> Gemini API Client", why: "Exposes secure server endpoints (/api/gemini/explain, /docs, /readme) without exposing API keys." },
      { feature: "Public Project Access & Analytics", concept: "Public Read-Only Routes & Aggregation Queries", why: "Calculates member contribution stats and provides shareable project overview links." }
    ],
    mainProject: {
      title: "Main Project: CollabSphere Platform",
      desc: "A full-stack SaaS application integrating JWT authentication, project workspaces, markdown note editor, file uploads, contribution analytics, public share links, and Gemini AI endpoints.",
      pages: [
        { name: "Authentication Portal (Login / Register)", desc: "Secure forms with client-side validation and JWT token persistence in browser storage." },
        { name: "Developer Workspace Dashboard", desc: "Displays user projects, member lists, contribution metrics, and quick project creation." },
        { name: "Project Workspace & Markdown Editor", desc: "SimpleMDE note editor with live preview, Gemini AI explain/suggest buttons, and file manager." },
        { name: "Public Shareable Project View", desc: "Read-only shareable project showcase featuring Gemini-generated README files." }
      ]
    },
    miniProjects: [
      {
        title: "Mini Project 1: User Authentication System",
        desc: "Build a standalone Node/Express application with registration, login, bcrypt password hashing, JWT generation, and protected routes.",
        tasks: [
          "Create User Mongoose schema with email (unique, required) and password (hashed).",
          "Implement POST /api/auth/register and POST /api/auth/login.",
          "Write authMiddleware verifying JWT Bearer token on protected routes."
        ]
      },
      {
        title: "Mini Project 2: Collaborative Markdown Note App",
        desc: "Create a web app integrating SimpleMDE editor to save and retrieve markdown notes from MongoDB.",
        tasks: [
          "Integrate SimpleMDE editor on frontend.",
          "Design NoteSchema (title, content, projectId, author).",
          "Implement GET /api/notes and POST /api/notes endpoints."
        ]
      },
      {
        title: "Mini Project 3: Gemini-powered README Generator",
        desc: "Build an app collecting project details to generate a complete draft README.md via Gemini API.",
        tasks: [
          "Create web form for project name, tech stack, and feature descriptions.",
          "Build POST /api/gemini/readme endpoint constructing prompt for Gemini API.",
          "Display generated markdown response with copy-to-clipboard functionality."
        ]
      }
    ],
    videoAssignments: [
      {
        title: "Video 1: User Registration & Login (Auth System)",
        cover: "Demonstrate user registration, bcrypt password hashing, JWT generation, and route protection middleware.",
        questions: [
          "Why is password hashing with bcrypt essential before storing passwords in MongoDB?",
          "What is a JSON Web Token (JWT) and how is it used to authenticate subsequent API requests?",
          "How does authMiddleware verify JWT tokens in incoming HTTP headers?",
          "What HTTP status code should be returned when an unauthenticated user accesses a protected route?"
        ]
      },
      {
        title: "Video 2: Project Creation & Member Addition",
        cover: "Walk through creating projects, defining project scope, and adding registered collaborators to projects.",
        questions: [
          "How does the Project schema maintain relationships between project owner and invited members?",
          "How do you query MongoDB to fetch all projects where a user is either owner or member?",
          "How do you prevent unauthorized users from adding members to a project they do not own?",
          "What UX feedback indicates successful project creation and member invitation?"
        ]
      },
      {
        title: "Video 3: Markdown Notes - CRUD Operations",
        cover: "Showcase creating, editing, viewing, and deleting project notes using SimpleMDE and MongoDB persistence.",
        questions: [
          "How does SimpleMDE integrate into frontend HTML/JS forms for markdown editing?",
          "How are markdown notes linked to a specific projectId in MongoDB?",
          "How do you update existing note content in the database using findByIdAndUpdate()?",
          "How do you ensure users can only edit notes in projects they belong to?"
        ]
      },
      {
        title: "Video 4: Gemini Integration with Markdown Notes",
        cover: "Demonstrate Gemini AI buttons for note explanation ('Explain this note') and improvement suggestions.",
        questions: [
          "How does the POST /api/gemini/explain route receive note text and call Gemini API?",
          "How do you construct effective prompts to get actionable code/note suggestions from Gemini?",
          "How is Gemini AI response data parsed and rendered back to the user in the UI?",
          "How do you handle API errors gracefully if Gemini service is delayed or rate limited?"
        ]
      },
      {
        title: "Video 5: File Upload & Preview with Gemini Code Explanation",
        cover: "Demonstrate uploading code/image files with Multer, previewing contents, and requesting Gemini code explanations.",
        questions: [
          "How does Multer middleware handle multipart/form-data file uploads in Express?",
          "How are uploaded file paths or URLs stored in the MongoDB File schema?",
          "How does the backend pass uploaded code contents to Gemini for automated code explanations?",
          "What security measures prevent users from uploading executable or malicious server files?"
        ]
      },
      {
        title: "Video 6: Contribution Analytics Dashboard",
        cover: "Demonstrate tracking member activity (notes created, files uploaded) and rendering analytics summary graphics.",
        questions: [
          "How do MongoDB aggregation queries count notes and files created per user?",
          "How is activity metrics data formatted and sent to the frontend dashboard?",
          "How do visual progress bars or charts improve project manager insight?",
          "How do real-time updates keep team contribution analytics synchronized?"
        ]
      },
      {
        title: "Video 7: Public Shareable Project Page & Gemini README Generation",
        cover: "Demonstrate creating unique public project links and auto-generating project README files via Gemini API.",
        questions: [
          "How do read-only public routes expose specific project details without requiring authentication?",
          "How does POST /api/gemini/readme construct structured prompts from project description and tech stack?",
          "How can users preview and download the Gemini-generated README.md file?",
          "What distinguishes a public read-only view from an authenticated workspace?"
        ]
      }
    ],
    videoSubmission: [
      "Minimum 7 Feature Videos: Record short 2-5 min videos for each major feature (Auth, Projects, Notes, Gemini AI, Files, Analytics, Public Share).",
      "Demonstrate Gemini AI Endpoints: Specifically show and explain how Gemini API enhances notes, code explanations, and README generation.",
      "Live Working Walkthrough: Show full-stack functionality live in action across UI, Express backend, and MongoDB Atlas.",
      "Independent & Clear Presentation: Explain architectural decisions, endpoints, and data flows naturally without reading external scripts."
    ],
    learningOutcomes: [
      "Design, develop, and deploy a full-stack web application from scratch.",
      "Implement secure user authentication and authorization using JWT and bcrypt.",
      "Manage complex data relationships using MongoDB and Mongoose.",
      "Build robust RESTful APIs with Node.js and Express.js.",
      "Integrate third-party AI APIs (specifically Google Gemini) to add intelligent features.",
      "Handle file uploads and storage securely and efficiently using Multer.",
      "Implement real-time or near real-time collaboration features.",
      "Create responsive and interactive user interfaces.",
      "Understand and apply best practices for project structure and code organization.",
      "Effectively troubleshoot and debug issues across the full stack.",
      "Articulate and demonstrate complex technical features and their implementation."
    ],
    resources: [
      { name: "Node.js Official Documentation", url: "https://nodejs.org/en/docs/", desc: "Official reference manual for Node.js runtime." },
      { name: "Express.js Routing & Middleware Guide", url: "https://expressjs.com/en/starter/installing.html", desc: "Web framework manual for building REST endpoints." },
      { name: "MongoDB & Mongoose ODM Documentation", url: "https://mongoosejs.com/docs/guide.html", desc: "Schema design, model associations, and database queries." },
      { name: "Google AI Gemini API Documentation", url: "https://ai.google.dev/docs", desc: "Official reference for Gemini API models and prompt engineering." },
      { name: "bcrypt.js & JWT Authentication Best Practices", url: "https://www.npmjs.com/package/jsonwebtoken", desc: "Secure password hashing and token authorization." },
      { name: "Multer File Upload Middleware for Node.js", url: "https://www.npmjs.com/package/multer", desc: "Handling multipart form data file uploads in Express." }
    ],
    rubrics: [
      {
        parameter: "Understanding the Problem & System Architecture Awareness",
        weight: "15%",
        beginner: "Cannot clearly explain system architecture or purpose of AI integration; limited understanding of how parts communicate.",
        intermediate: "Understands frontend/backend/database basics but struggles to explain scalability, AI workflows, or authentication flow clearly.",
        advanced: "Clearly explains architecture, authentication flow, API structure, database usage, and why AI is integrated into the application.",
        expert: "Demonstrates strong architectural understanding, explaining scalable application flow, AI request lifecycle, modular backend design, and production-level system thinking."
      },
      {
        parameter: "Technical Robustness (Functionality, Stability & Structure)",
        weight: "40%",
        beginner: "Major functionality broken; unstable backend/frontend integration; authentication missing or incomplete; project crashes frequently.",
        intermediate: "Core features work partially; authentication/basic CRUD implemented but error handling and structure are weak.",
        advanced: "Stable full-stack implementation with working authentication, CRUD operations, AI integration, modular routes/models, and structured APIs.",
        expert: "Production-style implementation with scalable architecture, strong error handling, secure authentication, modular backend structure, clean API organization, deployment readiness, and optimized workflows."
      },
      {
        parameter: "Conceptual Implementation (Full-Stack + AI Concepts)",
        weight: "30%",
        beginner: "Cannot clearly explain authentication, APIs, database relationships, or AI integration concepts; mostly copy-paste understanding.",
        intermediate: "Basic understanding of JWT, APIs, schemas, and AI requests but explanations are incomplete or partially correct.",
        advanced: "Clearly explains JWT authentication, bcrypt hashing, middleware, MongoDB relationships, API requests/responses, and Gemini API integration.",
        expert: "Demonstrates deep conceptual clarity regarding secure authentication, REST APIs, middleware flow, database relationships, AI prompt handling, API optimization, and full-stack architecture principles."
      },
      {
        parameter: "Solution Explanation (Project Flow & AI/Data Lifecycle)",
        weight: "15%",
        beginner: "Cannot explain complete project flow or how requests move through the system.",
        intermediate: "Understands basic request-response cycle but struggles to explain AI flow or authentication lifecycle completely.",
        advanced: "Clearly explains frontend -> backend -> database -> AI API -> frontend lifecycle with proper request handling.",
        expert: "Demonstrates strong understanding of complete application lifecycle including authentication validation, middleware execution, database queries, AI request/response processing, and frontend rendering flow."
      }
    ]
  }
];


