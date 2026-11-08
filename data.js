// ============================================================
//  IELTS READING — PASSAGE & QUESTION DATA
// ============================================================

const passages = [
  // ============================
  // PASSAGE 1
  // ============================
  {
    id: 0,
    title: "The History of the Internet",
    source: "Adapted from academic sources",
    body: [
      {
        label: "A",
        text: "The internet, as we know it today, is the result of decades of research, development, and collaboration across numerous scientific and governmental organisations. Its origins can be traced back to the late 1960s, when the United States Department of Defense funded a project known as ARPANET — the Advanced Research Projects Agency Network. This early network was designed not as a tool for public communication, but as a means of ensuring that military and research communications could survive a nuclear attack by rerouting signals if part of the network were destroyed."
      },
      {
        label: "B",
        text: "The concept of packet switching, a method of breaking data into small chunks that are transmitted independently and reassembled at the destination, was central to ARPANET's design. This contrasted sharply with the circuit-switched telephone networks of the time, which required a dedicated connection between two parties for the duration of a call. Packet switching allowed multiple users to share the same network infrastructure, greatly improving efficiency and resilience."
      },
      {
        label: "C",
        text: "Throughout the 1970s and 1980s, ARPANET expanded beyond its original military purpose and began connecting universities and research institutions. A key development during this period was the creation of TCP/IP — the Transmission Control Protocol/Internet Protocol — in 1983. TCP/IP established a common language for computers on the network to communicate, and it remains the foundational protocol of the internet to this day. The shift to TCP/IP is often regarded as the birth of the modern internet."
      },
      {
        label: "D",
        text: "The transformation of the internet from a tool used exclusively by researchers and academics into a global public resource was largely driven by the invention of the World Wide Web in 1989 by British computer scientist Tim Berners-Lee, who was working at CERN, the European Organisation for Nuclear Research. Berners-Lee's vision was to create a system in which documents stored on different computers could be linked together through hyperlinks, making information far easier to navigate and share."
      },
      {
        label: "E",
        text: "The release of Mosaic in 1993, the first widely used web browser with a graphical interface, made the World Wide Web accessible to non-technical users for the first time. This triggered an explosion in internet usage and gave rise to the 'dot-com' era of the 1990s, during which thousands of new companies rushed to establish an online presence. While many of these ventures failed spectacularly, the period laid the groundwork for the digital economy that dominates commerce today."
      },
      {
        label: "F",
        text: "Today, the internet connects billions of people and devices across the globe and has fundamentally altered how societies operate. From communication and entertainment to healthcare, education, and governance, the internet's influence is pervasive and growing. Yet alongside its enormous benefits come significant challenges: cybersecurity threats, misinformation, digital inequality, and concerns over privacy and the concentration of power in the hands of a small number of large technology corporations. How societies choose to govern and regulate this technology will likely be one of the defining questions of the 21st century."
      }
    ],
    questionSets: [
      {
        type: "heading_match",
        instruction: "The reading passage has six paragraphs, A–F. Choose the correct heading for each paragraph from the list of headings below. Write the correct number, i–viii, in the boxes.",
        headings: [
          "i. The protocol that unified the network",
          "ii. Origins in military research",
          "iii. Challenges facing the modern internet",
          "iv. A tool for the public — the Web is born",
          "v. How data travels in small pieces",
          "vi. The browser that opened the web to everyone",
          "vii. The decline of research networks",
          "viii. Financial boom and bust online"
        ],
        questions: [
          { num: 1,  label: "Paragraph A", answer: "ii" },
          { num: 2,  label: "Paragraph B", answer: "v"  },
          { num: 3,  label: "Paragraph C", answer: "i"  },
          { num: 4,  label: "Paragraph D", answer: "iv" },
          { num: 5,  label: "Paragraph E", answer: "vi" },
          { num: 6,  label: "Paragraph F", answer: "iii"}
        ]
      },
      {
        type: "tfng",
        instruction: "Do the following statements agree with the information given in the reading passage? Write TRUE, FALSE, or NOT GIVEN.",
        questions: [
          { num: 7,  text: "ARPANET was originally designed for public communication.", answer: "FALSE" },
          { num: 8,  text: "TCP/IP was created in 1983 and is still used today.", answer: "TRUE" },
          { num: 9,  text: "Tim Berners-Lee was born in Switzerland.", answer: "NOT GIVEN" },
          { num: 10, text: "Mosaic was the first browser with a graphical interface to reach wide use.", answer: "TRUE" },
          { num: 11, text: "All dot-com companies founded in the 1990s eventually became successful.", answer: "FALSE" },
          { num: 12, text: "The internet currently connects more than five billion people.", answer: "NOT GIVEN" }
        ]
      },
      {
        type: "fill",
        instruction: "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
        questions: [
          { num: 13, text: "ARPANET used ________ to break data into small chunks for transmission.", answer: "packet switching" },
          { num: 14, text: "TCP/IP provided a common ________ for computers on the network.", answer: "language" }
        ]
      }
    ]
  },

  // ============================
  // PASSAGE 2
  // ============================
  {
    id: 1,
    title: "Urban Farming: Growing Food in the City",
    source: "Adapted from academic sources",
    body: [
      {
        label: "A",
        text: "Urban farming — the practice of growing, processing, and distributing food within or around urban areas — is experiencing a global renaissance. From rooftop gardens in New York to vertical farms in Singapore, city dwellers are increasingly turning to agriculture as a way to supplement food supplies, reduce carbon footprints, and reconnect with the natural world. Proponents argue that urban farming has the potential to transform cities from purely consumptive environments into productive ecosystems."
      },
      {
        label: "B",
        text: "The history of urban agriculture stretches back centuries. During World War II, 'victory gardens' in the United States and United Kingdom produced a significant proportion of the vegetables consumed by civilian populations. In Cuba, following the collapse of the Soviet Union and the subsequent loss of food imports, the government promoted urban agriculture so effectively that Havana now produces a substantial share of its own fresh produce. These historical examples demonstrate that urban farming flourishes most dramatically in times of crisis or necessity."
      },
      {
        label: "C",
        text: "Modern urban farming takes many forms. Community gardens provide shared green space where residents grow their own fruits and vegetables. Rooftop farming makes use of otherwise wasted space atop apartment buildings and offices. Vertical farming, perhaps the most technologically advanced approach, involves growing crops in stacked layers within indoor facilities, often using hydroponics — a system in which plants grow in nutrient-rich water rather than soil — and artificial LED lighting. Vertical farms can produce crops year-round, regardless of climate or season, and use significantly less water than traditional agriculture."
      },
      {
        label: "D",
        text: "Despite its promise, urban farming faces substantial challenges. Land in cities is extremely expensive and scarce, meaning that unless buildings are specifically designed to incorporate growing space, farming must compete with housing, offices, and other commercial uses. The energy demands of vertical farms in particular are considerable; while they save water, the electricity required to power artificial lighting and climate control systems can make them expensive and, depending on the energy source, potentially less environmentally friendly than conventional farming."
      },
      {
        label: "E",
        text: "There are also questions about the scale at which urban farming can realistically operate. Critics point out that even the most productive urban farms can supply only a small fraction of a city's food needs. A study conducted in the United Kingdom estimated that urban agriculture could realistically supply no more than 10% of London's vegetable consumption, even if every available space were used. For staple crops such as wheat, rice, and maize, which require vast areas of land, urban farming is simply not a viable alternative to rural agriculture."
      },
      {
        label: "F",
        text: "Nevertheless, advocates of urban farming emphasise its social and psychological benefits alongside its environmental credentials. Urban farms and community gardens have been shown to reduce stress, promote physical activity, and foster a sense of community among participants. In low-income neighbourhoods with limited access to fresh produce — areas sometimes described as 'food deserts' — community gardens can significantly improve residents' diets and overall health. For many urban farming enthusiasts, the goal is not to replace conventional agriculture, but to complement it and to reintroduce urban populations to the processes by which food is grown."
      }
    ],
    questionSets: [
      {
        type: "mcq",
        instruction: "Choose the correct letter, A, B, C or D.",
        questions: [
          {
            num: 15,
            text: "According to paragraph B, urban agriculture in Cuba expanded because of",
            options: [
              { letter: "A", text: "a government initiative to reduce food waste." },
              { letter: "B", text: "the loss of imported food following political changes." },
              { letter: "C", text: "a successful campaign during World War II." },
              { letter: "D", text: "growing public interest in organic produce." }
            ],
            answer: "B"
          },
          {
            num: 16,
            text: "Which of the following best describes vertical farming?",
            options: [
              { letter: "A", text: "Growing crops in shared outdoor community spaces." },
              { letter: "B", text: "Using rooftops of buildings to grow food." },
              { letter: "C", text: "Growing crops in stacked indoor layers using technology." },
              { letter: "D", text: "A traditional method of farming revived in modern cities." }
            ],
            answer: "C"
          },
          {
            num: 17,
            text: "What is identified as a key disadvantage of vertical farms?",
            options: [
              { letter: "A", text: "They cannot produce crops in winter." },
              { letter: "B", text: "They require large quantities of water." },
              { letter: "C", text: "The cost and energy use of artificial lighting may reduce their benefits." },
              { letter: "D", text: "They are unpopular with urban residents." }
            ],
            answer: "C"
          },
          {
            num: 18,
            text: "The UK study mentioned in paragraph E found that urban farming could supply",
            options: [
              { letter: "A", text: "most of London's grain needs." },
              { letter: "B", text: "up to 10% of London's vegetable consumption." },
              { letter: "C", text: "more than half of London's food needs." },
              { letter: "D", text: "a significant share of all UK food production." }
            ],
            answer: "B"
          },
          {
            num: 19,
            text: "According to the final paragraph, what do urban farming supporters see as its primary purpose?",
            options: [
              { letter: "A", text: "To completely replace rural agriculture." },
              { letter: "B", text: "To reduce the cost of food in cities." },
              { letter: "C", text: "To complement existing food production and reconnect people with nature." },
              { letter: "D", text: "To provide employment for low-income residents." }
            ],
            answer: "C"
          }
        ]
      },
      {
        type: "fill",
        instruction: "Complete the notes below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
        questions: [
          { num: 20, text: "Hydroponics is a system in which plants grow in ________ rather than soil.", answer: "nutrient-rich water" },
          { num: 21, text: "Areas with limited access to fresh produce are sometimes called '________ deserts'.", answer: "food" },
          { num: 22, text: "Urban farms have been shown to reduce ________ and promote physical activity.", answer: "stress" }
        ]
      },
      {
        type: "tfng",
        instruction: "Do the following statements agree with the information given in the passage? Write TRUE, FALSE, or NOT GIVEN.",
        questions: [
          { num: 23, text: "Victory gardens supplied a notable portion of vegetables consumed during World War II.", answer: "TRUE" },
          { num: 24, text: "Vertical farms use more water than conventional farms.", answer: "FALSE" },
          { num: 25, text: "Urban agriculture is more common in Asia than in Europe.", answer: "NOT GIVEN" },
          { num: 26, text: "Wheat, rice, and maize can be effectively produced through urban farming.", answer: "FALSE" },
          { num: 27, text: "Community gardens improve the diets of residents in food deserts.", answer: "TRUE" }
        ]
      }
    ]
  },

  // ============================
  // PASSAGE 3
  // ============================
  {
    id: 2,
    title: "The Psychology of Decision-Making",
    source: "Adapted from academic sources",
    body: [
      {
        label: "A",
        text: "For much of the 20th century, economists operated under the assumption that human beings are fundamentally rational agents — individuals who gather available information, weigh up the costs and benefits of different courses of action, and make choices that maximise their own interests. This model, known as the Rational Actor Model, underpinned much of classical economics and public policy. However, from the 1970s onwards, research in cognitive psychology began to reveal that real human decision-making is far more complex, inconsistent, and predictably irrational than this model suggested."
      },
      {
        label: "B",
        text: "The pioneering work of Israeli-American psychologists Daniel Kahneman and Amos Tversky was instrumental in establishing the field now known as behavioural economics. Their research demonstrated that people rely heavily on mental shortcuts, or heuristics, when making decisions. While these shortcuts are often useful — allowing us to navigate a complex world without being paralysed by too much information — they can also lead to systematic errors in judgement, which Kahneman and Tversky termed 'cognitive biases'."
      },
      {
        label: "C",
        text: "One of the most well-documented cognitive biases is anchoring, the tendency to rely too heavily on the first piece of information encountered when making a decision. In one experiment, participants were asked to estimate the percentage of African countries in the United Nations. Before answering, they were shown a randomly generated number — either high or low — spun on a wheel. Remarkably, participants' estimates were significantly influenced by this irrelevant number: those who saw a high number gave higher estimates, and those who saw a low number gave lower ones."
      },
      {
        label: "D",
        text: "Another influential concept from Kahneman and Tversky's research is loss aversion — the idea that the pain of losing something is psychologically more powerful than the pleasure of gaining something of equivalent value. Studies suggest that losses feel roughly twice as significant as equivalent gains. This asymmetry has profound implications for economics and finance: it helps explain why investors hold onto losing stocks for too long, why people avoid fair gambles, and why insurance products are so attractive even when statistically poor value."
      },
      {
        label: "E",
        text: "The concept of 'choice architecture' — the idea that the way options are presented can dramatically influence the choices people make — has found widespread application in public policy. Governments and organisations have used insights from behavioural economics to 'nudge' people towards better decisions. For example, making organ donation an opt-out rather than an opt-in system has dramatically increased donation rates in several countries. Similarly, enrolling employees in pension schemes by default, while allowing them to opt out, has significantly boosted retirement savings."
      },
      {
        label: "F",
        text: "Critics of behavioural economics raise several concerns. Some argue that the findings, many of which are based on laboratory experiments, do not necessarily translate to real-world behaviour, where the stakes are higher and people have more time and motivation to think carefully. Others contend that nudge policies are paternalistic — that governments should not manipulate the decision-making environment but instead trust individuals to make their own choices. Despite these criticisms, behavioural economics has had a transformative impact on how we understand human behaviour and design systems intended to serve human needs."
      }
    ],
    questionSets: [
      {
        type: "mcq",
        instruction: "Choose the correct letter, A, B, C or D.",
        questions: [
          {
            num: 28,
            text: "What did the Rational Actor Model assume about human beings?",
            options: [
              { letter: "A", text: "They make decisions based on emotions." },
              { letter: "B", text: "They always choose options that maximise their own interests." },
              { letter: "C", text: "They are influenced by social pressure." },
              { letter: "D", text: "They rely on heuristics to make decisions." }
            ],
            answer: "B"
          },
          {
            num: 29,
            text: "According to paragraph B, cognitive biases are",
            options: [
              { letter: "A", text: "rare and difficult to detect." },
              { letter: "B", text: "useful shortcuts that always improve decision-making." },
              { letter: "C", text: "systematic errors that result from mental shortcuts." },
              { letter: "D", text: "unique to people with psychological disorders." }
            ],
            answer: "C"
          },
          {
            num: 30,
            text: "In the anchoring experiment, participants' estimates were affected by",
            options: [
              { letter: "A", text: "their prior knowledge about Africa." },
              { letter: "B", text: "an irrelevant number shown before the question." },
              { letter: "C", text: "advice given by the researchers." },
              { letter: "D", text: "the order in which countries were listed." }
            ],
            answer: "B"
          },
          {
            num: 31,
            text: "Loss aversion implies that people feel",
            options: [
              { letter: "A", text: "equally affected by gains and losses of the same size." },
              { letter: "B", text: "more pleasure from gains than pain from equivalent losses." },
              { letter: "C", text: "more pain from losses than pleasure from equivalent gains." },
              { letter: "D", text: "indifferent to financial risks." }
            ],
            answer: "C"
          },
          {
            num: 32,
            text: "Making organ donation 'opt-out' rather than 'opt-in' is an example of",
            options: [
              { letter: "A", text: "anchoring." },
              { letter: "B", text: "loss aversion in public policy." },
              { letter: "C", text: "heuristic decision-making." },
              { letter: "D", text: "choice architecture." }
            ],
            answer: "D"
          }
        ]
      },
      {
        type: "tfng",
        instruction: "Do the following statements agree with the claims of the writer? Write TRUE, FALSE, or NOT GIVEN.",
        questions: [
          { num: 33, text: "Daniel Kahneman and Amos Tversky were both born in Israel.", answer: "NOT GIVEN" },
          { num: 34, text: "Loss aversion can explain why investors keep losing stocks too long.", answer: "TRUE" },
          { num: 35, text: "Nudge policies have been adopted exclusively in European countries.", answer: "NOT GIVEN" },
          { num: 36, text: "Some critics believe behavioural economics findings may not apply outside the laboratory.", answer: "TRUE" },
          { num: 37, text: "The writer concludes that behavioural economics has had a significant impact on understanding human behaviour.", answer: "TRUE" }
        ]
      },
      {
        type: "fill",
        instruction: "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
        questions: [
          { num: 38, text: "The Rational Actor Model was central to classical ________ and public policy.", answer: "economics" },
          { num: 39, text: "Mental shortcuts used in decision-making are also known as ________.", answer: "heuristics" },
          { num: 40, text: "According to research, losses feel roughly ________ as significant as equivalent gains.", answer: "twice as" }
        ]
      }
    ]
  }
];

