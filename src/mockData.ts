/**
 * @license
 * Academic Precision OBE System
 * Standard Accredited Course Specifications
 */

import { CourseSpecification, UserProfile } from './types.ts';

export const INITIAL_USER: UserProfile = {
  id: 'usr_001',
  name: 'Dr. Evelyn Vasquez',
  email: 'e.vasquez@engineering.edu',
  role: 'faculty',
  designation: 'Associate Professor & Course Coordinator',
  department: 'Computer Science & Engineering'
};

export const INITIAL_COURSES: CourseSpecification[] = [
  {
    id: 'crs_cs401',
    code: 'CS401',
    title: 'Design and Analysis of Algorithms',
    department: 'Computer Science & Engineering',
    academicYear: '2025-2026',
    semester: 'IV',
    regulation: 'Autonomous R22 / OBE Tier-1',
    category: 'Professional Core Course (PCC)',
    lectureHours: 3,
    tutorialHours: 1,
    practicalHours: 0,
    totalCredits: 4,
    totalContactHours: 60,
    prerequisites: ['CS201 Data Structures', 'MA102 Discrete Mathematics'],
    courseCoordinator: 'Dr. Evelyn Vasquez',
    approvalStatus: 'submitted',
    version: '2.1',
    lastUpdated: '2026-03-14',
    objectives: [
      'To analyze the asymptotic performance of classical and modern computer algorithms.',
      'To demonstrate proficiency in applying divide-and-conquer, greedy, and dynamic programming paradigms.',
      'To synthesize graph-theoretic models for network flow and traversal optimization.',
      'To understand complexity hierarchies, tractability, and polynomial-time reductions for NP-Complete problems.'
    ],
    courseOutcomes: [
      {
        id: 'co1',
        code: 'CO1',
        bloomsLevel: 'L2',
        actionVerb: 'Explain',
        statement: 'Explain asymptotic complexity notations, recurrence relations, and algorithmic efficiency models across best, average, and worst-case bounds.',
        expectedAttainment: 75
      },
      {
        id: 'co2',
        code: 'CO2',
        bloomsLevel: 'L3',
        actionVerb: 'Apply',
        statement: 'Apply divide-and-conquer, greedy selection, and dynamic programming techniques to solve constrained algorithmic optimization problems.',
        expectedAttainment: 70
      },
      {
        id: 'co3',
        code: 'CO3',
        bloomsLevel: 'L4',
        actionVerb: 'Analyze',
        statement: 'Analyze minimum spanning tree, shortest path, and maximum network flow algorithms on sparse and dense graph topologies.',
        expectedAttainment: 70
      },
      {
        id: 'co4',
        code: 'CO4',
        bloomsLevel: 'L4',
        actionVerb: 'Differentiate',
        statement: 'Differentiate polynomial vs non-deterministic polynomial problem classes (P, NP, NP-Complete) using formal reduction proofs.',
        expectedAttainment: 65
      },
      {
        id: 'co5',
        code: 'CO5',
        bloomsLevel: 'L5',
        actionVerb: 'Evaluate',
        statement: 'Evaluate randomized and approximation heuristics for computationally intractable NP-hard combinatorial bottlenecks.',
        expectedAttainment: 60
      },
      {
        id: 'co6',
        code: 'CO6',
        bloomsLevel: 'L6',
        actionVerb: 'Design',
        statement: 'Design branch-and-bound and state-space search architectures for high-dimensional computational decision systems.',
        expectedAttainment: 65
      }
    ],
    poMapping: {
      CO1: { PO1: 3, PO2: 2, PO3: 0, PO4: 0, PO5: 0, PO6: 0, PO7: 0, PO8: 0, PO9: 0, PO10: 1, PO11: 0, PO12: 2 },
      CO2: { PO1: 3, PO2: 3, PO3: 3, PO4: 2, PO5: 1, PO6: 0, PO7: 0, PO8: 0, PO9: 0, PO10: 1, PO11: 0, PO12: 2 },
      CO3: { PO1: 2, PO2: 3, PO3: 3, PO4: 3, PO5: 2, PO6: 0, PO7: 0, PO8: 0, PO9: 1, PO10: 1, PO11: 0, PO12: 2 },
      CO4: { PO1: 3, PO2: 3, PO3: 2, PO4: 3, PO5: 0, PO6: 0, PO7: 0, PO8: 0, PO9: 0, PO10: 1, PO11: 0, PO12: 3 },
      CO5: { PO1: 2, PO2: 3, PO3: 3, PO4: 3, PO5: 2, PO6: 1, PO7: 0, PO8: 0, PO9: 1, PO10: 1, PO11: 1, PO12: 3 },
      CO6: { PO1: 2, PO2: 3, PO3: 3, PO4: 2, PO5: 2, PO6: 0, PO7: 0, PO8: 0, PO9: 1, PO10: 2, PO11: 1, PO12: 3 }
    },
    psoMapping: {
      CO1: { PSO1: 3, PSO2: 1, PSO3: 1 },
      CO2: { PSO1: 3, PSO2: 2, PSO3: 2 },
      CO3: { PSO1: 3, PSO2: 2, PSO3: 2 },
      CO4: { PSO1: 3, PSO2: 1, PSO3: 1 },
      CO5: { PSO1: 3, PSO2: 2, PSO3: 3 },
      CO6: { PSO1: 3, PSO2: 3, PSO3: 2 }
    },
    mappingJustifications: {
      'CO1-PO1': 'Mathematical induction and asymptotic recurrence analysis form the bedrock of fundamental engineering knowledge.',
      'CO2-PO3': 'Formulating dynamic programming matrices directly exercises solution design for complex constrained engineering systems.',
      'CO3-PO4': 'Investigating network flow bounds against min-cut capacity involves rigorous analytical verification.',
      'CO4-PO2': 'NP-completeness classification enforces deep problem-hardness formulation and mathematical reduction.',
      'CO5-PO5': 'Utilizing approximation algorithms requires software modeling tools and empirical benchmark simulations.',
      'CO6-PSO1': 'Branch-and-bound search synthesis directly delivers core algorithmic software engineering competency.'
    },
    syllabusUnits: [
      {
        id: 'u1',
        unitNumber: 1,
        title: 'Introduction & Asymptotic Analysis',
        lectureHours: 12,
        topics: 'Order Notation (O, Omega, Theta), Master Theorem, Substitution Method, Recursion Tree, Recurrences, Amortized Analysis (Accounting & Potential Methods).',
        pedagogicalMethods: ['Chalk & Talk', 'ICT / Interactive Slides', 'Mathematical Proof Workshop'],
        mappedCOs: ['CO1']
      },
      {
        id: 'u2',
        unitNumber: 2,
        title: 'Divide & Conquer and Greedy Paradigms',
        lectureHours: 12,
        topics: 'Strassen Matrix Multiplication, Convex Hull, Greedy Choice Property, Optimal Substructure, Fractional Knapsack, Huffman Coding, Job Sequencing with Deadlines.',
        pedagogicalMethods: ['Chalk & Talk', 'Algorithm Visualization Demo', 'Peer Code Walkthrough'],
        mappedCOs: ['CO2']
      },
      {
        id: 'u3',
        unitNumber: 3,
        title: 'Dynamic Programming & Graph Algorithms',
        lectureHours: 12,
        topics: 'Matrix Chain Multiplication, Longest Common Subsequence (LCS), 0/1 Knapsack, Bellman-Ford, Floyd-Warshall, Johnson Algorithm, Maximum Bipartite Matching, Ford-Fulkerson.',
        pedagogicalMethods: ['ICT / Visual Simulation', 'Problem-Based Learning Group Activity'],
        mappedCOs: ['CO2', 'CO3']
      },
      {
        id: 'u4',
        unitNumber: 4,
        title: 'Tractability & NP-Completeness',
        lectureHours: 12,
        topics: 'Deterministic vs Non-deterministic Turing Machines, Polynomial Reductions, Cook-Levin Theorem, Satisfiability (3-SAT), Clique, Vertex Cover, Hamiltonian Cycle, TSP.',
        pedagogicalMethods: ['Chalk & Talk', 'Case Studies in Intractability', 'Socratic Seminar'],
        mappedCOs: ['CO4']
      },
      {
        id: 'u5',
        unitNumber: 5,
        title: 'Approximation, Randomized & Branch-and-Bound',
        lectureHours: 12,
        topics: 'Approximation Ratio, Vertex Cover 2-Approximation, Metric TSP, Random Treaps, Quickselect Expected Bounds, Branch and Bound LC-Search, 15-Puzzle Problem, Assignment Problem.',
        pedagogicalMethods: ['Interactive Benchmark Coding', 'Research Paper Seminar'],
        mappedCOs: ['CO5', 'CO6']
      }
    ],
    assessments: [
      {
        id: 'as1',
        category: 'CIE',
        name: 'Continuous Assessment Test 1 (CAT-I)',
        weightageMarks: 20,
        mappedCOs: ['CO1', 'CO2'],
        bloomsFocus: ['L2', 'L3']
      },
      {
        id: 'as2',
        category: 'CIE',
        name: 'Continuous Assessment Test 2 (CAT-II)',
        weightageMarks: 20,
        mappedCOs: ['CO3', 'CO4'],
        bloomsFocus: ['L3', 'L4']
      },
      {
        id: 'as3',
        category: 'CIE',
        name: 'Algorithm Implementation Lab Project & Quiz',
        weightageMarks: 10,
        mappedCOs: ['CO2', 'CO5', 'CO6'],
        bloomsFocus: ['L4', 'L5', 'L6']
      },
      {
        id: 'as4',
        category: 'SEE',
        name: 'Comprehensive Semester End Examination (SEE)',
        weightageMarks: 50,
        mappedCOs: ['CO1', 'CO2', 'CO3', 'CO4', 'CO5', 'CO6'],
        bloomsFocus: ['L2', 'L3', 'L4', 'L5', 'L6']
      }
    ],
    textbooks: [
      {
        id: 'tb1',
        authors: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
        title: 'Introduction to Algorithms',
        edition: '4th Edition',
        publisher: 'MIT Press',
        year: '2022',
        isbn: '978-0262046305',
        isPrescribed: true
      },
      {
        id: 'tb2',
        authors: 'Jon Kleinberg, Éva Tardos',
        title: 'Algorithm Design',
        edition: '1st Edition',
        publisher: 'Pearson',
        year: '2014',
        isbn: '978-0321295354',
        isPrescribed: true
      },
      {
        id: 'tb3',
        authors: 'Ellis Horowitz, Sartaj Sahni, Sanguthevar Rajasekaran',
        title: 'Fundamentals of Computer Algorithms',
        edition: '2nd Edition',
        publisher: 'Universities Press',
        year: '2018',
        isbn: '978-8173716126',
        isPrescribed: false
      }
    ],
    workflowComments: [
      {
        id: 'wc1',
        author: 'Dr. Evelyn Vasquez',
        role: 'faculty',
        date: '2026-03-12',
        message: 'Draft syllabus updated to R22 autonomous regulations with 6 formal Course Outcomes and Tier-1 Bloom distribution.',
        statusChange: 'submitted'
      },
      {
        id: 'wc2',
        author: 'Prof. Marcus Brody',
        role: 'hod',
        date: '2026-03-14',
        message: 'Reviewed PO mapping. Unit 4 & 5 approximation content meets NBA Criterion 2 requirements. Ready for BoS final approval.',
        statusChange: 'under_review'
      }
    ]
  },
  {
    id: 'crs_cs302',
    code: 'CS302',
    title: 'Database Management Systems',
    department: 'Computer Science & Engineering',
    academicYear: '2025-2026',
    semester: 'III',
    regulation: 'Autonomous R22 / OBE Tier-1',
    category: 'Professional Core Course (PCC)',
    lectureHours: 3,
    tutorialHours: 0,
    practicalHours: 2,
    totalCredits: 4,
    totalContactHours: 60,
    prerequisites: ['CS101 Problem Solving and Python Programming'],
    courseCoordinator: 'Dr. Ramesh Sundaram',
    approvalStatus: 'approved',
    version: '1.4',
    lastUpdated: '2026-02-18',
    objectives: [
      'To introduce relational data models, relational algebra, and SQL query formulations.',
      'To master functional dependencies, normal forms (1NF to BCNF/4NF), and schema normalization.',
      'To study transaction ACID semantics, concurrency control protocols, and crash recovery.',
      'To evaluate distributed databases and NoSQL document architectures.'
    ],
    courseOutcomes: [
      {
        id: 'co1',
        code: 'CO1',
        bloomsLevel: 'L2',
        actionVerb: 'Describe',
        statement: 'Describe database architectures, relational data models, and constraints governing relational schemas.',
        expectedAttainment: 80
      },
      {
        id: 'co2',
        code: 'CO2',
        bloomsLevel: 'L3',
        actionVerb: 'Implement',
        statement: 'Implement complex declarative queries using SQL and procedural relational algebra operators.',
        expectedAttainment: 75
      },
      {
        id: 'co3',
        code: 'CO3',
        bloomsLevel: 'L4',
        actionVerb: 'Analyze',
        statement: 'Analyze relational schemas using functional dependencies to synthesize decomposed normal forms (3NF & BCNF).',
        expectedAttainment: 70
      },
      {
        id: 'co4',
        code: 'CO4',
        bloomsLevel: 'L5',
        actionVerb: 'Evaluate',
        statement: 'Evaluate lock-based and timestamp concurrency schedules ensuring conflict serializability and ACID guarantees.',
        expectedAttainment: 65
      },
      {
        id: 'co5',
        code: 'CO5',
        bloomsLevel: 'L6',
        actionVerb: 'Design',
        statement: 'Design distributed database schemas and indexing structures for high-concurrency cloud workloads.',
        expectedAttainment: 65
      }
    ],
    poMapping: {
      CO1: { PO1: 3, PO2: 2, PO3: 0, PO4: 0, PO5: 1, PO6: 0, PO7: 0, PO8: 0, PO9: 0, PO10: 1, PO11: 0, PO12: 2 },
      CO2: { PO1: 2, PO2: 3, PO3: 3, PO4: 2, PO5: 3, PO6: 0, PO7: 0, PO8: 0, PO9: 1, PO10: 1, PO11: 0, PO12: 2 },
      CO3: { PO1: 3, PO2: 3, PO3: 3, PO4: 3, PO5: 2, PO6: 0, PO7: 0, PO8: 0, PO9: 0, PO10: 1, PO11: 0, PO12: 2 },
      CO4: { PO1: 2, PO2: 3, PO3: 3, PO4: 3, PO5: 2, PO6: 0, PO7: 0, PO8: 0, PO9: 0, PO10: 1, PO11: 0, PO12: 3 },
      CO5: { PO1: 2, PO2: 3, PO3: 3, PO4: 2, PO5: 3, PO6: 0, PO7: 0, PO8: 1, PO9: 1, PO10: 2, PO11: 1, PO12: 3 }
    },
    psoMapping: {
      CO1: { PSO1: 3, PSO2: 2, PSO3: 1 },
      CO2: { PSO1: 3, PSO2: 3, PSO3: 2 },
      CO3: { PSO1: 3, PSO2: 2, PSO3: 2 },
      CO4: { PSO1: 2, PSO2: 3, PSO3: 2 },
      CO5: { PSO1: 3, PSO2: 3, PSO3: 3 }
    },
    mappingJustifications: {
      'CO2-PO5': 'SQL query implementation leverages enterprise relational databases (PostgreSQL/Oracle) directly cultivating modern tool proficiency.',
      'CO5-PO3': 'Designing distributed cloud database schemas directly fulfills complex system design criteria.'
    },
    syllabusUnits: [
      {
        id: 'u1',
        unitNumber: 1,
        title: 'Relational Model & Relational Algebra',
        lectureHours: 12,
        topics: 'Database Systems Architecture, Data Independence, Relational Data Model, Integrity Constraints, Relational Algebra and Tuple Relational Calculus.',
        pedagogicalMethods: ['Chalk & Talk', 'Live SQL Terminal Demonstration'],
        mappedCOs: ['CO1', 'CO2']
      },
      {
        id: 'u2',
        unitNumber: 2,
        title: 'SQL & Query Optimization',
        lectureHours: 12,
        topics: 'DDL, DML, Complex Joins, Subqueries, Views, Indexes, Query Processing, Cost Estimation, Heuristic Query Optimization.',
        pedagogicalMethods: ['Live Coding', 'ICT Simulation'],
        mappedCOs: ['CO2']
      },
      {
        id: 'u3',
        unitNumber: 3,
        title: 'Database Design & Normalization',
        lectureHours: 12,
        topics: 'ER/EER Modeling, Functional Dependencies, Closure Sets, Normal Forms (1NF, 2NF, 3NF, BCNF, 4NF), Lossless Join, Dependency Preservation.',
        pedagogicalMethods: ['Chalk & Talk', 'Schema Design Workshop'],
        mappedCOs: ['CO3']
      },
      {
        id: 'u4',
        unitNumber: 4,
        title: 'Transactions & Concurrency Control',
        lectureHours: 12,
        topics: 'Transaction Concepts, ACID Properties, Serializability, Two-Phase Locking (2PL), Deadlock Detection, Timestamp Protocols, ARIES Recovery.',
        pedagogicalMethods: ['Case Study Analysis', 'Interactive State Trace'],
        mappedCOs: ['CO4']
      },
      {
        id: 'u5',
        unitNumber: 5,
        title: 'NoSQL & Distributed Architectures',
        lectureHours: 12,
        topics: 'CAP Theorem, Sharding, Replication, Document Databases (MongoDB), Key-Value Stores, Distributed Commit (2PC), Modern Cloud DBaaS.',
        pedagogicalMethods: ['Lab Demonstration', 'Architecture Comparison Matrix'],
        mappedCOs: ['CO5']
      }
    ],
    assessments: [
      {
        id: 'as1',
        category: 'CIE',
        name: 'Internal Assessment Test 1',
        weightageMarks: 20,
        mappedCOs: ['CO1', 'CO2'],
        bloomsFocus: ['L2', 'L3']
      },
      {
        id: 'as2',
        category: 'CIE',
        name: 'Internal Assessment Test 2',
        weightageMarks: 20,
        mappedCOs: ['CO3', 'CO4'],
        bloomsFocus: ['L3', 'L4', 'L5']
      },
      {
        id: 'as3',
        category: 'CIE',
        name: 'Database Design & SQL Lab Assessment',
        weightageMarks: 10,
        mappedCOs: ['CO2', 'CO5'],
        bloomsFocus: ['L3', 'L6']
      },
      {
        id: 'as4',
        category: 'SEE',
        name: 'Final Semester Examination',
        weightageMarks: 50,
        mappedCOs: ['CO1', 'CO2', 'CO3', 'CO4', 'CO5'],
        bloomsFocus: ['L2', 'L3', 'L4', 'L5', 'L6']
      }
    ],
    textbooks: [
      {
        id: 'tb1',
        authors: 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan',
        title: 'Database System Concepts',
        edition: '7th Edition',
        publisher: 'McGraw-Hill',
        year: '2020',
        isbn: '978-0078022159',
        isPrescribed: true
      },
      {
        id: 'tb2',
        authors: 'Ramez Elmasri, Shamkant B. Navathe',
        title: 'Fundamentals of Database Systems',
        edition: '7th Edition',
        publisher: 'Pearson',
        year: '2016',
        isbn: '978-0133970777',
        isPrescribed: true
      }
    ],
    workflowComments: [
      {
        id: 'wc1',
        author: 'Prof. Marcus Brody',
        role: 'hod',
        date: '2026-02-18',
        message: 'Curriculum conforms with Autonomous R22 guidelines. Approved for academic batch 2025-2026.',
        statusChange: 'approved'
      }
    ]
  }
];
