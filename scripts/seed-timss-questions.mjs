/**
 * TIMSS Grade 8 Expanded Question Bank Seed Script
 * Seeds Mock Exam 1 with 30 questions across 4 blocks (2 Math + 2 Science),
 * covering all question types including drawing_canvas, pattern_interaction, psi_lab,
 * partial_credit_short_answer, drag_drop, matching, ordering, and multiple_choice.
 *
 * Block structure (TIMSS-style):
 *   Block 1 (M1): Math questions 1-15  → Session 1 (Math, 45 min)
 *   Block 2 (M2): Math questions 16-30 → Session 1 (Math, 45 min) [rotation alt]
 *   Block 3 (S1): Science questions 1-15 → Session 2 (Science, 45 min)
 *   Block 4 (S2): Science questions 16-30 → Session 2 (Science, 45 min) [rotation alt]
 *
 * For Mock 1: Class 8A gets Blocks 1 + 3 (15 Math + 15 Science = 30 questions)
 */

import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const db = await mysql.createConnection(process.env.DATABASE_URL);

// ─── Clear existing questions and exam_questions for Mock 1 ──────────────────
await db.execute("DELETE FROM exam_questions WHERE exam_id = 30007");
await db.execute("DELETE FROM exam_blocks WHERE exam_id = 30007");
await db.execute("DELETE FROM questions");

// ─── Update Mock Exam 1 to use two-session structure ─────────────────────────
await db.execute(
  `UPDATE exams SET session1_minutes=45, break_minutes=5, session2_minutes=45, use_block_rotation=true WHERE id=30007`
);

// ─── Question definitions ─────────────────────────────────────────────────────
// Block 1 (M1): 15 Math questions — Session 1
// Block 3 (S1): 15 Science questions — Session 2

