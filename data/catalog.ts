// Public academic catalog: School → Year → Course → Professor.
// Static, so logged-out visitors can browse it without any database read.
//
// SAMPLE DATA. School names are IE University's schools; every professor,
// biography and course below is FICTIONAL and does not describe real IE staff.
//
// Edit the SCHOOLS list to add, rename or reorder schools. `color` picks the
// folder colour on the home page (one of the brand colours in globals.css).

export type FolderColor = "blue" | "orange" | "sky" | "neon" | "coffee" | "cream";

export type School = {
  id: string;
  name: string;
  short: string;
  color: FolderColor;
  description: string;
};

export type Course = {
  id: string;
  code: string;
  name: string;
  schoolId: string;
  year: 1 | 2 | 3 | 4;
  summary: string;
  covers: string[];
  assessment: { label: string; weight: number }[];
};

export type Professor = {
  id: string;
  name: string;
  title: string;
  schoolId: string;
  courseIds: string[];
  bio: string;
};

export const SCHOOLS: School[] = [
  {
    id: "spega",
    name: "IE School of Politics, Economics & Global Affairs",
    short: "SPEGA",
    color: "blue",
    description: "Politics, economics, international relations and global affairs.",
  },
  {
    id: "business",
    name: "IE Business School",
    short: "Business",
    color: "orange",
    description: "Management, finance, marketing and strategy.",
  },
  {
    id: "humanities",
    name: "IE School of Humanities",
    short: "Humanities",
    color: "sky",
    description: "Writing, history, philosophy and the arts.",
  },
  {
    id: "architecture-design",
    name: "IE School of Architecture & Design",
    short: "Architecture & Design",
    color: "neon",
    description: "Architecture, design studios and visual communication.",
  },
  {
    id: "law",
    name: "IE Law School",
    short: "Law",
    color: "coffee",
    description: "Legal systems, contracts, business law and human rights.",
  },
  {
    id: "science-technology",
    name: "IE School of Science & Technology",
    short: "Science & Tech",
    color: "cream",
    description: "Data, computing, statistics and the ethics of technology.",
  },
];

export const YEARS = [1, 2, 3, 4] as const;

