import { Router } from "express";
import { and, eq } from "drizzle-orm";
import { getDb } from "./db";
import { questions, exams, examQuestions, studentExamAttempts, studentAnswers, studentReports } from "../drizzle/schema";

export function registerSeedRoute(app: Router) {
  // Dev helper: reset a student's exam attempt so they can retake it
  app.post("/api/reset-attempt", async (req, res) => {
    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "DB not available" });
      const { studentId, examId } = req.body as { studentId?: number; examId?: number };
      if (!studentId) return res.status(400).json({ error: "studentId required" });
      const whereClause = examId
        ? and(eq(studentExamAttempts.studentId, studentId), eq(studentExamAttempts.examId, examId))
        : eq(studentExamAttempts.studentId, studentId);
      const attempts = await db.select().from(studentExamAttempts).where(whereClause);
      for (const a of attempts) {
        await db.delete(studentAnswers).where(eq(studentAnswers.attemptId, a.id));
        await db.delete(studentReports).where(eq(studentReports.attemptId, a.id));
        await db.delete(studentExamAttempts).where(eq(studentExamAttempts.id, a.id));
      }
      return res.json({ success: true, deleted: attempts.length });
    } catch (e) {
      return res.status(500).json({ error: String(e) });
    }
  });

  app.post("/api/seed-questions", async (req, res) => {
    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "DB not available" });

      // Clear existing
      await db.delete(examQuestions);
      await db.delete(questions);

      const allQuestions = [
        // ── MATH: NUMBER ──────────────────────────────────────────────────────
        {
          subject: "Math" as const, contentDomain: "Number", cognitiveDomain: "Knowing" as const, difficulty: "Easy" as const,
          questionType: "multiple_choice" as const,
          questionText: "Which of the following is equivalent to 3.6 × 10⁻⁴?",
          options: JSON.stringify([{label:"A",text:"0.00036"},{label:"B",text:"0.0036"},{label:"C",text:"36,000"},{label:"D",text:"0.000036"}]),
          correctAnswer: "A", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Math" as const, contentDomain: "Number", cognitiveDomain: "Applying" as const, difficulty: "Medium" as const,
          questionType: "multiple_choice" as const,
          questionText: "A jacket costs $120. During a sale, the price is reduced by 35%. What is the sale price?",
          options: JSON.stringify([{label:"A",text:"$42"},{label:"B",text:"$78"},{label:"C",text:"$85"},{label:"D",text:"$84"}]),
          correctAnswer: "B", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Math" as const, contentDomain: "Number", cognitiveDomain: "Reasoning" as const, difficulty: "Hard" as const,
          questionType: "short_answer" as const,
          questionText: "The ratio of boys to girls in a school is 5 : 7. If there are 420 girls, how many students are in the school altogether? Show your working.",
          options: null, correctAnswer: "720", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Math" as const, contentDomain: "Number", cognitiveDomain: "Applying" as const, difficulty: "Medium" as const,
          questionType: "multiple_choice" as const,
          questionText: "What is the value of (−3)³ + √64?",
          options: JSON.stringify([{label:"A",text:"−19"},{label:"B",text:"−35"},{label:"C",text:"−27"},{label:"D",text:"19"}]),
          correctAnswer: "A", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Math" as const, contentDomain: "Number", cognitiveDomain: "Knowing" as const, difficulty: "Easy" as const,
          questionType: "ordering" as const,
          questionText: "Arrange the following numbers in order from least to greatest.",
          options: null, correctAnswer: JSON.stringify(["item1","item4","item2","item3"]),
          interactiveData: JSON.stringify({
            items:[{id:"item1",text:"−0.75"},{id:"item2",text:"3/4"},{id:"item3",text:"1.2"},{id:"item4",text:"−1/3"}],
            correctOrder:["item1","item4","item2","item3"]
          }), imageUrl: null,
        },
        {
          subject: "Math" as const, contentDomain: "Number", cognitiveDomain: "Reasoning" as const, difficulty: "Hard" as const,
          questionType: "multiple_choice" as const,
          questionText: "If p is a prime number greater than 2, which of the following must be true?\nI. p is odd\nII. p + 1 is even\nIII. p² is prime",
          options: JSON.stringify([{label:"A",text:"I only"},{label:"B",text:"I and II only"},{label:"C",text:"II and III only"},{label:"D",text:"I, II, and III"}]),
          correctAnswer: "B", interactiveData: null, imageUrl: null,
        },
        // ── MATH: ALGEBRA ─────────────────────────────────────────────────────
        {
          subject: "Math" as const, contentDomain: "Algebra", cognitiveDomain: "Knowing" as const, difficulty: "Easy" as const,
          questionType: "multiple_choice" as const,
          questionText: "If 4x − 7 = 13, what is the value of x?",
          options: JSON.stringify([{label:"A",text:"1.5"},{label:"B",text:"5"},{label:"C",text:"6"},{label:"D",text:"20"}]),
          correctAnswer: "B", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Math" as const, contentDomain: "Algebra", cognitiveDomain: "Applying" as const, difficulty: "Medium" as const,
          questionType: "multiple_choice" as const,
          questionText: "A mobile phone plan charges a fixed monthly fee of $15 plus $0.05 per text message. Which equation represents the total monthly cost C for sending n text messages?",
          options: JSON.stringify([{label:"A",text:"C = 15n + 0.05"},{label:"B",text:"C = 0.05n + 15"},{label:"C",text:"C = 15 − 0.05n"},{label:"D",text:"C = 0.05(n + 15)"}]),
          correctAnswer: "B", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Math" as const, contentDomain: "Algebra", cognitiveDomain: "Reasoning" as const, difficulty: "Hard" as const,
          questionType: "short_answer" as const,
          questionText: "The sum of three consecutive even integers is 78. Write an equation and solve to find the three integers.",
          options: null, correctAnswer: "24, 26, 28", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Math" as const, contentDomain: "Algebra", cognitiveDomain: "Applying" as const, difficulty: "Medium" as const,
          questionType: "multiple_choice" as const,
          questionText: "Which of the following best describes the line y = −2x + 3?",
          options: JSON.stringify([{label:"A",text:"A line with positive slope crossing the y-axis at 3"},{label:"B",text:"A line with slope −2 crossing the y-axis at 3"},{label:"C",text:"A line with slope −2 crossing the x-axis at 3"},{label:"D",text:"A parabola opening downward"}]),
          correctAnswer: "B", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Math" as const, contentDomain: "Algebra", cognitiveDomain: "Reasoning" as const, difficulty: "Hard" as const,
          questionType: "drag_drop" as const,
          questionText: "Match each algebraic expression with its equivalent simplified form. Drag each expression to the correct box.",
          options: null, correctAnswer: JSON.stringify({expr1:"box1",expr2:"box2",expr3:"box3",expr4:"box4"}),
          interactiveData: JSON.stringify({
            items:[{id:"expr1",text:"3(2x − 4)"},{id:"expr2",text:"(x + 3)²"},{id:"expr3",text:"5x − 2x + 7"},{id:"expr4",text:"2(x + 1) + 3(x − 2)"}],
            targets:[{id:"box1",label:"6x − 12"},{id:"box2",label:"x² + 6x + 9"},{id:"box3",label:"3x + 7"},{id:"box4",label:"5x − 4"}],
            correctMapping:{expr1:"box1",expr2:"box2",expr3:"box3",expr4:"box4"}
          }), imageUrl: null,
        },
        {
          subject: "Math" as const, contentDomain: "Algebra", cognitiveDomain: "Knowing" as const, difficulty: "Easy" as const,
          questionType: "multiple_choice" as const,
          questionText: "What is the value of 2a² − 3b when a = 3 and b = 4?",
          options: JSON.stringify([{label:"A",text:"6"},{label:"B",text:"30"},{label:"C",text:"18"},{label:"D",text:"−6"}]),
          correctAnswer: "A", interactiveData: null, imageUrl: null,
        },
        // ── MATH: GEOMETRY ────────────────────────────────────────────────────
        {
          subject: "Math" as const, contentDomain: "Geometry", cognitiveDomain: "Knowing" as const, difficulty: "Easy" as const,
          questionType: "multiple_choice" as const,
          questionText: "A right triangle has legs of length 6 cm and 8 cm. What is the length of the hypotenuse?",
          options: JSON.stringify([{label:"A",text:"10 cm"},{label:"B",text:"14 cm"},{label:"C",text:"7 cm"},{label:"D",text:"100 cm"}]),
          correctAnswer: "A", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Math" as const, contentDomain: "Geometry", cognitiveDomain: "Applying" as const, difficulty: "Medium" as const,
          questionType: "multiple_choice" as const,
          questionText: "A cylinder has a radius of 5 cm and a height of 12 cm. What is its volume? (Use π ≈ 3.14)",
          options: JSON.stringify([{label:"A",text:"942 cm³"},{label:"B",text:"376.8 cm³"},{label:"C",text:"1884 cm³"},{label:"D",text:"471 cm³"}]),
          correctAnswer: "A", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Math" as const, contentDomain: "Geometry", cognitiveDomain: "Reasoning" as const, difficulty: "Hard" as const,
          questionType: "short_answer" as const,
          questionText: "Two parallel lines are cut by a transversal. One co-interior angle measures 112°. What is the measure of the other co-interior angle? Explain your reasoning.",
          options: null, correctAnswer: "68", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Math" as const, contentDomain: "Geometry", cognitiveDomain: "Applying" as const, difficulty: "Medium" as const,
          questionType: "matching" as const,
          questionText: "Match each geometric shape in Column A with its correct area formula in Column B.",
          options: null, correctAnswer: JSON.stringify({shape1:"formula1",shape2:"formula2",shape3:"formula3",shape4:"formula4"}),
          interactiveData: JSON.stringify({
            leftItems:[{id:"shape1",text:"Circle"},{id:"shape2",text:"Trapezoid"},{id:"shape3",text:"Triangle"},{id:"shape4",text:"Parallelogram"}],
            rightItems:[{id:"formula1",text:"A = πr²"},{id:"formula2",text:"A = ½(b₁ + b₂)h"},{id:"formula3",text:"A = ½bh"},{id:"formula4",text:"A = bh"}],
            correctPairs:{shape1:"formula1",shape2:"formula2",shape3:"formula3",shape4:"formula4"}
          }), imageUrl: null,
        },
        {
          subject: "Math" as const, contentDomain: "Geometry", cognitiveDomain: "Knowing" as const, difficulty: "Easy" as const,
          questionType: "multiple_choice" as const,
          questionText: "In triangle ABC, angle A = 45° and angle B = 75°. What is the measure of angle C?",
          options: JSON.stringify([{label:"A",text:"40°"},{label:"B",text:"60°"},{label:"C",text:"120°"},{label:"D",text:"80°"}]),
          correctAnswer: "B", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Math" as const, contentDomain: "Geometry", cognitiveDomain: "Reasoning" as const, difficulty: "Hard" as const,
          questionType: "short_answer" as const,
          questionText: "A square has a perimeter of 48 cm. What is the area of the square? Show your working.",
          options: null, correctAnswer: "144 cm²", interactiveData: null, imageUrl: null,
        },
        // ── MATH: DATA AND PROBABILITY ────────────────────────────────────────
        {
          subject: "Math" as const, contentDomain: "Data and Probability", cognitiveDomain: "Knowing" as const, difficulty: "Easy" as const,
          questionType: "multiple_choice" as const,
          questionText: "The ages of 7 students are: 13, 14, 13, 15, 14, 13, 16. What is the mode?",
          options: JSON.stringify([{label:"A",text:"14"},{label:"B",text:"13"},{label:"C",text:"15"},{label:"D",text:"16"}]),
          correctAnswer: "B", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Math" as const, contentDomain: "Data and Probability", cognitiveDomain: "Applying" as const, difficulty: "Medium" as const,
          questionType: "multiple_choice" as const,
          questionText: "A bag contains 4 red, 3 blue, and 5 green marbles. What is the probability of drawing a blue marble?",
          options: JSON.stringify([{label:"A",text:"1/4"},{label:"B",text:"1/4 (3 out of 12)"},{label:"C",text:"1/3"},{label:"D",text:"5/12"}]),
          correctAnswer: "A", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Math" as const, contentDomain: "Data and Probability", cognitiveDomain: "Reasoning" as const, difficulty: "Hard" as const,
          questionType: "short_answer" as const,
          questionText: "The mean score of 6 students is 72. A seventh student joins and the new mean becomes 74. What was the seventh student's score? Show your working.",
          options: null, correctAnswer: "86", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Math" as const, contentDomain: "Data and Probability", cognitiveDomain: "Applying" as const, difficulty: "Medium" as const,
          questionType: "ordering" as const,
          questionText: "Arrange the steps for finding the median of a data set in the correct order.",
          options: null, correctAnswer: JSON.stringify(["step1","step2","step3","step4"]),
          interactiveData: JSON.stringify({
            items:[{id:"step1",text:"Write the data values in order from least to greatest"},{id:"step2",text:"Count the total number of data values"},{id:"step3",text:"Identify the middle value (or two middle values)"},{id:"step4",text:"If two middle values, calculate their average"}],
            correctOrder:["step1","step2","step3","step4"]
          }), imageUrl: null,
        },
        {
          subject: "Math" as const, contentDomain: "Data and Probability", cognitiveDomain: "Reasoning" as const, difficulty: "Hard" as const,
          questionType: "multiple_choice" as const,
          questionText: "Two fair six-sided dice are rolled. What is the probability that the sum is greater than 9?",
          options: JSON.stringify([{label:"A",text:"1/6"},{label:"B",text:"1/4"},{label:"C",text:"1/9"},{label:"D",text:"5/18"}]),
          correctAnswer: "A", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Math" as const, contentDomain: "Data and Probability", cognitiveDomain: "Applying" as const, difficulty: "Medium" as const,
          questionType: "multiple_choice" as const,
          questionText: "A student scores 75, 82, 90, 68, and 85 on five tests. What is the mean score?",
          options: JSON.stringify([{label:"A",text:"80"},{label:"B",text:"82"},{label:"C",text:"78"},{label:"D",text:"85"}]),
          correctAnswer: "A", interactiveData: null, imageUrl: null,
        },
        // ── SCIENCE: BIOLOGY ──────────────────────────────────────────────────
        {
          subject: "Science" as const, contentDomain: "Biology", cognitiveDomain: "Knowing" as const, difficulty: "Easy" as const,
          questionType: "multiple_choice" as const,
          questionText: "Which organelle is responsible for producing energy (ATP) through cellular respiration?",
          options: JSON.stringify([{label:"A",text:"Nucleus"},{label:"B",text:"Ribosome"},{label:"C",text:"Mitochondria"},{label:"D",text:"Chloroplast"}]),
          correctAnswer: "C", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Science" as const, contentDomain: "Biology", cognitiveDomain: "Applying" as const, difficulty: "Medium" as const,
          questionType: "multiple_choice" as const,
          questionText: "A student places a red blood cell in a solution and observes the cell swelling and bursting. What type of solution was used?",
          options: JSON.stringify([{label:"A",text:"Hypertonic solution"},{label:"B",text:"Isotonic solution"},{label:"C",text:"Hypotonic solution"},{label:"D",text:"Saturated solution"}]),
          correctAnswer: "C", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Science" as const, contentDomain: "Biology", cognitiveDomain: "Reasoning" as const, difficulty: "Hard" as const,
          questionType: "short_answer" as const,
          questionText: "Explain why a plant placed in a dark room for several days would eventually turn yellow and die. Refer to the role of chlorophyll and photosynthesis.",
          options: null, correctAnswer: "Without light photosynthesis cannot occur; chlorophyll breaks down; plant cannot produce glucose for energy", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Science" as const, contentDomain: "Biology", cognitiveDomain: "Applying" as const, difficulty: "Medium" as const,
          questionType: "drag_drop" as const,
          questionText: "Classify each organism into the correct kingdom by dragging it to the appropriate box.",
          options: null, correctAnswer: JSON.stringify({org1:"kingdom1",org2:"kingdom2",org3:"kingdom3",org4:"kingdom4"}),
          interactiveData: JSON.stringify({
            items:[{id:"org1",text:"Mushroom (multicellular, absorbs nutrients)"},{id:"org2",text:"Amoeba (single-celled, has nucleus)"},{id:"org3",text:"Oak tree (multicellular, produces own food)"},{id:"org4",text:"Bacterium (no membrane-bound nucleus)"}],
            targets:[{id:"kingdom1",label:"Kingdom Fungi"},{id:"kingdom2",label:"Kingdom Protista"},{id:"kingdom3",label:"Kingdom Plantae"},{id:"kingdom4",label:"Kingdom Monera (Bacteria)"}],
            correctMapping:{org1:"kingdom1",org2:"kingdom2",org3:"kingdom3",org4:"kingdom4"}
          }), imageUrl: null,
        },
        {
          subject: "Science" as const, contentDomain: "Biology", cognitiveDomain: "Knowing" as const, difficulty: "Easy" as const,
          questionType: "matching" as const,
          questionText: "Match each part of the human digestive system with its primary function.",
          options: null, correctAnswer: JSON.stringify({organ1:"func1",organ2:"func2",organ3:"func3",organ4:"func4"}),
          interactiveData: JSON.stringify({
            leftItems:[{id:"organ1",text:"Stomach"},{id:"organ2",text:"Small intestine"},{id:"organ3",text:"Large intestine"},{id:"organ4",text:"Liver"}],
            rightItems:[{id:"func1",text:"Churns food and begins protein digestion with acid"},{id:"func2",text:"Absorbs most nutrients into the bloodstream"},{id:"func3",text:"Absorbs water and forms solid waste"},{id:"func4",text:"Produces bile to emulsify fats"}],
            correctPairs:{organ1:"func1",organ2:"func2",organ3:"func3",organ4:"func4"}
          }), imageUrl: null,
        },
        {
          subject: "Science" as const, contentDomain: "Biology", cognitiveDomain: "Reasoning" as const, difficulty: "Hard" as const,
          questionType: "multiple_choice" as const,
          questionText: "A scientist observes that an isolated island bird species developed longer curved beaks suited to nectar feeding. Which process best explains this change over many generations?",
          options: JSON.stringify([{label:"A",text:"Artificial selection by human farmers"},{label:"B",text:"Natural selection favouring birds with longer beaks in the island environment"},{label:"C",text:"Lamarckian inheritance of acquired characteristics"},{label:"D",text:"Genetic mutation caused by island climate"}]),
          correctAnswer: "B", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Science" as const, contentDomain: "Biology", cognitiveDomain: "Applying" as const, difficulty: "Medium" as const,
          questionType: "multiple_choice" as const,
          questionText: "During meiosis, a cell with 46 chromosomes divides. How many chromosomes will each resulting cell contain?",
          options: JSON.stringify([{label:"A",text:"46"},{label:"B",text:"92"},{label:"C",text:"23"},{label:"D",text:"12"}]),
          correctAnswer: "C", interactiveData: null, imageUrl: null,
        },
        // ── SCIENCE: CHEMISTRY ────────────────────────────────────────────────
        {
          subject: "Science" as const, contentDomain: "Chemistry", cognitiveDomain: "Knowing" as const, difficulty: "Easy" as const,
          questionType: "multiple_choice" as const,
          questionText: "An atom of carbon has 6 protons and 6 neutrons. What is its mass number?",
          options: JSON.stringify([{label:"A",text:"6"},{label:"B",text:"12"},{label:"C",text:"18"},{label:"D",text:"3"}]),
          correctAnswer: "B", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Science" as const, contentDomain: "Chemistry", cognitiveDomain: "Applying" as const, difficulty: "Medium" as const,
          questionType: "multiple_choice" as const,
          questionText: "When iron (Fe) reacts with oxygen (O₂) to form iron oxide (Fe₂O₃), what type of chemical reaction is this?",
          options: JSON.stringify([{label:"A",text:"Decomposition reaction"},{label:"B",text:"Synthesis (combination) reaction"},{label:"C",text:"Double displacement reaction"},{label:"D",text:"Neutralisation reaction"}]),
          correctAnswer: "B", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Science" as const, contentDomain: "Chemistry", cognitiveDomain: "Reasoning" as const, difficulty: "Hard" as const,
          questionType: "short_answer" as const,
          questionText: "A student adds zinc metal to hydrochloric acid and observes bubbles. Identify the reaction type, name the gas produced, and write a word equation.",
          options: null, correctAnswer: "Single displacement; hydrogen gas; zinc + hydrochloric acid → zinc chloride + hydrogen", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Science" as const, contentDomain: "Chemistry", cognitiveDomain: "Applying" as const, difficulty: "Medium" as const,
          questionType: "ordering" as const,
          questionText: "Arrange the following steps of the scientific method in the correct order.",
          options: null, correctAnswer: JSON.stringify(["sci1","sci2","sci3","sci4","sci5"]),
          interactiveData: JSON.stringify({
            items:[{id:"sci1",text:"Identify the problem or ask a question"},{id:"sci2",text:"Form a hypothesis"},{id:"sci3",text:"Design and conduct an experiment"},{id:"sci4",text:"Collect and analyse data"},{id:"sci5",text:"Draw a conclusion and communicate results"}],
            correctOrder:["sci1","sci2","sci3","sci4","sci5"]
          }), imageUrl: null,
        },
        {
          subject: "Science" as const, contentDomain: "Chemistry", cognitiveDomain: "Knowing" as const, difficulty: "Easy" as const,
          questionType: "matching" as const,
          questionText: "Match each substance with its correct pH classification.",
          options: null, correctAnswer: JSON.stringify({sub1:"ph1",sub2:"ph2",sub3:"ph3",sub4:"ph4"}),
          interactiveData: JSON.stringify({
            leftItems:[{id:"sub1",text:"Lemon juice (pH 2)"},{id:"sub2",text:"Pure water (pH 7)"},{id:"sub3",text:"Baking soda solution (pH 9)"},{id:"sub4",text:"Bleach (pH 13)"}],
            rightItems:[{id:"ph1",text:"Strong acid"},{id:"ph2",text:"Neutral"},{id:"ph3",text:"Weak base"},{id:"ph4",text:"Strong base"}],
            correctPairs:{sub1:"ph1",sub2:"ph2",sub3:"ph3",sub4:"ph4"}
          }), imageUrl: null,
        },
        {
          subject: "Science" as const, contentDomain: "Chemistry", cognitiveDomain: "Reasoning" as const, difficulty: "Hard" as const,
          questionType: "multiple_choice" as const,
          questionText: "A student dissolves 20 g of salt in 80 g of water. What is the mass percent concentration of the salt?",
          options: JSON.stringify([{label:"A",text:"20%"},{label:"B",text:"25%"},{label:"C",text:"80%"},{label:"D",text:"16%"}]),
          correctAnswer: "A", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Science" as const, contentDomain: "Chemistry", cognitiveDomain: "Applying" as const, difficulty: "Medium" as const,
          questionType: "multiple_choice" as const,
          questionText: "Which of the following is a physical change?",
          options: JSON.stringify([{label:"A",text:"Iron rusting in moist air"},{label:"B",text:"Wood burning in a fireplace"},{label:"C",text:"Ice melting into liquid water"},{label:"D",text:"Baking soda reacting with vinegar"}]),
          correctAnswer: "C", interactiveData: null, imageUrl: null,
        },
        // ── SCIENCE: PHYSICS ──────────────────────────────────────────────────
        {
          subject: "Science" as const, contentDomain: "Physics", cognitiveDomain: "Knowing" as const, difficulty: "Easy" as const,
          questionType: "multiple_choice" as const,
          questionText: "A car travels 150 km in 3 hours. What is its average speed?",
          options: JSON.stringify([{label:"A",text:"450 km/h"},{label:"B",text:"50 km/h"},{label:"C",text:"153 km/h"},{label:"D",text:"0.02 km/h"}]),
          correctAnswer: "B", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Science" as const, contentDomain: "Physics", cognitiveDomain: "Applying" as const, difficulty: "Medium" as const,
          questionType: "multiple_choice" as const,
          questionText: "A ball is thrown upward. Ignoring air resistance, what happens to its kinetic energy as it rises?",
          options: JSON.stringify([{label:"A",text:"It increases because the ball is moving upward"},{label:"B",text:"It decreases as kinetic energy is converted to potential energy"},{label:"C",text:"It remains constant because energy is conserved"},{label:"D",text:"It first increases then decreases"}]),
          correctAnswer: "B", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Science" as const, contentDomain: "Physics", cognitiveDomain: "Reasoning" as const, difficulty: "Hard" as const,
          questionType: "short_answer" as const,
          questionText: "A student pushes a 10 kg box across a frictionless floor with a force of 40 N. Using Newton's second law, calculate the acceleration. Show your working and include units.",
          options: null, correctAnswer: "4 m/s²", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Science" as const, contentDomain: "Physics", cognitiveDomain: "Applying" as const, difficulty: "Medium" as const,
          questionType: "drag_drop" as const,
          questionText: "Classify each wave property or example by dragging it to the correct wave type.",
          options: null, correctAnswer: JSON.stringify({wave1:"wtype1",wave2:"wtype2",wave3:"wtype1",wave4:"wtype2"}),
          interactiveData: JSON.stringify({
            items:[{id:"wave1",text:"Sound waves in air"},{id:"wave2",text:"Light waves from the Sun"},{id:"wave3",text:"Particles vibrate parallel to wave direction"},{id:"wave4",text:"Can travel through a vacuum"}],
            targets:[{id:"wtype1",label:"Longitudinal Wave"},{id:"wtype2",label:"Transverse Wave"}],
            correctMapping:{wave1:"wtype1",wave2:"wtype2",wave3:"wtype1",wave4:"wtype2"}
          }), imageUrl: null,
        },
        {
          subject: "Science" as const, contentDomain: "Physics", cognitiveDomain: "Knowing" as const, difficulty: "Easy" as const,
          questionType: "multiple_choice" as const,
          questionText: "Which of the following is a unit of electrical resistance?",
          options: JSON.stringify([{label:"A",text:"Ampere (A)"},{label:"B",text:"Volt (V)"},{label:"C",text:"Ohm (Ω)"},{label:"D",text:"Watt (W)"}]),
          correctAnswer: "C", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Science" as const, contentDomain: "Physics", cognitiveDomain: "Reasoning" as const, difficulty: "Hard" as const,
          questionType: "short_answer" as const,
          questionText: "A circuit has a 12 V battery and two resistors in series: R₁ = 4 Ω and R₂ = 8 Ω. Calculate (a) total resistance, (b) current through the circuit, and (c) voltage drop across R₁. Show all working.",
          options: null, correctAnswer: "12 Ω; 1 A; 4 V", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Science" as const, contentDomain: "Physics", cognitiveDomain: "Applying" as const, difficulty: "Medium" as const,
          questionType: "multiple_choice" as const,
          questionText: "A 60 W light bulb is left on for 5 hours. How much electrical energy does it consume?",
          options: JSON.stringify([{label:"A",text:"300 J"},{label:"B",text:"1,080,000 J"},{label:"C",text:"12 J"},{label:"D",text:"300,000 J"}]),
          correctAnswer: "B", interactiveData: null, imageUrl: null,
        },
        // ── SCIENCE: EARTH SCIENCE ────────────────────────────────────────────
        {
          subject: "Science" as const, contentDomain: "Earth Science", cognitiveDomain: "Knowing" as const, difficulty: "Easy" as const,
          questionType: "multiple_choice" as const,
          questionText: "Which layer of the Earth is composed primarily of solid iron and nickel?",
          options: JSON.stringify([{label:"A",text:"Mantle"},{label:"B",text:"Outer core"},{label:"C",text:"Crust"},{label:"D",text:"Inner core"}]),
          correctAnswer: "D", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Science" as const, contentDomain: "Earth Science", cognitiveDomain: "Applying" as const, difficulty: "Medium" as const,
          questionType: "multiple_choice" as const,
          questionText: "A geologist finds rock layers from bottom to top: sandstone, limestone, shale, granite. Which is most likely the oldest?",
          options: JSON.stringify([{label:"A",text:"Granite (top)"},{label:"B",text:"Shale"},{label:"C",text:"Limestone"},{label:"D",text:"Sandstone (bottom)"}]),
          correctAnswer: "D", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Science" as const, contentDomain: "Earth Science", cognitiveDomain: "Reasoning" as const, difficulty: "Hard" as const,
          questionType: "short_answer" as const,
          questionText: "Explain how the greenhouse effect contributes to global warming. Describe the role of greenhouse gases such as CO₂ and methane.",
          options: null, correctAnswer: "Greenhouse gases trap infrared radiation; increasing CO2 and methane from human activity enhances this effect; more heat retained causing temperature rise", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Science" as const, contentDomain: "Earth Science", cognitiveDomain: "Applying" as const, difficulty: "Medium" as const,
          questionType: "ordering" as const,
          questionText: "Arrange the stages of the water cycle in the correct order, starting from the ocean.",
          options: null, correctAnswer: JSON.stringify(["wc1","wc2","wc3","wc4","wc5"]),
          interactiveData: JSON.stringify({
            items:[{id:"wc1",text:"Evaporation: water from the ocean turns to water vapour"},{id:"wc2",text:"Condensation: water vapour cools and forms clouds"},{id:"wc3",text:"Precipitation: water falls as rain or snow"},{id:"wc4",text:"Surface runoff: water flows into rivers and lakes"},{id:"wc5",text:"Collection: water returns to the ocean"}],
            correctOrder:["wc1","wc2","wc3","wc4","wc5"]
          }), imageUrl: null,
        },
        {
          subject: "Science" as const, contentDomain: "Earth Science", cognitiveDomain: "Knowing" as const, difficulty: "Easy" as const,
          questionType: "matching" as const,
          questionText: "Match each type of plate boundary with the geological feature it typically produces.",
          options: null, correctAnswer: JSON.stringify({bound1:"feat1",bound2:"feat2",bound3:"feat3"}),
          interactiveData: JSON.stringify({
            leftItems:[{id:"bound1",text:"Convergent boundary (oceanic-continental)"},{id:"bound2",text:"Divergent boundary"},{id:"bound3",text:"Transform boundary"}],
            rightItems:[{id:"feat1",text:"Subduction zone and volcanic mountains"},{id:"feat2",text:"Mid-ocean ridge and rift valley"},{id:"feat3",text:"Earthquakes along a fault line"}],
            correctPairs:{bound1:"feat1",bound2:"feat2",bound3:"feat3"}
          }), imageUrl: null,
        },
        {
          subject: "Science" as const, contentDomain: "Earth Science", cognitiveDomain: "Reasoning" as const, difficulty: "Hard" as const,
          questionType: "multiple_choice" as const,
          questionText: "Which of the following best describes why seasons occur on Earth?",
          options: JSON.stringify([{label:"A",text:"Earth changes its distance from the Sun throughout the year"},{label:"B",text:"Earth's axial tilt causes different hemispheres to receive more direct sunlight at different times"},{label:"C",text:"The Sun's energy output varies throughout the year"},{label:"D",text:"Earth's rotation speed changes with the seasons"}]),
          correctAnswer: "B", interactiveData: null, imageUrl: null,
        },
        {
          subject: "Science" as const, contentDomain: "Earth Science", cognitiveDomain: "Applying" as const, difficulty: "Medium" as const,
          questionType: "multiple_choice" as const,
          questionText: "Which type of rock is formed when magma cools and solidifies below the Earth's surface?",
          options: JSON.stringify([{label:"A",text:"Sedimentary rock"},{label:"B",text:"Metamorphic rock"},{label:"C",text:"Intrusive igneous rock"},{label:"D",text:"Extrusive igneous rock"}]),
          correctAnswer: "C", interactiveData: null, imageUrl: null,
        },
      ];

      // Insert in small batches of 5
      const batchSize = 5;
      for (let i = 0; i < allQuestions.length; i += batchSize) {
        const batch = allQuestions.slice(i, i + batchSize);
        await db.insert(questions).values(batch);
      }

      // Fetch all inserted question IDs ordered by id
      const allInserted = await db.select({ id: questions.id }).from(questions).orderBy(questions.id);
      const insertedIds = allInserted.map(q => q.id);

      // Get all 6 exam IDs sorted by id
      const allExams = await db.select({ id: exams.id, name: exams.name }).from(exams).orderBy(exams.id);
      if (allExams.length < 6) {
        return res.json({ error: "Need 6 exams in DB first", examCount: allExams.length });
      }

      // Distribute questions across 6 exams — each exam gets a full set
      // All 52 questions cover Math + Science evenly
      const examMappings = [
        { examId: allExams[0].id, qIds: insertedIds.slice(0, 30) },   // Mock 1: q1-30
        { examId: allExams[1].id, qIds: insertedIds.slice(22, 52) },  // Mock 2: q23-52
        { examId: allExams[2].id, qIds: insertedIds.slice(0, 26) },   // Mock 3: q1-26
        { examId: allExams[3].id, qIds: insertedIds.slice(10, 40) },  // Mock 4: q11-40
        { examId: allExams[4].id, qIds: insertedIds.slice(5, 35) },   // Mock 5: q6-35
        { examId: allExams[5].id, qIds: insertedIds.slice(15, 45) },  // Mock 6: q16-45
      ];

      for (const { examId, qIds } of examMappings) {
        const eqRows = qIds.map((qId, order) => ({
          examId,
          questionId: qId,
          orderIndex: order + 1,
        }));
        if (eqRows.length > 0) {
          for (let i = 0; i < eqRows.length; i += 10) {
            await db.insert(examQuestions).values(eqRows.slice(i, i + 10));
          }
        }
      }

      res.json({
        success: true,
        questionsInserted: insertedIds.length,
        examsLinked: examMappings.length,
        questionIds: insertedIds,
      });
    } catch (err: any) {
      console.error("[Seed] Error:", err);
      res.status(500).json({ error: err.message });
    }
  });
}