const questions = [
  // ══════════════════════════════════════════════════════════════════
  // BLOCK 1 — MATH SESSION (Questions 1-15)
  // ══════════════════════════════════════════════════════════════════

  // Q1: Multiple choice — Number / Knowing / Easy
  {
    subject: "Math", contentDomain: "Number", scienceSubDomain: null,
    session: "math_session", blockNumber: 1,
    cognitiveDomain: "Knowing", difficulty: "Easy",
    questionType: "multiple_choice", maxPoints: 1,
    questionText: "Which of the following is equivalent to 3.6 × 10⁻⁴?",
    options: JSON.stringify([
      { id: "A", text: "0.00036" }, { id: "B", text: "0.0036" },
      { id: "C", text: "36,000" }, { id: "D", text: "0.000036" }
    ]),
    correctAnswer: "A",
    explanation: "3.6 × 10⁻⁴ = 3.6 ÷ 10000 = 0.00036",
    interactiveData: null, imageUrl: null
  },

  // Q2: Multiple choice — Number / Applying / Medium
  {
    subject: "Math", contentDomain: "Number", scienceSubDomain: null,
    session: "math_session", blockNumber: 1,
    cognitiveDomain: "Applying", difficulty: "Medium",
    questionType: "multiple_choice", maxPoints: 1,
    questionText: "A jacket costs $120. It is on sale for 35% off. What is the sale price?",
    options: JSON.stringify([
      { id: "A", text: "$42" }, { id: "B", text: "$78" },
      { id: "C", text: "$85" }, { id: "D", text: "$92" }
    ]),
    correctAnswer: "B",
    explanation: "Discount = 35% × 120 = 42. Sale price = 120 − 42 = $78",
    interactiveData: null, imageUrl: null
  },

  // Q3: Partial credit short answer — Algebra / Reasoning / Hard
  {
    subject: "Math", contentDomain: "Algebra", scienceSubDomain: null,
    session: "math_session", blockNumber: 1,
    cognitiveDomain: "Reasoning", difficulty: "Hard",
    questionType: "partial_credit_short_answer", maxPoints: 2,
    questionText: "Solve for x and show your working: 3(2x − 4) = 2(x + 6)\n\nWrite your answer as x = ___",
    options: null,
    correctAnswer: "x = 6",
    explanation: "Full marks (2): correct answer x=6 with valid working shown.\nPartial (1): correct method but arithmetic error, or correct answer without working.\nZero (0): incorrect method.",
    interactiveData: null, imageUrl: null
  },

  // Q4: Ordering — Algebra / Applying / Medium
  {
    subject: "Math", contentDomain: "Algebra", scienceSubDomain: null,
    session: "math_session", blockNumber: 1,
    cognitiveDomain: "Applying", difficulty: "Medium",
    questionType: "ordering", maxPoints: 1,
    questionText: "Arrange the following steps in the correct order to solve the equation 2x + 5 = 13.",
    options: null,
    correctAnswer: "step1,step2,step3",
    explanation: "Step 1: Subtract 5 from both sides → 2x = 8. Step 2: Divide both sides by 2 → x = 4. Step 3: Check: 2(4)+5=13 ✓",
    interactiveData: JSON.stringify({
      items: [
        { id: "step1", text: "Subtract 5 from both sides: 2x = 8" },
        { id: "step3", text: "Check your answer: 2(4) + 5 = 13 ✓" },
        { id: "step2", text: "Divide both sides by 2: x = 4" }
      ],
      correctOrder: ["step1", "step2", "step3"]
    }),
    imageUrl: null
  },

  // Q5: Pattern interaction — Number / Knowing / Easy
  {
    subject: "Math", contentDomain: "Number", scienceSubDomain: null,
    session: "math_session", blockNumber: 1,
    cognitiveDomain: "Knowing", difficulty: "Easy",
    questionType: "pattern_interaction", maxPoints: 1,
    questionText: "The sequence below follows a rule. Click on the correct missing values to complete the pattern.",
    options: null,
    correctAnswer: "25,36",
    explanation: "The pattern is perfect squares: 1, 4, 9, 16, 25, 36, 49. Missing values are 25 and 36.",
    interactiveData: JSON.stringify({
      patternType: "sequence",
      displayItems: [
        { id: "p1", value: "1", isBlank: false },
        { id: "p2", value: "4", isBlank: false },
        { id: "p3", value: "9", isBlank: false },
        { id: "p4", value: "16", isBlank: false },
        { id: "p5", value: "?", isBlank: true, correctValue: "25" },
        { id: "p6", value: "?", isBlank: true, correctValue: "36" },
        { id: "p7", value: "49", isBlank: false }
      ],
      choices: ["20", "25", "30", "36", "42", "48"]
    }),
    imageUrl: null
  },

  // Q6: Drawing canvas — Geometry / Applying / Medium
  {
    subject: "Math", contentDomain: "Geometry", scienceSubDomain: null,
    session: "math_session", blockNumber: 1,
    cognitiveDomain: "Applying", difficulty: "Medium",
    questionType: "drawing_canvas", maxPoints: 2,
    questionText: "On the coordinate grid below, plot the triangle with vertices at A(1, 2), B(5, 2), and C(3, 6). Then draw the line of symmetry of the triangle.",
    options: null,
    correctAnswer: "triangle_with_symmetry",
    explanation: "The triangle has a vertical line of symmetry at x = 3. Full marks: correct triangle + correct line of symmetry. Partial: correct triangle only.",
    interactiveData: JSON.stringify({
      canvasType: "graph",
      width: 400,
      height: 400,
      gridLines: true,
      axes: true,
      xRange: [0, 8],
      yRange: [0, 8],
      prompt: "Draw the triangle ABC and its line of symmetry",
      scoringHints: {
        fullCredit: "Triangle with vertices at (1,2), (5,2), (3,6) AND vertical line at x=3",
        partialCredit: "Correct triangle vertices only, no line of symmetry"
      }
    }),
    imageUrl: null
  },

  // Q7: Multiple choice — Geometry / Knowing / Easy
  {
    subject: "Math", contentDomain: "Geometry", scienceSubDomain: null,
    session: "math_session", blockNumber: 1,
    cognitiveDomain: "Knowing", difficulty: "Easy",
    questionType: "multiple_choice", maxPoints: 1,
    questionText: "What is the sum of interior angles of a hexagon?",
    options: JSON.stringify([
      { id: "A", text: "540°" }, { id: "B", text: "720°" },
      { id: "C", text: "900°" }, { id: "D", text: "1080°" }
    ]),
    correctAnswer: "B",
    explanation: "Sum of interior angles = (n − 2) × 180° = (6 − 2) × 180° = 720°",
    interactiveData: null, imageUrl: null
  },

  // Q8: Drag-drop — Data and Probability / Applying / Medium
  {
    subject: "Math", contentDomain: "Data and Probability", scienceSubDomain: null,
    session: "math_session", blockNumber: 1,
    cognitiveDomain: "Applying", difficulty: "Medium",
    questionType: "drag_drop", maxPoints: 1,
    questionText: "A bag contains 3 red, 5 blue, and 2 green marbles. Drag each event to the correct probability category.",
    options: null,
    correctAnswer: JSON.stringify({ "ev1": "tg2", "ev2": "tg1", "ev3": "tg3" }),
    explanation: "P(red) = 3/10 = unlikely. P(blue) = 5/10 = equally likely. P(not green) = 8/10 = likely.",
    interactiveData: JSON.stringify({
      items: [
        { id: "ev1", text: "Drawing a red marble" },
        { id: "ev2", text: "Drawing a blue marble" },
        { id: "ev3", text: "Drawing a marble that is NOT green" }
      ],
      targets: [
        { id: "tg1", label: "Equally Likely (50%)" },
        { id: "tg2", label: "Unlikely (less than 50%)" },
        { id: "tg3", label: "Likely (more than 50%)" }
      ],
      correctMapping: { "ev1": "tg2", "ev2": "tg1", "ev3": "tg3" }
    }),
    imageUrl: null
  },

  // Q9: Multiple choice — Algebra / Reasoning / Hard
  {
    subject: "Math", contentDomain: "Algebra", scienceSubDomain: null,
    session: "math_session", blockNumber: 1,
    cognitiveDomain: "Reasoning", difficulty: "Hard",
    questionType: "multiple_choice", maxPoints: 1,
    questionText: "If f(x) = 2x² − 3x + 1, what is f(−2)?",
    options: JSON.stringify([
      { id: "A", text: "3" }, { id: "B", text: "11" },
      { id: "C", text: "15" }, { id: "D", text: "−1" }
    ]),
    correctAnswer: "C",
    explanation: "f(−2) = 2(−2)² − 3(−2) + 1 = 2(4) + 6 + 1 = 8 + 6 + 1 = 15",
    interactiveData: null, imageUrl: null
  },

  // Q10: Matching — Geometry / Knowing / Easy
  {
    subject: "Math", contentDomain: "Geometry", scienceSubDomain: null,
    session: "math_session", blockNumber: 1,
    cognitiveDomain: "Knowing", difficulty: "Easy",
    questionType: "matching", maxPoints: 1,
    questionText: "Match each shape on the left with its correct property on the right.",
    options: null,
    correctAnswer: JSON.stringify({ "s1": "p3", "s2": "p1", "s3": "p4", "s4": "p2" }),
    explanation: "Equilateral triangle: all sides equal. Rectangle: 4 right angles. Rhombus: all sides equal, no right angles. Trapezoid: exactly one pair of parallel sides.",
    interactiveData: JSON.stringify({
      leftItems: [
        { id: "s1", text: "Equilateral Triangle" },
        { id: "s2", text: "Rectangle" },
        { id: "s3", text: "Rhombus" },
        { id: "s4", text: "Trapezoid" }
      ],
      rightItems: [
        { id: "p1", text: "Has 4 right angles" },
        { id: "p2", text: "Exactly one pair of parallel sides" },
        { id: "p3", text: "All three sides are equal" },
        { id: "p4", text: "All sides equal, no right angles" }
      ],
      correctPairs: { "s1": "p3", "s2": "p1", "s3": "p4", "s4": "p2" }
    }),
    imageUrl: null
  },

  // Q11: Short answer — Number / Applying / Medium
  {
    subject: "Math", contentDomain: "Number", scienceSubDomain: null,
    session: "math_session", blockNumber: 1,
    cognitiveDomain: "Applying", difficulty: "Medium",
    questionType: "short_answer", maxPoints: 1,
    questionText: "A recipe requires 2¾ cups of flour. If you want to make 1½ times the recipe, how many cups of flour do you need? Write your answer as a mixed number.",
    options: null,
    correctAnswer: "4 1/8",
    explanation: "2¾ × 1½ = 11/4 × 3/2 = 33/8 = 4⅛ cups",
    interactiveData: null, imageUrl: null
  },

  // Q12: Multiple choice — Data and Probability / Reasoning / Hard
  {
    subject: "Math", contentDomain: "Data and Probability", scienceSubDomain: null,
    session: "math_session", blockNumber: 1,
    cognitiveDomain: "Reasoning", difficulty: "Hard",
    questionType: "multiple_choice", maxPoints: 1,
    questionText: "The mean of 5 numbers is 12. If four of the numbers are 8, 10, 15, and 14, what is the fifth number?",
    options: JSON.stringify([
      { id: "A", text: "11" }, { id: "B", text: "13" },
      { id: "C", text: "12" }, { id: "D", text: "9" }
    ]),
    correctAnswer: "B",
    explanation: "Sum = 5 × 12 = 60. Known sum = 8+10+15+14 = 47. Fifth number = 60 − 47 = 13.",
    interactiveData: null, imageUrl: null
  },

  // Q13: Pattern interaction — Algebra / Applying / Medium
  {
    subject: "Math", contentDomain: "Algebra", scienceSubDomain: null,
    session: "math_session", blockNumber: 1,
    cognitiveDomain: "Applying", difficulty: "Medium",
    questionType: "pattern_interaction", maxPoints: 1,
    questionText: "The table shows a linear relationship between x and y. Click the correct missing values to complete the table.",
    options: null,
    correctAnswer: "8,14",
    explanation: "The rule is y = 2x + 2. When x=3, y=8. When x=6, y=14.",
    interactiveData: JSON.stringify({
      patternType: "table",
      headers: ["x", "y"],
      rows: [
        { id: "r1", values: ["1", "4"], blanks: [] },
        { id: "r2", values: ["2", "6"], blanks: [] },
        { id: "r3", values: ["3", "?"], blanks: ["y"], correctValues: { y: "8" } },
        { id: "r4", values: ["4", "10"], blanks: [] },
        { id: "r5", values: ["5", "12"], blanks: [] },
        { id: "r6", values: ["6", "?"], blanks: ["y"], correctValues: { y: "14" } }
      ],
      choices: ["7", "8", "11", "13", "14", "16"]
    }),
    imageUrl: null
  },

  // Q14: Drawing canvas — Geometry / Reasoning / Hard
  {
    subject: "Math", contentDomain: "Geometry", scienceSubDomain: null,
    session: "math_session", blockNumber: 1,
    cognitiveDomain: "Reasoning", difficulty: "Hard",
    questionType: "drawing_canvas", maxPoints: 2,
    questionText: "The diagram shows a right-angled triangle with legs of 6 cm and 8 cm. Draw the altitude from the right angle to the hypotenuse, and label its length.",
    options: null,
    correctAnswer: "altitude_4.8cm",
    explanation: "Hypotenuse = 10 cm (Pythagorean theorem). Altitude = (6 × 8) / 10 = 4.8 cm. Full marks: correct altitude drawn AND labeled 4.8 cm. Partial: altitude drawn but not labeled.",
    interactiveData: JSON.stringify({
      canvasType: "geometry",
      width: 400,
      height: 300,
      prompt: "Draw the altitude from the right angle to the hypotenuse and label its length",
      preDrawnElements: [
        { type: "triangle", vertices: [{ x: 50, y: 250 }, { x: 290, y: 250 }, { x: 50, y: 50 }], labels: ["6 cm (vertical)", "8 cm (horizontal)", "hypotenuse"] }
      ],
      scoringHints: {
        fullCredit: "Altitude drawn from right angle to hypotenuse AND labeled 4.8 cm",
        partialCredit: "Altitude drawn correctly but not labeled"
      }
    }),
    imageUrl: null
  },

  // Q15: Multiple choice — Algebra / Applying / Medium
  {
    subject: "Math", contentDomain: "Algebra", scienceSubDomain: null,
    session: "math_session", blockNumber: 1,
    cognitiveDomain: "Applying", difficulty: "Medium",
    questionType: "multiple_choice", maxPoints: 1,
    questionText: "Which graph best represents the equation y = −2x + 3?",
    options: JSON.stringify([
      { id: "A", text: "A line with positive slope crossing y-axis at 3" },
      { id: "B", text: "A line with negative slope crossing y-axis at 3" },
      { id: "C", text: "A line with negative slope crossing y-axis at −2" },
      { id: "D", text: "A parabola opening downward" }
    ]),
    correctAnswer: "B",
    explanation: "y = −2x + 3 has slope −2 (negative, going down left to right) and y-intercept at 3.",
    interactiveData: null, imageUrl: null
  },

  // ══════════════════════════════════════════════════════════════════
  // BLOCK 3 — SCIENCE SESSION (Questions 16-30)
  // ══════════════════════════════════════════════════════════════════

  // Q16: PSI Lab — Biology / Applying / Medium
  {
    subject: "Science", contentDomain: "Biology", scienceSubDomain: "Biology",
    session: "science_session", blockNumber: 3,
    cognitiveDomain: "Applying", difficulty: "Medium",
    questionType: "psi_lab", maxPoints: 2,
    questionText: "In this investigation, you will explore how light intensity affects the rate of photosynthesis in aquatic plants. Read the scenario and answer the tasks below.",
    options: null,
    correctAnswer: JSON.stringify({ task1: "increases", task2: "carbon_dioxide_and_water", task3: "chlorophyll" }),
    explanation: "As light intensity increases, photosynthesis rate increases (up to a limit). Photosynthesis uses CO₂ and water. Chlorophyll is the pigment that absorbs light.",
    interactiveData: JSON.stringify({
      scenario: "An aquatic plant (Elodea) is placed in water under a lamp. The distance between the lamp and the plant is varied, and the number of oxygen bubbles produced per minute is counted.",
      variables: [
        { name: "Distance from lamp (cm)", unit: "cm", values: [10, 20, 30, 40, 50] },
        { name: "Bubbles per minute", unit: "bubbles/min", values: [45, 30, 18, 10, 5] }
      ],
      hypothesis: "As the distance from the light source increases, the rate of photosynthesis ___.",
      tasks: [
        {
          id: "task1",
          instruction: "Based on the data, as the lamp moves farther away, the rate of photosynthesis:",
          type: "multiple_choice",
          choices: ["increases", "decreases", "stays the same", "first increases then decreases"],
          correctAnswer: "decreases"
        },
        {
          id: "task2",
          instruction: "What two raw materials does the plant use in photosynthesis?",
          type: "multiple_choice",
          choices: ["oxygen_and_glucose", "carbon_dioxide_and_water", "nitrogen_and_oxygen", "glucose_and_water"],
          correctAnswer: "carbon_dioxide_and_water"
        },
        {
          id: "task3",
          instruction: "Which pigment in plant cells absorbs light energy for photosynthesis?",
          type: "short_answer",
          correctAnswer: "chlorophyll"
        }
      ]
    }),
    imageUrl: null
  },

  // Q17: Multiple choice — Earth Science / Knowing / Easy
  {
    subject: "Science", contentDomain: "Earth Science", scienceSubDomain: "Earth Science",
    session: "science_session", blockNumber: 3,
    cognitiveDomain: "Knowing", difficulty: "Easy",
    questionType: "multiple_choice", maxPoints: 1,
    questionText: "Which layer of Earth's atmosphere contains the ozone layer that protects life from harmful ultraviolet radiation?",
    options: JSON.stringify([
      { id: "A", text: "Troposphere" }, { id: "B", text: "Stratosphere" },
      { id: "C", text: "Mesosphere" }, { id: "D", text: "Thermosphere" }
    ]),
    correctAnswer: "B",
    explanation: "The ozone layer is located in the stratosphere, approximately 15–35 km above Earth's surface.",
    interactiveData: null, imageUrl: null
  },

  // Q18: Matching — Chemistry / Knowing / Easy
  {
    subject: "Science", contentDomain: "Chemistry", scienceSubDomain: "Chemistry",
    session: "science_session", blockNumber: 3,
    cognitiveDomain: "Knowing", difficulty: "Easy",
    questionType: "matching", maxPoints: 1,
    questionText: "Match each element symbol on the left with its element name on the right.",
    options: null,
    correctAnswer: JSON.stringify({ "e1": "n3", "e2": "n1", "e3": "n4", "e4": "n2" }),
    explanation: "Na = Sodium, Fe = Iron, Au = Gold, K = Potassium",
    interactiveData: JSON.stringify({
      leftItems: [
        { id: "e1", text: "Na" }, { id: "e2", text: "Fe" },
        { id: "e3", text: "Au" }, { id: "e4", text: "K" }
      ],
      rightItems: [
        { id: "n1", text: "Iron" }, { id: "n2", text: "Potassium" },
        { id: "n3", text: "Sodium" }, { id: "n4", text: "Gold" }
      ],
      correctPairs: { "e1": "n3", "e2": "n1", "e3": "n4", "e4": "n2" }
    }),
    imageUrl: null
  },

  // Q19: Drag-drop — Physics / Applying / Medium
  {
    subject: "Science", contentDomain: "Physics", scienceSubDomain: "Physics",
    session: "science_session", blockNumber: 3,
    cognitiveDomain: "Applying", difficulty: "Medium",
    questionType: "drag_drop", maxPoints: 1,
    questionText: "Drag each energy transformation to the correct device that performs it.",
    options: null,
    correctAnswer: JSON.stringify({ "t1": "d2", "t2": "d3", "t3": "d1", "t4": "d4" }),
    explanation: "Solar panel: light→electrical. Motor: electrical→kinetic. Battery: chemical→electrical. Loudspeaker: electrical→sound.",
    interactiveData: JSON.stringify({
      items: [
        { id: "t1", text: "Light energy → Electrical energy" },
        { id: "t2", text: "Electrical energy → Kinetic energy" },
        { id: "t3", text: "Chemical energy → Electrical energy" },
        { id: "t4", text: "Electrical energy → Sound energy" }
      ],
      targets: [
        { id: "d1", label: "Battery" },
        { id: "d2", label: "Solar Panel" },
        { id: "d3", label: "Electric Motor" },
        { id: "d4", label: "Loudspeaker" }
      ],
      correctMapping: { "t1": "d2", "t2": "d3", "t3": "d1", "t4": "d4" }
    }),
    imageUrl: null
  },

  // Q20: Multiple choice — Biology / Applying / Medium
  {
    subject: "Science", contentDomain: "Biology", scienceSubDomain: "Biology",
    session: "science_session", blockNumber: 3,
    cognitiveDomain: "Applying", difficulty: "Medium",
    questionType: "multiple_choice", maxPoints: 1,
    questionText: "A student observes that plants in a shaded area have larger leaves than plants of the same species in a sunny area. What is the most likely explanation?",
    options: JSON.stringify([
      { id: "A", text: "Shaded plants have more chlorophyll per cell" },
      { id: "B", text: "Larger leaves increase the surface area to capture more light" },
      { id: "C", text: "Shaded plants need less water so they grow larger" },
      { id: "D", text: "Larger leaves reduce the rate of photosynthesis" }
    ]),
    correctAnswer: "B",
    explanation: "In low-light conditions, plants adapt by growing larger leaves to maximize the surface area available for capturing sunlight for photosynthesis.",
    interactiveData: null, imageUrl: null
  },

  // Q21: Ordering — Earth Science / Applying / Medium
  {
    subject: "Science", contentDomain: "Earth Science", scienceSubDomain: "Earth Science",
    session: "science_session", blockNumber: 3,
    cognitiveDomain: "Applying", difficulty: "Medium",
    questionType: "ordering", maxPoints: 1,
    questionText: "Arrange the following stages of the water cycle in the correct order, starting from ocean evaporation.",
    options: null,
    correctAnswer: "ev,co,pr,ru,in",
    explanation: "Evaporation → Condensation → Precipitation → Surface runoff → Infiltration back to groundwater",
    interactiveData: JSON.stringify({
      items: [
        { id: "pr", text: "Precipitation (rain/snow falls)" },
        { id: "co", text: "Condensation (water vapor forms clouds)" },
        { id: "in", text: "Infiltration (water seeps into ground)" },
        { id: "ev", text: "Evaporation (water rises from ocean)" },
        { id: "ru", text: "Surface runoff (water flows to rivers)" }
      ],
      correctOrder: ["ev", "co", "pr", "ru", "in"]
    }),
    imageUrl: null
  },

  // Q22: Partial credit short answer — Chemistry / Reasoning / Hard
  {
    subject: "Science", contentDomain: "Chemistry", scienceSubDomain: "Chemistry",
    session: "science_session", blockNumber: 3,
    cognitiveDomain: "Reasoning", difficulty: "Hard",
    questionType: "partial_credit_short_answer", maxPoints: 2,
    questionText: "Balance the following chemical equation and explain what the law it demonstrates:\n\n___ H₂ + ___ O₂ → ___ H₂O\n\nWrite the balanced equation and name the law.",
    options: null,
    correctAnswer: "2H₂ + O₂ → 2H₂O; Law of Conservation of Mass",
    explanation: "Full marks (2): Correct balanced equation (2H₂ + O₂ → 2H₂O) AND correctly names Law of Conservation of Mass.\nPartial (1): Correct balanced equation only, OR correct law name only.\nZero (0): Neither correct.",
    interactiveData: null, imageUrl: null
  },

  // Q23: Multiple choice — Physics / Knowing / Easy
  {
    subject: "Science", contentDomain: "Physics", scienceSubDomain: "Physics",
    session: "science_session", blockNumber: 3,
    cognitiveDomain: "Knowing", difficulty: "Easy",
    questionType: "multiple_choice", maxPoints: 1,
    questionText: "What is the SI unit of electric current?",
    options: JSON.stringify([
      { id: "A", text: "Volt (V)" }, { id: "B", text: "Ohm (Ω)" },
      { id: "C", text: "Ampere (A)" }, { id: "D", text: "Watt (W)" }
    ]),
    correctAnswer: "C",
    explanation: "The SI unit of electric current is the Ampere (A), named after André-Marie Ampère.",
    interactiveData: null, imageUrl: null
  },

  // Q24: PSI Lab — Physics / Reasoning / Hard
  {
    subject: "Science", contentDomain: "Physics", scienceSubDomain: "Physics",
    session: "science_session", blockNumber: 3,
    cognitiveDomain: "Reasoning", difficulty: "Hard",
    questionType: "psi_lab", maxPoints: 2,
    questionText: "In this investigation, you will examine the relationship between force and acceleration. Study the data and answer the tasks.",
    options: null,
    correctAnswer: JSON.stringify({ task1: "directly_proportional", task2: "newton_second_law", task3: "4" }),
    explanation: "Newton's 2nd Law: F = ma. As force increases, acceleration increases proportionally (constant mass). If F=8N and a=2m/s², then m=4kg.",
    interactiveData: JSON.stringify({
      scenario: "A cart of constant mass is pushed with different forces on a frictionless surface. The resulting acceleration is measured.",
      variables: [
        { name: "Force (N)", unit: "N", values: [2, 4, 6, 8, 10] },
        { name: "Acceleration (m/s²)", unit: "m/s²", values: [0.5, 1.0, 1.5, 2.0, 2.5] }
      ],
      tasks: [
        {
          id: "task1",
          instruction: "What is the relationship between force and acceleration shown in this data?",
          type: "multiple_choice",
          choices: ["directly_proportional", "inversely_proportional", "no_relationship", "exponential"],
          correctAnswer: "directly_proportional"
        },
        {
          id: "task2",
          instruction: "Which law of motion does this investigation demonstrate?",
          type: "multiple_choice",
          choices: ["newton_first_law", "newton_second_law", "newton_third_law", "law_of_gravity"],
          correctAnswer: "newton_second_law"
        },
        {
          id: "task3",
          instruction: "Using the data, calculate the mass of the cart in kg. (Hint: use F = ma with any data pair)",
          type: "short_answer",
          correctAnswer: "4"
        }
      ]
    }),
    imageUrl: null
  },

  // Q25: Multiple choice — Biology / Reasoning / Hard
  {
    subject: "Science", contentDomain: "Biology", scienceSubDomain: "Biology",
    session: "science_session", blockNumber: 3,
    cognitiveDomain: "Reasoning", difficulty: "Hard",
    questionType: "multiple_choice", maxPoints: 1,
    questionText: "A scientist discovers a new organism that has a cell wall, can photosynthesize, and has no membrane-bound nucleus. To which kingdom does this organism most likely belong?",
    options: JSON.stringify([
      { id: "A", text: "Plantae" }, { id: "B", text: "Fungi" },
      { id: "C", text: "Monera (Bacteria)" }, { id: "D", text: "Protista" }
    ]),
    correctAnswer: "C",
    explanation: "The organism is prokaryotic (no membrane-bound nucleus), has a cell wall, and can photosynthesize — this describes cyanobacteria in the kingdom Monera.",
    interactiveData: null, imageUrl: null
  },

  // Q26: Drawing canvas — Earth Science / Applying / Medium
  {
    subject: "Science", contentDomain: "Earth Science", scienceSubDomain: "Earth Science",
    session: "science_session", blockNumber: 3,
    cognitiveDomain: "Applying", difficulty: "Medium",
    questionType: "drawing_canvas", maxPoints: 2,
    questionText: "The diagram shows a cross-section of Earth's layers. Label the four main layers (inner core, outer core, mantle, crust) by drawing arrows to the correct regions and writing their names.",
    options: null,
    correctAnswer: "labeled_earth_layers",
    explanation: "From center outward: Inner Core (solid iron/nickel) → Outer Core (liquid iron/nickel) → Mantle (silicate rock) → Crust (thin outer layer). Full marks: all 4 correct. Partial: 2-3 correct.",
    interactiveData: JSON.stringify({
      canvasType: "diagram",
      width: 400,
      height: 400,
      prompt: "Draw arrows and label the four main layers of Earth",
      backgroundImage: "earth_cross_section",
      labels: ["Inner Core", "Outer Core", "Mantle", "Crust"],
      scoringHints: {
        fullCredit: "All 4 layers correctly labeled",
        partialCredit: "2 or 3 layers correctly labeled"
      }
    }),
    imageUrl: null
  },

  // Q27: Multiple choice — Chemistry / Applying / Medium
  {
    subject: "Science", contentDomain: "Chemistry", scienceSubDomain: "Chemistry",
    session: "science_session", blockNumber: 3,
    cognitiveDomain: "Applying", difficulty: "Medium",
    questionType: "multiple_choice", maxPoints: 1,
    questionText: "When iron rusts, it reacts with oxygen and water to form iron oxide. This is an example of which type of chemical reaction?",
    options: JSON.stringify([
      { id: "A", text: "Decomposition reaction" },
      { id: "B", text: "Synthesis (combination) reaction" },
      { id: "C", text: "Single displacement reaction" },
      { id: "D", text: "Neutralization reaction" }
    ]),
    correctAnswer: "B",
    explanation: "Rusting is a synthesis reaction: Fe + O₂ + H₂O → Fe₂O₃·H₂O. Two or more substances combine to form a single product.",
    interactiveData: null, imageUrl: null
  },

  // Q28: Pattern interaction — Biology / Knowing / Easy
  {
    subject: "Science", contentDomain: "Biology", scienceSubDomain: "Biology",
    session: "science_session", blockNumber: 3,
    cognitiveDomain: "Knowing", difficulty: "Easy",
    questionType: "pattern_interaction", maxPoints: 1,
    questionText: "The diagram shows a food chain. Click on the correct organisms to fill in the missing positions in the food chain.",
    options: null,
    correctAnswer: "grass,rabbit",
    explanation: "A typical food chain: Grass (producer) → Rabbit (primary consumer) → Fox (secondary consumer) → Eagle (tertiary consumer).",
    interactiveData: JSON.stringify({
      patternType: "sequence",
      displayItems: [
        { id: "fc1", value: "?", isBlank: true, correctValue: "Grass" },
        { id: "fc2", value: "→", isBlank: false },
        { id: "fc3", value: "?", isBlank: true, correctValue: "Rabbit" },
        { id: "fc4", value: "→", isBlank: false },
        { id: "fc5", value: "Fox", isBlank: false },
        { id: "fc6", value: "→", isBlank: false },
        { id: "fc7", value: "Eagle", isBlank: false }
      ],
      choices: ["Grass", "Mushroom", "Rabbit", "Snake", "Bacteria"]
    }),
    imageUrl: null
  },

  // Q29: Short answer — Physics / Applying / Medium
  {
    subject: "Science", contentDomain: "Physics", scienceSubDomain: "Physics",
    session: "science_session", blockNumber: 3,
    cognitiveDomain: "Applying", difficulty: "Medium",
    questionType: "short_answer", maxPoints: 1,
    questionText: "A wave has a frequency of 200 Hz and a wavelength of 1.5 m. Calculate the wave speed in m/s.",
    options: null,
    correctAnswer: "300",
    explanation: "Wave speed = frequency × wavelength = 200 × 1.5 = 300 m/s",
    interactiveData: null, imageUrl: null
  },

  // Q30: Partial credit short answer — Earth Science / Reasoning / Hard
  {
    subject: "Science", contentDomain: "Earth Science", scienceSubDomain: "Earth Science",
    session: "science_session", blockNumber: 3,
    cognitiveDomain: "Reasoning", difficulty: "Hard",
    questionType: "partial_credit_short_answer", maxPoints: 2,
    questionText: "Explain how the greenhouse effect works and describe ONE way human activity has intensified it. Include specific gases in your answer.",
    options: null,
    correctAnswer: "Greenhouse gases (CO₂, CH₄, H₂O) trap heat; burning fossil fuels increases CO₂",
    explanation: "Full marks (2): Explains that greenhouse gases (e.g., CO₂, CH₄, water vapor) absorb and re-emit infrared radiation from Earth's surface, trapping heat — AND names a specific human activity (e.g., burning fossil fuels, deforestation) that increases greenhouse gas concentrations.\nPartial (1): Explains the mechanism OR names a human activity, but not both.\nZero (0): Vague or incorrect answer.",
    interactiveData: null, imageUrl: null
  }
];

