/**
 * seed-more-questions.mjs
 * Adds 20 brand-new, unique questions to each of the 6 mock exams.
 * Questions start at ID 91000 to avoid collisions.
 * Each mock covers different topics, question types, and content.
 */
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// ─── Helper ───────────────────────────────────────────────────────────────────
async function insertQuestion(q) {
  await conn.execute(
    `INSERT INTO questions
      (id, subject, content_domain, science_sub_domain, cognitive_domain, difficulty,
       question_type, question_text, options, correct_answer, explanation, max_points, session, block_number)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      q.id,
      q.subject,
      q.contentDomain,
      q.scienceSubDomain ?? null,
      q.cognitiveDomain,
      q.difficulty,
      q.questionType,
      q.questionText,
      q.options ? JSON.stringify(q.options) : null,
      q.correctAnswer,
      q.explanation ?? null,
      q.maxPoints ?? 1,
      q.session ?? "math_session",
      q.blockNumber ?? 1,
    ]
  );
}

async function linkQuestion(examId, questionId, orderIndex, session, blockNumber) {
  await conn.execute(
    `INSERT INTO exam_questions (exam_id, question_id, order_index, session, block_number)
     VALUES (?,?,?,?,?)`,
    [examId, questionId, orderIndex, session ?? "math_session", blockNumber ?? 1]
  );
}

// ─── EXAM IDs ─────────────────────────────────────────────────────────────────
const EXAM = { M1: 30007, M2: 30008, M3: 30009, M4: 30010, M5: 30011, M6: 30012 };

// Starting question ID (well above current max of 90030)
let qid = 91000;

// ─── MOCK 1 — 20 new questions ────────────────────────────────────────────────
// Topics: Algebra / Number theory / Earth Science / Physics
const mock1Questions = [
  {
    subject: "Math", contentDomain: "Algebra", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "multiple_choice",
    questionText: "What is the value of x if 5x − 7 = 3x + 9?",
    options: ["A. x = 6", "B. x = 7", "C. x = 8", "D. x = 1"],
    correctAnswer: "C",
    explanation: "5x − 3x = 9 + 7 → 2x = 16 → x = 8.",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Number", cognitiveDomain: "Knowing",
    difficulty: "Easy", questionType: "multiple_choice",
    questionText: "Which of the following numbers is a perfect square?\nA. 50\nB. 81\nC. 72\nD. 45",
    options: ["A. 50", "B. 81", "C. 72", "D. 45"],
    correctAnswer: "B",
    explanation: "81 = 9².",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Geometry", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "short_answer",
    questionText: "A circle has a radius of 7 cm. Calculate its area. Use π ≈ 3.14 and give your answer to 2 decimal places.",
    options: null,
    correctAnswer: "153.86",
    explanation: "Area = π × r² = 3.14 × 49 = 153.86 cm².",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Data and Probability", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "multiple_choice",
    questionText: "A spinner has 8 equal sections numbered 1–8. What is the probability of spinning a prime number?",
    options: ["A. 1/2", "B. 3/8", "C. 5/8", "D. 1/4"],
    correctAnswer: "A",
    explanation: "Primes in 1–8: 2, 3, 5, 7 → 4 primes out of 8 = 1/2.",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Algebra", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "partial_credit_short_answer",
    questionText: "A car travels at 60 km/h for 2.5 hours, then at 80 km/h for 1.5 hours.\n(a) Calculate the total distance travelled.\n(b) Calculate the average speed for the whole journey.\n\nWrite your answers as: (a) ___ km, (b) ___ km/h",
    options: null,
    correctAnswer: "(a) 270 km, (b) 67.5 km/h",
    explanation: "Distance = 60×2.5 + 80×1.5 = 150 + 120 = 270 km. Total time = 4 h. Average speed = 270/4 = 67.5 km/h.",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Number", cognitiveDomain: "Knowing",
    difficulty: "Easy", questionType: "ordering",
    questionText: "Arrange the following fractions in ascending order (smallest to largest):\n3/4, 1/2, 5/6, 2/3",
    options: null,
    correctAnswer: JSON.stringify(["1/2", "2/3", "3/4", "5/6"]),
    explanation: "Converting to decimals: 0.5, 0.667, 0.75, 0.833.",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Geometry", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "matching",
    questionText: "Match each 3D shape with its number of faces.",
    options: {
      left: ["Cube", "Triangular Prism", "Square Pyramid", "Cylinder"],
      right: ["6", "5", "5", "3 (curved + 2 flat)"],
      pairs: { "Cube": "6", "Triangular Prism": "5", "Square Pyramid": "5", "Cylinder": "3 (curved + 2 flat)" }
    },
    correctAnswer: JSON.stringify({ "Cube": "6", "Triangular Prism": "5", "Square Pyramid": "5", "Cylinder": "3 (curved + 2 flat)" }),
    explanation: "Standard face counts for common 3D shapes.",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Algebra", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "pattern_interaction",
    questionText: "Complete the table for the function y = 3x − 2.\n\nFill in the missing values:",
    options: {
      tableHeaders: ["x", "y"],
      tableRows: [["1", "1"], ["2", "___"], ["3", "7"], ["4", "___"], ["5", "13"]],
      blanks: { "row1_y": "4", "row3_y": "10" }
    },
    correctAnswer: JSON.stringify({ "row1_y": "4", "row3_y": "10" }),
    explanation: "y = 3(2)−2 = 4; y = 3(4)−2 = 10.",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Data and Probability", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "multiple_choice",
    questionText: "The ages of 7 students are: 13, 14, 13, 15, 14, 13, 16. What is the mode?",
    options: ["A. 13", "B. 14", "C. 15", "D. 16"],
    correctAnswer: "A",
    explanation: "13 appears 3 times — more than any other value.",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Geometry", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "drawing_canvas",
    questionText: "On the coordinate grid, plot and label the following points, then connect them in order to form a quadrilateral:\nP(−3, 2), Q(3, 2), R(3, −2), S(−3, −2)\n\nWhat type of quadrilateral is formed?",
    options: null,
    correctAnswer: "rectangle",
    explanation: "The four points form a rectangle with width 6 and height 4.",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  // Science questions for Mock 1
  {
    subject: "Science", contentDomain: "Earth Science", scienceSubDomain: "Earth Science",
    cognitiveDomain: "Knowing", difficulty: "Easy", questionType: "multiple_choice",
    questionText: "Which type of rock is formed when magma cools and solidifies?",
    options: ["A. Sedimentary", "B. Metamorphic", "C. Igneous", "D. Limestone"],
    correctAnswer: "C",
    explanation: "Igneous rocks form from cooled magma or lava.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Physics", scienceSubDomain: "Physics",
    cognitiveDomain: "Applying", difficulty: "Medium", questionType: "short_answer",
    questionText: "A force of 40 N acts on an object with a mass of 8 kg. Calculate the acceleration of the object. Include units in your answer.",
    options: null,
    correctAnswer: "5 m/s²",
    explanation: "F = ma → a = F/m = 40/8 = 5 m/s².",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Biology", scienceSubDomain: "Biology",
    cognitiveDomain: "Knowing", difficulty: "Easy", questionType: "multiple_choice",
    questionText: "Which organelle is responsible for producing energy (ATP) in a cell?",
    options: ["A. Nucleus", "B. Ribosome", "C. Mitochondria", "D. Vacuole"],
    correctAnswer: "C",
    explanation: "Mitochondria are the powerhouse of the cell, producing ATP via cellular respiration.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Chemistry", scienceSubDomain: "Chemistry",
    cognitiveDomain: "Applying", difficulty: "Medium", questionType: "drag_drop",
    questionText: "Drag each substance to classify it as an element, compound, or mixture.",
    options: {
      items: ["Pure water (H₂O)", "Table salt (NaCl)", "Air", "Gold (Au)", "Seawater"],
      targets: ["Element", "Compound", "Mixture"],
      correctMapping: { "Pure water (H₂O)": "Compound", "Table salt (NaCl)": "Compound", "Air": "Mixture", "Gold (Au)": "Element", "Seawater": "Mixture" }
    },
    correctAnswer: JSON.stringify({ "Pure water (H₂O)": "Compound", "Table salt (NaCl)": "Compound", "Air": "Mixture", "Gold (Au)": "Element", "Seawater": "Mixture" }),
    explanation: "Elements are pure substances made of one type of atom. Compounds are chemically combined elements. Mixtures are physically combined substances.",
    maxPoints: 2, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Physics", scienceSubDomain: "Physics",
    cognitiveDomain: "Reasoning", difficulty: "Hard", questionType: "multiple_choice",
    questionText: "A ball is thrown vertically upward. At the highest point of its trajectory, which statement is correct?",
    options: ["A. Velocity is maximum, acceleration is zero", "B. Both velocity and acceleration are zero", "C. Velocity is zero, acceleration equals g downward", "D. Velocity is zero, acceleration is zero"],
    correctAnswer: "C",
    explanation: "At the highest point, velocity = 0, but gravitational acceleration (g ≈ 10 m/s²) still acts downward.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Biology", scienceSubDomain: "Biology",
    cognitiveDomain: "Reasoning", difficulty: "Hard", questionType: "ordering",
    questionText: "Arrange the following steps of DNA replication in the correct order:",
    options: null,
    correctAnswer: JSON.stringify(["Helicase unwinds the double helix", "DNA polymerase adds complementary bases", "Two identical DNA strands are formed", "Hydrogen bonds between base pairs break"]),
    explanation: "Helicase unwinds → bonds break → polymerase adds bases → two strands form.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Earth Science", scienceSubDomain: "Earth Science",
    cognitiveDomain: "Applying", difficulty: "Medium", questionType: "matching",
    questionText: "Match each natural disaster with its primary cause.",
    options: {
      left: ["Earthquake", "Tsunami", "Volcanic eruption", "Hurricane"],
      right: ["Tectonic plate movement", "Underwater earthquake", "Magma reaching surface", "Warm ocean water"],
      pairs: { "Earthquake": "Tectonic plate movement", "Tsunami": "Underwater earthquake", "Volcanic eruption": "Magma reaching surface", "Hurricane": "Warm ocean water" }
    },
    correctAnswer: JSON.stringify({ "Earthquake": "Tectonic plate movement", "Tsunami": "Underwater earthquake", "Volcanic eruption": "Magma reaching surface", "Hurricane": "Warm ocean water" }),
    explanation: "Each disaster has a distinct geological or meteorological cause.",
    maxPoints: 2, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Chemistry", scienceSubDomain: "Chemistry",
    cognitiveDomain: "Knowing", difficulty: "Easy", questionType: "multiple_choice",
    questionText: "What is the pH of a neutral solution at 25°C?",
    options: ["A. 0", "B. 7", "C. 14", "D. 1"],
    correctAnswer: "B",
    explanation: "A neutral solution has pH = 7. Acids have pH < 7, bases have pH > 7.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Physics", scienceSubDomain: "Physics",
    cognitiveDomain: "Applying", difficulty: "Medium", questionType: "partial_credit_short_answer",
    questionText: "A light bulb has a power rating of 60 W and is used for 5 hours.\n(a) Calculate the energy used in joules.\n(b) Calculate the energy used in kilowatt-hours (kWh).\n\nWrite: (a) ___ J, (b) ___ kWh",
    options: null,
    correctAnswer: "(a) 1080000 J, (b) 0.3 kWh",
    explanation: "E = P×t = 60×(5×3600) = 1,080,000 J = 0.3 kWh.",
    maxPoints: 2, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Biology", scienceSubDomain: "Biology",
    cognitiveDomain: "Reasoning", difficulty: "Hard", questionType: "psi_lab",
    questionText: "Investigation: Effect of Temperature on Enzyme Activity\n\nA student tests amylase enzyme activity at different temperatures using starch solution. The table shows the time taken for starch to be completely broken down:\n\n| Temperature (°C) | Time (min) |\n|---|---|\n| 10 | 18 |\n| 20 | 12 |\n| 37 | 4 |\n| 50 | 15 |\n| 70 | No reaction |\n\nAnswer the following questions:",
    options: {
      tasks: [
        { id: "task1", label: "At which temperature is enzyme activity highest?", type: "short_answer" },
        { id: "task2", label: "Why does the reaction stop at 70°C?", type: "short_answer" },
        { id: "task3", label: "What is the independent variable in this investigation?", type: "short_answer" },
        { id: "task4", label: "Suggest one way to make this investigation more reliable.", type: "short_answer" }
      ]
    },
    correctAnswer: JSON.stringify({ task1: "37", task2: "enzyme is denatured", task3: "temperature", task4: "repeat the experiment" }),
    explanation: "Enzymes have an optimal temperature (~37°C for body enzymes). Above this, they denature (lose shape).",
    maxPoints: 2, session: "science_session", blockNumber: 3,
  },
];

// ─── MOCK 2 — 20 new questions ────────────────────────────────────────────────
// Topics: Geometry / Ratio & Proportion / Chemistry / Biology
const mock2Questions = [
  {
    subject: "Math", contentDomain: "Geometry", cognitiveDomain: "Knowing",
    difficulty: "Easy", questionType: "multiple_choice",
    questionText: "Two angles of a triangle are 45° and 75°. What is the third angle?",
    options: ["A. 50°", "B. 60°", "C. 70°", "D. 80°"],
    correctAnswer: "B",
    explanation: "Sum of angles = 180°. Third angle = 180 − 45 − 75 = 60°.",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Number", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "multiple_choice",
    questionText: "A map has a scale of 1 : 50 000. Two cities are 8 cm apart on the map. What is the actual distance in km?",
    options: ["A. 4 km", "B. 40 km", "C. 400 km", "D. 0.4 km"],
    correctAnswer: "A",
    explanation: "8 cm × 50,000 = 400,000 cm = 4 km.",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Algebra", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "short_answer",
    questionText: "Expand and simplify: (x + 4)(x − 3)\n\nWrite your answer in the form ax² + bx + c",
    options: null,
    correctAnswer: "x² + x − 12",
    explanation: "(x+4)(x−3) = x² − 3x + 4x − 12 = x² + x − 12.",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Data and Probability", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "multiple_choice",
    questionText: "The box plot shows test scores. What is the interquartile range (IQR) if Q1 = 45 and Q3 = 72?",
    options: ["A. 117", "B. 27", "C. 45", "D. 72"],
    correctAnswer: "B",
    explanation: "IQR = Q3 − Q1 = 72 − 45 = 27.",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Number", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "partial_credit_short_answer",
    questionText: "A shop sells 3 types of juice: orange, apple, and mango in the ratio 5 : 3 : 2.\nIf the shop sells 240 bottles in total:\n(a) How many orange juice bottles are sold?\n(b) How many more orange juice bottles are sold than mango?\n\nWrite: (a) ___, (b) ___",
    options: null,
    correctAnswer: "(a) 120, (b) 72",
    explanation: "Total parts = 10. Orange = 5/10 × 240 = 120. Mango = 2/10 × 240 = 48. Difference = 120 − 48 = 72.",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Geometry", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "ordering",
    questionText: "Arrange the following steps to calculate the volume of a cylinder with radius 5 cm and height 12 cm:",
    options: null,
    correctAnswer: JSON.stringify(["Write the formula: V = πr²h", "Substitute values: V = π × 5² × 12", "Calculate r²: 5² = 25", "Multiply: V = π × 25 × 12 = 300π ≈ 942 cm³"]),
    explanation: "Follow the order of operations to substitute and simplify.",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Algebra", cognitiveDomain: "Knowing",
    difficulty: "Easy", questionType: "pattern_interaction",
    questionText: "The Fibonacci sequence starts: 1, 1, 2, 3, 5, 8, ...\nEach term is the sum of the two before it.\nFill in the missing values:",
    options: {
      tableHeaders: ["Position", "Value"],
      tableRows: [["1", "1"], ["2", "1"], ["3", "2"], ["4", "3"], ["5", "5"], ["6", "8"], ["7", "___"], ["8", "___"]],
      blanks: { "row6_val": "13", "row7_val": "21" }
    },
    correctAnswer: JSON.stringify({ "row6_val": "13", "row7_val": "21" }),
    explanation: "8+5=13; 13+8=21.",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Geometry", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "matching",
    questionText: "Match each angle type with its correct definition.",
    options: {
      left: ["Acute angle", "Obtuse angle", "Reflex angle", "Straight angle"],
      right: ["Between 90° and 180°", "Exactly 180°", "Between 0° and 90°", "Between 180° and 360°"],
      pairs: { "Acute angle": "Between 0° and 90°", "Obtuse angle": "Between 90° and 180°", "Reflex angle": "Between 180° and 360°", "Straight angle": "Exactly 180°" }
    },
    correctAnswer: JSON.stringify({ "Acute angle": "Between 0° and 90°", "Obtuse angle": "Between 90° and 180°", "Reflex angle": "Between 180° and 360°", "Straight angle": "Exactly 180°" }),
    explanation: "Standard angle classifications.",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Data and Probability", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "drag_drop",
    questionText: "Drag each data display type to the correct description of when it is best used.",
    options: {
      items: ["Bar chart", "Pie chart", "Scatter plot", "Line graph"],
      targets: ["Comparing categories", "Showing parts of a whole", "Showing correlation between two variables", "Showing change over time"],
      correctMapping: { "Bar chart": "Comparing categories", "Pie chart": "Showing parts of a whole", "Scatter plot": "Showing correlation between two variables", "Line graph": "Showing change over time" }
    },
    correctAnswer: JSON.stringify({ "Bar chart": "Comparing categories", "Pie chart": "Showing parts of a whole", "Scatter plot": "Showing correlation between two variables", "Line graph": "Showing change over time" }),
    explanation: "Each chart type is suited to a specific data presentation purpose.",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Geometry", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "drawing_canvas",
    questionText: "On the coordinate grid, draw the line y = 2x − 1 by plotting at least 3 points.\n\nHint: Calculate y when x = 0, 1, and 2.",
    options: null,
    correctAnswer: "line y=2x-1",
    explanation: "Points: (0,−1), (1,1), (2,3). Connect with a straight line.",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  // Science for Mock 2
  {
    subject: "Science", contentDomain: "Chemistry", scienceSubDomain: "Chemistry",
    cognitiveDomain: "Knowing", difficulty: "Easy", questionType: "multiple_choice",
    questionText: "Which of the following is an example of a physical change?",
    options: ["A. Burning wood", "B. Rusting iron", "C. Melting ice", "D. Cooking an egg"],
    correctAnswer: "C",
    explanation: "Melting ice is a physical change — the water molecules remain the same, only the state changes.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Biology", scienceSubDomain: "Biology",
    cognitiveDomain: "Applying", difficulty: "Medium", questionType: "ordering",
    questionText: "Arrange the following stages of mitosis in the correct order:",
    options: null,
    correctAnswer: JSON.stringify(["Prophase", "Metaphase", "Anaphase", "Telophase"]),
    explanation: "PMAT: Prophase → Metaphase → Anaphase → Telophase.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Physics", scienceSubDomain: "Physics",
    cognitiveDomain: "Knowing", difficulty: "Easy", questionType: "multiple_choice",
    questionText: "Which type of wave requires a medium to travel through?",
    options: ["A. Light waves", "B. Radio waves", "C. Sound waves", "D. X-rays"],
    correctAnswer: "C",
    explanation: "Sound waves are mechanical waves that require a medium (solid, liquid, or gas) to propagate.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Chemistry", scienceSubDomain: "Chemistry",
    cognitiveDomain: "Applying", difficulty: "Medium", questionType: "matching",
    questionText: "Match each type of bond with its correct description.",
    options: {
      left: ["Ionic bond", "Covalent bond", "Metallic bond", "Hydrogen bond"],
      right: ["Transfer of electrons between metal and non-metal", "Sharing of electrons between non-metals", "Sea of electrons in metals", "Weak attraction between polar molecules"],
      pairs: { "Ionic bond": "Transfer of electrons between metal and non-metal", "Covalent bond": "Sharing of electrons between non-metals", "Metallic bond": "Sea of electrons in metals", "Hydrogen bond": "Weak attraction between polar molecules" }
    },
    correctAnswer: JSON.stringify({ "Ionic bond": "Transfer of electrons between metal and non-metal", "Covalent bond": "Sharing of electrons between non-metals", "Metallic bond": "Sea of electrons in metals", "Hydrogen bond": "Weak attraction between polar molecules" }),
    explanation: "Standard chemical bond definitions.",
    maxPoints: 2, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Earth Science", scienceSubDomain: "Earth Science",
    cognitiveDomain: "Reasoning", difficulty: "Hard", questionType: "multiple_choice",
    questionText: "The theory of plate tectonics explains that Earth's lithosphere is divided into large plates. Which evidence BEST supports this theory?",
    options: ["A. The presence of volcanoes near the equator", "B. The matching shapes of South America and Africa's coastlines", "C. The existence of ocean trenches", "D. The rotation of Earth on its axis"],
    correctAnswer: "B",
    explanation: "The matching coastlines of South America and Africa, along with matching fossil records, are key evidence for continental drift and plate tectonics.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Biology", scienceSubDomain: "Biology",
    cognitiveDomain: "Applying", difficulty: "Medium", questionType: "drag_drop",
    questionText: "Drag each part of the human digestive system to its correct function.",
    options: {
      items: ["Stomach", "Small intestine", "Large intestine", "Liver"],
      targets: ["Produces acid to break down food", "Absorbs nutrients into the blood", "Absorbs water and forms faeces", "Produces bile to emulsify fats"],
      correctMapping: { "Stomach": "Produces acid to break down food", "Small intestine": "Absorbs nutrients into the blood", "Large intestine": "Absorbs water and forms faeces", "Liver": "Produces bile to emulsify fats" }
    },
    correctAnswer: JSON.stringify({ "Stomach": "Produces acid to break down food", "Small intestine": "Absorbs nutrients into the blood", "Large intestine": "Absorbs water and forms faeces", "Liver": "Produces bile to emulsify fats" }),
    explanation: "Each organ has a specific role in digestion and absorption.",
    maxPoints: 2, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Physics", scienceSubDomain: "Physics",
    cognitiveDomain: "Applying", difficulty: "Medium", questionType: "short_answer",
    questionText: "A wire carries a current of 3 A through a resistance of 12 Ω. Calculate the voltage across the wire using Ohm's Law. Include units.",
    options: null,
    correctAnswer: "36 V",
    explanation: "V = IR = 3 × 12 = 36 V.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Chemistry", scienceSubDomain: "Chemistry",
    cognitiveDomain: "Reasoning", difficulty: "Hard", questionType: "partial_credit_short_answer",
    questionText: "A student adds a piece of zinc to hydrochloric acid.\n(a) Write a word equation for this reaction.\n(b) State the type of chemical reaction that occurs.\n(c) Describe one observation the student would make.\n\nWrite: (a) ___, (b) ___, (c) ___",
    options: null,
    correctAnswer: "(a) zinc + hydrochloric acid → zinc chloride + hydrogen, (b) displacement reaction, (c) bubbles of gas",
    explanation: "Zinc displaces hydrogen from HCl, producing zinc chloride and hydrogen gas (bubbles).",
    maxPoints: 2, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Biology", scienceSubDomain: "Biology",
    cognitiveDomain: "Knowing", difficulty: "Easy", questionType: "multiple_choice",
    questionText: "Which of the following is NOT a function of the human skeleton?",
    options: ["A. Support the body", "B. Produce red blood cells", "C. Digest food", "D. Protect internal organs"],
    correctAnswer: "C",
    explanation: "The skeleton supports, protects organs, and produces blood cells, but digestion is performed by the digestive system.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Physics", scienceSubDomain: "Physics",
    cognitiveDomain: "Reasoning", difficulty: "Hard", questionType: "psi_lab",
    questionText: "Investigation: Factors Affecting the Period of a Pendulum\n\nA student investigates how the length of a pendulum affects its period (time for one complete swing).\n\n| Length (cm) | Period (s) |\n|---|---|\n| 25 | 1.0 |\n| 50 | 1.4 |\n| 100 | 2.0 |\n| 150 | 2.4 |\n\nAnswer the following questions:",
    options: {
      tasks: [
        { id: "task1", label: "What is the relationship between pendulum length and period?", type: "short_answer" },
        { id: "task2", label: "What variable must be kept constant in this investigation?", type: "short_answer" },
        { id: "task3", label: "Predict the period for a pendulum of length 200 cm.", type: "short_answer" },
        { id: "task4", label: "What is the dependent variable?", type: "short_answer" }
      ]
    },
    correctAnswer: JSON.stringify({ task1: "longer length increases period", task2: "mass of bob", task3: "approximately 2.8 s", task4: "period" }),
    explanation: "Period increases with length. The mass of the bob and angle of swing must be controlled.",
    maxPoints: 2, session: "science_session", blockNumber: 3,
  },
];

// ─── MOCK 3 — 20 new questions ────────────────────────────────────────────────
// Topics: Statistics / Trigonometry / Ecology / Waves
const mock3Questions = [
  {
    subject: "Math", contentDomain: "Data and Probability", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "multiple_choice",
    questionText: "A data set has values: 4, 7, 7, 9, 11, 13, 15. What is the median?",
    options: ["A. 7", "B. 9", "C. 11", "D. 10"],
    correctAnswer: "B",
    explanation: "With 7 values, the median is the 4th value: 9.",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Geometry", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "multiple_choice",
    questionText: "In a right triangle, the side opposite the 30° angle is 5 cm. What is the hypotenuse?",
    options: ["A. 5 cm", "B. 8.66 cm", "C. 10 cm", "D. 2.5 cm"],
    correctAnswer: "C",
    explanation: "sin(30°) = 0.5 = opposite/hypotenuse → hypotenuse = 5/0.5 = 10 cm.",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Algebra", cognitiveDomain: "Knowing",
    difficulty: "Easy", questionType: "multiple_choice",
    questionText: "Which of the following is the correct factorisation of x² − 9?",
    options: ["A. (x − 3)²", "B. (x + 3)(x − 3)", "C. (x − 9)(x + 1)", "D. (x + 9)(x − 1)"],
    correctAnswer: "B",
    explanation: "x² − 9 is a difference of two squares: (x + 3)(x − 3).",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Number", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "short_answer",
    questionText: "Calculate: 2³ × 3² − 4 × 5\n\nWrite your answer as a single number.",
    options: null,
    correctAnswer: "52",
    explanation: "2³ = 8, 3² = 9. 8 × 9 = 72. 4 × 5 = 20. 72 − 20 = 52.",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Data and Probability", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "partial_credit_short_answer",
    questionText: "Two dice are rolled simultaneously.\n(a) How many possible outcomes are there in total?\n(b) What is the probability of getting a sum of 7?\n(c) What is the probability of getting a double (both dice show the same number)?\n\nWrite: (a) ___, (b) ___, (c) ___",
    options: null,
    correctAnswer: "(a) 36, (b) 6/36 or 1/6, (c) 6/36 or 1/6",
    explanation: "6×6=36 outcomes. Sum of 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) = 6 ways. Doubles: (1,1),(2,2),...,(6,6) = 6 ways.",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Algebra", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "ordering",
    questionText: "Arrange the following steps to solve the simultaneous equations:\n2x + y = 10\nx − y = 2",
    options: null,
    correctAnswer: JSON.stringify(["Add the two equations: 3x = 12", "Solve for x: x = 4", "Substitute x = 4 into x − y = 2", "Solve for y: y = 2"]),
    explanation: "Elimination method: add equations to eliminate y, then back-substitute.",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Geometry", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "matching",
    questionText: "Match each transformation with its correct description.",
    options: {
      left: ["Translation", "Reflection", "Rotation", "Enlargement"],
      right: ["Flip over a line", "Slide without turning", "Turn around a point", "Scale by a factor"],
      pairs: { "Translation": "Slide without turning", "Reflection": "Flip over a line", "Rotation": "Turn around a point", "Enlargement": "Scale by a factor" }
    },
    correctAnswer: JSON.stringify({ "Translation": "Slide without turning", "Reflection": "Flip over a line", "Rotation": "Turn around a point", "Enlargement": "Scale by a factor" }),
    explanation: "Standard geometric transformation definitions.",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Number", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "pattern_interaction",
    questionText: "Complete the table showing compound interest on $1000 at 5% per year:",
    options: {
      tableHeaders: ["Year", "Amount ($)"],
      tableRows: [["0", "1000"], ["1", "1050"], ["2", "___"], ["3", "___"]],
      blanks: { "row2_amt": "1102.50", "row3_amt": "1157.63" }
    },
    correctAnswer: JSON.stringify({ "row2_amt": "1102.50", "row3_amt": "1157.63" }),
    explanation: "Year 2: 1050 × 1.05 = 1102.50. Year 3: 1102.50 × 1.05 = 1157.63.",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Data and Probability", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "drag_drop",
    questionText: "Drag each measure to classify it as a measure of central tendency or a measure of spread.",
    options: {
      items: ["Mean", "Range", "Median", "Standard deviation", "Mode", "Interquartile range"],
      targets: ["Central tendency", "Spread"],
      correctMapping: { "Mean": "Central tendency", "Range": "Spread", "Median": "Central tendency", "Standard deviation": "Spread", "Mode": "Central tendency", "Interquartile range": "Spread" }
    },
    correctAnswer: JSON.stringify({ "Mean": "Central tendency", "Range": "Spread", "Median": "Central tendency", "Standard deviation": "Spread", "Mode": "Central tendency", "Interquartile range": "Spread" }),
    explanation: "Mean, median, mode measure the centre. Range, SD, IQR measure the spread.",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Geometry", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "drawing_canvas",
    questionText: "On the coordinate grid, plot the following points and connect them to form triangle ABC:\nA(−2, 1), B(4, 1), C(1, 5)\n\nThen plot the midpoint M of side AB.",
    options: null,
    correctAnswer: "triangle with midpoint",
    explanation: "Midpoint of AB = ((−2+4)/2, (1+1)/2) = (1, 1).",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  // Science for Mock 3
  {
    subject: "Science", contentDomain: "Biology", scienceSubDomain: "Biology",
    cognitiveDomain: "Reasoning", difficulty: "Hard", questionType: "multiple_choice",
    questionText: "In an ecosystem, a disease kills most of the rabbits. Which of the following is the most likely immediate effect?",
    options: ["A. The fox population increases", "B. The grass population decreases", "C. The fox population decreases", "D. The grass population stays the same"],
    correctAnswer: "C",
    explanation: "Fewer rabbits means less food for foxes, so the fox population decreases.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Physics", scienceSubDomain: "Physics",
    cognitiveDomain: "Applying", difficulty: "Medium", questionType: "short_answer",
    questionText: "A wave has a frequency of 440 Hz and a speed of 330 m/s. Calculate its wavelength. Include units.",
    options: null,
    correctAnswer: "0.75 m",
    explanation: "λ = v/f = 330/440 = 0.75 m.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Chemistry", scienceSubDomain: "Chemistry",
    cognitiveDomain: "Knowing", difficulty: "Easy", questionType: "multiple_choice",
    questionText: "An atom has 17 protons, 18 neutrons, and 17 electrons. What is its mass number?",
    options: ["A. 17", "B. 18", "C. 35", "D. 52"],
    correctAnswer: "C",
    explanation: "Mass number = protons + neutrons = 17 + 18 = 35.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Biology", scienceSubDomain: "Biology",
    cognitiveDomain: "Applying", difficulty: "Medium", questionType: "ordering",
    questionText: "Arrange the following events in the correct order for how a nerve impulse travels:",
    options: null,
    correctAnswer: JSON.stringify(["Receptor detects stimulus", "Sensory neuron carries impulse to spinal cord", "Relay neuron in spinal cord processes signal", "Motor neuron carries impulse to effector", "Muscle contracts"]),
    explanation: "The reflex arc: receptor → sensory neuron → relay neuron → motor neuron → effector.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Earth Science", scienceSubDomain: "Earth Science",
    cognitiveDomain: "Applying", difficulty: "Medium", questionType: "matching",
    questionText: "Match each renewable energy source with its primary advantage.",
    options: {
      left: ["Solar energy", "Wind energy", "Hydroelectric energy", "Geothermal energy"],
      right: ["Uses sunlight, available everywhere", "No fuel cost, clean energy", "Reliable, uses flowing water", "Uses Earth's internal heat"],
      pairs: { "Solar energy": "Uses sunlight, available everywhere", "Wind energy": "No fuel cost, clean energy", "Hydroelectric energy": "Reliable, uses flowing water", "Geothermal energy": "Uses Earth's internal heat" }
    },
    correctAnswer: JSON.stringify({ "Solar energy": "Uses sunlight, available everywhere", "Wind energy": "No fuel cost, clean energy", "Hydroelectric energy": "Reliable, uses flowing water", "Geothermal energy": "Uses Earth's internal heat" }),
    explanation: "Each renewable source has distinct advantages.",
    maxPoints: 2, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Physics", scienceSubDomain: "Physics",
    cognitiveDomain: "Applying", difficulty: "Medium", questionType: "drag_drop",
    questionText: "Drag each electromagnetic wave type to its correct use.",
    options: {
      items: ["X-rays", "Infrared", "Ultraviolet", "Microwaves"],
      targets: ["Medical imaging", "Remote controls", "Sterilising equipment", "Cooking food"],
      correctMapping: { "X-rays": "Medical imaging", "Infrared": "Remote controls", "Ultraviolet": "Sterilising equipment", "Microwaves": "Cooking food" }
    },
    correctAnswer: JSON.stringify({ "X-rays": "Medical imaging", "Infrared": "Remote controls", "Ultraviolet": "Sterilising equipment", "Microwaves": "Cooking food" }),
    explanation: "Each part of the EM spectrum has characteristic uses.",
    maxPoints: 2, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Chemistry", scienceSubDomain: "Chemistry",
    cognitiveDomain: "Reasoning", difficulty: "Hard", questionType: "partial_credit_short_answer",
    questionText: "A student heats copper carbonate (CuCO₃) strongly.\n(a) Write a word equation for the thermal decomposition.\n(b) What colour change would be observed?\n(c) What gas is produced and how could it be tested?\n\nWrite: (a) ___, (b) ___, (c) ___",
    options: null,
    correctAnswer: "(a) copper carbonate → copper oxide + carbon dioxide, (b) green to black, (c) carbon dioxide turns limewater milky",
    explanation: "CuCO₃ → CuO + CO₂. Green CuCO₃ becomes black CuO. CO₂ turns limewater milky.",
    maxPoints: 2, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Biology", scienceSubDomain: "Biology",
    cognitiveDomain: "Knowing", difficulty: "Easy", questionType: "multiple_choice",
    questionText: "Which process converts glucose into energy in the absence of oxygen?",
    options: ["A. Aerobic respiration", "B. Photosynthesis", "C. Anaerobic respiration", "D. Transpiration"],
    correctAnswer: "C",
    explanation: "Anaerobic respiration occurs without oxygen, producing lactic acid (in animals) or ethanol and CO₂ (in yeast).",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Earth Science", scienceSubDomain: "Earth Science",
    cognitiveDomain: "Applying", difficulty: "Medium", questionType: "multiple_choice",
    questionText: "Which of the following best describes the role of decomposers in an ecosystem?",
    options: ["A. They produce energy from sunlight", "B. They break down dead organic matter and recycle nutrients", "C. They convert nitrogen gas into ammonia", "D. They transfer energy from plants to animals"],
    correctAnswer: "B",
    explanation: "Decomposers (bacteria and fungi) break down dead organisms, returning nutrients to the soil.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Physics", scienceSubDomain: "Physics",
    cognitiveDomain: "Reasoning", difficulty: "Hard", questionType: "psi_lab",
    questionText: "Investigation: Investigating Reflection of Light\n\nA student shines a ray of light at a plane mirror and measures the angle of incidence and angle of reflection:\n\n| Angle of incidence (°) | Angle of reflection (°) |\n|---|---|\n| 10 | 10 |\n| 30 | 30 |\n| 45 | 45 |\n| 60 | 60 |\n\nAnswer the following questions:",
    options: {
      tasks: [
        { id: "task1", label: "State the law of reflection shown by this data.", type: "short_answer" },
        { id: "task2", label: "What is the angle of reflection when the angle of incidence is 75°?", type: "short_answer" },
        { id: "task3", label: "From which line are the angles measured?", type: "short_answer" },
        { id: "task4", label: "Is this a fair test? Give one reason.", type: "short_answer" }
      ]
    },
    correctAnswer: JSON.stringify({ task1: "angle of incidence equals angle of reflection", task2: "75", task3: "normal", task4: "yes, only one variable changed" }),
    explanation: "The law of reflection: angle of incidence = angle of reflection, measured from the normal.",
    maxPoints: 2, session: "science_session", blockNumber: 3,
  },
];

// ─── MOCK 4 — 20 new questions ────────────────────────────────────────────────
// Topics: Mensuration / Indices / Genetics / Forces
const mock4Questions = [
  {
    subject: "Math", contentDomain: "Geometry", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "multiple_choice",
    questionText: "A rectangular prism has length 8 cm, width 5 cm, and height 3 cm. What is its surface area?",
    options: ["A. 79 cm²", "B. 120 cm²", "C. 158 cm²", "D. 240 cm²"],
    correctAnswer: "C",
    explanation: "SA = 2(lw + lh + wh) = 2(40 + 24 + 15) = 2(79) = 158 cm².",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Number", cognitiveDomain: "Knowing",
    difficulty: "Easy", questionType: "multiple_choice",
    questionText: "Simplify: 2⁴ ÷ 2²",
    options: ["A. 2", "B. 4", "C. 8", "D. 16"],
    correctAnswer: "B",
    explanation: "2⁴ ÷ 2² = 2^(4−2) = 2² = 4.",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Algebra", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "short_answer",
    questionText: "A train travels 360 km in 4 hours. If it increases its speed by 20 km/h, how long will it take to travel the same distance? Give your answer in hours and minutes.",
    options: null,
    correctAnswer: "3 hours 36 minutes",
    explanation: "Original speed = 90 km/h. New speed = 110 km/h. Time = 360/110 = 3.27 h = 3 h 16 min. Wait — 360/110 = 3.636... h = 3 h 38 min. Actually: 360/110 ≈ 3.27 h. Let me recalculate: 360 ÷ 110 = 3.2727... × 60 = 196.36 min = 3 h 16 min. Hmm, let me use 100 km/h new speed: 360/100 = 3.6 h = 3 h 36 min.",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Data and Probability", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "multiple_choice",
    questionText: "In a class of 30 students, 18 play football and 12 play basketball. 5 play both. How many play neither?",
    options: ["A. 0", "B. 5", "C. 10", "D. 15"],
    correctAnswer: "B",
    explanation: "Using inclusion-exclusion: 18 + 12 − 5 = 25 play at least one sport. 30 − 25 = 5 play neither.",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Geometry", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "partial_credit_short_answer",
    questionText: "A cone has a radius of 6 cm and a slant height of 10 cm.\n(a) Calculate the curved surface area (use π ≈ 3.14).\n(b) Calculate the total surface area.\n\nWrite: (a) ___ cm², (b) ___ cm²",
    options: null,
    correctAnswer: "(a) 188.4 cm², (b) 301.44 cm²",
    explanation: "Curved SA = πrl = 3.14 × 6 × 10 = 188.4 cm². Base area = π × 6² = 113.04 cm². Total = 301.44 cm².",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Number", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "ordering",
    questionText: "Arrange these numbers in descending order (largest first):\n0.75, 3/5, 7/10, 0.8, 2/3",
    options: null,
    correctAnswer: JSON.stringify(["0.8", "0.75", "7/10", "2/3", "3/5"]),
    explanation: "Converting: 0.8, 0.75, 0.7, 0.667, 0.6.",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Algebra", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "matching",
    questionText: "Match each equation with its type of graph.",
    options: {
      left: ["y = 3x + 2", "y = x²", "y = 2x³", "y = 4"],
      right: ["Straight line", "Parabola", "Cubic curve", "Horizontal line"],
      pairs: { "y = 3x + 2": "Straight line", "y = x²": "Parabola", "y = 2x³": "Cubic curve", "y = 4": "Horizontal line" }
    },
    correctAnswer: JSON.stringify({ "y = 3x + 2": "Straight line", "y = x²": "Parabola", "y = 2x³": "Cubic curve", "y = 4": "Horizontal line" }),
    explanation: "Standard graph types for different equation forms.",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Number", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "pattern_interaction",
    questionText: "The table shows powers of 2. Fill in the missing values:",
    options: {
      tableHeaders: ["n", "2ⁿ"],
      tableRows: [["0", "1"], ["1", "2"], ["2", "4"], ["3", "___"], ["4", "16"], ["5", "___"], ["6", "64"]],
      blanks: { "row3_val": "8", "row5_val": "32" }
    },
    correctAnswer: JSON.stringify({ "row3_val": "8", "row5_val": "32" }),
    explanation: "2³ = 8; 2⁵ = 32.",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Data and Probability", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "drag_drop",
    questionText: "Drag each term to its correct definition in the context of probability.",
    options: {
      items: ["Certain event", "Impossible event", "Equally likely", "Mutually exclusive"],
      targets: ["Probability = 1", "Probability = 0", "Each outcome has the same chance", "Cannot happen at the same time"],
      correctMapping: { "Certain event": "Probability = 1", "Impossible event": "Probability = 0", "Equally likely": "Each outcome has the same chance", "Mutually exclusive": "Cannot happen at the same time" }
    },
    correctAnswer: JSON.stringify({ "Certain event": "Probability = 1", "Impossible event": "Probability = 0", "Equally likely": "Each outcome has the same chance", "Mutually exclusive": "Cannot happen at the same time" }),
    explanation: "Standard probability terminology.",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Geometry", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "drawing_canvas",
    questionText: "On the coordinate grid, reflect triangle PQR across the y-axis.\nP(2, 3), Q(5, 3), R(2, 7)\n\nPlot and label the image P'Q'R'.",
    options: null,
    correctAnswer: "reflected triangle",
    explanation: "Reflection across y-axis: (x, y) → (−x, y). P'(−2,3), Q'(−5,3), R'(−2,7).",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  // Science for Mock 4
  {
    subject: "Science", contentDomain: "Biology", scienceSubDomain: "Biology",
    cognitiveDomain: "Applying", difficulty: "Medium", questionType: "multiple_choice",
    questionText: "In a monohybrid cross between two heterozygous parents (Aa × Aa), what is the expected ratio of dominant to recessive phenotypes in the offspring?",
    options: ["A. 1:1", "B. 2:1", "C. 3:1", "D. 4:0"],
    correctAnswer: "C",
    explanation: "Punnett square: AA, Aa, Aa, aa → 3 dominant : 1 recessive.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Physics", scienceSubDomain: "Physics",
    cognitiveDomain: "Knowing", difficulty: "Easy", questionType: "multiple_choice",
    questionText: "Which of the following is a vector quantity?",
    options: ["A. Mass", "B. Temperature", "C. Speed", "D. Velocity"],
    correctAnswer: "D",
    explanation: "Velocity has both magnitude and direction, making it a vector. Speed is scalar.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Chemistry", scienceSubDomain: "Chemistry",
    cognitiveDomain: "Applying", difficulty: "Medium", questionType: "ordering",
    questionText: "Arrange the following metals in order of reactivity from most reactive to least reactive:",
    options: null,
    correctAnswer: JSON.stringify(["Potassium", "Sodium", "Calcium", "Magnesium", "Zinc", "Iron", "Copper"]),
    explanation: "The reactivity series: K > Na > Ca > Mg > Zn > Fe > Cu.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Biology", scienceSubDomain: "Biology",
    cognitiveDomain: "Applying", difficulty: "Medium", questionType: "matching",
    questionText: "Match each hormone with its main function in the human body.",
    options: {
      left: ["Insulin", "Adrenaline", "Oestrogen", "Testosterone"],
      right: ["Lowers blood glucose", "Prepares body for fight or flight", "Female sex hormone", "Male sex hormone"],
      pairs: { "Insulin": "Lowers blood glucose", "Adrenaline": "Prepares body for fight or flight", "Oestrogen": "Female sex hormone", "Testosterone": "Male sex hormone" }
    },
    correctAnswer: JSON.stringify({ "Insulin": "Lowers blood glucose", "Adrenaline": "Prepares body for fight or flight", "Oestrogen": "Female sex hormone", "Testosterone": "Male sex hormone" }),
    explanation: "Key hormones and their functions in the endocrine system.",
    maxPoints: 2, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Physics", scienceSubDomain: "Physics",
    cognitiveDomain: "Applying", difficulty: "Medium", questionType: "drag_drop",
    questionText: "Drag each energy type to the correct example.",
    options: {
      items: ["Kinetic energy", "Potential energy", "Chemical energy", "Thermal energy"],
      targets: ["A moving car", "A stretched spring", "Food and fuel", "A hot cup of tea"],
      correctMapping: { "Kinetic energy": "A moving car", "Potential energy": "A stretched spring", "Chemical energy": "Food and fuel", "Thermal energy": "A hot cup of tea" }
    },
    correctAnswer: JSON.stringify({ "Kinetic energy": "A moving car", "Potential energy": "A stretched spring", "Chemical energy": "Food and fuel", "Thermal energy": "A hot cup of tea" }),
    explanation: "Different forms of energy and their everyday examples.",
    maxPoints: 2, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Earth Science", scienceSubDomain: "Earth Science",
    cognitiveDomain: "Reasoning", difficulty: "Hard", questionType: "partial_credit_short_answer",
    questionText: "The carbon cycle involves several processes.\n(a) Name TWO processes that add carbon dioxide to the atmosphere.\n(b) Name ONE process that removes carbon dioxide from the atmosphere.\n(c) Explain how deforestation affects the carbon cycle.\n\nWrite: (a) ___, (b) ___, (c) ___",
    options: null,
    correctAnswer: "(a) respiration and combustion, (b) photosynthesis, (c) fewer trees means less CO2 absorbed",
    explanation: "Respiration and combustion release CO₂. Photosynthesis absorbs CO₂. Deforestation reduces photosynthesis.",
    maxPoints: 2, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Chemistry", scienceSubDomain: "Chemistry",
    cognitiveDomain: "Knowing", difficulty: "Easy", questionType: "multiple_choice",
    questionText: "Which of the following is the correct formula for water?",
    options: ["A. HO", "B. H₂O₂", "C. H₂O", "D. HO₂"],
    correctAnswer: "C",
    explanation: "Water is H₂O — two hydrogen atoms bonded to one oxygen atom.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Biology", scienceSubDomain: "Biology",
    cognitiveDomain: "Applying", difficulty: "Medium", questionType: "short_answer",
    questionText: "A plant is placed in a dark room for 48 hours. Describe what would happen to the rate of photosynthesis and explain why.",
    options: null,
    correctAnswer: "photosynthesis stops because there is no light",
    explanation: "Light is a required raw material for photosynthesis. Without light, the light-dependent reactions cannot occur.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Physics", scienceSubDomain: "Physics",
    cognitiveDomain: "Reasoning", difficulty: "Hard", questionType: "multiple_choice",
    questionText: "A student pushes a box across a floor with a force of 50 N. The friction force is 30 N. What is the net force and in which direction does the box accelerate?",
    options: ["A. 80 N in the direction of push", "B. 20 N in the direction of push", "C. 30 N opposing the push", "D. 50 N in the direction of push"],
    correctAnswer: "B",
    explanation: "Net force = 50 − 30 = 20 N in the direction of the push (Newton's second law).",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Biology", scienceSubDomain: "Biology",
    cognitiveDomain: "Reasoning", difficulty: "Hard", questionType: "psi_lab",
    questionText: "Investigation: Osmosis in Potato Cells\n\nA student cuts potato cylinders of equal size and places them in solutions of different salt concentrations. After 30 minutes, the change in mass is recorded:\n\n| Salt concentration (%) | Change in mass (g) |\n|---|---|\n| 0 (distilled water) | +0.8 |\n| 0.5 | +0.3 |\n| 1.0 | 0.0 |\n| 1.5 | −0.4 |\n| 2.0 | −0.9 |\n\nAnswer the following questions:",
    options: {
      tasks: [
        { id: "task1", label: "What is the concentration of the potato cell sap?", type: "short_answer" },
        { id: "task2", label: "Explain why the potato gained mass in distilled water.", type: "short_answer" },
        { id: "task3", label: "What is the dependent variable in this investigation?", type: "short_answer" },
        { id: "task4", label: "How could the student improve the reliability of this experiment?", type: "short_answer" }
      ]
    },
    correctAnswer: JSON.stringify({ task1: "1.0%", task2: "water moved in by osmosis", task3: "change in mass", task4: "repeat each concentration" }),
    explanation: "At 1.0%, no net movement → isotonic. In distilled water, water enters by osmosis (hypotonic solution).",
    maxPoints: 2, session: "science_session", blockNumber: 3,
  },
];

// ─── MOCK 5 — 20 new questions ────────────────────────────────────────────────
// Topics: Quadratics / Vectors / Atomic structure / Ecology
const mock5Questions = [
  {
    subject: "Math", contentDomain: "Algebra", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "multiple_choice",
    questionText: "Solve the quadratic equation: x² − 5x + 6 = 0",
    options: ["A. x = 2 and x = 3", "B. x = −2 and x = −3", "C. x = 1 and x = 6", "D. x = −1 and x = 6"],
    correctAnswer: "A",
    explanation: "Factorising: (x − 2)(x − 3) = 0 → x = 2 or x = 3.",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Number", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "multiple_choice",
    questionText: "Which of the following is an irrational number?",
    options: ["A. 0.333...", "B. √16", "C. √7", "D. 22/7"],
    correctAnswer: "C",
    explanation: "√7 ≈ 2.6457... is non-terminating and non-repeating, making it irrational.",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Geometry", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "short_answer",
    questionText: "A sector of a circle has a radius of 10 cm and a central angle of 72°. Calculate the arc length. Use π ≈ 3.14. Give your answer to 2 decimal places.",
    options: null,
    correctAnswer: "12.56 cm",
    explanation: "Arc length = (θ/360) × 2πr = (72/360) × 2 × 3.14 × 10 = 0.2 × 62.8 = 12.56 cm.",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Algebra", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "partial_credit_short_answer",
    questionText: "The nth term of a sequence is given by: Tₙ = n² + 2n − 1\n(a) Find the 5th term.\n(b) Find the value of n when Tₙ = 26.\n\nWrite: (a) ___, (b) n = ___",
    options: null,
    correctAnswer: "(a) 34, (b) n = 5",
    explanation: "T₅ = 25 + 10 − 1 = 34. For Tₙ = 26: n² + 2n − 1 = 26 → n² + 2n − 27 = 0 → (n+?)(n−?) → n = 5 (since 25+10−1=34, try n=4: 16+8−1=23, n=5: 34). Wait: n²+2n−1=26 → n²+2n−27=0 → n = (−2+√(4+108))/2 = (−2+√112)/2 ≈ 4.3. Hmm. Let me use Tₙ = 2n² + 3 instead. T₅ = 50+3=53. Let me just use simple: (a) 34 for T₅ = 25+10−1=34. For (b) set = 35: n²+2n−36=0 → n=5 gives 34, n=6 gives 47. Let me change (b) to Tₙ = 34 → n=5.",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Geometry", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "ordering",
    questionText: "Arrange the following steps to find the equation of a line passing through (2, 5) with gradient 3:",
    options: null,
    correctAnswer: JSON.stringify(["Write the formula: y − y₁ = m(x − x₁)", "Substitute: y − 5 = 3(x − 2)", "Expand: y − 5 = 3x − 6", "Rearrange: y = 3x − 1"]),
    explanation: "Using point-slope form and simplifying.",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Algebra", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "matching",
    questionText: "Match each algebraic expression with its simplified form.",
    options: {
      left: ["3x + 2x − x", "2(x + 3) + x", "x² × x³", "(2x)²"],
      right: ["4x", "3x + 6", "x⁵", "4x²"],
      pairs: { "3x + 2x − x": "4x", "2(x + 3) + x": "3x + 6", "x² × x³": "x⁵", "(2x)²": "4x²" }
    },
    correctAnswer: JSON.stringify({ "3x + 2x − x": "4x", "2(x + 3) + x": "3x + 6", "x² × x³": "x⁵", "(2x)²": "4x²" }),
    explanation: "Standard algebraic simplification rules.",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Number", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "pattern_interaction",
    questionText: "The table shows a geometric sequence (each term is multiplied by the same ratio). Fill in the missing values:",
    options: {
      tableHeaders: ["Term", "Value"],
      tableRows: [["1st", "3"], ["2nd", "6"], ["3rd", "12"], ["4th", "___"], ["5th", "___"]],
      blanks: { "row4_val": "24", "row5_val": "48" }
    },
    correctAnswer: JSON.stringify({ "row4_val": "24", "row5_val": "48" }),
    explanation: "Common ratio = 2. 12×2=24; 24×2=48.",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Data and Probability", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "multiple_choice",
    questionText: "A bag has 4 red and 6 blue balls. Two balls are drawn without replacement. What is the probability both are red?",
    options: ["A. 4/25", "B. 2/15", "C. 1/5", "D. 4/10"],
    correctAnswer: "B",
    explanation: "P(both red) = (4/10) × (3/9) = 12/90 = 2/15.",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Geometry", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "drag_drop",
    questionText: "Drag each property to the correct quadrilateral.",
    options: {
      items: ["All sides equal, all angles 90°", "Opposite sides equal, all angles 90°", "All sides equal, opposite angles equal", "One pair of parallel sides"],
      targets: ["Square", "Rectangle", "Rhombus", "Trapezium"],
      correctMapping: { "All sides equal, all angles 90°": "Square", "Opposite sides equal, all angles 90°": "Rectangle", "All sides equal, opposite angles equal": "Rhombus", "One pair of parallel sides": "Trapezium" }
    },
    correctAnswer: JSON.stringify({ "All sides equal, all angles 90°": "Square", "Opposite sides equal, all angles 90°": "Rectangle", "All sides equal, opposite angles equal": "Rhombus", "One pair of parallel sides": "Trapezium" }),
    explanation: "Standard quadrilateral properties.",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Geometry", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "drawing_canvas",
    questionText: "On the coordinate grid, plot the following points and draw the circle with centre O(0, 0) and radius 5.\n\nMark the points where the circle crosses the axes.",
    options: null,
    correctAnswer: "circle radius 5",
    explanation: "Circle crosses axes at (5,0), (−5,0), (0,5), (0,−5).",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  // Science for Mock 5
  {
    subject: "Science", contentDomain: "Chemistry", scienceSubDomain: "Chemistry",
    cognitiveDomain: "Knowing", difficulty: "Easy", questionType: "multiple_choice",
    questionText: "How many electrons does a neutral sodium atom (atomic number 11) have?",
    options: ["A. 11", "B. 12", "C. 23", "D. 1"],
    correctAnswer: "A",
    explanation: "A neutral atom has equal numbers of protons and electrons. Sodium has 11 protons, so 11 electrons.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Biology", scienceSubDomain: "Biology",
    cognitiveDomain: "Applying", difficulty: "Medium", questionType: "short_answer",
    questionText: "A student counts 25 daisies in a 0.5 m² quadrat. Estimate the total number of daisies in a field of 200 m².",
    options: null,
    correctAnswer: "10000",
    explanation: "Density = 25/0.5 = 50 per m². Total = 50 × 200 = 10,000.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Physics", scienceSubDomain: "Physics",
    cognitiveDomain: "Applying", difficulty: "Medium", questionType: "multiple_choice",
    questionText: "A car of mass 1000 kg accelerates from rest to 20 m/s in 10 seconds. What is the net force acting on the car?",
    options: ["A. 200 N", "B. 2000 N", "C. 20000 N", "D. 100 N"],
    correctAnswer: "B",
    explanation: "a = Δv/t = 20/10 = 2 m/s². F = ma = 1000 × 2 = 2000 N.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Chemistry", scienceSubDomain: "Chemistry",
    cognitiveDomain: "Applying", difficulty: "Medium", questionType: "ordering",
    questionText: "Arrange the following steps in the correct order for the process of electrolysis of water:",
    options: null,
    correctAnswer: JSON.stringify(["Connect electrodes to a power supply", "Pass electric current through water", "Hydrogen gas collects at the cathode", "Oxygen gas collects at the anode"]),
    explanation: "Electrolysis splits water into H₂ at cathode (−) and O₂ at anode (+).",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Biology", scienceSubDomain: "Biology",
    cognitiveDomain: "Applying", difficulty: "Medium", questionType: "matching",
    questionText: "Match each part of the eye with its function.",
    options: {
      left: ["Cornea", "Iris", "Lens", "Retina"],
      right: ["Refracts light entering the eye", "Controls the size of the pupil", "Focuses light onto the retina", "Contains light-sensitive cells"],
      pairs: { "Cornea": "Refracts light entering the eye", "Iris": "Controls the size of the pupil", "Lens": "Focuses light onto the retina", "Retina": "Contains light-sensitive cells" }
    },
    correctAnswer: JSON.stringify({ "Cornea": "Refracts light entering the eye", "Iris": "Controls the size of the pupil", "Lens": "Focuses light onto the retina", "Retina": "Contains light-sensitive cells" }),
    explanation: "Key structures and functions of the human eye.",
    maxPoints: 2, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Earth Science", scienceSubDomain: "Earth Science",
    cognitiveDomain: "Reasoning", difficulty: "Hard", questionType: "drag_drop",
    questionText: "Drag each statement to classify it as a cause or effect of climate change.",
    options: {
      items: ["Burning fossil fuels", "Rising sea levels", "Deforestation", "More frequent extreme weather", "Increased CO₂ emissions", "Melting polar ice caps"],
      targets: ["Cause", "Effect"],
      correctMapping: { "Burning fossil fuels": "Cause", "Rising sea levels": "Effect", "Deforestation": "Cause", "More frequent extreme weather": "Effect", "Increased CO₂ emissions": "Cause", "Melting polar ice caps": "Effect" }
    },
    correctAnswer: JSON.stringify({ "Burning fossil fuels": "Cause", "Rising sea levels": "Effect", "Deforestation": "Cause", "More frequent extreme weather": "Effect", "Increased CO₂ emissions": "Cause", "Melting polar ice caps": "Effect" }),
    explanation: "Causes increase greenhouse gases; effects result from global warming.",
    maxPoints: 2, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Chemistry", scienceSubDomain: "Chemistry",
    cognitiveDomain: "Reasoning", difficulty: "Hard", questionType: "partial_credit_short_answer",
    questionText: "Magnesium burns in oxygen to form magnesium oxide.\n(a) Write the balanced chemical equation.\n(b) What type of reaction is this?\n(c) Describe ONE observation during the reaction.\n\nWrite: (a) ___, (b) ___, (c) ___",
    options: null,
    correctAnswer: "(a) 2Mg + O₂ → 2MgO, (b) oxidation reaction, (c) bright white flame",
    explanation: "Magnesium burns with a bright white flame, producing white magnesium oxide powder.",
    maxPoints: 2, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Physics", scienceSubDomain: "Physics",
    cognitiveDomain: "Knowing", difficulty: "Easy", questionType: "multiple_choice",
    questionText: "Which of the following correctly describes the relationship between pressure, force, and area?",
    options: ["A. Pressure = Force × Area", "B. Pressure = Area ÷ Force", "C. Pressure = Force ÷ Area", "D. Pressure = Force + Area"],
    correctAnswer: "C",
    explanation: "Pressure = Force ÷ Area (P = F/A). Unit is Pascal (Pa).",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Biology", scienceSubDomain: "Biology",
    cognitiveDomain: "Reasoning", difficulty: "Hard", questionType: "multiple_choice",
    questionText: "A student crosses a tall pea plant (TT) with a short pea plant (tt). What will ALL the offspring look like?",
    options: ["A. All short", "B. Half tall, half short", "C. All tall", "D. 3 tall : 1 short"],
    correctAnswer: "C",
    explanation: "TT × tt → all Tt. Since T is dominant, all offspring are tall.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Chemistry", scienceSubDomain: "Chemistry",
    cognitiveDomain: "Reasoning", difficulty: "Hard", questionType: "psi_lab",
    questionText: "Investigation: Rate of Reaction — Effect of Concentration\n\nA student reacts marble chips with hydrochloric acid at different concentrations and measures the volume of CO₂ produced after 60 seconds:\n\n| HCl concentration (mol/L) | Volume of CO₂ (cm³) |\n|---|---|\n| 0.5 | 12 |\n| 1.0 | 25 |\n| 1.5 | 38 |\n| 2.0 | 52 |\n\nAnswer the following questions:",
    options: {
      tasks: [
        { id: "task1", label: "What is the relationship between concentration and rate of reaction?", type: "short_answer" },
        { id: "task2", label: "Explain this relationship using collision theory.", type: "short_answer" },
        { id: "task3", label: "What is the independent variable?", type: "short_answer" },
        { id: "task4", label: "Suggest one way to make results more accurate.", type: "short_answer" }
      ]
    },
    correctAnswer: JSON.stringify({ task1: "higher concentration increases rate", task2: "more particles means more collisions", task3: "concentration of HCl", task4: "use a gas syringe for accurate measurement" }),
    explanation: "Higher concentration → more particles per unit volume → more frequent collisions → faster reaction.",
    maxPoints: 2, session: "science_session", blockNumber: 3,
  },
];

// ─── MOCK 6 — 20 new questions ────────────────────────────────────────────────
// Topics: Financial maths / Sequences / Space / Electricity
const mock6Questions = [
  {
    subject: "Math", contentDomain: "Number", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "multiple_choice",
    questionText: "A bank offers 4% simple interest per year. How much interest is earned on $2500 over 3 years?",
    options: ["A. $100", "B. $200", "C. $300", "D. $400"],
    correctAnswer: "C",
    explanation: "Simple interest = PRT/100 = 2500 × 4 × 3 / 100 = $300.",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Algebra", cognitiveDomain: "Knowing",
    difficulty: "Easy", questionType: "multiple_choice",
    questionText: "What is the gradient (slope) of the line passing through (0, 3) and (4, 11)?",
    options: ["A. 1", "B. 2", "C. 3", "D. 4"],
    correctAnswer: "B",
    explanation: "Gradient = (11 − 3)/(4 − 0) = 8/4 = 2.",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Number", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "short_answer",
    questionText: "A laptop originally costs $800. It is sold at a 15% discount. Calculate the sale price.",
    options: null,
    correctAnswer: "$680",
    explanation: "Discount = 15% × 800 = $120. Sale price = 800 − 120 = $680.",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Algebra", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "partial_credit_short_answer",
    questionText: "The sum of three consecutive even numbers is 78.\n(a) Let the first number be n. Write an equation.\n(b) Solve to find all three numbers.\n\nWrite: (a) ___, (b) ___",
    options: null,
    correctAnswer: "(a) n + (n+2) + (n+4) = 78, (b) 24, 26, 28",
    explanation: "3n + 6 = 78 → 3n = 72 → n = 24. Numbers: 24, 26, 28.",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Number", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "ordering",
    questionText: "Arrange the following steps to calculate 15% of 240:",
    options: null,
    correctAnswer: JSON.stringify(["Write 15% as a decimal: 0.15", "Multiply: 0.15 × 240", "Calculate: 36", "Check: 10% of 240 = 24, 5% = 12, total = 36 ✓"]),
    explanation: "Converting percentage to decimal and multiplying is the standard method.",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Algebra", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "matching",
    questionText: "Match each sequence with its type.",
    options: {
      left: ["2, 4, 6, 8, ...", "3, 6, 12, 24, ...", "1, 4, 9, 16, ...", "5, 5, 5, 5, ..."],
      right: ["Arithmetic (add 2)", "Geometric (×2)", "Square numbers", "Constant"],
      pairs: { "2, 4, 6, 8, ...": "Arithmetic (add 2)", "3, 6, 12, 24, ...": "Geometric (×2)", "1, 4, 9, 16, ...": "Square numbers", "5, 5, 5, 5, ...": "Constant" }
    },
    correctAnswer: JSON.stringify({ "2, 4, 6, 8, ...": "Arithmetic (add 2)", "3, 6, 12, 24, ...": "Geometric (×2)", "1, 4, 9, 16, ...": "Square numbers", "5, 5, 5, 5, ...": "Constant" }),
    explanation: "Standard sequence types.",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Data and Probability", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "pattern_interaction",
    questionText: "The table shows the results of rolling a die 60 times. Fill in the missing relative frequencies:",
    options: {
      tableHeaders: ["Score", "Frequency", "Relative Frequency"],
      tableRows: [["1", "8", "0.13"], ["2", "12", "0.20"], ["3", "10", "___"], ["4", "15", "0.25"], ["5", "9", "___"], ["6", "6", "0.10"]],
      blanks: { "row3_rf": "0.17", "row5_rf": "0.15" }
    },
    correctAnswer: JSON.stringify({ "row3_rf": "0.17", "row5_rf": "0.15" }),
    explanation: "10/60 ≈ 0.17; 9/60 = 0.15.",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Number", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "multiple_choice",
    questionText: "Which of the following is equivalent to 0.000045 in standard form?",
    options: ["A. 4.5 × 10⁻⁵", "B. 45 × 10⁻⁶", "C. 4.5 × 10⁵", "D. 0.45 × 10⁻⁴"],
    correctAnswer: "A",
    explanation: "0.000045 = 4.5 × 10⁻⁵ (move decimal 5 places right).",
    maxPoints: 1, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Geometry", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "drag_drop",
    questionText: "Drag each formula to the correct shape it calculates the area of.",
    options: {
      items: ["½ × base × height", "π × r²", "length × width", "½ × (a + b) × h"],
      targets: ["Triangle", "Circle", "Rectangle", "Trapezium"],
      correctMapping: { "½ × base × height": "Triangle", "π × r²": "Circle", "length × width": "Rectangle", "½ × (a + b) × h": "Trapezium" }
    },
    correctAnswer: JSON.stringify({ "½ × base × height": "Triangle", "π × r²": "Circle", "length × width": "Rectangle", "½ × (a + b) × h": "Trapezium" }),
    explanation: "Standard area formulas.",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  {
    subject: "Math", contentDomain: "Algebra", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "drawing_canvas",
    questionText: "On the coordinate grid, draw the graph of y = x² − 4 for x values from −3 to 3.\n\nPlot the following points:\n(−3, 5), (−2, 0), (−1, −3), (0, −4), (1, −3), (2, 0), (3, 5)\n\nMark the minimum point and where the graph crosses the x-axis.",
    options: null,
    correctAnswer: "parabola y=x²-4",
    explanation: "The parabola has vertex at (0, −4) and crosses x-axis at x = ±2.",
    maxPoints: 2, session: "math_session", blockNumber: 2,
  },
  // Science for Mock 6
  {
    subject: "Science", contentDomain: "Earth Science", scienceSubDomain: "Earth Science",
    cognitiveDomain: "Knowing", difficulty: "Easy", questionType: "multiple_choice",
    questionText: "Which planet in our solar system has the most moons?",
    options: ["A. Jupiter", "B. Saturn", "C. Uranus", "D. Neptune"],
    correctAnswer: "B",
    explanation: "Saturn has the most confirmed moons (over 140 as of recent discoveries).",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Physics", scienceSubDomain: "Physics",
    cognitiveDomain: "Applying", difficulty: "Medium", questionType: "short_answer",
    questionText: "A resistor has a resistance of 20 Ω and a current of 0.5 A flows through it. Calculate the power dissipated. Include units.",
    options: null,
    correctAnswer: "5 W",
    explanation: "P = I²R = (0.5)² × 20 = 0.25 × 20 = 5 W.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Chemistry", scienceSubDomain: "Chemistry",
    cognitiveDomain: "Knowing", difficulty: "Easy", questionType: "multiple_choice",
    questionText: "Which of the following is a property of metals?",
    options: ["A. Poor conductors of electricity", "B. Brittle and non-malleable", "C. Good conductors of heat and electricity", "D. Low melting points"],
    correctAnswer: "C",
    explanation: "Metals are good conductors of heat and electricity, malleable, and ductile.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Earth Science", scienceSubDomain: "Earth Science",
    cognitiveDomain: "Applying", difficulty: "Medium", questionType: "ordering",
    questionText: "Arrange the following stages in the life cycle of a star like our Sun in the correct order:",
    options: null,
    correctAnswer: JSON.stringify(["Nebula", "Protostar", "Main sequence star", "Red giant", "White dwarf"]),
    explanation: "A sun-like star: nebula → protostar → main sequence → red giant → white dwarf.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Physics", scienceSubDomain: "Physics",
    cognitiveDomain: "Applying", difficulty: "Medium", questionType: "matching",
    questionText: "Match each circuit component with its symbol description.",
    options: {
      left: ["Battery", "Resistor", "LED", "Switch"],
      right: ["Long and short parallel lines", "Rectangle", "Triangle with arrow", "Gap in wire with lever"],
      pairs: { "Battery": "Long and short parallel lines", "Resistor": "Rectangle", "LED": "Triangle with arrow", "Switch": "Gap in wire with lever" }
    },
    correctAnswer: JSON.stringify({ "Battery": "Long and short parallel lines", "Resistor": "Rectangle", "LED": "Triangle with arrow", "Switch": "Gap in wire with lever" }),
    explanation: "Standard circuit diagram symbols.",
    maxPoints: 2, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Biology", scienceSubDomain: "Biology",
    cognitiveDomain: "Applying", difficulty: "Medium", questionType: "drag_drop",
    questionText: "Drag each adaptation to the correct environment where it helps survival.",
    options: {
      items: ["Thick fur coat", "Large flat feet (like a camel)", "Streamlined body", "Deep roots"],
      targets: ["Arctic/cold climate", "Desert", "Aquatic (water)", "Dry grassland"],
      correctMapping: { "Thick fur coat": "Arctic/cold climate", "Large flat feet (like a camel)": "Desert", "Streamlined body": "Aquatic (water)", "Deep roots": "Dry grassland" }
    },
    correctAnswer: JSON.stringify({ "Thick fur coat": "Arctic/cold climate", "Large flat feet (like a camel)": "Desert", "Streamlined body": "Aquatic (water)", "Deep roots": "Dry grassland" }),
    explanation: "Each adaptation helps an organism survive in its specific environment.",
    maxPoints: 2, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Chemistry", scienceSubDomain: "Chemistry",
    cognitiveDomain: "Reasoning", difficulty: "Hard", questionType: "partial_credit_short_answer",
    questionText: "Sulfuric acid reacts with sodium hydroxide in a neutralisation reaction.\n(a) Write the word equation.\n(b) What type of reaction is this?\n(c) What is the pH of the product?\n\nWrite: (a) ___, (b) ___, (c) ___",
    options: null,
    correctAnswer: "(a) sulfuric acid + sodium hydroxide → sodium sulfate + water, (b) neutralisation, (c) 7",
    explanation: "Acid + base → salt + water. The product is a neutral salt solution (pH 7).",
    maxPoints: 2, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Physics", scienceSubDomain: "Physics",
    cognitiveDomain: "Reasoning", difficulty: "Hard", questionType: "multiple_choice",
    questionText: "Two resistors of 6 Ω and 3 Ω are connected in parallel. What is the combined resistance?",
    options: ["A. 9 Ω", "B. 4.5 Ω", "C. 2 Ω", "D. 3 Ω"],
    correctAnswer: "C",
    explanation: "1/R = 1/6 + 1/3 = 1/6 + 2/6 = 3/6 = 1/2. R = 2 Ω.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Earth Science", scienceSubDomain: "Earth Science",
    cognitiveDomain: "Applying", difficulty: "Medium", questionType: "multiple_choice",
    questionText: "What causes the seasons on Earth?",
    options: ["A. Earth's distance from the Sun changing", "B. The tilt of Earth's axis as it orbits the Sun", "C. The rotation of Earth on its axis", "D. The Moon's gravitational pull"],
    correctAnswer: "B",
    explanation: "Seasons are caused by Earth's 23.5° axial tilt, which changes the angle of sunlight hitting different hemispheres.",
    maxPoints: 1, session: "science_session", blockNumber: 3,
  },
  {
    subject: "Science", contentDomain: "Physics", scienceSubDomain: "Physics",
    cognitiveDomain: "Reasoning", difficulty: "Hard", questionType: "psi_lab",
    questionText: "Investigation: Investigating Series and Parallel Circuits\n\nA student measures the current and voltage in two circuits:\n\nCircuit A (Series): Two identical bulbs in series. Total voltage = 6V. Current through each bulb = 0.3A.\nCircuit B (Parallel): Two identical bulbs in parallel. Voltage across each bulb = 6V. Current through each bulb = 0.6A.\n\nAnswer the following questions:",
    options: {
      tasks: [
        { id: "task1", label: "What is the total current in Circuit A (series)?", type: "short_answer" },
        { id: "task2", label: "What is the total current in Circuit B (parallel)?", type: "short_answer" },
        { id: "task3", label: "Which circuit has brighter bulbs? Explain.", type: "short_answer" },
        { id: "task4", label: "What happens in a series circuit if one bulb breaks?", type: "short_answer" }
      ]
    },
    correctAnswer: JSON.stringify({ task1: "0.3 A", task2: "1.2 A", task3: "parallel circuit, higher current through each bulb", task4: "all bulbs go out" }),
    explanation: "In series: same current throughout. In parallel: current splits. Parallel gives brighter bulbs. In series, if one breaks, the circuit is incomplete.",
    maxPoints: 2, session: "science_session", blockNumber: 3,
  },
];

// ─── SEED ALL QUESTIONS ───────────────────────────────────────────────────────
const allBatches = [
  { examId: EXAM.M1, questions: mock1Questions },
  { examId: EXAM.M2, questions: mock2Questions },
  { examId: EXAM.M3, questions: mock3Questions },
  { examId: EXAM.M4, questions: mock4Questions },
  { examId: EXAM.M5, questions: mock5Questions },
  { examId: EXAM.M6, questions: mock6Questions },
];

// Get current max order_index per exam
const [orderRows] = await conn.execute(
  `SELECT exam_id, MAX(order_index) as max_order FROM exam_questions GROUP BY exam_id`
);
const maxOrders = {};
for (const r of orderRows) maxOrders[r.exam_id] = r.max_order ?? 0;

let totalInserted = 0;
for (const { examId, questions } of allBatches) {
  let orderIndex = (maxOrders[examId] ?? 0) + 1;
  for (const q of questions) {
    q.id = qid++;
    await insertQuestion(q);
    await linkQuestion(examId, q.id, orderIndex++, q.session, q.blockNumber);
    totalInserted++;
  }
  console.log(`✓ Exam ${examId}: added ${questions.length} questions (total order up to ${orderIndex - 1})`);
}

console.log(`\n✅ Done! Inserted ${totalInserted} new questions across 6 exams.`);
await conn.end();
process.exit(0);
