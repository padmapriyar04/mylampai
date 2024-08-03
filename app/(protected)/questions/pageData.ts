// interface Option {
//   name: string;
//   icon?: string;
// }

// interface SliderOption {
//   name: string;
//   min: number;
//   max: number;
// }

// interface Page {
//   question: string;
//   options?: Option[] | Option[][];
//   sliders?: SliderOption[];
//   multiSelect?: boolean;
//   gridLayout?: boolean;
// }

// const pageData: Page[] = [
//   {
//     question: "Where do you want to study?",
//     options: [
//       { name: "India 🇮🇳" },
//       { name: "UK 🇬🇧" },
//       { name: "US 🇺🇸" },
//       { name: "Australia 🇦🇺" },
//       { name: "Canada 🇨🇦" },
//       { name: "Singapore 🇸🇬" },
//       { name: "France 🇫🇷" },
//       { name: "Germany 🇩🇪" },
//       { name: "New Zealand 🇳🇿" },
//     ],
//     multiSelect: false,
//     gridLayout: true,
//   },
//   {
//     question: "What is your preferred area of study?",
//     options: [
//       [
//         { name: "Business and Management 💼" },
//         { name: "Computer Science and IT 💻" },
//       ],
//       [
//         { name: "Engineering ⚙️" },
//         { name: "Social Science 🧑‍🤝‍🧑" },
//         { name: "Architecture 🏛️" },
//       ],
//       [
//         { name: "Professional Studies 👔" },
//         { name: "Hospitality and Tourism 🏨" },
//       ],
//       [
//         { name: "Science 🔬" },
//         { name: "Sports 🏅" },
//         { name: "Fine Arts 🎨" },
//         { name: "Law ⚖️" },
//       ],
//       [
//         { name: "Education 📚" },
//         { name: "Mathematics 🔢" },
//         { name: "Medicine 🩺" },
//       ],
//       [
//         { name: "Journalism and Media 📰" },
//         { name: "Agriculture and Forestry 🌱" },
//       ],
//     ],
//     multiSelect: true,
//     gridLayout: false,
//   },
//   {
//     question: "What degree do you want to pursue?",
//     options: [
//       { name: "12th 🏫" },
//       { name: "Bachelors 🎓" },
//       { name: "Masters 🎓🎓" },
//     ],
//     multiSelect: false,
//     gridLayout: true,
//   },
//   {
//     question: "What is your current education level?",
//     options: [
//       { name: "12th 🏫" },
//       { name: "Bachelors 🎓" },
//       { name: "Masters 🎓🎓" },
//     ],
//     multiSelect: false,
//     gridLayout: true,
//     sliders: [
//       { name: "Marks in %", min: 0, max: 100 },
//       { name: "Backlogs", min: 0, max: 5 },
//     ],
//   },
//   {
//     question: "Which aptitude test did you take?",
//     options: [
//       { name: "GRE 📝" },
//       { name: "GMAT 📊" },
//       { name: "SAT 📚" },
//       { name: "ACT 🧠" },
//     ],
//     multiSelect: false,
//     gridLayout: true,
//     sliders: [{ name: "Score", min: 0, max: 340 }],
//   },
//   {
//     question: "Which English test did you take?",
//     options: [
//       { name: "TOEFL 🗣️" },
//       { name: "IELTS 🌐" },
//       { name: "PTE 🖥️" },
//       { name: "None ❌" },
//     ],
//     multiSelect: false,
//     gridLayout: true,
//   },
// ];

// export default pageData;

interface Page {
  type: "dropdown" | "tabs" | "input" | "multiDropdown";
  question: string;
  placeholder?: string;
  options?: { name: string }[];
  tabs?: string[];
  dropdowns?: { placeholder: string; options: string[] }[];
}

const pageData: Page[] = [
  {
    type: "dropdown",
    question: "In which college/organization are you enrolled?",
    placeholder: "Select College",
    options: [
      { name: "College A" },
      { name: "College B" },
      { name: "College C" },
    ],
  },
  {
    type: "dropdown",
    question: "Which degree are you pursuing?",
    placeholder: "Select Degree",
    options: [
      { name: "12th 🏫" },
      { name: "Bachelors 🎓" },
      { name: "Masters 🎓🎓" },
    ],
  },
  {
    type: "dropdown",
    question: "In which course are you enrolled?",
    placeholder: "Select Course",
    options: [
      { name: "Computer Science" },
      { name: "Engineering" },
      { name: "Business" },
    ],
  },
  {
    type: "tabs",
    question: "In which year are you currently?",
    tabs: ["Current year", "Year of Completion"],
    placeholder: "Enter year",
  },
  {
    type: "input",
    question: "What is your score?",
    placeholder: "Enter your score",
  },
  {
    type: "dropdown",
    question: "In which domain are you more interested?",
    placeholder: "Select Domain",
    options: [
      { name: "Business and Management 💼" },
      { name: "Computer Science and IT 💻" },
      { name: "Engineering ⚙️" },
      { name: "Social Science 🧑‍🤝‍🧑" },
      { name: "Architecture 🏛️" },
      { name: "Professional Studies 👔" },
      { name: "Hospitality and Tourism 🏨" },
      { name: "Science 🔬" },
      { name: "Sports 🏅" },
      { name: "Fine Arts 🎨" },
      { name: "Law ⚖️" },
      { name: "Education 📚" },
      { name: "Mathematics 🔢" },
      { name: "Medicine 🩺" },
      { name: "Journalism and Media 📰" },
      { name: "Agriculture and Forestry 🌱" },
    ],
  },
  {
    type: "multiDropdown",
    question: "What skills have you explored/familiar with?",
    dropdowns: [
      {
        placeholder: "Select Skill 1",
        options: [
          "Java",
          "JavaScript",
          "Python",
          "C++",
          "Rust",
          "Next.js",
          "React",
          "TypeScript",
          "Tailwind CSS",
          "HTML",
          "CSS",
        ],
      },
      {
        placeholder: "Select Skill 2",
        options: [
          "Java",
          "JavaScript",
          "Python",
          "C++",
          "Rust",
          "Next.js",
          "React",
          "TypeScript",
          "Tailwind CSS",
          "HTML",
          "CSS",
        ],
      },
      {
        placeholder: "Select Skill 3",
        options: [
          "Java",
          "JavaScript",
          "Python",
          "C++",
          "Rust",
          "Next.js",
          "React",
          "TypeScript",
          "Tailwind CSS",
          "HTML",
          "CSS",
        ],
      },
      {
        placeholder: "Select Skill 4",
        options: [
          "Java",
          "JavaScript",
          "Python",
          "C++",
          "Rust",
          "Next.js",
          "React",
          "TypeScript",
          "Tailwind CSS",
          "HTML",
          "CSS",
        ],
      },
    ],
  },
  {
    type: "dropdown",
    question: "What is your skill level in the selected skills?",
    placeholder: "Select Skill Level",
    options: [
      { name: "Beginner" },
      { name: "Intermediate" },
      { name: "Advanced" },
      { name: "Expert" },
    ],
  },
];

export default pageData;