// ─── Insert questions ─────────────────────────────────────────────────────────
console.log(`Inserting ${questions.length} questions...`);
const questionIds = [];

for (const q of questions) {
  const [result] = await db.execute(
    `INSERT INTO questions 
      (subject, content_domain, science_sub_domain, session, block_number, cognitive_domain, difficulty, 
       question_type, max_points, question_text, options, correct_answer, explanation, interactive_data, image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      q.subject, q.contentDomain, q.scienceSubDomain, q.session, q.blockNumber,
      q.cognitiveDomain, q.difficulty, q.questionType, q.maxPoints,
      q.questionText,
      q.options ? q.options : null,
      q.correctAnswer, q.explanation,
      q.interactiveData ? q.interactiveData : null,
      q.imageUrl
    ]
  );
  questionIds.push(result.insertId);
  console.log(`  ✓ Q${questionIds.length}: [${q.questionType}] ${q.questionText.substring(0, 60)}...`);
}

// ─── Create exam blocks ───────────────────────────────────────────────────────
console.log("\nCreating exam blocks...");
await db.execute(
  `INSERT INTO exam_blocks (exam_id, block_number, session, label) VALUES (30007, 1, 'math_session', 'M1')`
);
await db.execute(
  `INSERT INTO exam_blocks (exam_id, block_number, session, label) VALUES (30007, 3, 'science_session', 'S1')`
);
console.log("  ✓ Block M1 (Math, Block 1)");
console.log("  ✓ Block S1 (Science, Block 3)");

// ─── Link questions to exam ───────────────────────────────────────────────────
console.log("\nLinking questions to exam 30007...");
for (let i = 0; i < questionIds.length; i++) {
  const q = questions[i];
  await db.execute(
    `INSERT INTO exam_questions (exam_id, question_id, order_index, session, block_number) VALUES (?, ?, ?, ?, ?)`,
    [30007, questionIds[i], i + 1, q.session, q.blockNumber]
  );
}
console.log(`  ✓ Linked ${questionIds.length} questions`);

// ─── Update class assignment with block rotation ──────────────────────────────
await db.execute(
  `UPDATE class_exam_assignments SET assigned_blocks = '[1, 3]' WHERE exam_id = 30007`
);
console.log("\n  ✓ Updated class assignment with blocks [1, 3]");

console.log("\n✅ Seed complete! Mock Exam 1 now has:");
console.log("   • 15 Math questions (Block 1, Session 1 — 45 min)");
console.log("   • 15 Science questions (Block 3, Session 2 — 45 min)");
console.log("   • Question types: MC, SA, drag_drop, matching, ordering, drawing_canvas, pattern_interaction, psi_lab, partial_credit_SA");
console.log("   • Science sub-domains: Biology, Chemistry, Physics, Earth Science");

await db.end();
