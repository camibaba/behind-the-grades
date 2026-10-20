// Public academic catalog. Static, so logged-out visitors can browse it without any
// database read. SAMPLE DATA: universities, schools and degrees are placeholders to
// replace later; professors and courses are fictional and do not describe real people.
//
// The hierarchy is flexible: a degree may belong to a school or directly to a
// university (schoolId omitted), and a course may be part of several degrees.

export type University = {
  id: string;
  name: string;
  city: string;
  description: string;
};

export type School = {
  id: string;
  universityId: string;
  name: string;
  description: string;
};

export type Degree = {
  id: string;
  universityId: string;
  schoolId?: string;
  name: string;
  level: "Bachelor" | "Master";
  years: number;
  description: string;
};

export type Course = {
  id: string;
  code: string;
  name: string;
  degreeIds: string[];
  year?: number;
  credits?: number;
  summary: string;
  covers: string[];
  assessment: { label: string; weight?: number }[];
  inClass: string[];
  skills: string[];
};

export type Professor = {
  id: string;
  name: string;
  title: string;
  courseIds: string[];
};

export const universities: University[] = [
  {
    id: "sample-university",
    name: "Sample University",
    city: "Madrid",
    description: "Placeholder university organised into schools, each offering its own degrees.",
  },
  {
    id: "example-institute",
    name: "Example Institute of Design",
    city: "Segovia",
    description: "Placeholder institute without schools: its degrees sit directly under the institute.",
  },
];

export const schools: School[] = [
  {
    id: "business",
    universityId: "sample-university",
    name: "School of Business",
    description: "Management, finance, economics and law for business.",
  },
  {
    id: "global-affairs",
    universityId: "sample-university",
    name: "School of Global Affairs",
    description: "Politics, international relations and political economy.",
  },
  {
    id: "science-technology",
    universityId: "sample-university",
    name: "School of Science & Technology",
    description: "Data, computing and quantitative methods.",
  },
];

export const degrees: Degree[] = [
  {
    id: "bba",
    universityId: "sample-university",
    schoolId: "business",
    name: "Bachelor in Business Administration",
    level: "Bachelor",
    years: 4,
    description: "A broad business degree covering economics, finance, law and innovation.",
  },
  {
    id: "international-relations",
    universityId: "sample-university",
    schoolId: "global-affairs",
    name: "Bachelor in International Relations",
    level: "Bachelor",
    years: 4,
    description: "Theory and practice of global politics, diplomacy and political economy.",
  },
  {
    id: "data-business-analytics",
    universityId: "sample-university",
    schoolId: "science-technology",
    name: "Bachelor in Data & Business Analytics",
    level: "Bachelor",
    years: 4,
    description: "Programming, statistics and analytics applied to business decisions.",
  },
  {
    id: "design",
    universityId: "example-institute",
    name: "Bachelor in Design",
    level: "Bachelor",
    years: 4,
    description: "Studio-based design degree combining visual communication and innovation methods.",
  },
];