// Course and professor names marked "existing reviews" must not change:
// reviews already in the database refer to them by name.
export const COURSES: Course[] = [
  // SPEGA
  {
    id: "intro-microeconomics", code: "ECO 101", name: "Introduction to Microeconomics", schoolId: "spega", year: 1, // existing reviews
    summary: "How households and firms make decisions, and how markets bring those decisions together.",
    covers: ["Supply, demand and elasticity", "Consumer choice", "Costs and market structures", "Market failures"],
    assessment: [{ label: "Final exam", weight: 50 }, { label: "Midterm", weight: 25 }, { label: "Problem sets", weight: 15 }, { label: "Participation", weight: 10 }],
  },
  {
    id: "international-relations-theory", code: "IR 110", name: "International Relations Theory", schoolId: "spega", year: 1, // existing reviews
    summary: "The main schools of thought that explain how states and other actors behave.",
    covers: ["Realism and liberalism", "Constructivism", "Critical approaches", "Theory applied to current events"],
    assessment: [{ label: "Essay", weight: 40 }, { label: "Final exam", weight: 40 }, { label: "Seminar participation", weight: 20 }],
  },
  {
    id: "global-political-economy", code: "IR 220", name: "Global Political Economy", schoolId: "spega", year: 2,
    summary: "How politics and economics interact across borders: trade, money and development.",
    covers: ["Trade policy", "The international monetary system", "Globalisation debates"],
    assessment: [{ label: "Research paper", weight: 50 }, { label: "Final exam", weight: 30 }, { label: "Presentation", weight: 20 }],
  },
  {
    id: "comparative-politics", code: "POL 310", name: "Comparative Politics", schoolId: "spega", year: 3,
    summary: "Why political systems differ, and what difference it makes.",
    covers: ["Democracies and autocracies", "Electoral systems", "Parties and movements"],
    assessment: [{ label: "Country case study", weight: 50 }, { label: "Final exam", weight: 50 }],
  },
  {
    id: "development-economics", code: "ECO 410", name: "Development Economics Seminar", schoolId: "spega", year: 4,
    summary: "Research seminar on growth, poverty and policy in developing economies.",
    covers: ["Growth theories", "Poverty measurement", "Policy evaluation"],
    assessment: [{ label: "Seminar paper", weight: 70 }, { label: "Discussion lead", weight: 30 }],
  },

  // Business
  {
    id: "financial-accounting", code: "ACC 101", name: "Financial Accounting", schoolId: "business", year: 1,
    summary: "Reading and preparing the financial statements every business relies on.",
    covers: ["The balance sheet", "Income statement", "Cash flow statement", "Ratio analysis"],
    assessment: [{ label: "Final exam", weight: 60 }, { label: "Quizzes", weight: 25 }, { label: "Participation", weight: 15 }],
  },
  {
    id: "corporate-finance", code: "FIN 210", name: "Corporate Finance", schoolId: "business", year: 2, // existing reviews
    summary: "How companies decide which projects to invest in and how to fund them.",
    covers: ["Time value of money", "Capital budgeting", "Risk and return", "Capital structure"],
    assessment: [{ label: "Final exam", weight: 50 }, { label: "Case studies", weight: 30 }, { label: "Quizzes", weight: 20 }],
  },
  {
    id: "marketing-management", code: "MKT 220", name: "Marketing Management", schoolId: "business", year: 2,
    summary: "Understanding customers and building products, prices and campaigns around them.",
    covers: ["Segmentation and positioning", "Pricing", "Brand strategy"],
    assessment: [{ label: "Group project", weight: 50 }, { label: "Final exam", weight: 35 }, { label: "Participation", weight: 15 }],
  },
  {
    id: "operations-management", code: "OPS 310", name: "Operations Management", schoolId: "business", year: 3,
    summary: "How organisations design processes that deliver on time and on budget.",
    covers: ["Process design", "Inventory", "Quality management"],
    assessment: [{ label: "Simulation game", weight: 40 }, { label: "Final exam", weight: 60 }],
  },
  {
    id: "strategy-capstone", code: "STR 410", name: "Strategy Capstone", schoolId: "business", year: 4,
    summary: "Teams advise a (fictional) company on a real strategic decision.",
    covers: ["Competitive analysis", "Corporate strategy", "Presenting to a board"],
    assessment: [{ label: "Team consulting report", weight: 60 }, { label: "Final presentation", weight: 40 }],
  },

  // Humanities
  {
    id: "academic-writing", code: "HUM 101", name: "Academic Writing & Rhetoric", schoolId: "humanities", year: 1,
    summary: "Building clear arguments in writing and in speech.",
    covers: ["Structuring an argument", "Using sources", "Persuasive speaking"],
    assessment: [{ label: "Portfolio of essays", weight: 70 }, { label: "Speech", weight: 30 }],
  },
  {
    id: "history-of-ideas", code: "HUM 210", name: "History of Ideas", schoolId: "humanities", year: 2,
    summary: "Key ideas that shaped the modern world, read in their original texts.",
    covers: ["Enlightenment thinkers", "Political philosophy", "Ideas of progress"],
    assessment: [{ label: "Essays", weight: 60 }, { label: "Oral exam", weight: 40 }],
  },
  {
    id: "philosophy-of-technology", code: "HUM 320", name: "Philosophy of Technology", schoolId: "humanities", year: 3,
    summary: "What technology does to how we live, work and think.",
    covers: ["Tools and human nature", "Automation and work", "Attention and media"],
    assessment: [{ label: "Essay", weight: 50 }, { label: "Debate", weight: 20 }, { label: "Final exam", weight: 30 }],
  },
  {
    id: "humanities-research-seminar", code: "HUM 410", name: "Humanities Research Seminar", schoolId: "humanities", year: 4,
    summary: "Students design and write an independent research project.",
    covers: ["Research questions", "Archival and textual methods", "Writing a long paper"],
    assessment: [{ label: "Research paper", weight: 80 }, { label: "Presentation", weight: 20 }],
  },

  // Architecture & Design
  {
    id: "design-thinking", code: "DES 101", name: "Design Thinking & Innovation", schoolId: "architecture-design", year: 1, // existing reviews
    summary: "A human-centred process for understanding problems and prototyping solutions.",
    covers: ["User research", "Problem framing", "Ideation", "Prototyping and testing"],
    assessment: [{ label: "Team project", weight: 60 }, { label: "Reflection journal", weight: 25 }, { label: "Participation", weight: 15 }],
  },
  {
    id: "visual-communication", code: "DES 110", name: "Visual Communication Studio", schoolId: "architecture-design", year: 1,
    summary: "Typography, layout and visual hierarchy through weekly studio briefs.",
    covers: ["Typography", "Grids and layout", "Colour"],
    assessment: [{ label: "Portfolio", weight: 70 }, { label: "Critiques", weight: 30 }],
  },
  {
    id: "architectural-drawing", code: "ARC 210", name: "Architectural Drawing", schoolId: "architecture-design", year: 2,
    summary: "Hand and digital drawing as tools for thinking about space.",
    covers: ["Plans, sections and elevations", "Perspective", "Digital drafting"],
    assessment: [{ label: "Drawing portfolio", weight: 80 }, { label: "Participation", weight: 20 }],
  },
  {
    id: "urban-design-studio", code: "ARC 320", name: "Urban Design Studio", schoolId: "architecture-design", year: 3,
    summary: "Designing streets, squares and neighbourhoods for the people who use them.",
    covers: ["Site analysis", "Public space", "Mobility"],
    assessment: [{ label: "Studio project", weight: 70 }, { label: "Juries", weight: 30 }],
  },
  {
    id: "final-design-project", code: "DES 410", name: "Final Design Project", schoolId: "architecture-design", year: 4,
    summary: "A year-long project from brief to finished design.",
    covers: ["Brief writing", "Iteration", "Exhibition"],
    assessment: [{ label: "Final project", weight: 80 }, { label: "Process book", weight: 20 }],
  },

  // Law
  {
    id: "business-law", code: "LAW 101", name: "Business Law Fundamentals", schoolId: "law", year: 1, // existing reviews
    summary: "The legal framework businesses operate in: contracts, companies and liability.",
    covers: ["Contract basics", "Company law", "Liability", "Intellectual property"],
    assessment: [{ label: "Final exam", weight: 60 }, { label: "Case analyses", weight: 40 }],
  },
  {
    id: "legal-systems", code: "LAW 110", name: "Introduction to Legal Systems", schoolId: "law", year: 1,
    summary: "How civil law and common law systems work, and how courts reason.",
    covers: ["Sources of law", "Civil vs common law", "Reading judgments"],
    assessment: [{ label: "Final exam", weight: 70 }, { label: "Case brief", weight: 30 }],
  },
  {
    id: "contract-law", code: "LAW 210", name: "Contract Law", schoolId: "law", year: 2,
    summary: "Formation, interpretation and breach of contracts.",
    covers: ["Offer and acceptance", "Interpretation", "Remedies"],
    assessment: [{ label: "Final exam", weight: 60 }, { label: "Moot exercise", weight: 40 }],
  },
  {
    id: "human-rights-law", code: "LAW 320", name: "International Human Rights Law", schoolId: "law", year: 3,
    summary: "How human rights are protected by treaties, courts and institutions.",
    covers: ["Treaty systems", "Regional courts", "Enforcement"],
    assessment: [{ label: "Research memo", weight: 50 }, { label: "Final exam", weight: 50 }],
  },
  {
    id: "legal-clinic", code: "LAW 410", name: "Legal Clinic", schoolId: "law", year: 4,
    summary: "Supervised practical work on (fictional) client cases.",
    covers: ["Client interviews", "Drafting", "Professional ethics"],
    assessment: [{ label: "Casework", weight: 70 }, { label: "Reflection", weight: 30 }],
  },

  // Science & Technology
  {
    id: "data-analytics-python", code: "DAT 120", name: "Data Analytics with Python", schoolId: "science-technology", year: 1, // existing reviews
    summary: "Hands-on introduction to cleaning, analysing and visualising data with Python.",
    covers: ["Python fundamentals", "pandas", "Exploratory analysis", "Data visualisation"],
    assessment: [{ label: "Group project", weight: 40 }, { label: "Weekly labs", weight: 30 }, { label: "Final exam", weight: 30 }],
  },
  {
    id: "statistics-decisions", code: "STA 140", name: "Statistics for Decision Making", schoolId: "science-technology", year: 1,
    summary: "Probability and statistical inference for decisions under uncertainty.",
    covers: ["Descriptive statistics", "Probability", "Hypothesis testing", "Regression"],
    assessment: [{ label: "Final exam", weight: 50 }, { label: "Midterm", weight: 30 }, { label: "Assignments", weight: 20 }],
  },
  {
    id: "algorithms", code: "CS 210", name: "Algorithms & Data Structures", schoolId: "science-technology", year: 2,
    summary: "Designing efficient programs and reasoning about their cost.",
    covers: ["Sorting and searching", "Graphs", "Complexity"],
    assessment: [{ label: "Programming assignments", weight: 50 }, { label: "Final exam", weight: 50 }],
  },
  {
    id: "machine-learning", code: "CS 320", name: "Machine Learning Foundations", schoolId: "science-technology", year: 3,
    summary: "Core ideas behind models that learn from data.",
    covers: ["Supervised learning", "Model evaluation", "Neural networks basics"],
    assessment: [{ label: "Project", weight: 50 }, { label: "Final exam", weight: 50 }],
  },
  {
    id: "ethics-technology", code: "TEC 410", name: "Ethics in Technology", schoolId: "science-technology", year: 4,
    summary: "Ethical questions raised by data, algorithms and automation.",
    covers: ["Privacy", "Algorithmic bias", "Accountability"],
    assessment: [{ label: "Essay", weight: 60 }, { label: "Participation", weight: 40 }],
  },
];

