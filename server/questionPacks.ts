// Ready-made TIMSS-style question packs that admins can add to the question bank
// from Admin → Question Bank → "Add question packs". Importing is additive and skips
// any question whose text already exists for that grade, so it is safe to run twice.
// Generated from the TIMSS Practice Centre question bank. Numeric answers use the
// short_answer type and are marked by value (e.g. "48 crayons" matches "48").

export type PackQuestion = {
  grade: 4 | 8;
  subject: "Math" | "Science";
  contentDomain: string;
  scienceSubDomain: "Earth Science" | "Biology" | "Chemistry" | "Physics" | "Life Science" | "Physical Science" | null;
  session: "math_session" | "science_session";
  cognitiveDomain: "Knowing" | "Applying" | "Reasoning";
  difficulty: "Easy" | "Medium" | "Hard";
  questionType: "multiple_choice" | "short_answer";
  maxPoints: number;
  questionText: string;
  options?: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  imageUrl: string | null;
};

export const QUESTION_PACKS = {
  grade4: {
    label: "Grade 4 starter pack",
    description: "Grade 4 Mathematics (Number, Measurement and Geometry, Data) and Science (Life, Physical, Earth Science).",
    questions: [
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "What number is 3,000 + 400 + 7?",
    "explanation": "3 thousands, 4 hundreds, 0 tens and 7 ones make 3,407.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "3,047"
      },
      {
        "id": "B",
        "text": "34,007"
      },
      {
        "id": "C",
        "text": "3,407"
      },
      {
        "id": "D",
        "text": "3,470"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Which digit is in the hundreds place in 5,862?",
    "explanation": "5,862 = 5 thousands, 8 hundreds, 6 tens, 2 ones.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "6"
      },
      {
        "id": "B",
        "text": "2"
      },
      {
        "id": "C",
        "text": "8"
      },
      {
        "id": "D",
        "text": "5"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Sara had 245 stickers. She gave 78 to her brother. How many stickers does she have left?",
    "explanation": "245 − 78 = 167.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "167"
      },
      {
        "id": "B",
        "text": "177"
      },
      {
        "id": "C",
        "text": "233"
      },
      {
        "id": "D",
        "text": "323"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "A box holds 6 rows of crayons with 8 crayons in each row. How many crayons are in the box? Give your answer in crayons.",
    "explanation": "6 × 8 = 48 crayons.",
    "questionType": "short_answer",
    "correctAnswer": "48",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Which fraction is equal to 1/2?",
    "explanation": "3/6 simplifies to 1/2, because 3 is half of 6.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "3/6"
      },
      {
        "id": "B",
        "text": "2/3"
      },
      {
        "id": "C",
        "text": "1/4"
      },
      {
        "id": "D",
        "text": "5/8"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "Which fraction is the largest?",
    "explanation": "2/3 is more than one half. 3/8 and 1/4 are less than one half.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "2/3"
      },
      {
        "id": "B",
        "text": "1/2"
      },
      {
        "id": "C",
        "text": "1/4"
      },
      {
        "id": "D",
        "text": "3/8"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "72 apples are shared equally into 9 bags. How many apples are in each bag? Give your answer in apples.",
    "explanation": "72 ÷ 9 = 8.",
    "questionType": "short_answer",
    "correctAnswer": "8",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Round 4,768 to the nearest hundred.",
    "explanation": "The tens digit is 6, which is 5 or more, so round up to 4,800.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "4,700"
      },
      {
        "id": "B",
        "text": "4,800"
      },
      {
        "id": "C",
        "text": "5,000"
      },
      {
        "id": "D",
        "text": "4,770"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "One pencil costs 15 zeds. How much do 6 pencils cost? Give your answer in zeds.",
    "explanation": "15 × 6 = 90 zeds.",
    "questionType": "short_answer",
    "correctAnswer": "90",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "Look at the pattern: 5, 9, 13, 17, … What is the 7th number in the pattern?",
    "explanation": "The rule is add 4: 5, 9, 13, 17, 21, 25, 29.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "29"
      },
      {
        "id": "B",
        "text": "33"
      },
      {
        "id": "C",
        "text": "27"
      },
      {
        "id": "D",
        "text": "25"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "What is 1/4 of 28?",
    "explanation": "28 ÷ 4 = 7.",
    "questionType": "short_answer",
    "correctAnswer": "7",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Which fraction is the same as 0.7?",
    "explanation": "0.7 means 7 tenths, which is 7/10.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "7/100"
      },
      {
        "id": "B",
        "text": "1/7"
      },
      {
        "id": "C",
        "text": "7/10"
      },
      {
        "id": "D",
        "text": "70/10"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "Ali thinks of a number. He multiplies it by 4 and then adds 3. His answer is 31. What number did Ali think of?",
    "explanation": "Work backwards: 31 − 3 = 28, then 28 ÷ 4 = 7.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "34"
      },
      {
        "id": "B",
        "text": "7"
      },
      {
        "id": "C",
        "text": "6"
      },
      {
        "id": "D",
        "text": "8"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "A bus has 36 people on it. At a stop, 14 people get off and 9 people get on. How many people are on the bus now? Give your answer in people.",
    "explanation": "36 − 14 = 22, then 22 + 9 = 31.",
    "questionType": "short_answer",
    "correctAnswer": "31",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Which of these is an odd number?",
    "explanation": "Odd numbers end in 1, 3, 5, 7 or 9. 731 ends in 1.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "731"
      },
      {
        "id": "B",
        "text": "990"
      },
      {
        "id": "C",
        "text": "346"
      },
      {
        "id": "D",
        "text": "528"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "A book costs 12 zeds and a pen costs 3 zeds. Mona buys 2 books and 4 pens. How much does she pay? Give your answer in zeds.",
    "explanation": "2 × 12 = 24 and 4 × 3 = 12. 24 + 12 = 36 zeds.",
    "questionType": "short_answer",
    "correctAnswer": "36",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "What number goes in the box?  48 ÷ □ = 6",
    "explanation": "6 × 8 = 48, so 48 ÷ 8 = 6.",
    "questionType": "short_answer",
    "correctAnswer": "8",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "3 friends share 2 pizzas equally. How much pizza does each friend get?",
    "explanation": "2 pizzas ÷ 3 friends = 2/3 of a pizza each.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "1/3 of a pizza"
      },
      {
        "id": "B",
        "text": "1/2 of a pizza"
      },
      {
        "id": "C",
        "text": "2/3 of a pizza"
      },
      {
        "id": "D",
        "text": "3/2 of a pizza"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "What is 405 − 199?",
    "explanation": "405 − 200 = 205, then add back 1: 206.",
    "questionType": "short_answer",
    "correctAnswer": "206",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "I am a 2-digit number less than 50. I am a multiple of 7. My digits add up to 10. What number am I?",
    "explanation": "Multiples of 7 below 50: 14, 21, 28, 35, 42, 49. Only 28 has digits that add to 10 (2 + 8). 91 also works but it is not less than 50.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "35"
      },
      {
        "id": "B",
        "text": "46"
      },
      {
        "id": "C",
        "text": "91"
      },
      {
        "id": "D",
        "text": "28"
      }
    ],
    "correctAnswer": "D",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Measurement and Geometry",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "How many sides does a hexagon have?",
    "explanation": "A hexagon has 6 sides. A pentagon has 5 and an octagon has 8.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "6"
      },
      {
        "id": "B",
        "text": "8"
      },
      {
        "id": "C",
        "text": "5"
      },
      {
        "id": "D",
        "text": "7"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Measurement and Geometry",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "A rectangle is 8 cm long and 5 cm wide. What is its perimeter?",
    "explanation": "Perimeter = 8 + 5 + 8 + 5 = 26 cm. 40 is the area, not the perimeter.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "40 cm"
      },
      {
        "id": "B",
        "text": "26 cm"
      },
      {
        "id": "C",
        "text": "13 cm"
      },
      {
        "id": "D",
        "text": "30 cm"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Measurement and Geometry",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "A garden is a rectangle 7 m long and 4 m wide. What is its area? Give your answer in m².",
    "explanation": "Area = length × width = 7 × 4 = 28 square metres.",
    "questionType": "short_answer",
    "correctAnswer": "28",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Measurement and Geometry",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Which shape has 4 equal sides and 4 right angles?",
    "explanation": "A square has 4 equal sides and 4 right angles.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Pentagon"
      },
      {
        "id": "B",
        "text": "Rectangle that is not a square"
      },
      {
        "id": "C",
        "text": "Square"
      },
      {
        "id": "D",
        "text": "Triangle"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Measurement and Geometry",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "A film starts at 3:45 pm and lasts 1 hour 30 minutes. What time does it end?",
    "explanation": "3:45 + 1 hour = 4:45. 4:45 + 30 minutes = 5:15 pm.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "5:15 pm"
      },
      {
        "id": "B",
        "text": "5:45 pm"
      },
      {
        "id": "C",
        "text": "4:75 pm"
      },
      {
        "id": "D",
        "text": "4:15 pm"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Measurement and Geometry",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "How many centimetres are in 3 metres? Give your answer in cm.",
    "explanation": "1 metre = 100 cm, so 3 metres = 300 cm.",
    "questionType": "short_answer",
    "correctAnswer": "300",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Measurement and Geometry",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "A square has a perimeter of 36 cm. How long is one side? Give your answer in cm.",
    "explanation": "A square has 4 equal sides: 36 ÷ 4 = 9 cm.",
    "questionType": "short_answer",
    "correctAnswer": "9",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Measurement and Geometry",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "What do we call an angle that is smaller than a right angle?",
    "explanation": "An acute angle is less than 90°. An obtuse angle is between 90° and 180°.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Acute angle"
      },
      {
        "id": "B",
        "text": "Obtuse angle"
      },
      {
        "id": "C",
        "text": "Reflex angle"
      },
      {
        "id": "D",
        "text": "Straight angle"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Measurement and Geometry",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Each small square is 1 square centimetre. What is the area of the shaded shape? Give your answer in cm².",
    "explanation": "Count the shaded squares: 4 on top, 2 down the side and 3 along the bottom = 9 square centimetres.",
    "questionType": "short_answer",
    "correctAnswer": "9",
    "imageUrl": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20172%20138%22%20width%3D%22172%22%20height%3D%22138%22%3E%3Crect%20x%3D%221%22%20y%3D%221%22%20width%3D%2234%22%20height%3D%2234%22%20fill%3D%22%23f59e0b%22%20stroke%3D%22%23475569%22%2F%3E%3Crect%20x%3D%2235%22%20y%3D%221%22%20width%3D%2234%22%20height%3D%2234%22%20fill%3D%22%23f59e0b%22%20stroke%3D%22%23475569%22%2F%3E%3Crect%20x%3D%2269%22%20y%3D%221%22%20width%3D%2234%22%20height%3D%2234%22%20fill%3D%22%23f59e0b%22%20stroke%3D%22%23475569%22%2F%3E%3Crect%20x%3D%22103%22%20y%3D%221%22%20width%3D%2234%22%20height%3D%2234%22%20fill%3D%22%23f59e0b%22%20stroke%3D%22%23475569%22%2F%3E%3Crect%20x%3D%22137%22%20y%3D%221%22%20width%3D%2234%22%20height%3D%2234%22%20fill%3D%22%23ffffff%22%20stroke%3D%22%23475569%22%2F%3E%3Crect%20x%3D%221%22%20y%3D%2235%22%20width%3D%2234%22%20height%3D%2234%22%20fill%3D%22%23f59e0b%22%20stroke%3D%22%23475569%22%2F%3E%3Crect%20x%3D%2235%22%20y%3D%2235%22%20width%3D%2234%22%20height%3D%2234%22%20fill%3D%22%23ffffff%22%20stroke%3D%22%23475569%22%2F%3E%3Crect%20x%3D%2269%22%20y%3D%2235%22%20width%3D%2234%22%20height%3D%2234%22%20fill%3D%22%23ffffff%22%20stroke%3D%22%23475569%22%2F%3E%3Crect%20x%3D%22103%22%20y%3D%2235%22%20width%3D%2234%22%20height%3D%2234%22%20fill%3D%22%23ffffff%22%20stroke%3D%22%23475569%22%2F%3E%3Crect%20x%3D%22137%22%20y%3D%2235%22%20width%3D%2234%22%20height%3D%2234%22%20fill%3D%22%23ffffff%22%20stroke%3D%22%23475569%22%2F%3E%3Crect%20x%3D%221%22%20y%3D%2269%22%20width%3D%2234%22%20height%3D%2234%22%20fill%3D%22%23f59e0b%22%20stroke%3D%22%23475569%22%2F%3E%3Crect%20x%3D%2235%22%20y%3D%2269%22%20width%3D%2234%22%20height%3D%2234%22%20fill%3D%22%23ffffff%22%20stroke%3D%22%23475569%22%2F%3E%3Crect%20x%3D%2269%22%20y%3D%2269%22%20width%3D%2234%22%20height%3D%2234%22%20fill%3D%22%23ffffff%22%20stroke%3D%22%23475569%22%2F%3E%3Crect%20x%3D%22103%22%20y%3D%2269%22%20width%3D%2234%22%20height%3D%2234%22%20fill%3D%22%23ffffff%22%20stroke%3D%22%23475569%22%2F%3E%3Crect%20x%3D%22137%22%20y%3D%2269%22%20width%3D%2234%22%20height%3D%2234%22%20fill%3D%22%23ffffff%22%20stroke%3D%22%23475569%22%2F%3E%3Crect%20x%3D%221%22%20y%3D%22103%22%20width%3D%2234%22%20height%3D%2234%22%20fill%3D%22%23f59e0b%22%20stroke%3D%22%23475569%22%2F%3E%3Crect%20x%3D%2235%22%20y%3D%22103%22%20width%3D%2234%22%20height%3D%2234%22%20fill%3D%22%23f59e0b%22%20stroke%3D%22%23475569%22%2F%3E%3Crect%20x%3D%2269%22%20y%3D%22103%22%20width%3D%2234%22%20height%3D%2234%22%20fill%3D%22%23f59e0b%22%20stroke%3D%22%23475569%22%2F%3E%3Crect%20x%3D%22103%22%20y%3D%22103%22%20width%3D%2234%22%20height%3D%2234%22%20fill%3D%22%23ffffff%22%20stroke%3D%22%23475569%22%2F%3E%3Crect%20x%3D%22137%22%20y%3D%22103%22%20width%3D%2234%22%20height%3D%2234%22%20fill%3D%22%23ffffff%22%20stroke%3D%22%23475569%22%2F%3E%3C%2Fsvg%3E"
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Measurement and Geometry",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Which object has a mass of about 1 kilogram?",
    "explanation": "A bag of sugar is usually about 1 kg. A paper clip is about 1 gram.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "A car"
      },
      {
        "id": "B",
        "text": "A pencil"
      },
      {
        "id": "C",
        "text": "A bag of sugar"
      },
      {
        "id": "D",
        "text": "A paper clip"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Measurement and Geometry",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "How many lines of symmetry does a square have?",
    "explanation": "A square has 2 lines through the middles of opposite sides and 2 diagonal lines: 4 in total.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "8"
      },
      {
        "id": "B",
        "text": "2"
      },
      {
        "id": "C",
        "text": "4"
      },
      {
        "id": "D",
        "text": "1"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Measurement and Geometry",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "A ribbon is 2 metres long. It is cut into pieces that are each 25 cm long. How many pieces are there? Give your answer in pieces.",
    "explanation": "2 m = 200 cm. 200 ÷ 25 = 8 pieces.",
    "questionType": "short_answer",
    "correctAnswer": "8",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Measurement and Geometry",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Which solid has 6 square faces?",
    "explanation": "A cube has 6 faces and every face is a square.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Sphere"
      },
      {
        "id": "B",
        "text": "Cone"
      },
      {
        "id": "C",
        "text": "Cube"
      },
      {
        "id": "D",
        "text": "Cylinder"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Data",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Look at the bar graph. How many more students chose Mango than Banana? Give your answer in students.",
    "explanation": "Mango = 9 and Banana = 5. 9 − 5 = 4.",
    "questionType": "short_answer",
    "correctAnswer": "4",
    "imageUrl": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20420%20240%22%20width%3D%22420%22%20height%3D%22240%22%3E%3Crect%20width%3D%22420%22%20height%3D%22240%22%20fill%3D%22%23ffffff%22%2F%3E%3Ctext%20x%3D%2240%22%20y%3D%2216%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20font-weight%3D%22bold%22%20fill%3D%22%230f172a%22%3EFavourite%20fruit%20in%20Class%204B%3C%2Ftext%3E%3Ctext%20x%3D%226%22%20y%3D%2224%22%20font-family%3D%22Arial%22%20font-size%3D%2211%22%20fill%3D%22%23475569%22%3EStudents%3C%2Ftext%3E%3Cline%20x1%3D%2240%22%20x2%3D%22414%22%20y1%3D%22200%22%20y2%3D%22200%22%20stroke%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%22204%22%20text-anchor%3D%22end%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23475569%22%3E0%3C%2Ftext%3E%3Cline%20x1%3D%2240%22%20x2%3D%22414%22%20y1%3D%22166%22%20y2%3D%22166%22%20stroke%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%22170%22%20text-anchor%3D%22end%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23475569%22%3E2%3C%2Ftext%3E%3Cline%20x1%3D%2240%22%20x2%3D%22414%22%20y1%3D%22132%22%20y2%3D%22132%22%20stroke%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%22136%22%20text-anchor%3D%22end%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23475569%22%3E4%3C%2Ftext%3E%3Cline%20x1%3D%2240%22%20x2%3D%22414%22%20y1%3D%2298%22%20y2%3D%2298%22%20stroke%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%22102%22%20text-anchor%3D%22end%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23475569%22%3E6%3C%2Ftext%3E%3Cline%20x1%3D%2240%22%20x2%3D%22414%22%20y1%3D%2264%22%20y2%3D%2264%22%20stroke%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%2268%22%20text-anchor%3D%22end%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23475569%22%3E8%3C%2Ftext%3E%3Cline%20x1%3D%2240%22%20x2%3D%22414%22%20y1%3D%2230%22%20y2%3D%2230%22%20stroke%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%2234%22%20text-anchor%3D%22end%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23475569%22%3E10%3C%2Ftext%3E%3Crect%20x%3D%2258.5%22%20y%3D%2264%22%20width%3D%2255.5%22%20height%3D%22136%22%20fill%3D%22%232563eb%22%2F%3E%3Ctext%20x%3D%2286.25%22%20y%3D%22218%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%230f172a%22%3EApple%3C%2Ftext%3E%3Crect%20x%3D%22151%22%20y%3D%22115%22%20width%3D%2255.5%22%20height%3D%2285%22%20fill%3D%22%232563eb%22%2F%3E%3Ctext%20x%3D%22178.75%22%20y%3D%22218%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%230f172a%22%3EBanana%3C%2Ftext%3E%3Crect%20x%3D%22243.5%22%20y%3D%2247%22%20width%3D%2255.5%22%20height%3D%22153%22%20fill%3D%22%232563eb%22%2F%3E%3Ctext%20x%3D%22271.25%22%20y%3D%22218%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%230f172a%22%3EMango%3C%2Ftext%3E%3Crect%20x%3D%22336%22%20y%3D%22149%22%20width%3D%2255.5%22%20height%3D%2251%22%20fill%3D%22%232563eb%22%2F%3E%3Ctext%20x%3D%22363.75%22%20y%3D%22218%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%230f172a%22%3EGrapes%3C%2Ftext%3E%3Cline%20x1%3D%2240%22%20x2%3D%22414%22%20y1%3D%22200%22%20y2%3D%22200%22%20stroke%3D%22%23475569%22%2F%3E%3C%2Fsvg%3E"
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Data",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Look at the bar graph. Which fruit was chosen by the fewest students?",
    "explanation": "The shortest bar is Grapes, with 3 students.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Grapes"
      },
      {
        "id": "B",
        "text": "Mango"
      },
      {
        "id": "C",
        "text": "Apple"
      },
      {
        "id": "D",
        "text": "Banana"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20420%20240%22%20width%3D%22420%22%20height%3D%22240%22%3E%3Crect%20width%3D%22420%22%20height%3D%22240%22%20fill%3D%22%23ffffff%22%2F%3E%3Ctext%20x%3D%2240%22%20y%3D%2216%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20font-weight%3D%22bold%22%20fill%3D%22%230f172a%22%3EFavourite%20fruit%20in%20Class%204B%3C%2Ftext%3E%3Ctext%20x%3D%226%22%20y%3D%2224%22%20font-family%3D%22Arial%22%20font-size%3D%2211%22%20fill%3D%22%23475569%22%3EStudents%3C%2Ftext%3E%3Cline%20x1%3D%2240%22%20x2%3D%22414%22%20y1%3D%22200%22%20y2%3D%22200%22%20stroke%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%22204%22%20text-anchor%3D%22end%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23475569%22%3E0%3C%2Ftext%3E%3Cline%20x1%3D%2240%22%20x2%3D%22414%22%20y1%3D%22166%22%20y2%3D%22166%22%20stroke%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%22170%22%20text-anchor%3D%22end%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23475569%22%3E2%3C%2Ftext%3E%3Cline%20x1%3D%2240%22%20x2%3D%22414%22%20y1%3D%22132%22%20y2%3D%22132%22%20stroke%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%22136%22%20text-anchor%3D%22end%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23475569%22%3E4%3C%2Ftext%3E%3Cline%20x1%3D%2240%22%20x2%3D%22414%22%20y1%3D%2298%22%20y2%3D%2298%22%20stroke%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%22102%22%20text-anchor%3D%22end%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23475569%22%3E6%3C%2Ftext%3E%3Cline%20x1%3D%2240%22%20x2%3D%22414%22%20y1%3D%2264%22%20y2%3D%2264%22%20stroke%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%2268%22%20text-anchor%3D%22end%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23475569%22%3E8%3C%2Ftext%3E%3Cline%20x1%3D%2240%22%20x2%3D%22414%22%20y1%3D%2230%22%20y2%3D%2230%22%20stroke%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%2234%22%20text-anchor%3D%22end%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23475569%22%3E10%3C%2Ftext%3E%3Crect%20x%3D%2258.5%22%20y%3D%2264%22%20width%3D%2255.5%22%20height%3D%22136%22%20fill%3D%22%232563eb%22%2F%3E%3Ctext%20x%3D%2286.25%22%20y%3D%22218%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%230f172a%22%3EApple%3C%2Ftext%3E%3Crect%20x%3D%22151%22%20y%3D%22115%22%20width%3D%2255.5%22%20height%3D%2285%22%20fill%3D%22%232563eb%22%2F%3E%3Ctext%20x%3D%22178.75%22%20y%3D%22218%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%230f172a%22%3EBanana%3C%2Ftext%3E%3Crect%20x%3D%22243.5%22%20y%3D%2247%22%20width%3D%2255.5%22%20height%3D%22153%22%20fill%3D%22%232563eb%22%2F%3E%3Ctext%20x%3D%22271.25%22%20y%3D%22218%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%230f172a%22%3EMango%3C%2Ftext%3E%3Crect%20x%3D%22336%22%20y%3D%22149%22%20width%3D%2255.5%22%20height%3D%2251%22%20fill%3D%22%232563eb%22%2F%3E%3Ctext%20x%3D%22363.75%22%20y%3D%22218%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%230f172a%22%3EGrapes%3C%2Ftext%3E%3Cline%20x1%3D%2240%22%20x2%3D%22414%22%20y1%3D%22200%22%20y2%3D%22200%22%20stroke%3D%22%23475569%22%2F%3E%3C%2Fsvg%3E"
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Data",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Look at the bar graph. How many students are in Class 4B altogether? Give your answer in students.",
    "explanation": "8 + 5 + 9 + 3 = 25 students.",
    "questionType": "short_answer",
    "correctAnswer": "25",
    "imageUrl": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20420%20240%22%20width%3D%22420%22%20height%3D%22240%22%3E%3Crect%20width%3D%22420%22%20height%3D%22240%22%20fill%3D%22%23ffffff%22%2F%3E%3Ctext%20x%3D%2240%22%20y%3D%2216%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20font-weight%3D%22bold%22%20fill%3D%22%230f172a%22%3EFavourite%20fruit%20in%20Class%204B%3C%2Ftext%3E%3Ctext%20x%3D%226%22%20y%3D%2224%22%20font-family%3D%22Arial%22%20font-size%3D%2211%22%20fill%3D%22%23475569%22%3EStudents%3C%2Ftext%3E%3Cline%20x1%3D%2240%22%20x2%3D%22414%22%20y1%3D%22200%22%20y2%3D%22200%22%20stroke%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%22204%22%20text-anchor%3D%22end%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23475569%22%3E0%3C%2Ftext%3E%3Cline%20x1%3D%2240%22%20x2%3D%22414%22%20y1%3D%22166%22%20y2%3D%22166%22%20stroke%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%22170%22%20text-anchor%3D%22end%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23475569%22%3E2%3C%2Ftext%3E%3Cline%20x1%3D%2240%22%20x2%3D%22414%22%20y1%3D%22132%22%20y2%3D%22132%22%20stroke%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%22136%22%20text-anchor%3D%22end%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23475569%22%3E4%3C%2Ftext%3E%3Cline%20x1%3D%2240%22%20x2%3D%22414%22%20y1%3D%2298%22%20y2%3D%2298%22%20stroke%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%22102%22%20text-anchor%3D%22end%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23475569%22%3E6%3C%2Ftext%3E%3Cline%20x1%3D%2240%22%20x2%3D%22414%22%20y1%3D%2264%22%20y2%3D%2264%22%20stroke%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%2268%22%20text-anchor%3D%22end%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23475569%22%3E8%3C%2Ftext%3E%3Cline%20x1%3D%2240%22%20x2%3D%22414%22%20y1%3D%2230%22%20y2%3D%2230%22%20stroke%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%2234%22%20text-anchor%3D%22end%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23475569%22%3E10%3C%2Ftext%3E%3Crect%20x%3D%2258.5%22%20y%3D%2264%22%20width%3D%2255.5%22%20height%3D%22136%22%20fill%3D%22%232563eb%22%2F%3E%3Ctext%20x%3D%2286.25%22%20y%3D%22218%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%230f172a%22%3EApple%3C%2Ftext%3E%3Crect%20x%3D%22151%22%20y%3D%22115%22%20width%3D%2255.5%22%20height%3D%2285%22%20fill%3D%22%232563eb%22%2F%3E%3Ctext%20x%3D%22178.75%22%20y%3D%22218%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%230f172a%22%3EBanana%3C%2Ftext%3E%3Crect%20x%3D%22243.5%22%20y%3D%2247%22%20width%3D%2255.5%22%20height%3D%22153%22%20fill%3D%22%232563eb%22%2F%3E%3Ctext%20x%3D%22271.25%22%20y%3D%22218%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%230f172a%22%3EMango%3C%2Ftext%3E%3Crect%20x%3D%22336%22%20y%3D%22149%22%20width%3D%2255.5%22%20height%3D%2251%22%20fill%3D%22%232563eb%22%2F%3E%3Ctext%20x%3D%22363.75%22%20y%3D%22218%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%230f172a%22%3EGrapes%3C%2Ftext%3E%3Cline%20x1%3D%2240%22%20x2%3D%22414%22%20y1%3D%22200%22%20y2%3D%22200%22%20stroke%3D%22%23475569%22%2F%3E%3C%2Fsvg%3E"
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Data",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "In a pictograph, each book symbol stands for 4 books. Class 4A has 5 and a half symbols. How many books did Class 4A read?",
    "explanation": "5 symbols = 5 × 4 = 20. Half a symbol = 2. 20 + 2 = 22 books.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "11"
      },
      {
        "id": "B",
        "text": "22"
      },
      {
        "id": "C",
        "text": "24"
      },
      {
        "id": "D",
        "text": "20"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Data",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "The temperatures were: Monday 24°C, Tuesday 27°C, Wednesday 22°C, Thursday 29°C. What is the difference between the highest and lowest temperature? Give your answer in °C.",
    "explanation": "Highest 29°C, lowest 22°C. 29 − 22 = 7 degrees.",
    "questionType": "short_answer",
    "correctAnswer": "7",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Data",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "A bag has 3 red, 5 blue and 2 green marbles. Sami takes one marble without looking. Which colour is he most likely to take?",
    "explanation": "There are more blue marbles (5) than any other colour.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Green"
      },
      {
        "id": "B",
        "text": "All colours are equally likely"
      },
      {
        "id": "C",
        "text": "Red"
      },
      {
        "id": "D",
        "text": "Blue"
      }
    ],
    "correctAnswer": "D",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Math",
    "contentDomain": "Data",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "In a survey, 6 students walk to school, 9 come by bus and 5 come by car. What fraction of the students come by car?",
    "explanation": "Total = 6 + 9 + 5 = 20. Car = 5 out of 20 = 5/20 = 1/4.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "1/5"
      },
      {
        "id": "B",
        "text": "1/3"
      },
      {
        "id": "C",
        "text": "1/4"
      },
      {
        "id": "D",
        "text": "5/15"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Life Science",
    "scienceSubDomain": "Life Science",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Which part of a plant takes in water from the soil?",
    "explanation": "Roots take in water and minerals from the soil.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Leaves"
      },
      {
        "id": "B",
        "text": "Fruit"
      },
      {
        "id": "C",
        "text": "Roots"
      },
      {
        "id": "D",
        "text": "Flowers"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Life Science",
    "scienceSubDomain": "Life Science",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "What do green plants need to make their own food?",
    "explanation": "Plants use sunlight, water and carbon dioxide from the air to make food (sugar) in their leaves.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Moonlight and salt"
      },
      {
        "id": "B",
        "text": "Only water"
      },
      {
        "id": "C",
        "text": "Sunlight, water and carbon dioxide"
      },
      {
        "id": "D",
        "text": "Soil, sugar and oxygen"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Life Science",
    "scienceSubDomain": "Life Science",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Which animal is a mammal?",
    "explanation": "Whales breathe air, have hair at some stage and feed their babies milk, so they are mammals. A shark is a fish.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Frog"
      },
      {
        "id": "B",
        "text": "Whale"
      },
      {
        "id": "C",
        "text": "Eagle"
      },
      {
        "id": "D",
        "text": "Shark"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Life Science",
    "scienceSubDomain": "Life Science",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Look at this food chain: grass → rabbit → fox. Which living thing is the producer?",
    "explanation": "Producers make their own food. Grass is a plant, so it is the producer. The Sun is not a living thing.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "The Sun"
      },
      {
        "id": "B",
        "text": "Fox"
      },
      {
        "id": "C",
        "text": "Rabbit"
      },
      {
        "id": "D",
        "text": "Grass"
      }
    ],
    "correctAnswer": "D",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Life Science",
    "scienceSubDomain": "Life Science",
    "session": "science_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "In this food chain: grass → grasshopper → frog → snake. If all the frogs disappeared, what would most likely happen to the grasshoppers first?",
    "explanation": "Frogs eat grasshoppers. Without frogs, fewer grasshoppers are eaten, so their number goes up.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "They would start eating snakes"
      },
      {
        "id": "B",
        "text": "Their number would increase"
      },
      {
        "id": "C",
        "text": "Nothing would change"
      },
      {
        "id": "D",
        "text": "Their number would decrease"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Life Science",
    "scienceSubDomain": "Life Science",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "What is the correct order of the life cycle of a butterfly?",
    "explanation": "A butterfly lays an egg, a caterpillar (larva) hatches, it forms a pupa, and an adult butterfly comes out.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Egg → caterpillar → pupa → adult"
      },
      {
        "id": "B",
        "text": "Pupa → egg → adult → caterpillar"
      },
      {
        "id": "C",
        "text": "Caterpillar → egg → adult → pupa"
      },
      {
        "id": "D",
        "text": "Egg → pupa → caterpillar → adult"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Life Science",
    "scienceSubDomain": "Life Science",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Why do polar bears have thick fur and a layer of fat?",
    "explanation": "Thick fur and fat are adaptations that keep polar bears warm in the Arctic.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "To make them lighter"
      },
      {
        "id": "B",
        "text": "To hide from the Sun"
      },
      {
        "id": "C",
        "text": "To keep warm in a very cold place"
      },
      {
        "id": "D",
        "text": "To swim faster"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Life Science",
    "scienceSubDomain": "Life Science",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Which organ pumps blood around the body?",
    "explanation": "The heart is a muscle that pumps blood through blood vessels.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Stomach"
      },
      {
        "id": "B",
        "text": "Heart"
      },
      {
        "id": "C",
        "text": "Brain"
      },
      {
        "id": "D",
        "text": "Lungs"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Life Science",
    "scienceSubDomain": "Life Science",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Which habit helps stop germs from spreading?",
    "explanation": "Soap and water remove germs from your hands.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Sharing a drinking bottle"
      },
      {
        "id": "B",
        "text": "Eating food that fell on the floor"
      },
      {
        "id": "C",
        "text": "Sneezing into your hands and touching the door"
      },
      {
        "id": "D",
        "text": "Washing hands with soap before eating"
      }
    ],
    "correctAnswer": "D",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Life Science",
    "scienceSubDomain": "Life Science",
    "session": "science_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "A cactus has a thick stem that stores water and spines instead of leaves. Where does a cactus most likely live?",
    "explanation": "Storing water and having spines (which lose less water than leaves) helps a cactus survive where there is little rain.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "In a hot, dry desert"
      },
      {
        "id": "B",
        "text": "In a rainforest"
      },
      {
        "id": "C",
        "text": "Under the sea"
      },
      {
        "id": "D",
        "text": "In a pond"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Life Science",
    "scienceSubDomain": "Life Science",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Which animal hatches from an egg?",
    "explanation": "Birds such as chickens lay eggs. Cats, cows and dolphins are mammals that give birth to live young.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Chicken"
      },
      {
        "id": "B",
        "text": "Dolphin"
      },
      {
        "id": "C",
        "text": "Cow"
      },
      {
        "id": "D",
        "text": "Cat"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Life Science",
    "scienceSubDomain": "Life Science",
    "session": "science_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "A green plant is kept in a dark cupboard for two weeks. Its leaves turn yellow and it becomes weak. What is the best explanation?",
    "explanation": "Plants need light to make food. Without light the plant uses up its stored food and becomes weak.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "The cupboard gave it too much water"
      },
      {
        "id": "B",
        "text": "It had too much air"
      },
      {
        "id": "C",
        "text": "It could not make food without light"
      },
      {
        "id": "D",
        "text": "It was too cold to grow roots"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Life Science",
    "scienceSubDomain": "Life Science",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Which group contains only living things?",
    "explanation": "Trees, mushrooms and ants all grow, need food and reproduce. Rocks, clouds, the Sun, sand and wind are not living.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Tree, mushroom, ant"
      },
      {
        "id": "B",
        "text": "Water, bird, sun"
      },
      {
        "id": "C",
        "text": "Rock, tree, cloud"
      },
      {
        "id": "D",
        "text": "Sand, fish, wind"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Life Science",
    "scienceSubDomain": "Life Science",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Which teeth are best for biting and cutting food?",
    "explanation": "The flat, sharp front teeth (incisors) cut food. Molars at the back grind it.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Baby teeth only"
      },
      {
        "id": "B",
        "text": "Wisdom teeth"
      },
      {
        "id": "C",
        "text": "Front teeth (incisors)"
      },
      {
        "id": "D",
        "text": "Back teeth (molars)"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Life Science",
    "scienceSubDomain": "Life Science",
    "session": "science_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "Huda wants to find out if plants need water. She uses two plants of the same kind in the same sunny place. What should be different between the two plants?",
    "explanation": "In a fair test only one thing is changed. To test water, only the amount of water should be different.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "The type of plant"
      },
      {
        "id": "B",
        "text": "The amount of light"
      },
      {
        "id": "C",
        "text": "The size of the pot"
      },
      {
        "id": "D",
        "text": "The amount of water they get"
      }
    ],
    "correctAnswer": "D",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Physical Science",
    "scienceSubDomain": "Physical Science",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Which object would be attracted to a magnet?",
    "explanation": "Magnets attract iron and steel. Plastic, wood and glass are not magnetic.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "A wooden stick"
      },
      {
        "id": "B",
        "text": "A glass marble"
      },
      {
        "id": "C",
        "text": "An iron nail"
      },
      {
        "id": "D",
        "text": "A plastic spoon"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Physical Science",
    "scienceSubDomain": "Physical Science",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "What do we call it when liquid water changes into ice?",
    "explanation": "Water freezes into ice when it is cooled to 0°C.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Boiling"
      },
      {
        "id": "B",
        "text": "Freezing"
      },
      {
        "id": "C",
        "text": "Melting"
      },
      {
        "id": "D",
        "text": "Evaporating"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Physical Science",
    "scienceSubDomain": "Physical Science",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Which cup would keep a hot drink warm for the longest time?",
    "explanation": "Foam is a good insulator, so heat escapes slowly. Metal lets heat escape quickly.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "A foam cup"
      },
      {
        "id": "B",
        "text": "A thin glass cup"
      },
      {
        "id": "C",
        "text": "A thin metal cup"
      },
      {
        "id": "D",
        "text": "A thin plastic cup"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Physical Science",
    "scienceSubDomain": "Physical Science",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Which of these gives off its own light?",
    "explanation": "The Sun makes its own light. The Moon and a mirror only reflect light.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "A window"
      },
      {
        "id": "B",
        "text": "A mirror"
      },
      {
        "id": "C",
        "text": "The Moon"
      },
      {
        "id": "D",
        "text": "The Sun"
      }
    ],
    "correctAnswer": "D",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Physical Science",
    "scienceSubDomain": "Physical Science",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Omar pushes a toy car. Then he pushes it again much harder. What happens the second time?",
    "explanation": "A bigger push (force) makes the car speed up more, so it goes faster and farther.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "The car moves faster and farther"
      },
      {
        "id": "B",
        "text": "The car moves backwards"
      },
      {
        "id": "C",
        "text": "The car does not move"
      },
      {
        "id": "D",
        "text": "The car moves slower"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Physical Science",
    "scienceSubDomain": "Physical Science",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "What is needed for a bulb to light up in a circuit with a battery?",
    "explanation": "Electricity only flows when the circuit is a complete loop.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "A complete loop of wires with no gaps"
      },
      {
        "id": "B",
        "text": "A gap in the wire"
      },
      {
        "id": "C",
        "text": "A plastic switch that is open"
      },
      {
        "id": "D",
        "text": "Only one wire"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Physical Science",
    "scienceSubDomain": "Physical Science",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Which material lets electricity flow through it?",
    "explanation": "Metals like copper are conductors. Rubber, wood and plastic are insulators.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Rubber band"
      },
      {
        "id": "B",
        "text": "Copper wire"
      },
      {
        "id": "C",
        "text": "Wooden ruler"
      },
      {
        "id": "D",
        "text": "Plastic straw"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Physical Science",
    "scienceSubDomain": "Physical Science",
    "session": "science_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "Why does a shadow form behind a tree on a sunny day?",
    "explanation": "Light travels in straight lines. The tree stops light from reaching the ground behind it.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "The wind pushes the light away"
      },
      {
        "id": "B",
        "text": "The tree makes darkness"
      },
      {
        "id": "C",
        "text": "The tree blocks the sunlight"
      },
      {
        "id": "D",
        "text": "The ground soaks up the light"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Physical Science",
    "scienceSubDomain": "Physical Science",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "What makes a sound?",
    "explanation": "All sounds are made by vibrations, like a guitar string moving back and forth.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Something stopping still"
      },
      {
        "id": "B",
        "text": "Light bouncing"
      },
      {
        "id": "C",
        "text": "Something getting colder"
      },
      {
        "id": "D",
        "text": "Something vibrating"
      }
    ],
    "correctAnswer": "D",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Physical Science",
    "scienceSubDomain": "Physical Science",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "After rain, there is a puddle in the playground. On a sunny afternoon the puddle disappears. Where did the water go?",
    "explanation": "Heat from the Sun turns the water into water vapour, which goes into the air. This is evaporation.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "It turned into soil"
      },
      {
        "id": "B",
        "text": "It was melted by the Sun"
      },
      {
        "id": "C",
        "text": "It evaporated into the air"
      },
      {
        "id": "D",
        "text": "It turned into ice"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Physical Science",
    "scienceSubDomain": "Physical Science",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Which of these is a gas?",
    "explanation": "Water vapour is water in the gas state. Ice and sand are solids, juice is a liquid.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Orange juice"
      },
      {
        "id": "B",
        "text": "Water vapour"
      },
      {
        "id": "C",
        "text": "Sand"
      },
      {
        "id": "D",
        "text": "Ice"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Physical Science",
    "scienceSubDomain": "Physical Science",
    "session": "science_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "The same ball is rolled with the same push on four surfaces. On which surface will it roll the farthest?",
    "explanation": "A smooth surface has the least friction, so the ball slows down the least.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Sand"
      },
      {
        "id": "B",
        "text": "Grass"
      },
      {
        "id": "C",
        "text": "Thick carpet"
      },
      {
        "id": "D",
        "text": "Smooth floor tiles"
      }
    ],
    "correctAnswer": "D",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Physical Science",
    "scienceSubDomain": "Physical Science",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Salt is dissolved in a glass of water. How can you get the salt back?",
    "explanation": "When the water evaporates, the salt is left behind. Salt passes through filter paper because it is dissolved.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Stir the water faster"
      },
      {
        "id": "B",
        "text": "Let the water evaporate"
      },
      {
        "id": "C",
        "text": "Put the glass in the fridge"
      },
      {
        "id": "D",
        "text": "Pour it through paper"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Physical Science",
    "scienceSubDomain": "Physical Science",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "What is the force that pulls objects down towards the Earth?",
    "explanation": "Gravity pulls everything towards the centre of the Earth.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Friction"
      },
      {
        "id": "B",
        "text": "Gravity"
      },
      {
        "id": "C",
        "text": "Air resistance"
      },
      {
        "id": "D",
        "text": "Magnetism"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Physical Science",
    "scienceSubDomain": "Physical Science",
    "session": "science_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "A metal spoon is left in a bowl of hot soup. After a few minutes the handle feels hot. Why?",
    "explanation": "Metals are good conductors of heat, so heat travels along the spoon to the handle.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Cold moves out of the spoon into the soup"
      },
      {
        "id": "B",
        "text": "Heat moves through the metal"
      },
      {
        "id": "C",
        "text": "The soup jumps onto the handle"
      },
      {
        "id": "D",
        "text": "Metal makes its own heat"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Earth Science",
    "scienceSubDomain": "Earth Science",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "How long does it take the Earth to travel once around the Sun?",
    "explanation": "The Earth orbits the Sun once every year (about 365 days).",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "One week"
      },
      {
        "id": "B",
        "text": "About one year"
      },
      {
        "id": "C",
        "text": "One day"
      },
      {
        "id": "D",
        "text": "One month"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Earth Science",
    "scienceSubDomain": "Earth Science",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "What causes day and night?",
    "explanation": "The Earth spins once every 24 hours. The side facing the Sun has day; the other side has night.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Clouds covering the Sun"
      },
      {
        "id": "B",
        "text": "The Earth spinning on its axis"
      },
      {
        "id": "C",
        "text": "The Sun moving around the Earth"
      },
      {
        "id": "D",
        "text": "The Moon blocking the Sun"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Earth Science",
    "scienceSubDomain": "Earth Science",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Which of these is a renewable energy source?",
    "explanation": "Wind will not run out. Coal, oil and gas take millions of years to form.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Natural gas"
      },
      {
        "id": "B",
        "text": "Wind"
      },
      {
        "id": "C",
        "text": "Coal"
      },
      {
        "id": "D",
        "text": "Oil"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Earth Science",
    "scienceSubDomain": "Earth Science",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "What covers most of the Earth's surface?",
    "explanation": "About 70% of the Earth's surface is covered by oceans.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Forests"
      },
      {
        "id": "B",
        "text": "Ice"
      },
      {
        "id": "C",
        "text": "Water"
      },
      {
        "id": "D",
        "text": "Sand"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Earth Science",
    "scienceSubDomain": "Earth Science",
    "session": "science_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "Fossils of sea shells are found at the top of a mountain. What does this tell us?",
    "explanation": "Sea animals lived and died there when the land was under water. The rock was pushed up later.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "The land was once under the sea"
      },
      {
        "id": "B",
        "text": "People put them there for fun"
      },
      {
        "id": "C",
        "text": "Shells grow on mountains"
      },
      {
        "id": "D",
        "text": "Birds carried the shells there"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Earth Science",
    "scienceSubDomain": "Earth Science",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Why does the Moon seem to change shape during the month?",
    "explanation": "The Moon is always lit on the side facing the Sun. As it orbits the Earth we see more or less of that lit side.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "The Earth's shadow covers it every night"
      },
      {
        "id": "B",
        "text": "We see different amounts of its sunlit side"
      },
      {
        "id": "C",
        "text": "Clouds cover parts of it"
      },
      {
        "id": "D",
        "text": "The Moon really changes shape"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Earth Science",
    "scienceSubDomain": "Earth Science",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Which instrument is used to measure temperature?",
    "explanation": "A thermometer measures temperature. A rain gauge measures rainfall.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Compass"
      },
      {
        "id": "B",
        "text": "Thermometer"
      },
      {
        "id": "C",
        "text": "Ruler"
      },
      {
        "id": "D",
        "text": "Rain gauge"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Earth Science",
    "scienceSubDomain": "Earth Science",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "What kind of rock forms when hot lava cools down?",
    "explanation": "Igneous rock forms from melted rock (magma or lava) that cools and hardens.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Igneous rock"
      },
      {
        "id": "B",
        "text": "Sandstone"
      },
      {
        "id": "C",
        "text": "Sedimentary rock"
      },
      {
        "id": "D",
        "text": "Fossil rock"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Earth Science",
    "scienceSubDomain": "Earth Science",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Which is the best way to save water at home?",
    "explanation": "Turning off the tap stops clean water from going down the drain.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Leave the hose running"
      },
      {
        "id": "B",
        "text": "Turn off the tap while brushing your teeth"
      },
      {
        "id": "C",
        "text": "Wash one cup at a time under a running tap"
      },
      {
        "id": "D",
        "text": "Take very long showers"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 4,
    "subject": "Science",
    "contentDomain": "Earth Science",
    "scienceSubDomain": "Earth Science",
    "session": "science_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "At what time of day is your shadow the shortest on a sunny day?",
    "explanation": "At midday the Sun is highest in the sky, so shadows are shortest.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Early morning"
      },
      {
        "id": "B",
        "text": "Around midday"
      },
      {
        "id": "C",
        "text": "Late afternoon"
      },
      {
        "id": "D",
        "text": "Just before sunset"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  }
] as PackQuestion[],
  },
  grade8: {
    label: "Grade 8 extra practice pack",
    description: "Extra Grade 8 Mathematics (Number, Algebra, Geometry, Data and Probability) and Science (Biology, Chemistry, Physics, Earth Science).",
    questions: [
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "What is −7 + 12?",
    "explanation": "Start at −7 and move 12 to the right on the number line: 5.",
    "questionType": "short_answer",
    "correctAnswer": "5",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "What is 3/4 + 2/5?",
    "explanation": "Common denominator 20: 15/20 + 8/20 = 23/20.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "23/20"
      },
      {
        "id": "B",
        "text": "5/20"
      },
      {
        "id": "C",
        "text": "6/9"
      },
      {
        "id": "D",
        "text": "5/9"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "What is 15% of 240?",
    "explanation": "10% of 240 = 24 and 5% = 12. 24 + 12 = 36.",
    "questionType": "short_answer",
    "correctAnswer": "36",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "A jacket costs 80 zeds. In a sale the price is reduced by 25%. What is the sale price? Give your answer in zeds.",
    "explanation": "25% of 80 = 20. 80 − 20 = 60 zeds.",
    "questionType": "short_answer",
    "correctAnswer": "60",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Which fraction is equal to 0.375?",
    "explanation": "0.375 = 375/1000. Divide top and bottom by 125: 3/8.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "37/100"
      },
      {
        "id": "B",
        "text": "3/75"
      },
      {
        "id": "C",
        "text": "5/8"
      },
      {
        "id": "D",
        "text": "3/8"
      }
    ],
    "correctAnswer": "D",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "The ratio of boys to girls in a class is 3 : 5. There are 32 students. How many girls are there? Give your answer in girls.",
    "explanation": "3 + 5 = 8 parts. 32 ÷ 8 = 4 students per part. Girls = 5 × 4 = 20.",
    "questionType": "short_answer",
    "correctAnswer": "20",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "What is 2.4 × 0.5?",
    "explanation": "Multiplying by 0.5 is the same as halving: half of 2.4 is 1.2.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "12"
      },
      {
        "id": "B",
        "text": "1.2"
      },
      {
        "id": "C",
        "text": "0.12"
      },
      {
        "id": "D",
        "text": "4.8"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Which of these is a prime number?",
    "explanation": "39 = 3 × 13, 51 = 3 × 17 and 57 = 3 × 19. 37 has only the factors 1 and 37.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "39"
      },
      {
        "id": "B",
        "text": "51"
      },
      {
        "id": "C",
        "text": "57"
      },
      {
        "id": "D",
        "text": "37"
      }
    ],
    "correctAnswer": "D",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "A car travels 180 km in 2.5 hours. What is its average speed? Give your answer in km/h.",
    "explanation": "Speed = distance ÷ time = 180 ÷ 2.5 = 72 km/h.",
    "questionType": "short_answer",
    "correctAnswer": "72",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "Which is the best estimate of 4.98 × 19.7?",
    "explanation": "4.98 is about 5 and 19.7 is about 20. 5 × 20 = 100.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "100"
      },
      {
        "id": "B",
        "text": "25"
      },
      {
        "id": "C",
        "text": "1,000"
      },
      {
        "id": "D",
        "text": "10"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "What is (−3) × (−4) − 5?",
    "explanation": "(−3) × (−4) = 12. 12 − 5 = 7.",
    "questionType": "short_answer",
    "correctAnswer": "7",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Which is equal to 2³ × 2²?",
    "explanation": "When multiplying powers with the same base, add the exponents: 3 + 2 = 5.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "4⁵"
      },
      {
        "id": "B",
        "text": "4⁶"
      },
      {
        "id": "C",
        "text": "2⁵"
      },
      {
        "id": "D",
        "text": "2⁶"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "What is the lowest common multiple (LCM) of 12 and 18?",
    "explanation": "Multiples of 12: 12, 24, 36… Multiples of 18: 18, 36… The first common one is 36.",
    "questionType": "short_answer",
    "correctAnswer": "36",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "A recipe uses 250 g of flour for 4 people. How much flour is needed for 10 people? Give your answer in g.",
    "explanation": "Per person: 250 ÷ 4 = 62.5 g. For 10 people: 62.5 × 10 = 625 g.",
    "questionType": "short_answer",
    "correctAnswer": "625",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Number",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "What is √144?",
    "explanation": "12 × 12 = 144.",
    "questionType": "short_answer",
    "correctAnswer": "12",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Algebra",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Solve 3x + 7 = 22. Give the value of x.",
    "explanation": "Subtract 7: 3x = 15. Divide by 3: x = 5.",
    "questionType": "short_answer",
    "correctAnswer": "5",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Algebra",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Simplify 4(2a − 3) − 2a.",
    "explanation": "4(2a − 3) = 8a − 12. Then 8a − 12 − 2a = 6a − 12.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "6a − 3"
      },
      {
        "id": "B",
        "text": "8a − 12"
      },
      {
        "id": "C",
        "text": "6a − 12"
      },
      {
        "id": "D",
        "text": "10a − 12"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Algebra",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "If a = 3 and b = −2, what is the value of 2a² − b?",
    "explanation": "2 × 3² = 18. 18 − (−2) = 20.",
    "questionType": "short_answer",
    "correctAnswer": "20",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Algebra",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "Look at the pattern: 2, 5, 10, 17, 26, … Which expression gives the nth term?",
    "explanation": "Check n = 1: 1 + 1 = 2. n = 3: 9 + 1 = 10. The terms are one more than the square numbers.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "2n + 1"
      },
      {
        "id": "B",
        "text": "3n − 1"
      },
      {
        "id": "C",
        "text": "n² + 1"
      },
      {
        "id": "D",
        "text": "n² − 1"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Algebra",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Which point lies on the line y = 2x − 3?",
    "explanation": "For x = 4: y = 8 − 3 = 5. ✓ The other points do not fit the equation.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "(2, 3)"
      },
      {
        "id": "B",
        "text": "(0, 3)"
      },
      {
        "id": "C",
        "text": "(4, 5)"
      },
      {
        "id": "D",
        "text": "(1, 1)"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Algebra",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "What is the slope (gradient) of the line y = −3x + 4?",
    "explanation": "In y = mx + c, m is the slope. Here m = −3.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "4"
      },
      {
        "id": "B",
        "text": "3"
      },
      {
        "id": "C",
        "text": "−3"
      },
      {
        "id": "D",
        "text": "−4"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Algebra",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Solve 5x − 4 = 2x + 14. Give the value of x.",
    "explanation": "Subtract 2x: 3x − 4 = 14. Add 4: 3x = 18. x = 6.",
    "questionType": "short_answer",
    "correctAnswer": "6",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Algebra",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "The sum of three consecutive whole numbers is 72. What is the largest of the three numbers?",
    "explanation": "n + (n + 1) + (n + 2) = 72, so 3n + 3 = 72 and n = 23. The numbers are 23, 24, 25.",
    "questionType": "short_answer",
    "correctAnswer": "25",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Algebra",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Expand (x + 3)(x − 5).",
    "explanation": "x² − 5x + 3x − 15 = x² − 2x − 15.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "x² − 15"
      },
      {
        "id": "B",
        "text": "x² + 2x − 15"
      },
      {
        "id": "C",
        "text": "x² − 8x − 15"
      },
      {
        "id": "D",
        "text": "x² − 2x − 15"
      }
    ],
    "correctAnswer": "D",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Algebra",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Which values of x make 2x − 1 > 9 true?",
    "explanation": "Add 1: 2x > 10. Divide by 2: x > 5.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "x < 5"
      },
      {
        "id": "B",
        "text": "x > 4"
      },
      {
        "id": "C",
        "text": "x > 10"
      },
      {
        "id": "D",
        "text": "x > 5"
      }
    ],
    "correctAnswer": "D",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Algebra",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "A taxi charges 5 zeds to start plus 2 zeds for each kilometre. Which expression gives the cost, in zeds, for a trip of k kilometres?",
    "explanation": "Fixed charge 5 plus 2 for each of the k kilometres: 5 + 2k.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "2 + 5k"
      },
      {
        "id": "B",
        "text": "5 + 2k"
      },
      {
        "id": "C",
        "text": "5k + 2k"
      },
      {
        "id": "D",
        "text": "7k"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Algebra",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Factorise x² − 9.",
    "explanation": "This is a difference of two squares: x² − 3² = (x − 3)(x + 3).",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "(x − 3)(x − 3)"
      },
      {
        "id": "B",
        "text": "(x − 9)(x + 1)"
      },
      {
        "id": "C",
        "text": "x(x − 9)"
      },
      {
        "id": "D",
        "text": "(x − 3)(x + 3)"
      }
    ],
    "correctAnswer": "D",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Algebra",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "x + y = 10 and x − y = 4. What is the value of x?",
    "explanation": "Add the two equations: 2x = 14, so x = 7 (and y = 3).",
    "questionType": "short_answer",
    "correctAnswer": "7",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Algebra",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Which expression is equivalent to 3(x + 2y)?",
    "explanation": "Multiply each term by 3: 3 × x + 3 × 2y = 3x + 6y.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "3x + 2y"
      },
      {
        "id": "B",
        "text": "3x + 6y"
      },
      {
        "id": "C",
        "text": "3x + 5y"
      },
      {
        "id": "D",
        "text": "x + 6y"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Algebra",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "In a table, x = 1, 2, 3, 4 gives y = 4, 7, 10, 13. Which rule fits the table?",
    "explanation": "y goes up by 3 each time, so y = 3x + c. For x = 1: 3 + c = 4, so c = 1.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "y = 2x + 2"
      },
      {
        "id": "B",
        "text": "y = 4x"
      },
      {
        "id": "C",
        "text": "y = x + 3"
      },
      {
        "id": "D",
        "text": "y = 3x + 1"
      }
    ],
    "correctAnswer": "D",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Geometry",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Two angles of a triangle are 48° and 67°. What is the third angle? Give your answer in °.",
    "explanation": "Angles in a triangle add to 180°. 180 − 48 − 67 = 65°.",
    "questionType": "short_answer",
    "correctAnswer": "65",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Geometry",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "A triangle has a base of 10 cm and a height of 6 cm. What is its area? Give your answer in cm².",
    "explanation": "Area = ½ × base × height = ½ × 10 × 6 = 30 cm².",
    "questionType": "short_answer",
    "correctAnswer": "30",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Geometry",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "A circle has a radius of 7 cm. Using π ≈ 22/7, what is its circumference? Give your answer in cm.",
    "explanation": "C = 2πr = 2 × 22/7 × 7 = 44 cm.",
    "questionType": "short_answer",
    "correctAnswer": "44",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Geometry",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "A right-angled triangle has shorter sides of 6 cm and 8 cm. How long is the longest side? Give your answer in cm.",
    "explanation": "By Pythagoras: 6² + 8² = 36 + 64 = 100, and √100 = 10 cm.",
    "questionType": "short_answer",
    "correctAnswer": "10",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Geometry",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "What is the sum of the interior angles of a hexagon? Give your answer in °.",
    "explanation": "(n − 2) × 180° = (6 − 2) × 180° = 720°.",
    "questionType": "short_answer",
    "correctAnswer": "720",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Geometry",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "What is the volume of a box 5 cm long, 4 cm wide and 3 cm high? Give your answer in cm³.",
    "explanation": "Volume = 5 × 4 × 3 = 60 cm³.",
    "questionType": "short_answer",
    "correctAnswer": "60",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Geometry",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "Two parallel lines are crossed by a transversal. One of the co-interior (same-side interior) angles is 70°. What is the other co-interior angle? Give your answer in °.",
    "explanation": "Co-interior angles between parallel lines add up to 180°. 180 − 70 = 110°.",
    "questionType": "short_answer",
    "correctAnswer": "110",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Geometry",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "The point (3, −2) is reflected in the x-axis. What are its new coordinates?",
    "explanation": "Reflecting in the x-axis keeps x the same and changes the sign of y.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "(−3, −2)"
      },
      {
        "id": "B",
        "text": "(−3, 2)"
      },
      {
        "id": "C",
        "text": "(−2, 3)"
      },
      {
        "id": "D",
        "text": "(3, 2)"
      }
    ],
    "correctAnswer": "D",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Geometry",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Each exterior angle of a regular polygon is 40°. How many sides does the polygon have? Give your answer in sides.",
    "explanation": "Exterior angles add up to 360°. 360 ÷ 40 = 9 sides.",
    "questionType": "short_answer",
    "correctAnswer": "9",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Geometry",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "A map has a scale of 1 : 50,000. Two towns are 4 cm apart on the map. What is the real distance?",
    "explanation": "4 × 50,000 = 200,000 cm = 2,000 m = 2 km.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "0.2 km"
      },
      {
        "id": "B",
        "text": "2 km"
      },
      {
        "id": "C",
        "text": "20 km"
      },
      {
        "id": "D",
        "text": "200 m"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Geometry",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Using π = 3.14, what is the area of a circle with radius 10 cm? Give your answer in cm².",
    "explanation": "A = πr² = 3.14 × 100 = 314 cm².",
    "questionType": "short_answer",
    "correctAnswer": "314",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Geometry",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "The length and the width of a rectangle are both doubled. What happens to its area?",
    "explanation": "New area = 2l × 2w = 4lw, so the area is 4 times as large.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "It stays the same"
      },
      {
        "id": "B",
        "text": "It is doubled"
      },
      {
        "id": "C",
        "text": "It is multiplied by 8"
      },
      {
        "id": "D",
        "text": "It is multiplied by 4"
      }
    ],
    "correctAnswer": "D",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Data and Probability",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "What is the mean of 4, 8, 6, 10 and 7?",
    "explanation": "Sum = 35. 35 ÷ 5 = 7.",
    "questionType": "short_answer",
    "correctAnswer": "7",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Data and Probability",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "What is the median of 3, 9, 4, 12, 7, 5?",
    "explanation": "In order: 3, 4, 5, 7, 9, 12. The middle two are 5 and 7, so the median is (5 + 7) ÷ 2 = 6.",
    "questionType": "short_answer",
    "correctAnswer": "6",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Data and Probability",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "A fair six-sided die is rolled. What is the probability of getting a number greater than 4?",
    "explanation": "Only 5 and 6 are greater than 4: 2 out of 6 = 1/3.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "1/3"
      },
      {
        "id": "B",
        "text": "1/2"
      },
      {
        "id": "C",
        "text": "2/3"
      },
      {
        "id": "D",
        "text": "1/6"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Data and Probability",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "A bag has 4 red and 6 blue counters. How many red counters must be added so that the probability of picking red is 1/2?",
    "explanation": "Red and blue must be equal: 4 + 2 = 6 red and 6 blue.",
    "questionType": "short_answer",
    "correctAnswer": "2",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Data and Probability",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "What is the mode of 2, 5, 5, 7, 8, 8, 8, 9?",
    "explanation": "8 appears three times, more than any other value.",
    "questionType": "short_answer",
    "correctAnswer": "8",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Data and Probability",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "The mean of five numbers is 12. Four of the numbers are 10, 14, 9 and 11. What is the fifth number?",
    "explanation": "Total = 5 × 12 = 60. The four numbers add to 44. 60 − 44 = 16.",
    "questionType": "short_answer",
    "correctAnswer": "16",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Data and Probability",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "In a pie chart, 25% of students chose football. What angle does the football sector have? Give your answer in °.",
    "explanation": "25% of 360° = 90°.",
    "questionType": "short_answer",
    "correctAnswer": "90",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Data and Probability",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "Two fair coins are tossed. What is the probability of getting exactly one head?",
    "explanation": "Outcomes: HH, HT, TH, TT. Exactly one head: HT and TH, so 2/4 = 1/2.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "1/2"
      },
      {
        "id": "B",
        "text": "3/4"
      },
      {
        "id": "C",
        "text": "1/4"
      },
      {
        "id": "D",
        "text": "1/3"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Data and Probability",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "What is the range of 12, 18, 7, 25, 15?",
    "explanation": "Range = largest − smallest = 25 − 7 = 18.",
    "questionType": "short_answer",
    "correctAnswer": "18",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Data and Probability",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Which type of graph is best for showing how a city's temperature changed over a month?",
    "explanation": "Line graphs show change over time.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Venn diagram"
      },
      {
        "id": "B",
        "text": "Pie chart"
      },
      {
        "id": "C",
        "text": "Line graph"
      },
      {
        "id": "D",
        "text": "Pictograph"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Math",
    "contentDomain": "Data and Probability",
    "scienceSubDomain": null,
    "session": "math_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Look at the bar graph. What is the mean number of goals per match? Give your answer in goals.",
    "explanation": "Total goals = 2 + 0 + 3 + 1 + 4 = 10. 10 ÷ 5 matches = 2.",
    "questionType": "short_answer",
    "correctAnswer": "2",
    "imageUrl": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20420%20240%22%20width%3D%22420%22%20height%3D%22240%22%3E%3Crect%20width%3D%22420%22%20height%3D%22240%22%20fill%3D%22%23ffffff%22%2F%3E%3Ctext%20x%3D%2240%22%20y%3D%2216%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20font-weight%3D%22bold%22%20fill%3D%22%230f172a%22%3EGoals%20scored%20by%20the%20school%20team%3C%2Ftext%3E%3Ctext%20x%3D%226%22%20y%3D%2224%22%20font-family%3D%22Arial%22%20font-size%3D%2211%22%20fill%3D%22%23475569%22%3EGoals%3C%2Ftext%3E%3Cline%20x1%3D%2240%22%20x2%3D%22414%22%20y1%3D%22200%22%20y2%3D%22200%22%20stroke%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%22204%22%20text-anchor%3D%22end%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23475569%22%3E0%3C%2Ftext%3E%3Cline%20x1%3D%2240%22%20x2%3D%22414%22%20y1%3D%22143.33333333333334%22%20y2%3D%22143.33333333333334%22%20stroke%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%22147.33333333333334%22%20text-anchor%3D%22end%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23475569%22%3E2%3C%2Ftext%3E%3Cline%20x1%3D%2240%22%20x2%3D%22414%22%20y1%3D%2286.66666666666667%22%20y2%3D%2286.66666666666667%22%20stroke%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%2290.66666666666667%22%20text-anchor%3D%22end%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23475569%22%3E4%3C%2Ftext%3E%3Cline%20x1%3D%2240%22%20x2%3D%22414%22%20y1%3D%2230%22%20y2%3D%2230%22%20stroke%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%2234%22%20text-anchor%3D%22end%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23475569%22%3E6%3C%2Ftext%3E%3Crect%20x%3D%2254.8%22%20y%3D%22143.33333333333334%22%20width%3D%2244.4%22%20height%3D%2256.66666666666666%22%20fill%3D%22%232563eb%22%2F%3E%3Ctext%20x%3D%2277%22%20y%3D%22218%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%230f172a%22%3EMatch%201%3C%2Ftext%3E%3Crect%20x%3D%22128.8%22%20y%3D%22200%22%20width%3D%2244.4%22%20height%3D%220%22%20fill%3D%22%232563eb%22%2F%3E%3Ctext%20x%3D%22151%22%20y%3D%22218%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%230f172a%22%3EMatch%202%3C%2Ftext%3E%3Crect%20x%3D%22202.8%22%20y%3D%22115%22%20width%3D%2244.4%22%20height%3D%2285%22%20fill%3D%22%232563eb%22%2F%3E%3Ctext%20x%3D%22225%22%20y%3D%22218%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%230f172a%22%3EMatch%203%3C%2Ftext%3E%3Crect%20x%3D%22276.8%22%20y%3D%22171.66666666666666%22%20width%3D%2244.4%22%20height%3D%2228.333333333333343%22%20fill%3D%22%232563eb%22%2F%3E%3Ctext%20x%3D%22299%22%20y%3D%22218%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%230f172a%22%3EMatch%204%3C%2Ftext%3E%3Crect%20x%3D%22350.8%22%20y%3D%2286.66666666666667%22%20width%3D%2244.4%22%20height%3D%22113.33333333333333%22%20fill%3D%22%232563eb%22%2F%3E%3Ctext%20x%3D%22373%22%20y%3D%22218%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%230f172a%22%3EMatch%205%3C%2Ftext%3E%3Cline%20x1%3D%2240%22%20x2%3D%22414%22%20y1%3D%22200%22%20y2%3D%22200%22%20stroke%3D%22%23475569%22%2F%3E%3C%2Fsvg%3E"
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Biology",
    "scienceSubDomain": "Biology",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "In which part of a plant cell does photosynthesis take place?",
    "explanation": "Chloroplasts contain chlorophyll, which absorbs light for photosynthesis.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Vacuole"
      },
      {
        "id": "B",
        "text": "Chloroplast"
      },
      {
        "id": "C",
        "text": "Nucleus"
      },
      {
        "id": "D",
        "text": "Cell wall"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Biology",
    "scienceSubDomain": "Biology",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "What is the basic unit of all living things?",
    "explanation": "All living things are made of one or more cells.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "The cell"
      },
      {
        "id": "B",
        "text": "The atom"
      },
      {
        "id": "C",
        "text": "The tissue"
      },
      {
        "id": "D",
        "text": "The organ"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Biology",
    "scienceSubDomain": "Biology",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Which blood vessels carry blood away from the heart?",
    "explanation": "Arteries carry blood away from the heart. Veins carry it back.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Arteries"
      },
      {
        "id": "B",
        "text": "Veins"
      },
      {
        "id": "C",
        "text": "Capillaries"
      },
      {
        "id": "D",
        "text": "Nerves"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Biology",
    "scienceSubDomain": "Biology",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "In the lungs, where does oxygen pass into the blood?",
    "explanation": "The alveoli have thin walls and many capillaries, so gases diffuse easily.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Diaphragm"
      },
      {
        "id": "B",
        "text": "Trachea"
      },
      {
        "id": "C",
        "text": "Bronchi"
      },
      {
        "id": "D",
        "text": "Alveoli (air sacs)"
      }
    ],
    "correctAnswer": "D",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Biology",
    "scienceSubDomain": "Biology",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "What is the main job of red blood cells?",
    "explanation": "Red blood cells contain haemoglobin, which carries oxygen. White blood cells fight germs.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "To carry oxygen around the body"
      },
      {
        "id": "B",
        "text": "To fight germs"
      },
      {
        "id": "C",
        "text": "To help blood clot"
      },
      {
        "id": "D",
        "text": "To digest food"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Biology",
    "scienceSubDomain": "Biology",
    "session": "science_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "A green plant is sealed in a clear jar and left in bright light for several hours. What most likely happens to the amount of oxygen in the jar?",
    "explanation": "In bright light, photosynthesis makes more oxygen than respiration uses.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "It drops to zero"
      },
      {
        "id": "B",
        "text": "It decreases"
      },
      {
        "id": "C",
        "text": "It increases"
      },
      {
        "id": "D",
        "text": "It stays exactly the same"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Biology",
    "scienceSubDomain": "Biology",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "What does cellular respiration produce?",
    "explanation": "Glucose + oxygen → carbon dioxide + water, releasing energy.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Chlorophyll and light"
      },
      {
        "id": "B",
        "text": "Glucose and oxygen"
      },
      {
        "id": "C",
        "text": "Proteins and starch"
      },
      {
        "id": "D",
        "text": "Energy, carbon dioxide and water"
      }
    ],
    "correctAnswer": "D",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Biology",
    "scienceSubDomain": "Biology",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Which organisms break down dead plants and animals and return nutrients to the soil?",
    "explanation": "Decomposers such as fungi and bacteria recycle nutrients.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Carnivores"
      },
      {
        "id": "B",
        "text": "Producers"
      },
      {
        "id": "C",
        "text": "Herbivores"
      },
      {
        "id": "D",
        "text": "Fungi and bacteria"
      }
    ],
    "correctAnswer": "D",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Biology",
    "scienceSubDomain": "Biology",
    "session": "science_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "Why do doctors not give antibiotics for the common cold?",
    "explanation": "Antibiotics work against bacteria. The common cold is caused by viruses.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Antibiotics make colds last longer"
      },
      {
        "id": "B",
        "text": "Colds are caused by bacteria that are too small"
      },
      {
        "id": "C",
        "text": "Colds are caused by viruses, and antibiotics do not kill viruses"
      },
      {
        "id": "D",
        "text": "Antibiotics only work on adults"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Biology",
    "scienceSubDomain": "Biology",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Where is genetic information mainly stored in a cell?",
    "explanation": "DNA in the nucleus carries the instructions for the cell.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "In the cytoplasm only"
      },
      {
        "id": "B",
        "text": "In the cell wall"
      },
      {
        "id": "C",
        "text": "In DNA in the nucleus"
      },
      {
        "id": "D",
        "text": "In the cell membrane"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Biology",
    "scienceSubDomain": "Biology",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "A pure tall pea plant (TT) is crossed with a pure short pea plant (tt). Tall is dominant. What will the offspring look like?",
    "explanation": "Every offspring gets T from one parent and t from the other: Tt. T is dominant, so all are tall.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Medium height"
      },
      {
        "id": "B",
        "text": "Half tall, half short"
      },
      {
        "id": "C",
        "text": "All short"
      },
      {
        "id": "D",
        "text": "All tall"
      }
    ],
    "correctAnswer": "D",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Biology",
    "scienceSubDomain": "Biology",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "What do digestive enzymes do?",
    "explanation": "Enzymes speed up the breakdown of food so it can be absorbed.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Break large food molecules into smaller ones"
      },
      {
        "id": "B",
        "text": "Store energy as fat"
      },
      {
        "id": "C",
        "text": "Carry oxygen"
      },
      {
        "id": "D",
        "text": "Build muscle"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Biology",
    "scienceSubDomain": "Biology",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Which structure is found in plant cells but not in animal cells?",
    "explanation": "Plant cells have a rigid cell wall made of cellulose. Both cell types have the others.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Cell wall"
      },
      {
        "id": "B",
        "text": "Mitochondria"
      },
      {
        "id": "C",
        "text": "Nucleus"
      },
      {
        "id": "D",
        "text": "Cell membrane"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Biology",
    "scienceSubDomain": "Biology",
    "session": "science_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "In a population of antelopes, the fastest runners are more likely to escape lions and have young. Over many generations the population becomes faster. What is this process called?",
    "explanation": "Individuals with helpful traits survive and reproduce more, so the trait becomes more common.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Pollination"
      },
      {
        "id": "B",
        "text": "Natural selection"
      },
      {
        "id": "C",
        "text": "Metamorphosis"
      },
      {
        "id": "D",
        "text": "Photosynthesis"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Biology",
    "scienceSubDomain": "Biology",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "How does a vaccine protect the body?",
    "explanation": "Vaccines train the immune system so it can respond quickly to a real infection.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "It kills all bacteria in the body"
      },
      {
        "id": "B",
        "text": "It heals broken bones"
      },
      {
        "id": "C",
        "text": "It helps the immune system make antibodies and remember the germ"
      },
      {
        "id": "D",
        "text": "It replaces white blood cells"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Biology",
    "scienceSubDomain": "Biology",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "Why is there less energy available at each higher level of a food chain?",
    "explanation": "Only about 10% of energy passes to the next level. The rest is used or lost as heat.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Energy is destroyed"
      },
      {
        "id": "B",
        "text": "Energy is used for life processes and lost as heat"
      },
      {
        "id": "C",
        "text": "Animals at the top eat less"
      },
      {
        "id": "D",
        "text": "Plants keep all the energy"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Chemistry",
    "scienceSubDomain": "Chemistry",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Which of these is a chemical change?",
    "explanation": "Burning makes new substances (ash, carbon dioxide). The others are physical changes.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Burning paper"
      },
      {
        "id": "B",
        "text": "Cutting wood"
      },
      {
        "id": "C",
        "text": "Melting ice"
      },
      {
        "id": "D",
        "text": "Dissolving sugar in water"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Chemistry",
    "scienceSubDomain": "Chemistry",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "What is found in the nucleus of an atom?",
    "explanation": "The nucleus contains protons and neutrons. Electrons move around the nucleus.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Protons and electrons"
      },
      {
        "id": "B",
        "text": "Molecules"
      },
      {
        "id": "C",
        "text": "Electrons only"
      },
      {
        "id": "D",
        "text": "Protons and neutrons"
      }
    ],
    "correctAnswer": "D",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Chemistry",
    "scienceSubDomain": "Chemistry",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "A solution has a pH of 2. What kind of solution is it?",
    "explanation": "pH below 7 is acidic; the lower the number, the stronger the acid. pH 7 is neutral.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Strongly acidic"
      },
      {
        "id": "B",
        "text": "Neutral"
      },
      {
        "id": "C",
        "text": "Strongly alkaline"
      },
      {
        "id": "D",
        "text": "Weakly alkaline"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Chemistry",
    "scienceSubDomain": "Chemistry",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "What is the chemical symbol for sodium?",
    "explanation": "Sodium's symbol Na comes from its Latin name, natrium. S is sulfur.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Sd"
      },
      {
        "id": "B",
        "text": "So"
      },
      {
        "id": "C",
        "text": "S"
      },
      {
        "id": "D",
        "text": "Na"
      }
    ],
    "correctAnswer": "D",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Chemistry",
    "scienceSubDomain": "Chemistry",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "What is the best way to separate sand from water?",
    "explanation": "Filter paper lets water through but traps the sand.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Filtration"
      },
      {
        "id": "B",
        "text": "Evaporation"
      },
      {
        "id": "C",
        "text": "Dissolving"
      },
      {
        "id": "D",
        "text": "Magnetism"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Chemistry",
    "scienceSubDomain": "Chemistry",
    "session": "science_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "A reaction takes place in a sealed container. The mass before the reaction was 50 g. What is the mass after the reaction?",
    "explanation": "Mass is conserved. In a sealed container no atoms can enter or leave.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "0 g"
      },
      {
        "id": "B",
        "text": "More than 50 g"
      },
      {
        "id": "C",
        "text": "50 g"
      },
      {
        "id": "D",
        "text": "Less than 50 g"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Chemistry",
    "scienceSubDomain": "Chemistry",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Which of these is a compound?",
    "explanation": "A compound has two or more different elements chemically joined. Water has hydrogen and oxygen.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Water (H₂O)"
      },
      {
        "id": "B",
        "text": "Iron (Fe)"
      },
      {
        "id": "C",
        "text": "Helium (He)"
      },
      {
        "id": "D",
        "text": "Oxygen (O₂)"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Chemistry",
    "scienceSubDomain": "Chemistry",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "An iron nail is placed in each of four test tubes. In which test tube will it rust the fastest?",
    "explanation": "Rusting needs both water and oxygen.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Tube with oil only"
      },
      {
        "id": "B",
        "text": "Tube with boiled water and an oil layer"
      },
      {
        "id": "C",
        "text": "Tube with dry air only"
      },
      {
        "id": "D",
        "text": "Tube with water and air"
      }
    ],
    "correctAnswer": "D",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Chemistry",
    "scienceSubDomain": "Chemistry",
    "session": "science_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "Sugar dissolves faster in hot water than in cold water. What is the best explanation?",
    "explanation": "At higher temperatures particles have more energy and move faster, so dissolving is quicker.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Sugar melts in hot water"
      },
      {
        "id": "B",
        "text": "Water particles move faster and hit the sugar more often"
      },
      {
        "id": "C",
        "text": "Cold water has no space for sugar"
      },
      {
        "id": "D",
        "text": "Hot water has more water particles"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Chemistry",
    "scienceSubDomain": "Chemistry",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "What decides which element an atom is?",
    "explanation": "The atomic number (number of protons) identifies the element.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "The number of protons"
      },
      {
        "id": "B",
        "text": "The number of neutrons"
      },
      {
        "id": "C",
        "text": "The number of molecules"
      },
      {
        "id": "D",
        "text": "The size of the atom"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Chemistry",
    "scienceSubDomain": "Chemistry",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "What is produced when an acid reacts with a base (alkali)?",
    "explanation": "This is neutralisation: acid + base → salt + water.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "A salt and water"
      },
      {
        "id": "B",
        "text": "Only hydrogen gas"
      },
      {
        "id": "C",
        "text": "Oxygen and carbon"
      },
      {
        "id": "D",
        "text": "A stronger acid"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Chemistry",
    "scienceSubDomain": "Chemistry",
    "session": "science_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "Zinc is added to dilute hydrochloric acid. Bubbles form. The gas makes a squeaky pop with a lit splint. What is the gas?",
    "explanation": "Metal + acid → salt + hydrogen. Hydrogen burns with a squeaky pop.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Hydrogen"
      },
      {
        "id": "B",
        "text": "Oxygen"
      },
      {
        "id": "C",
        "text": "Carbon dioxide"
      },
      {
        "id": "D",
        "text": "Nitrogen"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Chemistry",
    "scienceSubDomain": "Chemistry",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "How are particles arranged in a solid?",
    "explanation": "Particles in solids are tightly packed and vibrate in place.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Close together but sliding past each other"
      },
      {
        "id": "B",
        "text": "Close together, vibrating in fixed positions"
      },
      {
        "id": "C",
        "text": "Far apart and moving quickly"
      },
      {
        "id": "D",
        "text": "Not moving at all, with big gaps"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Physics",
    "scienceSubDomain": "Physics",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "A runner covers 300 m in 60 seconds. What is her average speed? Give your answer in m/s.",
    "explanation": "Speed = distance ÷ time = 300 ÷ 60 = 5 m/s.",
    "questionType": "short_answer",
    "correctAnswer": "5",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Physics",
    "scienceSubDomain": "Physics",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "What is the unit of force?",
    "explanation": "Force is measured in newtons. Joules measure energy.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Joule (J)"
      },
      {
        "id": "B",
        "text": "Watt (W)"
      },
      {
        "id": "C",
        "text": "Newton (N)"
      },
      {
        "id": "D",
        "text": "Pascal (Pa)"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Physics",
    "scienceSubDomain": "Physics",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "A box is pushed to the right with a force of 20 N. Friction acts to the left with a force of 5 N. What is the resultant force?",
    "explanation": "Forces in opposite directions are subtracted: 20 − 5 = 15 N in the direction of the bigger force.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "25 N to the right"
      },
      {
        "id": "B",
        "text": "5 N to the left"
      },
      {
        "id": "C",
        "text": "15 N to the left"
      },
      {
        "id": "D",
        "text": "15 N to the right"
      }
    ],
    "correctAnswer": "D",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Physics",
    "scienceSubDomain": "Physics",
    "session": "science_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "Why are small gaps left between sections of a metal bridge?",
    "explanation": "On hot days the metal expands. The gaps stop the bridge from buckling.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "To make the bridge lighter"
      },
      {
        "id": "B",
        "text": "Metal shrinks in summer"
      },
      {
        "id": "C",
        "text": "Metal expands when it gets hot"
      },
      {
        "id": "D",
        "text": "To let rain drain away"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Physics",
    "scienceSubDomain": "Physics",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Through which does light travel fastest?",
    "explanation": "Light is fastest in a vacuum (about 300,000 km/s). It slows down in materials.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Diamond"
      },
      {
        "id": "B",
        "text": "Water"
      },
      {
        "id": "C",
        "text": "A vacuum"
      },
      {
        "id": "D",
        "text": "Glass"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Physics",
    "scienceSubDomain": "Physics",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "A 6 V battery is connected to a 3 Ω resistor. What current flows? Give your answer in A.",
    "explanation": "I = V ÷ R = 6 ÷ 3 = 2 A.",
    "questionType": "short_answer",
    "correctAnswer": "2",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Physics",
    "scienceSubDomain": "Physics",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "What type of energy is stored in a stretched rubber band?",
    "explanation": "Stretching or squashing an object stores elastic potential energy.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Elastic potential energy"
      },
      {
        "id": "B",
        "text": "Chemical energy"
      },
      {
        "id": "C",
        "text": "Kinetic energy"
      },
      {
        "id": "D",
        "text": "Sound energy"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Physics",
    "scienceSubDomain": "Physics",
    "session": "science_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "An astronaut on the Moon drops a hammer and a feather at the same time. They hit the ground together. Why?",
    "explanation": "Without air, all objects fall with the same acceleration due to gravity.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "The feather is heavier on the Moon"
      },
      {
        "id": "B",
        "text": "There is no air resistance on the Moon"
      },
      {
        "id": "C",
        "text": "The Moon has no gravity"
      },
      {
        "id": "D",
        "text": "The hammer slows down on the Moon"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Physics",
    "scienceSubDomain": "Physics",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "An object has a mass of 200 g and a volume of 50 cm³. What is its density? Give your answer in g/cm³.",
    "explanation": "Density = mass ÷ volume = 200 ÷ 50 = 4 g/cm³.",
    "questionType": "short_answer",
    "correctAnswer": "4",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Physics",
    "scienceSubDomain": "Physics",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Sound cannot travel through which of these?",
    "explanation": "Sound needs particles to vibrate. A vacuum has no particles.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "A vacuum"
      },
      {
        "id": "B",
        "text": "Steel"
      },
      {
        "id": "C",
        "text": "Air"
      },
      {
        "id": "D",
        "text": "Water"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Physics",
    "scienceSubDomain": "Physics",
    "session": "science_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "During a storm, Layla sees lightning and hears thunder 3 seconds later. Why?",
    "explanation": "Both happen at the same moment, but light reaches her almost instantly while sound travels at about 340 m/s.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Her ears are slower than her eyes"
      },
      {
        "id": "B",
        "text": "Sound travels faster than light"
      },
      {
        "id": "C",
        "text": "Light travels much faster than sound"
      },
      {
        "id": "D",
        "text": "Thunder happens after lightning"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Physics",
    "scienceSubDomain": "Physics",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "A force of 600 N acts on an area of 2 m². What is the pressure? Give your answer in Pa.",
    "explanation": "Pressure = force ÷ area = 600 ÷ 2 = 300 Pa.",
    "questionType": "short_answer",
    "correctAnswer": "300",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Physics",
    "scienceSubDomain": "Physics",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Which is a renewable energy source?",
    "explanation": "Sunlight will not run out. Fossil fuels are non-renewable.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Natural gas"
      },
      {
        "id": "B",
        "text": "Coal"
      },
      {
        "id": "C",
        "text": "Oil"
      },
      {
        "id": "D",
        "text": "Solar"
      }
    ],
    "correctAnswer": "D",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Earth Science",
    "scienceSubDomain": "Earth Science",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Which layer of the Earth do we live on?",
    "explanation": "The crust is the thin outer rocky layer.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Inner core"
      },
      {
        "id": "B",
        "text": "Crust"
      },
      {
        "id": "C",
        "text": "Outer core"
      },
      {
        "id": "D",
        "text": "Mantle"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Earth Science",
    "scienceSubDomain": "Earth Science",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "What causes the seasons on Earth?",
    "explanation": "Because of the tilt, each hemisphere gets more direct sunlight for part of the year.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "The Earth's distance from the Moon"
      },
      {
        "id": "B",
        "text": "The tilt of the Earth's axis"
      },
      {
        "id": "C",
        "text": "Changes in the Sun's size"
      },
      {
        "id": "D",
        "text": "The Earth spinning on its axis"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Earth Science",
    "scienceSubDomain": "Earth Science",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "In the water cycle, what is it called when water vapour cools and forms clouds?",
    "explanation": "Water vapour condenses into tiny droplets, which form clouds.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Condensation"
      },
      {
        "id": "B",
        "text": "Precipitation"
      },
      {
        "id": "C",
        "text": "Transpiration"
      },
      {
        "id": "D",
        "text": "Evaporation"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Earth Science",
    "scienceSubDomain": "Earth Science",
    "session": "science_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "Why is an increase in greenhouse gases linked to global warming?",
    "explanation": "Gases such as carbon dioxide absorb heat radiated by the Earth and keep it in the atmosphere.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "They make the Sun hotter"
      },
      {
        "id": "B",
        "text": "They block all sunlight"
      },
      {
        "id": "C",
        "text": "They trap heat in the atmosphere"
      },
      {
        "id": "D",
        "text": "They cool the oceans"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Earth Science",
    "scienceSubDomain": "Earth Science",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Where do most earthquakes happen?",
    "explanation": "Plates moving against each other build up and release stress at their edges.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Where it rains the most"
      },
      {
        "id": "B",
        "text": "At the boundaries of tectonic plates"
      },
      {
        "id": "C",
        "text": "At the North Pole"
      },
      {
        "id": "D",
        "text": "In the middle of oceans only"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Earth Science",
    "scienceSubDomain": "Earth Science",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "About how long does it take the Moon to go through all its phases?",
    "explanation": "The cycle from new Moon to new Moon takes about 29.5 days.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "About one month (29.5 days)"
      },
      {
        "id": "B",
        "text": "One week"
      },
      {
        "id": "C",
        "text": "One day"
      },
      {
        "id": "D",
        "text": "One year"
      }
    ],
    "correctAnswer": "A",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Earth Science",
    "scienceSubDomain": "Earth Science",
    "session": "science_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "When does a lunar eclipse happen?",
    "explanation": "The Earth's shadow falls on the Moon. When the Moon is between the Sun and Earth, that is a solar eclipse.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "When the Sun is between the Earth and the Moon"
      },
      {
        "id": "B",
        "text": "When the Earth is between the Sun and the Moon"
      },
      {
        "id": "C",
        "text": "When the Moon is between the Sun and the Earth"
      },
      {
        "id": "D",
        "text": "When the Moon is closest to the Sun"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Earth Science",
    "scienceSubDomain": "Earth Science",
    "session": "science_session",
    "cognitiveDomain": "Applying",
    "difficulty": "Medium",
    "maxPoints": 1,
    "questionText": "In which layer of the atmosphere is most of the ozone found?",
    "explanation": "The ozone layer is in the stratosphere and absorbs harmful UV radiation.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Troposphere"
      },
      {
        "id": "B",
        "text": "Mesosphere"
      },
      {
        "id": "C",
        "text": "Thermosphere"
      },
      {
        "id": "D",
        "text": "Stratosphere"
      }
    ],
    "correctAnswer": "D",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Earth Science",
    "scienceSubDomain": "Earth Science",
    "session": "science_session",
    "cognitiveDomain": "Reasoning",
    "difficulty": "Hard",
    "maxPoints": 1,
    "questionText": "A cliff shows several layers of sedimentary rock that have not been disturbed. Which layer is most likely the oldest?",
    "explanation": "Sediments settle on top of older layers, so the lowest layer formed first.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "The top layer"
      },
      {
        "id": "B",
        "text": "The middle layer"
      },
      {
        "id": "C",
        "text": "The bottom layer"
      },
      {
        "id": "D",
        "text": "They are all the same age"
      }
    ],
    "correctAnswer": "C",
    "imageUrl": null
  },
  {
    "grade": 8,
    "subject": "Science",
    "contentDomain": "Earth Science",
    "scienceSubDomain": "Earth Science",
    "session": "science_session",
    "cognitiveDomain": "Knowing",
    "difficulty": "Easy",
    "maxPoints": 1,
    "questionText": "Which is the largest planet in our solar system?",
    "explanation": "Jupiter is the largest planet. More than 1,000 Earths could fit inside it.",
    "questionType": "multiple_choice",
    "options": [
      {
        "id": "A",
        "text": "Earth"
      },
      {
        "id": "B",
        "text": "Jupiter"
      },
      {
        "id": "C",
        "text": "Saturn"
      },
      {
        "id": "D",
        "text": "Neptune"
      }
    ],
    "correctAnswer": "B",
    "imageUrl": null
  }
] as PackQuestion[],
  },
} as const;

export type QuestionPackId = keyof typeof QUESTION_PACKS;