export const courses: Course[] = [
  {
    id: "intro-microeconomics",
    code: "ECO 101",
    name: "Introduction to Microeconomics",
    degreeIds: ["bba", "international-relations"],
    year: 1,
    credits: 6,
    summary: "How households and firms make decisions, and how markets bring those decisions together.",
    covers: ["Supply, demand and elasticity", "Consumer choice", "Costs and market structures", "Market failures and public policy"],
    assessment: [{ label: "Final exam", weight: 50 }, { label: "Midterm exam", weight: 25 }, { label: "Problem sets", weight: 15 }, { label: "Participation", weight: 10 }],
    inClass: ["Lectures with worked examples", "Weekly problem-solving sessions", "Short in-class quizzes"],
    skills: ["Economic reasoning", "Graphical analysis", "Basic quantitative modelling"],
  },
  {
    id: "data-analytics-python",
    code: "DAT 120",
    name: "Data Analytics with Python",
    degreeIds: ["data-business-analytics", "bba"],
    year: 1,
    credits: 6,
    summary: "Hands-on introduction to cleaning, analysing and visualising data with Python.",
    covers: ["Python fundamentals", "pandas for data wrangling", "Exploratory data analysis", "Charts and storytelling with data"],
    assessment: [{ label: "Group project", weight: 40 }, { label: "Weekly labs", weight: 30 }, { label: "Final exam", weight: 30 }],
    inClass: ["Live coding", "Lab exercises in pairs", "Project check-ins"],
    skills: ["Python", "Data cleaning", "Data visualisation", "Teamwork"],
  },
  {
    id: "international-relations-theory",
    code: "IR 110",
    name: "International Relations Theory",
    degreeIds: ["international-relations"],
    year: 1,
    credits: 6,
    summary: "The major schools of thought that explain how states and other actors behave.",
    covers: ["Realism and liberalism", "Constructivism", "Critical approaches", "Applying theory to current events"],
    assessment: [{ label: "Essay", weight: 40 }, { label: "Final exam", weight: 40 }, { label: "Seminar participation", weight: 20 }],
    inClass: ["Seminar discussions", "Assigned readings each week", "Student-led debates"],
    skills: ["Critical reading", "Academic writing", "Argumentation"],
  },
  {
    id: "corporate-finance",
    code: "FIN 210",
    name: "Corporate Finance",
    degreeIds: ["bba"],
    year: 2,
    credits: 6,
    summary: "How companies decide which projects to invest in and how to fund them.",
    covers: ["Time value of money", "Capital budgeting", "Risk and return", "Capital structure and dividends"],
    assessment: [{ label: "Final exam", weight: 50 }, { label: "Case studies", weight: 30 }, { label: "Quizzes", weight: 20 }],
    inClass: ["Lectures", "Case discussions", "Spreadsheet exercises"],
    skills: ["Financial modelling", "Valuation", "Spreadsheet skills"],
  },
  {
    id: "design-thinking",
    code: "INN 150",
    name: "Design Thinking & Innovation",
    degreeIds: ["bba", "design"],
    year: 1,
    credits: 4,
    summary: "A human-centred process for understanding problems and prototyping solutions.",
    covers: ["User research and empathy", "Problem framing", "Ideation methods", "Prototyping and testing"],
    assessment: [{ label: "Team project", weight: 60 }, { label: "Reflection journal", weight: 25 }, { label: "Participation", weight: 15 }],
    inClass: ["Workshops", "Team sprints", "Prototype presentations"],
    skills: ["Creative problem solving", "Presenting", "Collaboration"],
  },
  {
    id: "business-law",
    code: "LAW 130",
    name: "Business Law Fundamentals",
    degreeIds: ["bba"],
    year: 1,
    credits: 4,
    summary: "The legal framework businesses operate in: contracts, companies and liability.",
    covers: ["Contract law", "Company law", "Liability and torts", "Intellectual property basics"],
    assessment: [{ label: "Final exam", weight: 60 }, { label: "Case analyses", weight: 40 }],
    inClass: ["Lectures", "Case analysis in small groups"],
    skills: ["Legal reasoning", "Reading contracts"],
  },
  {
    id: "statistics-decisions",
    code: "STA 140",
    name: "Statistics for Decision Making",
    degreeIds: ["data-business-analytics", "bba"],
    year: 1,
    credits: 6,
    summary: "Probability and statistical inference for making decisions under uncertainty.",
    covers: ["Descriptive statistics", "Probability", "Hypothesis testing", "Linear regression"],
    assessment: [{ label: "Final exam", weight: 50 }, { label: "Midterm exam", weight: 30 }, { label: "Assignments", weight: 20 }],
    inClass: ["Lectures", "Exercises in R or Excel"],
    skills: ["Statistical inference", "Regression", "Interpreting data"],
  },
  {
    id: "global-political-economy",
    code: "IR 220",
    name: "Global Political Economy",
    degreeIds: ["international-relations"],
    year: 2,
    credits: 6,
    summary: "How politics and economics interact across borders: trade, money and development.",
    covers: ["Trade policy", "International monetary system", "Development", "Globalisation debates"],
    assessment: [{ label: "Research paper", weight: 50 }, { label: "Final exam", weight: 30 }, { label: "Presentations", weight: 20 }],
    inClass: ["Lectures", "Policy simulations", "Group presentations"],
    skills: ["Policy analysis", "Research", "Presenting"],
  },
  {
    id: "visual-communication",
    code: "DES 110",
    name: "Visual Communication Studio",
    degreeIds: ["design"],
    year: 1,
    credits: 6,
    summary: "Typography, layout and visual hierarchy through weekly studio briefs.",
    covers: ["Typography", "Grid and layout", "Colour", "Visual identity"],
    assessment: [{ label: "Portfolio", weight: 70 }, { label: "Critiques", weight: 30 }],
    inClass: ["Studio work", "Group critiques"],
    skills: ["Typography", "Layout", "Giving and receiving critique"],
  },
  {
    id: "ethics-technology",
    code: "TEC 230",
    name: "Ethics in Technology",
    degreeIds: ["data-business-analytics"],
    year: 2,
    credits: 3,
    summary: "Ethical questions raised by data, algorithms and automation.",
    covers: ["Privacy", "Algorithmic bias", "Responsibility and accountability"],
    assessment: [{ label: "Essay", weight: 60 }, { label: "Participation", weight: 40 }],
    inClass: ["Seminar discussions"],
    skills: ["Ethical reasoning", "Writing"],
  },
];

// Names of the first six professors must stay as they are: existing reviews refer to them by name.
export const professors: Professor[] = [
  { id: "elena-marin", name: "Prof. Elena Marín", title: "Associate Professor of Economics", courseIds: ["intro-microeconomics", "global-political-economy"] },
  { id: "david-okafor", name: "Prof. David Okafor", title: "Assistant Professor of Data Science", courseIds: ["data-analytics-python", "statistics-decisions"] },
  { id: "lucia-herrera", name: "Prof. Lucía Herrera", title: "Professor of International Relations", courseIds: ["international-relations-theory"] },
  { id: "marco-bellini", name: "Prof. Marco Bellini", title: "Associate Professor of Finance", courseIds: ["corporate-finance"] },
  { id: "sarah-lindqvist", name: "Prof. Sarah Lindqvist", title: "Lecturer in Innovation", courseIds: ["design-thinking"] },
  { id: "javier-ortega", name: "Prof. Javier Ortega", title: "Lecturer in Business Law", courseIds: ["business-law"] },
  { id: "amara-nwosu", name: "Prof. Amara Nwosu", title: "Assistant Professor of Statistics", courseIds: ["statistics-decisions"] },
  { id: "tomas-reyes", name: "Prof. Tomás Reyes", title: "Lecturer in Political Economy", courseIds: ["global-political-economy"] },
  { id: "ingrid-solberg", name: "Prof. Ingrid Solberg", title: "Lecturer in Visual Communication", courseIds: ["visual-communication", "design-thinking"] },
];