export const PROFESSORS: Professor[] = [
  // SPEGA
  {
    id: "elena-marin", name: "Prof. Elena Marín", title: "Associate Professor of Economics", schoolId: "spega", // existing reviews
    courseIds: ["intro-microeconomics", "global-political-economy"],
    bio: "Sample bio. An economist who studies how small firms respond to new regulation. Known for building lectures around one worked example per week.",
  },
  {
    id: "lucia-herrera", name: "Prof. Lucía Herrera", title: "Professor of International Relations", schoolId: "spega", // existing reviews
    courseIds: ["international-relations-theory", "comparative-politics"],
    bio: "Sample bio. A political scientist focused on regional organisations. Runs seminars as structured debates with assigned roles.",
  },
  {
    id: "tomas-reyes", name: "Prof. Tomás Reyes", title: "Lecturer in Political Economy", schoolId: "spega",
    courseIds: ["global-political-economy", "development-economics"],
    bio: "Sample bio. Previously worked as a (fictional) policy analyst on trade agreements before moving into teaching.",
  },

  // Business
  {
    id: "marco-bellini", name: "Prof. Marco Bellini", title: "Associate Professor of Finance", schoolId: "business", // existing reviews
    courseIds: ["corporate-finance", "operations-management"],
    bio: "Sample bio. A former (fictional) corporate treasury analyst. Teaches with spreadsheets open and cases drawn from invented companies.",
  },
  {
    id: "priya-raman", name: "Prof. Priya Raman", title: "Assistant Professor of Marketing", schoolId: "business",
    courseIds: ["marketing-management", "strategy-capstone"],
    bio: "Sample bio. Researches how people choose between similar products. Brings guest speakers into most units.",
  },
  {
    id: "hannah-whitcombe", name: "Prof. Hannah Whitcombe", title: "Lecturer in Accounting", schoolId: "business",
    courseIds: ["financial-accounting"],
    bio: "Sample bio. A chartered accountant by background who likes to explain every statement line by line.",
  },

  // Humanities
  {
    id: "clara-vennemann", name: "Prof. Clara Vennemann", title: "Associate Professor of Philosophy", schoolId: "humanities",
    courseIds: ["academic-writing", "philosophy-of-technology"],
    bio: "Sample bio. Writes about attention and digital media. Gives detailed written feedback on every draft.",
  },
  {
    id: "owen-prichard", name: "Prof. Owen Prichard", title: "Lecturer in Intellectual History", schoolId: "humanities",
    courseIds: ["history-of-ideas", "humanities-research-seminar"],
    bio: "Sample bio. A historian of eighteenth-century ideas who teaches mostly through close reading of primary texts.",
  },

  // Architecture & Design
  {
    id: "sarah-lindqvist", name: "Prof. Sarah Lindqvist", title: "Lecturer in Innovation", schoolId: "architecture-design", // existing reviews
    courseIds: ["design-thinking", "final-design-project"],
    bio: "Sample bio. A service designer who has run (fictional) design sprints for public libraries and hospitals.",
  },
  {
    id: "ingrid-solberg", name: "Prof. Ingrid Solberg", title: "Lecturer in Visual Communication", schoolId: "architecture-design",
    courseIds: ["visual-communication"],
    bio: "Sample bio. A graphic designer specialising in type. Studio sessions end with a short group critique.",
  },
  {
    id: "kenji-arai", name: "Prof. Kenji Arai", title: "Associate Professor of Architecture", schoolId: "architecture-design",
    courseIds: ["architectural-drawing", "urban-design-studio"],
    bio: "Sample bio. An architect interested in small public spaces. Expects sketchbooks at every class.",
  },

  // Law
  {
    id: "javier-ortega", name: "Prof. Javier Ortega", title: "Lecturer in Business Law", schoolId: "law", // existing reviews
    courseIds: ["business-law", "contract-law"],
    bio: "Sample bio. A former (fictional) in-house lawyer who teaches law through contracts students actually read in class.",
  },
  {
    id: "amelie-fournier", name: "Prof. Amélie Fournier", title: "Assistant Professor of International Law", schoolId: "law",
    courseIds: ["legal-systems", "human-rights-law"],
    bio: "Sample bio. Researches regional human rights courts. Uses short weekly case briefs instead of one big exam.",
  },

  // Science & Technology
  {
    id: "david-okafor", name: "Prof. David Okafor", title: "Assistant Professor of Data Science", schoolId: "science-technology", // existing reviews
    courseIds: ["data-analytics-python", "algorithms"],
    bio: "Sample bio. A data scientist who codes live in every class and shares all notebooks afterwards.",
  },
  {
    id: "amara-nwosu", name: "Prof. Amara Nwosu", title: "Assistant Professor of Statistics", schoolId: "science-technology",
    courseIds: ["statistics-decisions", "machine-learning", "ethics-technology"],
    bio: "Sample bio. A statistician working on fair evaluation of predictive models. Office hours are run as open problem-solving sessions.",
  },
];