const practiceTests = [
  {
    id: "neighbourhood-library",
    title: "The Neighbourhood Library",
    difficulty: "easy",
    durationMinutes: 15,
    passage: {
      id: 0,
      title: "The Neighbourhood Library",
      source: "Original practice passage",
      body: [
        { label: "A", text: "When the Riverside Library opened in 1986, its main purpose was simple: to lend books. The building occupied two rooms above a post office, and visitors could borrow up to three books for two weeks. Over time, however, the neighbourhood changed. More families moved into the area, and many residents asked for a quiet place to study after school or work." },
        { label: "B", text: "In 2012, the library moved into a larger building beside the bus station. The new site included a reading room, free internet access and a small children's area. Staff also began running weekly activities. On Tuesday afternoons, volunteers helped children with homework; on Saturday mornings, local residents practised conversation in English. These sessions were free, although visitors had to reserve a place because the rooms were small." },
        { label: "C", text: "The library's most popular change was a home-delivery service for people who could not easily travel. A volunteer selected books from a list prepared by each reader and delivered them once every three weeks. The service first supported older residents, but it later expanded to include people recovering from illness. It was not designed to replace visits to the library; instead, it allowed more people to use the collection." },
        { label: "D", text: "Today, the Riverside Library still lends printed books, but it also provides a shared study space. The manager says that the building succeeds because people can use it in different ways. Some visitors come to borrow a novel, while others use a computer, attend a class or meet a neighbour. The library has not become a substitute for schools or community centres. Its role is to make information and local activities easier to reach." }
      ],
      questionSets: [
        {
          type: "mcq",
          instruction: "Choose the correct letter, A, B, C or D.",
          questions: [
            { num: 1, text: "What was the library's original purpose?", options: [{ letter: "A", text: "To provide computers." }, { letter: "B", text: "To lend books." }, { letter: "C", text: "To run language classes." }, { letter: "D", text: "To deliver books to homes." }], answer: "B" },
            { num: 2, text: "Where did the library move in 2012?", options: [{ letter: "A", text: "Beside the bus station." }, { letter: "B", text: "Inside a school." }, { letter: "C", text: "Above a supermarket." }, { letter: "D", text: "Next to the hospital." }], answer: "A" },
            { num: 3, text: "When did volunteers help children with homework?", options: [{ letter: "A", text: "Monday mornings." }, { letter: "B", text: "Tuesday afternoons." }, { letter: "C", text: "Friday evenings." }, { letter: "D", text: "Saturday mornings." }], answer: "B" },
            { num: 4, text: "How often were books delivered to home-service readers?", options: [{ letter: "A", text: "Every week." }, { letter: "B", text: "Every two weeks." }, { letter: "C", text: "Every three weeks." }, { letter: "D", text: "Every month." }], answer: "C" }
          ]
        },
        {
          type: "tfng",
          instruction: "Do the following statements agree with the information in the passage? Write TRUE, FALSE or NOT GIVEN.",
          questions: [
            { num: 5, text: "The library originally occupied two rooms above a post office.", answer: "TRUE" },
            { num: 6, text: "Visitors must pay to attend the English conversation sessions.", answer: "FALSE" },
            { num: 7, text: "The home-delivery service uses bicycles provided by the local council.", answer: "NOT GIVEN" }
          ]
        },
        {
          type: "fill",
          instruction: "Complete each sentence with NO MORE THAN TWO WORDS from the passage.",
          questions: [
            { num: 8, text: "The new library opened beside the ________ station.", answer: "bus" },
            { num: 9, text: "Children can receive help with their ________ on Tuesday afternoons.", answer: "homework" },
            { num: 10, text: "The home-delivery service first supported ________ residents.", answer: "older" }
          ]
        }
      ]
    }
  },
  {
    id: "cooling-the-city",
    title: "Cooling the City",
    difficulty: "medium",
    durationMinutes: 18,
    passage: {
      id: 0,
      title: "Cooling the City",
      source: "Original practice passage",
      body: [
        { label: "A", text: "On a summer evening, the centre of a large city can remain warmer than nearby countryside. Roads, roofs and walls absorb energy from sunlight during the day and release it slowly after sunset. This pattern, often called the urban heat-island effect, is made stronger by limited shade and by heat produced by vehicles and buildings. The difference is not identical in every city: weather, building design and local geography all influence it." },
        { label: "B", text: "Planting trees is a familiar response, but the benefits depend on where and how they are planted. A row of trees can shade a pavement and reduce the amount of sunlight reaching a building. Leaves also release water vapour, which can cool the surrounding air. Yet young trees provide little shade for several years, and poorly chosen species may struggle in dry streets. City planners therefore need to consider water supply, root space and the needs of local residents." },
        { label: "C", text: "Some councils have tested reflective roofs. These surfaces send more sunlight back into the atmosphere than dark materials do, so buildings may absorb less heat. A reflective roof can lower indoor temperatures, especially in buildings with little insulation. It does not, however, cool every street directly. Researchers also warn that results from one neighbourhood cannot automatically be applied to another, because street width, wind and building height affect air movement." },
        { label: "D", text: "No single measure solves urban heat. A city may combine tree cover, shaded bus stops, reflective materials and public cooling rooms during heatwaves. The most useful plans begin by mapping which streets and buildings become hottest and identifying who is most exposed. Older people, outdoor workers and households without reliable cooling may face greater risks. For this reason, some researchers argue that heat policy should be judged not only by average temperature changes but also by whether protection reaches the most vulnerable residents." }
      ],
      questionSets: [
        {
          type: "mcq",
          instruction: "Choose the correct letter, A, B, C or D.",
          questions: [
            { num: 1, text: "Why can city centres stay warm after sunset?", options: [{ letter: "A", text: "They receive more rain than rural areas." }, { letter: "B", text: "Built surfaces release stored solar energy slowly." }, { letter: "C", text: "Trees produce heat at night." }, { letter: "D", text: "Councils operate heating systems outdoors." }], answer: "B" },
            { num: 2, text: "According to paragraph B, how can leaves help cool the air?", options: [{ letter: "A", text: "By releasing water vapour." }, { letter: "B", text: "By blocking wind completely." }, { letter: "C", text: "By increasing the amount of shade indoors." }, { letter: "D", text: "By reflecting all sunlight." }], answer: "A" },
            { num: 3, text: "What limitation of reflective roofs is mentioned?", options: [{ letter: "A", text: "They are useful only in rural areas." }, { letter: "B", text: "They cannot reduce indoor temperatures." }, { letter: "C", text: "They do not directly cool every street." }, { letter: "D", text: "They require mature trees nearby." }], answer: "C" },
            { num: 4, text: "What do some researchers think should be considered when evaluating heat plans?", options: [{ letter: "A", text: "Whether protection reaches vulnerable residents." }, { letter: "B", text: "How many cars use the city centre." }, { letter: "C", text: "The cost of replacing every roof." }, { letter: "D", text: "Whether all streets have the same design." }], answer: "A" }
          ]
        },
        {
          type: "tfng",
          instruction: "Do the following statements agree with the information in the passage? Write TRUE, FALSE or NOT GIVEN.",
          questions: [
            { num: 5, text: "The urban heat-island effect is exactly the same in every city.", answer: "FALSE" },
            { num: 6, text: "Young trees may take several years to provide substantial shade.", answer: "TRUE" },
            { num: 7, text: "The passage states that reflective roofs are cheaper to install than trees.", answer: "NOT GIVEN" }
          ]
        },
        {
          type: "fill",
          instruction: "Complete each sentence with NO MORE THAN TWO WORDS from the passage.",
          questions: [
            { num: 8, text: "Roads and roofs absorb energy from ________ during the day.", answer: "sunlight" },
            { num: 9, text: "Tree planning needs to account for water supply and root ________.", answer: "space" },
            { num: 10, text: "Heat plans can include public ________ rooms during heatwaves.", answer: "cooling" }
          ]
        }
      ]
    }
  },
  {
    id: "measuring-attention",
    title: "Measuring Attention",
    difficulty: "hard",
    durationMinutes: 20,
    passage: {
      id: 0,
      title: "Measuring Attention",
      source: "Original practice passage",
      body: [
        { label: "A", text: "Researchers often describe attention as if it were a limited resource that can be directed, divided or exhausted. This metaphor is useful, but it can also hide an important distinction: noticing a signal is not the same as understanding it. A person may detect a sound while concentrating on a task yet fail to identify its source. Experiments that measure only whether a signal was detected may therefore overestimate how much information entered conscious awareness." },
        { label: "B", text: "One method for studying attention asks participants to respond to a target that appears among other visual items. When the target is predictable, responses usually become faster. This improvement is sometimes interpreted as evidence that attention has become more efficient. However, participants may also have learned the rhythm of the task or adopted a strategy that prioritises speed over accuracy. To distinguish these explanations, researchers record both response time and errors, and vary the interval between trials." },
        { label: "C", text: "A second challenge is that laboratory tasks remove many distractions found in daily life. A quiet room makes it easier to control conditions, but it may also change the behaviour being studied. In a field study of commuters, for example, messages were noticed less consistently when people were navigating unfamiliar stations than when they were seated in a quiet room. The comparison does not prove that laboratory results are useless; instead, it suggests that findings should be tested under more than one set of conditions." },
        { label: "D", text: "Attention is also shaped by expectations. If people are told that a rare event may occur, they may monitor for it, but this does not guarantee that they will recognise it correctly. In one experiment, volunteers watching a moving display sometimes reported a meaningful pattern where none had been designed. The researchers argued that expectation can guide perception without determining it completely: prior knowledge influences what people look for, while the available evidence still places limits on what they can reasonably conclude." },
        { label: "E", text: "These findings have practical consequences for the design of alarms, dashboards and public information. Adding more alerts may seem helpful, yet frequent signals can encourage users to ignore them or respond automatically. Designers can reduce this risk by making signals distinct, testing them with representative users and checking whether people interpret them as intended. The central question is not simply whether a warning is visible, but whether it attracts attention at the right moment and supports an appropriate decision." }
      ],
      questionSets: [
        {
          type: "mcq",
          instruction: "Choose the correct letter, A, B, C or D.",
          questions: [
            { num: 1, text: "What distinction does paragraph A make?", options: [{ letter: "A", text: "Between hearing a signal and understanding it." }, { letter: "B", text: "Between attention and memory capacity." }, { letter: "C", text: "Between conscious and unconscious movement." }, { letter: "D", text: "Between visual and auditory experiments." }], answer: "A" },
            { num: 2, text: "Why do researchers measure both response time and errors?", options: [{ letter: "A", text: "To determine whether participants prefer visual tasks." }, { letter: "B", text: "To separate improved efficiency from a speed-first strategy." }, { letter: "C", text: "To ensure that every trial has the same target." }, { letter: "D", text: "To make participants more familiar with the task." }], answer: "B" },
            { num: 3, text: "What does the commuter study suggest about quiet laboratory settings?", options: [{ letter: "A", text: "They always produce inaccurate results." }, { letter: "B", text: "They may not reproduce all everyday conditions." }, { letter: "C", text: "They make people less able to see messages." }, { letter: "D", text: "They should be replaced by field studies." }], answer: "B" },
            { num: 4, text: "What conclusion do the researchers draw about expectations?", options: [{ letter: "A", text: "They completely determine what people perceive." }, { letter: "B", text: "They affect what people look for but do not remove evidential limits." }, { letter: "C", text: "They prevent people from detecting rare events." }, { letter: "D", text: "They are irrelevant when displays are moving." }], answer: "B" }
          ]
        },
        {
          type: "tfng",
          instruction: "Do the following statements agree with the information in the passage? Write TRUE, FALSE or NOT GIVEN.",
          questions: [
            { num: 5, text: "A detection-only measure may exaggerate how much information a person consciously understood.", answer: "TRUE" },
            { num: 6, text: "The commuter study found that participants noticed messages more consistently in unfamiliar stations.", answer: "FALSE" },
            { num: 7, text: "The experiment with volunteers used a display containing exactly six moving shapes.", answer: "NOT GIVEN" }
          ]
        },
        {
          type: "fill",
          instruction: "Complete each sentence with NO MORE THAN TWO WORDS from the passage.",
          questions: [
            { num: 8, text: "Researchers can vary the interval between ________ to study task performance.", answer: "trials" },
            { num: 9, text: "Frequent signals may lead users to ignore them or respond ________.", answer: "automatically" },
            { num: 10, text: "A warning should support an appropriate ________.", answer: "decision" }
          ]
        }
      ]
    }
  }
];

