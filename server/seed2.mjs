/**
 * TIMSS 2027-aligned Grade 8 Mock Assessment — Enhanced Question Seed
 * Covers all question types: multiple_choice, short_answer, drag_drop, matching, ordering
 * Math domains: Number, Algebra, Geometry, Data and Probability
 * Science domains: Biology, Chemistry, Physics, Earth Science
 * Cognitive domains: Knowing, Applying, Reasoning
 */

import mysql from "mysql2/promise";

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

const conn = await mysql.createConnection(DB_URL);
console.log("Connected to database");

// ─── Clear existing questions and exam-question links ─────────────────────────
await conn.execute("DELETE FROM exam_questions");
await conn.execute("DELETE FROM questions");
console.log("Cleared existing questions");

// ─── Question bank ────────────────────────────────────────────────────────────

const questions = [

  // ════════════════════════════════════════════════════════════════════════════
  // MATHEMATICS — NUMBER
  // ════════════════════════════════════════════════════════════════════════════
  {
    subject: "Math", contentDomain: "Number", cognitiveDomain: "Knowing",
    difficulty: "Easy", questionType: "multiple_choice",
    questionText: "Which of the following is equivalent to 3.6 × 10⁻⁴?",
    options: JSON.stringify([
      { label: "A", text: "0.00036" },
      { label: "B", text: "0.0036" },
      { label: "C", text: "36,000" },
      { label: "D", text: "0.000036" }
    ]),
    correctAnswer: "A", interactiveData: null, imageUrl: null
  },
  {
    subject: "Math", contentDomain: "Number", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "multiple_choice",
    questionText: "A jacket costs $120. During a sale, the price is reduced by 35%. What is the sale price of the jacket?",
    options: JSON.stringify([
      { label: "A", text: "$42" },
      { label: "B", text: "$78" },
      { label: "C", text: "$85" },
      { label: "D", text: "$84" }
    ]),
    correctAnswer: "B", interactiveData: null, imageUrl: null
  },
  {
    subject: "Math", contentDomain: "Number", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "short_answer",
    questionText: "The ratio of boys to girls in a school is 5 : 7. If there are 420 girls, how many students are in the school altogether? Show your working.",
    options: null,
    correctAnswer: "720", interactiveData: null, imageUrl: null
  },
  {
    subject: "Math", contentDomain: "Number", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "multiple_choice",
    questionText: "What is the value of (−3)³ + √64?",
    options: JSON.stringify([
      { label: "A", text: "−19" },
      { label: "B", text: "−35" },
      { label: "C", text: "−27" },
      { label: "D", text: "19" }
    ]),
    correctAnswer: "A", interactiveData: null, imageUrl: null
  },
  {
    subject: "Math", contentDomain: "Number", cognitiveDomain: "Knowing",
    difficulty: "Easy", questionType: "ordering",
    questionText: "Arrange the following numbers in order from least to greatest.",
    options: null,
    correctAnswer: JSON.stringify(["item1", "item4", "item2", "item3"]),
    interactiveData: JSON.stringify({
      items: [
        { id: "item1", text: "−0.75" },
        { id: "item2", text: "3/4" },
        { id: "item3", text: "1.2" },
        { id: "item4", text: "−1/3" }
      ],
      correctOrder: ["item1", "item4", "item2", "item3"]
    }),
    imageUrl: null
  },

  // ════════════════════════════════════════════════════════════════════════════
  // MATHEMATICS — ALGEBRA
  // ════════════════════════════════════════════════════════════════════════════
  {
    subject: "Math", contentDomain: "Algebra", cognitiveDomain: "Knowing",
    difficulty: "Easy", questionType: "multiple_choice",
    questionText: "If 4x − 7 = 13, what is the value of x?",
    options: JSON.stringify([
      { label: "A", text: "1.5" },
      { label: "B", text: "5" },
      { label: "C", text: "6" },
      { label: "D", text: "20" }
    ]),
    correctAnswer: "B", interactiveData: null, imageUrl: null
  },
  {
    subject: "Math", contentDomain: "Algebra", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "multiple_choice",
    questionText: "A mobile phone plan charges a fixed monthly fee of $15 plus $0.05 per text message. Which equation represents the total monthly cost C for sending n text messages?",
    options: JSON.stringify([
      { label: "A", text: "C = 15n + 0.05" },
      { label: "B", text: "C = 0.05n + 15" },
      { label: "C", text: "C = 15 − 0.05n" },
      { label: "D", text: "C = 0.05(n + 15)" }
    ]),
    correctAnswer: "B", interactiveData: null, imageUrl: null
  },
  {
    subject: "Math", contentDomain: "Algebra", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "short_answer",
    questionText: "The sum of three consecutive even integers is 78. Write an equation and solve to find the three integers.",
    options: null,
    correctAnswer: "24, 26, 28", interactiveData: null, imageUrl: null
  },
  {
    subject: "Math", contentDomain: "Algebra", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "multiple_choice",
    questionText: "Which graph represents the equation y = −2x + 3?\n\nA: A line with positive slope crossing the y-axis at 3\nB: A line with slope −2 crossing the y-axis at 3\nC: A line with slope −2 crossing the x-axis at 3\nD: A parabola opening downward",
    options: JSON.stringify([
      { label: "A", text: "A line with positive slope crossing the y-axis at 3" },
      { label: "B", text: "A line with slope −2 crossing the y-axis at 3" },
      { label: "C", text: "A line with slope −2 crossing the x-axis at 3" },
      { label: "D", text: "A parabola opening downward" }
    ]),
    correctAnswer: "B", interactiveData: null, imageUrl: null
  },
  {
    subject: "Math", contentDomain: "Algebra", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "drag_drop",
    questionText: "Match each algebraic expression on the left with its equivalent simplified form. Drag each expression to the correct box.",
    options: null,
    correctAnswer: JSON.stringify({ "expr1": "box1", "expr2": "box2", "expr3": "box3", "expr4": "box4" }),
    interactiveData: JSON.stringify({
      items: [
        { id: "expr1", text: "3(2x − 4)" },
        { id: "expr2", text: "(x + 3)²" },
        { id: "expr3", text: "5x − 2x + 7" },
        { id: "expr4", text: "2(x + 1) + 3(x − 2)" }
      ],
      targets: [
        { id: "box1", label: "6x − 12" },
        { id: "box2", label: "x² + 6x + 9" },
        { id: "box3", label: "3x + 7" },
        { id: "box4", label: "5x − 4" }
      ],
      correctMapping: { "expr1": "box1", "expr2": "box2", "expr3": "box3", "expr4": "box4" }
    }),
    imageUrl: null
  },

  // ════════════════════════════════════════════════════════════════════════════
  // MATHEMATICS — GEOMETRY
  // ════════════════════════════════════════════════════════════════════════════
  {
    subject: "Math", contentDomain: "Geometry", cognitiveDomain: "Knowing",
    difficulty: "Easy", questionType: "multiple_choice",
    questionText: "A right triangle has legs of length 6 cm and 8 cm. What is the length of the hypotenuse?",
    options: JSON.stringify([
      { label: "A", text: "10 cm" },
      { label: "B", text: "14 cm" },
      { label: "C", text: "7 cm" },
      { label: "D", text: "100 cm" }
    ]),
    correctAnswer: "A", interactiveData: null, imageUrl: null
  },
  {
    subject: "Math", contentDomain: "Geometry", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "multiple_choice",
    questionText: "A cylinder has a radius of 5 cm and a height of 12 cm. What is the volume of the cylinder? (Use π ≈ 3.14)",
    options: JSON.stringify([
      { label: "A", text: "942 cm³" },
      { label: "B", text: "376.8 cm³" },
      { label: "C", text: "1884 cm³" },
      { label: "D", text: "471 cm³" }
    ]),
    correctAnswer: "A", interactiveData: null, imageUrl: null
  },
  {
    subject: "Math", contentDomain: "Geometry", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "short_answer",
    questionText: "Two parallel lines are cut by a transversal. One of the co-interior (same-side interior) angles measures 112°. What is the measure of the other co-interior angle? Explain your reasoning using the properties of parallel lines.",
    options: null,
    correctAnswer: "68", interactiveData: null, imageUrl: null
  },
  {
    subject: "Math", contentDomain: "Geometry", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "matching",
    questionText: "Match each geometric shape in Column A with its correct area formula in Column B.",
    options: null,
    correctAnswer: JSON.stringify({ "shape1": "formula1", "shape2": "formula2", "shape3": "formula3", "shape4": "formula4" }),
    interactiveData: JSON.stringify({
      leftItems: [
        { id: "shape1", text: "Circle" },
        { id: "shape2", text: "Trapezoid" },
        { id: "shape3", text: "Triangle" },
        { id: "shape4", text: "Parallelogram" }
      ],
      rightItems: [
        { id: "formula1", text: "A = πr²" },
        { id: "formula2", text: "A = ½(b₁ + b₂)h" },
        { id: "formula3", text: "A = ½bh" },
        { id: "formula4", text: "A = bh" }
      ],
      correctPairs: { "shape1": "formula1", "shape2": "formula2", "shape3": "formula3", "shape4": "formula4" }
    }),
    imageUrl: null
  },
  {
    subject: "Math", contentDomain: "Geometry", cognitiveDomain: "Knowing",
    difficulty: "Easy", questionType: "multiple_choice",
    questionText: "In triangle ABC, angle A = 45° and angle B = 75°. What is the measure of angle C?",
    options: JSON.stringify([
      { label: "A", text: "40°" },
      { label: "B", text: "60°" },
      { label: "C", text: "120°" },
      { label: "D", text: "80°" }
    ]),
    correctAnswer: "B", interactiveData: null, imageUrl: null
  },

  // ════════════════════════════════════════════════════════════════════════════
  // MATHEMATICS — DATA AND PROBABILITY
  // ════════════════════════════════════════════════════════════════════════════
  {
    subject: "Math", contentDomain: "Data and Probability", cognitiveDomain: "Knowing",
    difficulty: "Easy", questionType: "multiple_choice",
    questionText: "The ages of 7 students are: 13, 14, 13, 15, 14, 13, 16.\nWhat is the mode of this data set?",
    options: JSON.stringify([
      { label: "A", text: "14" },
      { label: "B", text: "13" },
      { label: "C", text: "15" },
      { label: "D", text: "16" }
    ]),
    correctAnswer: "B", interactiveData: null, imageUrl: null
  },
  {
    subject: "Math", contentDomain: "Data and Probability", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "multiple_choice",
    questionText: "A bag contains 4 red marbles, 3 blue marbles, and 5 green marbles. If one marble is drawn at random, what is the probability of drawing a blue marble?",
    options: JSON.stringify([
      { label: "A", text: "1/4" },
      { label: "B", text: "3/12" },
      { label: "C", text: "1/3" },
      { label: "D", text: "5/12" }
    ]),
    correctAnswer: "B", interactiveData: null, imageUrl: null
  },
  {
    subject: "Math", contentDomain: "Data and Probability", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "short_answer",
    questionText: "The mean score of 6 students on a test is 72. A seventh student joins the group and the new mean becomes 74. What was the seventh student's score? Show your working.",
    options: null,
    correctAnswer: "86", interactiveData: null, imageUrl: null
  },
  {
    subject: "Math", contentDomain: "Data and Probability", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "ordering",
    questionText: "A student recorded the following test scores: 88, 72, 95, 61, 88, 79, 95, 88.\nArrange the steps for finding the median in the correct order.",
    options: null,
    correctAnswer: JSON.stringify(["step1", "step2", "step3", "step4"]),
    interactiveData: JSON.stringify({
      items: [
        { id: "step1", text: "Step 1: Write the scores in order from least to greatest" },
        { id: "step2", text: "Step 2: Count the number of data values (8 values)" },
        { id: "step3", text: "Step 3: Identify the two middle values (4th and 5th)" },
        { id: "step4", text: "Step 4: Calculate the average of the two middle values" }
      ],
      correctOrder: ["step1", "step2", "step3", "step4"]
    }),
    imageUrl: null
  },

  // ════════════════════════════════════════════════════════════════════════════
  // SCIENCE — BIOLOGY
  // ════════════════════════════════════════════════════════════════════════════
  {
    subject: "Science", contentDomain: "Biology", cognitiveDomain: "Knowing",
    difficulty: "Easy", questionType: "multiple_choice",
    questionText: "Which organelle is responsible for producing energy (ATP) in a cell through cellular respiration?",
    options: JSON.stringify([
      { label: "A", text: "Nucleus" },
      { label: "B", text: "Ribosome" },
      { label: "C", text: "Mitochondria" },
      { label: "D", text: "Chloroplast" }
    ]),
    correctAnswer: "C", interactiveData: null, imageUrl: null
  },
  {
    subject: "Science", contentDomain: "Biology", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "multiple_choice",
    questionText: "A student places a red blood cell in a solution and observes that the cell swells and eventually bursts. What type of solution was the cell placed in?",
    options: JSON.stringify([
      { label: "A", text: "Hypertonic solution" },
      { label: "B", text: "Isotonic solution" },
      { label: "C", text: "Hypotonic solution" },
      { label: "D", text: "Saturated solution" }
    ]),
    correctAnswer: "C", interactiveData: null, imageUrl: null
  },
  {
    subject: "Science", contentDomain: "Biology", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "short_answer",
    questionText: "Explain why a plant placed in a dark room for several days would eventually turn yellow and die. In your answer, refer to the role of chlorophyll and photosynthesis.",
    options: null,
    correctAnswer: "Without light, photosynthesis cannot occur; chlorophyll breaks down without light; plant cannot produce glucose for energy",
    interactiveData: null, imageUrl: null
  },
  {
    subject: "Science", contentDomain: "Biology", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "drag_drop",
    questionText: "Classify each organism into the correct kingdom by dragging it to the appropriate box.",
    options: null,
    correctAnswer: JSON.stringify({ "org1": "kingdom1", "org2": "kingdom2", "org3": "kingdom3", "org4": "kingdom4" }),
    interactiveData: JSON.stringify({
      items: [
        { id: "org1", text: "Mushroom (multicellular, absorbs nutrients)" },
        { id: "org2", text: "Amoeba (single-celled, no nucleus membrane)" },
        { id: "org3", text: "Oak tree (multicellular, produces own food)" },
        { id: "org4", text: "Bacterium (no membrane-bound nucleus)" }
      ],
      targets: [
        { id: "kingdom1", label: "Kingdom Fungi" },
        { id: "kingdom2", label: "Kingdom Protista" },
        { id: "kingdom3", label: "Kingdom Plantae" },
        { id: "kingdom4", label: "Kingdom Monera (Bacteria)" }
      ],
      correctMapping: { "org1": "kingdom1", "org2": "kingdom2", "org3": "kingdom3", "org4": "kingdom4" }
    }),
    imageUrl: null
  },
  {
    subject: "Science", contentDomain: "Biology", cognitiveDomain: "Knowing",
    difficulty: "Easy", questionType: "matching",
    questionText: "Match each part of the human digestive system in Column A with its primary function in Column B.",
    options: null,
    correctAnswer: JSON.stringify({ "organ1": "func1", "organ2": "func2", "organ3": "func3", "organ4": "func4" }),
    interactiveData: JSON.stringify({
      leftItems: [
        { id: "organ1", text: "Stomach" },
        { id: "organ2", text: "Small intestine" },
        { id: "organ3", text: "Large intestine" },
        { id: "organ4", text: "Liver" }
      ],
      rightItems: [
        { id: "func1", text: "Churns food and begins protein digestion with acid" },
        { id: "func2", text: "Absorbs most nutrients into the bloodstream" },
        { id: "func3", text: "Absorbs water and forms solid waste" },
        { id: "func4", text: "Produces bile to emulsify fats" }
      ],
      correctPairs: { "organ1": "func1", "organ2": "func2", "organ3": "func3", "organ4": "func4" }
    }),
    imageUrl: null
  },

  // ════════════════════════════════════════════════════════════════════════════
  // SCIENCE — CHEMISTRY
  // ════════════════════════════════════════════════════════════════════════════
  {
    subject: "Science", contentDomain: "Chemistry", cognitiveDomain: "Knowing",
    difficulty: "Easy", questionType: "multiple_choice",
    questionText: "An atom of carbon has 6 protons and 6 neutrons. What is its mass number?",
    options: JSON.stringify([
      { label: "A", text: "6" },
      { label: "B", text: "12" },
      { label: "C", text: "18" },
      { label: "D", text: "3" }
    ]),
    correctAnswer: "B", interactiveData: null, imageUrl: null
  },
  {
    subject: "Science", contentDomain: "Chemistry", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "multiple_choice",
    questionText: "When iron (Fe) reacts with oxygen (O₂) to form iron oxide (Fe₂O₃), what type of chemical reaction is this?",
    options: JSON.stringify([
      { label: "A", text: "Decomposition reaction" },
      { label: "B", text: "Synthesis (combination) reaction" },
      { label: "C", text: "Double displacement reaction" },
      { label: "D", text: "Neutralisation reaction" }
    ]),
    correctAnswer: "B", interactiveData: null, imageUrl: null
  },
  {
    subject: "Science", contentDomain: "Chemistry", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "short_answer",
    questionText: "A student adds a piece of zinc metal to a solution of hydrochloric acid (HCl) and observes bubbles forming. Identify the type of reaction, name the gas produced, and write a word equation for the reaction.",
    options: null,
    correctAnswer: "Single displacement; hydrogen gas; zinc + hydrochloric acid → zinc chloride + hydrogen",
    interactiveData: null, imageUrl: null
  },
  {
    subject: "Science", contentDomain: "Chemistry", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "ordering",
    questionText: "Arrange the following steps of the scientific method in the correct order.",
    options: null,
    correctAnswer: JSON.stringify(["sci1", "sci2", "sci3", "sci4", "sci5"]),
    interactiveData: JSON.stringify({
      items: [
        { id: "sci1", text: "Identify the problem or ask a question" },
        { id: "sci2", text: "Form a hypothesis" },
        { id: "sci3", text: "Design and conduct an experiment" },
        { id: "sci4", text: "Collect and analyse data" },
        { id: "sci5", text: "Draw a conclusion and communicate results" }
      ],
      correctOrder: ["sci1", "sci2", "sci3", "sci4", "sci5"]
    }),
    imageUrl: null
  },
  {
    subject: "Science", contentDomain: "Chemistry", cognitiveDomain: "Knowing",
    difficulty: "Easy", questionType: "matching",
    questionText: "Match each substance in Column A with its correct pH classification in Column B.",
    options: null,
    correctAnswer: JSON.stringify({ "sub1": "ph1", "sub2": "ph2", "sub3": "ph3", "sub4": "ph4" }),
    interactiveData: JSON.stringify({
      leftItems: [
        { id: "sub1", text: "Lemon juice (pH 2)" },
        { id: "sub2", text: "Pure water (pH 7)" },
        { id: "sub3", text: "Baking soda solution (pH 9)" },
        { id: "sub4", text: "Bleach (pH 13)" }
      ],
      rightItems: [
        { id: "ph1", text: "Strong acid" },
        { id: "ph2", text: "Neutral" },
        { id: "ph3", text: "Weak base" },
        { id: "ph4", text: "Strong base" }
      ],
      correctPairs: { "sub1": "ph1", "sub2": "ph2", "sub3": "ph3", "sub4": "ph4" }
    }),
    imageUrl: null
  },

  // ════════════════════════════════════════════════════════════════════════════
  // SCIENCE — PHYSICS
  // ════════════════════════════════════════════════════════════════════════════
  {
    subject: "Science", contentDomain: "Physics", cognitiveDomain: "Knowing",
    difficulty: "Easy", questionType: "multiple_choice",
    questionText: "A car travels 150 km in 3 hours. What is its average speed?",
    options: JSON.stringify([
      { label: "A", text: "450 km/h" },
      { label: "B", text: "50 km/h" },
      { label: "C", text: "153 km/h" },
      { label: "D", text: "0.02 km/h" }
    ]),
    correctAnswer: "B", interactiveData: null, imageUrl: null
  },
  {
    subject: "Science", contentDomain: "Physics", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "multiple_choice",
    questionText: "A ball is thrown upward with an initial velocity of 20 m/s. Ignoring air resistance, what happens to the ball's kinetic energy as it rises?",
    options: JSON.stringify([
      { label: "A", text: "It increases because the ball is moving upward" },
      { label: "B", text: "It decreases as kinetic energy is converted to potential energy" },
      { label: "C", text: "It remains constant because energy is conserved" },
      { label: "D", text: "It first increases then decreases" }
    ]),
    correctAnswer: "B", interactiveData: null, imageUrl: null
  },
  {
    subject: "Science", contentDomain: "Physics", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "short_answer",
    questionText: "A student pushes a 10 kg box across a frictionless floor with a force of 40 N. Using Newton's second law of motion, calculate the acceleration of the box. Show your working and include the correct unit.",
    options: null,
    correctAnswer: "4 m/s²", interactiveData: null, imageUrl: null
  },
  {
    subject: "Science", contentDomain: "Physics", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "drag_drop",
    questionText: "Classify each wave property or example by dragging it to the correct wave type.",
    options: null,
    correctAnswer: JSON.stringify({ "wave1": "wtype1", "wave2": "wtype2", "wave3": "wtype1", "wave4": "wtype2" }),
    interactiveData: JSON.stringify({
      items: [
        { id: "wave1", text: "Sound waves in air" },
        { id: "wave2", text: "Light waves from the Sun" },
        { id: "wave3", text: "Particles vibrate parallel to wave direction" },
        { id: "wave4", text: "Can travel through a vacuum" }
      ],
      targets: [
        { id: "wtype1", label: "Longitudinal Wave" },
        { id: "wtype2", label: "Transverse Wave" }
      ],
      correctMapping: { "wave1": "wtype1", "wave2": "wtype2", "wave3": "wtype1", "wave4": "wtype2" }
    }),
    imageUrl: null
  },
  {
    subject: "Science", contentDomain: "Physics", cognitiveDomain: "Knowing",
    difficulty: "Easy", questionType: "multiple_choice",
    questionText: "Which of the following is a unit of electrical resistance?",
    options: JSON.stringify([
      { label: "A", text: "Ampere (A)" },
      { label: "B", text: "Volt (V)" },
      { label: "C", text: "Ohm (Ω)" },
      { label: "D", text: "Watt (W)" }
    ]),
    correctAnswer: "C", interactiveData: null, imageUrl: null
  },

  // ════════════════════════════════════════════════════════════════════════════
  // SCIENCE — EARTH SCIENCE
  // ════════════════════════════════════════════════════════════════════════════
  {
    subject: "Science", contentDomain: "Earth Science", cognitiveDomain: "Knowing",
    difficulty: "Easy", questionType: "multiple_choice",
    questionText: "Which layer of the Earth is composed primarily of solid iron and nickel?",
    options: JSON.stringify([
      { label: "A", text: "Mantle" },
      { label: "B", text: "Outer core" },
      { label: "C", text: "Crust" },
      { label: "D", text: "Inner core" }
    ]),
    correctAnswer: "D", interactiveData: null, imageUrl: null
  },
  {
    subject: "Science", contentDomain: "Earth Science", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "multiple_choice",
    questionText: "A geologist finds rock layers in the following order from bottom to top: sandstone, limestone, shale, granite. Which rock layer is most likely the oldest?",
    options: JSON.stringify([
      { label: "A", text: "Granite (top)" },
      { label: "B", text: "Shale" },
      { label: "C", text: "Limestone" },
      { label: "D", text: "Sandstone (bottom)" }
    ]),
    correctAnswer: "D", interactiveData: null, imageUrl: null
  },
  {
    subject: "Science", contentDomain: "Earth Science", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "short_answer",
    questionText: "Explain how the greenhouse effect contributes to global warming. In your answer, describe the role of greenhouse gases such as carbon dioxide and methane, and explain why increasing concentrations of these gases leads to a rise in global temperatures.",
    options: null,
    correctAnswer: "Greenhouse gases trap heat/infrared radiation from Earth's surface; increasing CO2 and methane from human activity enhances this effect; more heat is retained causing temperature rise",
    interactiveData: null, imageUrl: null
  },
  {
    subject: "Science", contentDomain: "Earth Science", cognitiveDomain: "Applying",
    difficulty: "Medium", questionType: "ordering",
    questionText: "Arrange the following stages of the water cycle in the correct order, starting from the ocean.",
    options: null,
    correctAnswer: JSON.stringify(["wc1", "wc2", "wc3", "wc4", "wc5"]),
    interactiveData: JSON.stringify({
      items: [
        { id: "wc1", text: "Evaporation: water from the ocean turns to water vapour" },
        { id: "wc2", text: "Condensation: water vapour cools and forms clouds" },
        { id: "wc3", text: "Precipitation: water falls as rain or snow" },
        { id: "wc4", text: "Surface runoff: water flows into rivers and lakes" },
        { id: "wc5", text: "Collection: water returns to the ocean" }
      ],
      correctOrder: ["wc1", "wc2", "wc3", "wc4", "wc5"]
    }),
    imageUrl: null
  },
  {
    subject: "Science", contentDomain: "Earth Science", cognitiveDomain: "Knowing",
    difficulty: "Easy", questionType: "matching",
    questionText: "Match each type of plate boundary in Column A with the geological feature it typically produces in Column B.",
    options: null,
    correctAnswer: JSON.stringify({ "bound1": "feat1", "bound2": "feat2", "bound3": "feat3" }),
    interactiveData: JSON.stringify({
      leftItems: [
        { id: "bound1", text: "Convergent boundary (oceanic-continental)" },
        { id: "bound2", text: "Divergent boundary" },
        { id: "bound3", text: "Transform boundary" }
      ],
      rightItems: [
        { id: "feat1", text: "Subduction zone and volcanic mountains" },
        { id: "feat2", text: "Mid-ocean ridge and rift valley" },
        { id: "feat3", text: "Earthquakes along a fault line" }
      ],
      correctPairs: { "bound1": "feat1", "bound2": "feat2", "bound3": "feat3" }
    }),
    imageUrl: null
  },

  // ════════════════════════════════════════════════════════════════════════════
  // ADDITIONAL MIXED QUESTIONS FOR MOCK 2
  // ════════════════════════════════════════════════════════════════════════════
  {
    subject: "Math", contentDomain: "Number", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "multiple_choice",
    questionText: "If p is a prime number greater than 2, which of the following must be true?\n\nI. p is odd\nII. p + 1 is even\nIII. p² is prime",
    options: JSON.stringify([
      { label: "A", text: "I only" },
      { label: "B", text: "I and II only" },
      { label: "C", text: "II and III only" },
      { label: "D", text: "I, II, and III" }
    ]),
    correctAnswer: "B", interactiveData: null, imageUrl: null
  },
  {
    subject: "Math", contentDomain: "Algebra", cognitiveDomain: "Knowing",
    difficulty: "Easy", questionType: "multiple_choice",
    questionText: "What is the value of the expression 2a² − 3b when a = 3 and b = 4?",
    options: JSON.stringify([
      { label: "A", text: "6" },
      { label: "B", text: "30" },
      { label: "C", text: "18" },
      { label: "D", text: "−6" }
    ]),
    correctAnswer: "A", interactiveData: null, imageUrl: null
  },
  {
    subject: "Science", contentDomain: "Biology", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "multiple_choice",
    questionText: "A scientist observes that a species of bird on an isolated island has a beak shape very different from its mainland relatives. Over thousands of years, the island birds developed longer, curved beaks suited to feeding on nectar from flowers. Which process best explains this change?",
    options: JSON.stringify([
      { label: "A", text: "Artificial selection by human farmers" },
      { label: "B", text: "Natural selection favouring birds with longer beaks in the island environment" },
      { label: "C", text: "Lamarckian inheritance of acquired characteristics" },
      { label: "D", text: "Genetic mutation caused by island climate" }
    ]),
    correctAnswer: "B", interactiveData: null, imageUrl: null
  },
  {
    subject: "Science", contentDomain: "Physics", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "short_answer",
    questionText: "A circuit contains a 12 V battery and two resistors connected in series: R₁ = 4 Ω and R₂ = 8 Ω. Calculate: (a) the total resistance, (b) the current flowing through the circuit, and (c) the voltage drop across R₁. Show all working.",
    options: null,
    correctAnswer: "12 Ω; 1 A; 4 V",
    interactiveData: null, imageUrl: null
  },
  {
    subject: "Math", contentDomain: "Data and Probability", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "multiple_choice",
    questionText: "Two fair six-sided dice are rolled. What is the probability that the sum of the two dice is greater than 9?",
    options: JSON.stringify([
      { label: "A", text: "1/6" },
      { label: "B", text: "1/4" },
      { label: "C", text: "1/9" },
      { label: "D", text: "5/18" }
    ]),
    correctAnswer: "A", interactiveData: null, imageUrl: null
  },
  {
    subject: "Science", contentDomain: "Chemistry", cognitiveDomain: "Reasoning",
    difficulty: "Hard", questionType: "multiple_choice",
    questionText: "A student dissolves 20 g of salt in 80 g of water to make a solution. What is the mass percent concentration of the salt in the solution?",
    options: JSON.stringify([
      { label: "A", text: "20%" },
      { label: "B", text: "25%" },
      { label: "C", text: "80%" },
      { label: "D", text: "16%" }
    ]),
    correctAnswer: "A", interactiveData: null, imageUrl: null
  }
];