practiceTests.push(
  {
    id: "repair-cafes",
    title: "Repair Cafes",
    difficulty: "easy",
    durationMinutes: 15,
    passage: {
      id: 0,
      title: "Repair Cafes",
      source: "Original practice passage",
      body: [
        { label: "A", text: "At a repair cafe, people bring household objects that no longer work and try to fix them with help from volunteers. The first event in the town of Westbank took place in a community hall in 2014. Its organisers hoped to reduce waste, but they also wanted neighbours to share practical skills. Visitors keep their own belongings and take part in the repair rather than leaving an item to be fixed elsewhere." },
        { label: "B", text: "The event is held on the first Sunday of each month. Before arriving, visitors are asked to email a short description of the problem. This helps the organisers invite volunteers with suitable experience and prepare common spare parts. The service is free, although people may make a voluntary contribution to help pay for materials. If an object cannot be repaired safely, volunteers explain why instead of promising a result." },
        { label: "C", text: "Each table is devoted to a different kind of work. One may have sewing equipment, while another is set up for small electrical items or bicycles. The tools belong to the cafe, so visitors do not need to buy equipment for a single repair. Volunteers demonstrate techniques and encourage owners to do simple tasks themselves. This approach means that a repair can take longer, but visitors may learn how to deal with a similar problem later." },
        { label: "D", text: "The organisers record how many objects are brought in and whether they are repaired, but they say that attendance is not the only measure of success. They also ask visitors whether they have used a repair skill again at home. Some objects still cannot be saved, and the cafe does not accept large appliances. Even so, organisers believe that making repair visible can challenge the idea that a damaged object must always be replaced." }
      ],
      questionSets: [
        { type: "mcq", instruction: "Choose the correct letter, A, B, C or D.", questions: [
          { num: 1, text: "What do visitors do at the repair cafe?", options: [{ letter: "A", text: "Leave objects for volunteers to repair later." }, { letter: "B", text: "Try to repair their own objects with help." }, { letter: "C", text: "Exchange broken objects for new ones." }, { letter: "D", text: "Pay a fixed fee for every repair." }], answer: "B" },
          { num: 2, text: "Why are visitors asked to describe a problem before arriving?", options: [{ letter: "A", text: "To decide the price of the repair." }, { letter: "B", text: "To help prepare suitable skills and spare parts." }, { letter: "C", text: "To limit attendance to local residents." }, { letter: "D", text: "To guarantee that every object can be fixed." }], answer: "B" },
          { num: 3, text: "What is one advantage of using the cafe's tools?", options: [{ letter: "A", text: "Visitors need not buy equipment for one repair." }, { letter: "B", text: "Repairs can always be completed more quickly." }, { letter: "C", text: "Volunteers can take objects home." }, { letter: "D", text: "The cafe can repair large appliances." }], answer: "A" },
          { num: 4, text: "How do organisers also assess the cafe's success?", options: [{ letter: "A", text: "By counting how many new tools are donated." }, { letter: "B", text: "By asking whether visitors reuse repair skills." }, { letter: "C", text: "By measuring the value of repaired objects." }, { letter: "D", text: "By comparing attendance with other towns." }], answer: "B" }
        ] },
        { type: "tfng", instruction: "Do the following statements agree with the information in the passage? Write TRUE, FALSE or NOT GIVEN.", questions: [
          { num: 5, text: "The Westbank repair cafe began in 2014.", answer: "TRUE" },
          { num: 6, text: "Visitors must make a contribution before receiving help.", answer: "FALSE" },
          { num: 7, text: "The community hall is owned by the local council.", answer: "NOT GIVEN" }
        ] },
        { type: "fill", instruction: "Complete each sentence with NO MORE THAN TWO WORDS from the passage.", questions: [
          { num: 8, text: "The event takes place on the first ________ of each month.", answer: "Sunday" },
          { num: 9, text: "Visitors email a description so organisers can prepare spare ________.", answer: "parts" },
          { num: 10, text: "The cafe does not accept large ________.", answer: "appliances" }
        ] }
      ]
    }
  },
  {
    id: "salt-marsh-restoration",
    title: "Restoring a Salt Marsh",
    difficulty: "medium",
    durationMinutes: 18,
    passage: {
      id: 0,
      title: "Restoring a Salt Marsh",
      source: "Original practice passage",
      body: [
        { label: "A", text: "Salt marshes form where sheltered coastlines are regularly covered by the tide. Their grasses slow moving water and trap fine sediment, gradually building low platforms that can reduce the force of waves. These wetlands also provide feeding and breeding areas for fish and birds. In recent decades, researchers have drawn attention to another function: marsh plants and soils store carbon that might otherwise return to the atmosphere." },
        { label: "B", text: "Many marshes were drained or separated from the sea by embankments to create farmland and protect buildings. Such barriers reduced flooding in some places, but they also interrupted the movement of water and sediment. Where a marsh could no longer grow upwards by accumulating material, the ground sometimes became lower relative to the tide. In other sites, roads and walls prevented the wetland from moving inland as sea levels rose." },
        { label: "C", text: "Restoration projects often begin by changing how water enters a site. Rather than removing every embankment at once, engineers may create a limited opening and monitor the results through several tidal cycles. This gradual method can reveal whether the soil drains adequately and whether salt-tolerant plants return. It also gives nearby residents time to report problems. The approach is slower than a single large intervention, but it reduces uncertainty about how water will move across the land." },
        { label: "D", text: "Success cannot be judged by the number of plants alone. Project teams measure elevation, sediment movement and the range of species found at different times of year. They also record whether neighbouring homes or paths experience unexpected flooding. A marsh may take years to recover, and a rise in plant cover does not necessarily mean that the whole ecosystem has returned. Long-term observation is therefore part of restoration, not an optional final step." }
      ],
      questionSets: [
        { type: "mcq", instruction: "Choose the correct letter, A, B, C or D.", questions: [
          { num: 1, text: "How can marsh grasses reduce the force of waves?", options: [{ letter: "A", text: "They slow water and trap sediment." }, { letter: "B", text: "They deepen nearby channels." }, { letter: "C", text: "They prevent tides from reaching the coast." }, { letter: "D", text: "They remove salt from seawater." }], answer: "A" },
          { num: 2, text: "What could happen when a marsh is prevented from accumulating material?", options: [{ letter: "A", text: "Its ground may become lower relative to the tide." }, { letter: "B", text: "Its grasses become resistant to salt." }, { letter: "C", text: "The coastline moves rapidly seaward." }, { letter: "D", text: "Its carbon stores immediately increase." }], answer: "A" },
          { num: 3, text: "Why might engineers make only a small opening in an embankment at first?", options: [{ letter: "A", text: "To prevent any plants from returning." }, { letter: "B", text: "To observe water movement and reduce uncertainty." }, { letter: "C", text: "To avoid consulting nearby residents." }, { letter: "D", text: "To make the project finish in one tidal cycle." }], answer: "B" },
          { num: 4, text: "What does paragraph D suggest about plant cover?", options: [{ letter: "A", text: "It is the only reliable measure of restoration." }, { letter: "B", text: "It can increase without the whole ecosystem recovering." }, { letter: "C", text: "It should be measured only once." }, { letter: "D", text: "It is unrelated to marsh health." }], answer: "B" }
        ] },
        { type: "tfng", instruction: "Do the following statements agree with the information in the passage? Write TRUE, FALSE or NOT GIVEN.", questions: [
          { num: 5, text: "Salt marsh soils can store carbon.", answer: "TRUE" },
          { num: 6, text: "Restoration engineers always remove all coastal embankments at the start of a project.", answer: "FALSE" },
          { num: 7, text: "The passage identifies a particular country with the most successful marsh restoration programme.", answer: "NOT GIVEN" }
        ] },
        { type: "fill", instruction: "Complete each sentence with NO MORE THAN TWO WORDS from the passage.", questions: [
          { num: 8, text: "Marsh grasses trap fine ________ carried by water.", answer: "sediment" },
          { num: 9, text: "A limited opening can be observed through several ________ cycles.", answer: "tidal" },
          { num: 10, text: "Project teams record whether homes or paths experience unexpected ________.", answer: "flooding" }
        ] }
      ]
    }
  },
  {
    id: "sleep-and-social-time",
    title: "Sleep and Social Time",
    difficulty: "medium",
    durationMinutes: 18,
    passage: {
      id: 0,
      title: "Sleep and Social Time",
      source: "Original practice passage",
      body: [
        { label: "A", text: "People do not all feel ready for sleep at the same hour. This preference is partly linked to circadian rhythms, internal cycles that help coordinate sleep, body temperature and other processes across roughly a day. Light is an important signal for these rhythms, but work schedules, meals and social activity also influence when people go to bed. A person's preferred timing can therefore differ from the timetable imposed by school or employment." },
        { label: "B", text: "Researchers use the term social jet lag for the mismatch between a person's biological timing and the schedule required by daily obligations. Someone who sleeps later on free days than on workdays may be repaying sleep loss, following a different rhythm, or experiencing both. The difference alone cannot identify the cause. Studies therefore compare sleep diaries with other measures and ask participants about work hours, light exposure and their routines throughout the week." },
        { label: "C", text: "Bright light in the evening can delay the body's preparation for sleep, particularly when it comes from close, luminous screens. However, it would be misleading to blame screens alone for late bedtimes. A person may use a device because they are already awake, while shift work or family responsibilities may determine the available time for rest. Researchers distinguish between a factor associated with short sleep and one that directly causes it." },
        { label: "D", text: "Some schools have tested later start times for adolescents, whose sleep timing often shifts during development. Reports from these projects commonly show longer sleep on school nights, although attendance and academic outcomes vary between locations. A timetable change cannot remove every source of sleep loss, but it may reduce the gap between students' rhythms and the hours they are expected to be alert. Researchers argue that local routines should be considered before a policy is applied widely." }
      ],
      questionSets: [
        { type: "mcq", instruction: "Choose the correct letter, A, B, C or D.", questions: [
          { num: 1, text: "What do circadian rhythms help coordinate?", options: [{ letter: "A", text: "Sleep and other processes across roughly a day." }, { letter: "B", text: "Only the time people eat meals." }, { letter: "C", text: "The length of every work schedule." }, { letter: "D", text: "Differences between school subjects." }], answer: "A" },
          { num: 2, text: "Why can the difference in sleep timing between workdays and free days be difficult to interpret?", options: [{ letter: "A", text: "It may reflect more than one cause." }, { letter: "B", text: "People never remember their sleep times." }, { letter: "C", text: "Researchers cannot observe light exposure." }, { letter: "D", text: "It occurs only among shift workers." }], answer: "A" },
          { num: 3, text: "What warning does paragraph C make about screens?", options: [{ letter: "A", text: "They are the sole cause of late bedtimes." }, { letter: "B", text: "Their use may be associated with, rather than cause, late sleep." }, { letter: "C", text: "They have no effect on sleep preparation." }, { letter: "D", text: "They affect only people who work nights." }], answer: "B" },
          { num: 4, text: "What has often been reported after later school start times?", options: [{ letter: "A", text: "Longer sleep on school nights." }, { letter: "B", text: "Identical academic results everywhere." }, { letter: "C", text: "A complete end to sleep loss." }, { letter: "D", text: "Earlier sleep timing among all adolescents." }], answer: "A" }
        ] },
        { type: "tfng", instruction: "Do the following statements agree with the information in the passage? Write TRUE, FALSE or NOT GIVEN.", questions: [
          { num: 5, text: "Light is one signal that can influence circadian rhythms.", answer: "TRUE" },
          { num: 6, text: "A sleep diary by itself always reveals why a person sleeps later on free days.", answer: "FALSE" },
          { num: 7, text: "The passage states the exact number of adolescents included in the school projects.", answer: "NOT GIVEN" }
        ] },
        { type: "fill", instruction: "Complete each sentence with NO MORE THAN TWO WORDS from the passage.", questions: [
          { num: 8, text: "Social jet lag describes a mismatch between biological timing and daily ________.", answer: "obligations" },
          { num: 9, text: "Researchers may ask participants about work hours and light ________.", answer: "exposure" },
          { num: 10, text: "Later school starts may reduce the gap between students' rhythms and the hours they are expected to be ________.", answer: "alert" }
        ] }
      ]
    }
  },
  {
    id: "maps-and-movement",
    title: "Maps That Change the Journey",
    difficulty: "hard",
    durationMinutes: 20,
    passage: {
      id: 0,
      title: "Maps That Change the Journey",
      source: "Original practice passage",
      body: [
        { label: "A", text: "A map is often treated as a neutral picture of a place, but every map selects what to show and what to leave out. A route-planning service, for instance, may rank journeys by estimated time while giving less weight to slope, noise or the quality of a pavement. The route it presents as best is therefore best according to a particular measure, not necessarily according to every traveller's priorities. Digital maps can make these choices difficult to notice because their recommendations appear immediate and precise." },
        { label: "B", text: "When many users follow the same recommendation, the map may begin to alter the place it describes. A quiet side street can become busy, while a nearby shop receives new customers from people using walking directions. These effects are uneven: some businesses benefit, whereas residents may experience extra traffic or noise. The service has not physically built a road, yet its repeated suggestions help distribute movement across the urban network." },
        { label: "C", text: "Designers face a problem when several goals conflict. A route that is quickest for a cyclist may be uncomfortable for a child, and a path that avoids traffic may cross a poorly lit area. Adding more settings can give users control, but too many choices may make a service harder to use. Some researchers propose that route systems should explain why a recommendation appears and allow users to express relevant preferences, rather than presenting one ranking as universally correct." },
        { label: "D", text: "Evaluating these systems requires more than checking whether a traveller reaches a destination. Researchers can compare predicted and actual journey times, but they should also ask who uses the routes and who bears the resulting costs. A recommendation that works well for occasional visitors may not suit people with mobility limitations or residents whose streets receive diverted traffic. Audits conducted before and after a system changes its ranking can help reveal these distributional effects, although they cannot remove every uncertainty about why users choose a route." }
      ],
      questionSets: [
        { type: "mcq", instruction: "Choose the correct letter, A, B, C or D.", questions: [
          { num: 1, text: "What does paragraph A suggest about a route labelled 'best'?", options: [{ letter: "A", text: "It reflects a specific ranking measure." }, { letter: "B", text: "It is suitable for every traveller." }, { letter: "C", text: "It always avoids slopes and noise." }, { letter: "D", text: "It has been tested by all local residents." }], answer: "A" },
          { num: 2, text: "How can a route service affect a neighbourhood?", options: [{ letter: "A", text: "By changing how movement is distributed." }, { letter: "B", text: "By physically constructing new roads." }, { letter: "C", text: "By preventing shops from receiving visitors." }, { letter: "D", text: "By removing the need for pavement repairs." }], answer: "A" },
          { num: 3, text: "Why might adding many route settings be problematic?", options: [{ letter: "A", text: "It could make the service harder to use." }, { letter: "B", text: "It prevents users expressing preferences." }, { letter: "C", text: "It makes every route slower." }, { letter: "D", text: "It removes conflicts between user needs." }], answer: "A" },
          { num: 4, text: "What should researchers consider when evaluating recommendations?", options: [{ letter: "A", text: "Only whether users arrive on time." }, { letter: "B", text: "Who benefits and who bears the costs." }, { letter: "C", text: "Whether the map uses printed colours." }, { letter: "D", text: "How many roads exist in the city." }], answer: "B" }
        ] },
        { type: "tfng", instruction: "Do the following statements agree with the information in the passage? Write TRUE, FALSE or NOT GIVEN.", questions: [
          { num: 5, text: "A route service may give less importance to pavement quality than to estimated time.", answer: "TRUE" },
          { num: 6, text: "Every business located on a recommended street benefits from increased movement.", answer: "FALSE" },
          { num: 7, text: "The passage names a specific mapping company that changed its route ranking.", answer: "NOT GIVEN" }
        ] },
        { type: "fill", instruction: "Complete each sentence with NO MORE THAN TWO WORDS from the passage.", questions: [
          { num: 8, text: "A digital map may rank journeys by estimated ________.", answer: "time" },
          { num: 9, text: "Some routes may cross areas that are poorly ________.", answer: "lit" },
          { num: 10, text: "Before-and-after audits can help reveal ________ effects.", answer: "distributional" }
        ] }
      ]
    }
  }
);

// Band score conversion table
function getBandScore(correct) {
  if (correct >= 39) return 9.0;
  if (correct >= 37) return 8.5;
  if (correct >= 35) return 8.0;
  if (correct >= 33) return 7.5;
  if (correct >= 30) return 7.0;
  if (correct >= 27) return 6.5;
  if (correct >= 23) return 6.0;
  if (correct >= 19) return 5.5;
  if (correct >= 15) return 5.0;
  if (correct >= 13) return 4.5;
  if (correct >= 10) return 4.0;
  if (correct >= 8)  return 3.5;
  if (correct >= 6)  return 3.0;
  return 2.5;
}