// ─── Insert questions ─────────────────────────────────────────────────────────
const insertedIds = [];
for (const q of questions) {
  const [result] = await conn.execute(
    `INSERT INTO questions (subject, contentDomain, cognitiveDomain, difficulty, questionType, questionText, options, correctAnswer, interactiveData, imageUrl, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [q.subject, q.contentDomain, q.cognitiveDomain, q.difficulty, q.questionType,
     q.questionText, q.options, q.correctAnswer, q.interactiveData, q.imageUrl]
  );
  insertedIds.push(result.insertId);
}
console.log(`Inserted ${insertedIds.length} questions`);

// ─── Get exam IDs ─────────────────────────────────────────────────────────────
const [exams] = await conn.execute("SELECT id, name FROM exams ORDER BY id ASC");
console.log("Exams found:", exams.map(e => `${e.id}: ${e.name}`).join(", "));

if (exams.length < 2) {
  console.error("Need at least 2 exams in the database");
  process.exit(1);
}

const mock1Id = exams[0].id;
const mock2Id = exams[1].id;

// Mock 1: first 30 questions (balanced Math + Science, all types)
const mock1Questions = insertedIds.slice(0, 30);
// Mock 2: last questions + first 10 for variety
const mock2Questions = [...insertedIds.slice(30), ...insertedIds.slice(0, 10)];

let order = 1;
for (const qId of mock1Questions) {
  await conn.execute(
    "INSERT INTO exam_questions (examId, questionId, questionOrder, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())",
    [mock1Id, qId, order++]
  );
}
console.log(`Assigned ${mock1Questions.length} questions to Mock 1`);

order = 1;
for (const qId of mock2Questions) {
  await conn.execute(
    "INSERT INTO exam_questions (examId, questionId, questionOrder, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())",
    [mock2Id, qId, order++]
  );
}
console.log(`Assigned ${mock2Questions.length} questions to Mock 2`);

await conn.end();
console.log("✅ Enhanced seed complete!");
