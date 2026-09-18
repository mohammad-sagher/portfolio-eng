import type { Content } from './schema';

/** Production-safe initial content copied from the current portfolio database. */
export const seed: Content = {
  "meta": {
    "siteTitle": {
      "en": "Basma Sagher — Software Engineer",
      "ar": "بسمة صقر — مهندسة برمجيات"
    },
    "nav": [
      {
        "id": "nav-about",
        "label": {
          "en": "About",
          "ar": "نبذة"
        },
        "href": "#about"
      },
      {
        "id": "nav-exp",
        "label": {
          "en": "Experience",
          "ar": "الخبرة"
        },
        "href": "#experience"
      },
      {
        "id": "nav-skills",
        "label": {
          "en": "Skills",
          "ar": "المهارات"
        },
        "href": "#skills"
      },
      {
        "id": "nav-projects",
        "label": {
          "en": "Projects",
          "ar": "المشاريع"
        },
        "href": "#projects"
      },
      {
        "id": "nav-contact",
        "label": {
          "en": "Contact",
          "ar": "تواصل"
        },
        "href": "#contact"
      }
    ]
  },
  "labels": {
    "role": {
      "en": "Role",
      "ar": "الدور"
    },
    "duration": {
      "en": "Duration",
      "ar": "المدة"
    },
    "techStack": {
      "en": "Tech Stack",
      "ar": "التقنيات"
    },
    "tools": {
      "en": "Tools",
      "ar": "الأدوات"
    },
    "features": {
      "en": "Key features",
      "ar": "أبرز الميزات"
    },
    "responsibilities": {
      "en": "Responsibilities",
      "ar": "المسؤوليات"
    },
    "achievements": {
      "en": "Achievements",
      "ar": "الإنجازات"
    },
    "viewCode": {
      "en": "View code",
      "ar": "عرض الكود"
    },
    "liveDemo": {
      "en": "Live demo",
      "ar": "تجربة مباشرة"
    },
    "viewCertificate": {
      "en": "View certificate",
      "ar": "عرض الشهادة"
    },
    "scroll": {
      "en": "Scroll",
      "ar": "مرّر"
    },
    "emptySection": {
      "en": "Add your first item —",
      "ar": "أضف أول عنصر —"
    },
    "emptyList": {
      "en": "Nothing here yet — add one",
      "ar": "لا يوجد شيء بعد — أضف عنصرًا"
    },
    "imagePlaceholder": {
      "en": "Add an image",
      "ar": "أضف صورة"
    },
    "langSwitch": {
      "en": "العربية",
      "ar": "English"
    },
    "ownerLogin": {
      "en": "Owner sign in",
      "ar": "تسجيل دخول المالكة"
    }
  },
  "hero": {
    "eyebrow": {
      "en": "Software Engineer · Informatics Engineering",
      "ar": "مهندسة برمجيات · هندسة المعلوماتية"
    },
    "name": {
      "en": "Basma Sagher",
      "ar": "بسمة صقر"
    },
    "title": {
      "en": "Software Engineer",
      "ar": "مهندسة برمجيات"
    },
    "statement": {
      "en": "I build full-stack web software with an engineer’s discipline: clear architecture, readable code, and a testing mindset that catches problems before users do.",
      "ar": "أبني برمجيات ويب متكاملة بانضباط هندسي: بنية واضحة، وكود مقروء، وعقلية اختبار تكتشف المشكلات قبل أن يصل إليها المستخدم."
    },
    "ctas": [
      {
        "id": "cta-projects",
        "label": {
          "en": "View projects",
          "ar": "عرض المشاريع"
        },
        "href": "#projects"
      },
      {
        "id": "cta-about",
        "label": {
          "en": "About me",
          "ar": "نبذة عني"
        },
        "href": "#about"
      },
      {
        "id": "cta-contact",
        "label": {
          "en": "Contact",
          "ar": "تواصل"
        },
        "href": "#contact"
      }
    ]
  },
  "about": {
    "eyebrow": {
      "en": "About",
      "ar": "نبذة"
    },
    "heading": {
      "en": "Engineering with rigor, designed with care.",
      "ar": "هندسة بدقة، وتصميم بعناية."
    },
    "paragraphs": [
      {
        "id": "ab-1",
        "text": {
          "en": "My background is in Informatics Engineering, with a full-stack orientation that spans interface work through to backend services and data.",
          "ar": "خلفيتي في هندسة المعلوماتية، مع توجّه متكامل يمتد من واجهات المستخدم إلى خدمات الخلفية والبيانات."
        }
      },
      {
        "id": "ab-2",
        "text": {
          "en": "I care about software architecture and quality: how systems are structured, how they are verified, and how they stay maintainable as they grow.",
          "ar": "أهتم ببنية البرمجيات وجودتها: كيف تُنظَّم الأنظمة، وكيف يُتحقق منها، وكيف تبقى قابلة للصيانة مع نموّها."
        }
      },
      {
        "id": "ab-3",
        "text": {
          "en": "Problem-solving is the constant — breaking ambiguous requirements into precise, testable pieces.",
          "ar": "حلّ المشكلات هو الثابت — تفكيك المتطلبات الغامضة إلى أجزاء دقيقة قابلة للاختبار."
        }
      }
    ],
    "facts": [
      {
        "id": "f-1",
        "label": {
          "en": "Focus",
          "ar": "التركيز"
        },
        "value": {
          "en": "Full-stack web",
          "ar": "ويب متكامل"
        }
      },
      {
        "id": "f-2",
        "label": {
          "en": "Field",
          "ar": "المجال"
        },
        "value": {
          "en": "Informatics Engineering",
          "ar": "هندسة المعلوماتية"
        }
      },
      {
        "id": "f-3",
        "label": {
          "en": "Based in",
          "ar": "المقر"
        },
        "value": {
          "en": "[Placeholder] City",
          "ar": "[بديل مؤقت] المدينة"
        }
      }
    ]
  },
  "specializations": {
    "eyebrow": {
      "en": "Specializations",
      "ar": "التخصصات"
    },
    "heading": {
      "en": "Where I do my best work",
      "ar": "المجالات التي أتقنها"
    },
    "items": [
      {
        "id": "sp-1",
        "label": {
          "en": "Software Engineering",
          "ar": "هندسة البرمجيات"
        }
      },
      {
        "id": "sp-2",
        "label": {
          "en": "Full-Stack Development",
          "ar": "تطوير متكامل"
        }
      },
      {
        "id": "sp-3",
        "label": {
          "en": "Frontend Engineering",
          "ar": "هندسة الواجهات الأمامية"
        }
      },
      {
        "id": "sp-4",
        "label": {
          "en": "Backend Development",
          "ar": "تطوير الخلفية"
        }
      },
      {
        "id": "sp-5",
        "label": {
          "en": "Software Testing",
          "ar": "اختبار البرمجيات"
        }
      },
      {
        "id": "sp-6",
        "label": {
          "en": "Quality Assurance",
          "ar": "ضمان الجودة"
        }
      },
      {
        "id": "sp-7",
        "label": {
          "en": "Web Development",
          "ar": "تطوير الويب"
        }
      },
      {
        "id": "sp-8",
        "label": {
          "en": "UI Engineering",
          "ar": "هندسة واجهات المستخدم"
        }
      }
    ]
  },
  "experience": {
    "eyebrow": {
      "en": "Experience",
      "ar": "الخبرة"
    },
    "heading": {
      "en": "A timeline of building and verifying",
      "ar": "مسار من البناء والتحقق"
    },
    "items": [
      {
        "id": "exp-1",
        "title": {
          "en": "Software Engineer",
          "ar": "مهندسة برمجيات"
        },
        "company": {
          "en": "[Placeholder] Company name",
          "ar": "[بديل مؤقت] اسم الشركة"
        },
        "dates": {
          "en": "[Placeholder] 2024 — Present",
          "ar": "[بديل مؤقت] 2024 — الآن"
        },
        "summary": {
          "en": "Full-stack development across web interfaces and backend services.",
          "ar": "تطوير متكامل عبر واجهات الويب وخدمات الخلفية."
        },
        "responsibilities": [
          {
            "id": "r-1",
            "text": {
              "en": "Designed and implemented web features end to end.",
              "ar": "صمّمت ونفّذت ميزات ويب من البداية إلى النهاية."
            }
          },
          {
            "id": "r-2",
            "text": {
              "en": "Wrote maintainable, reviewed code with attention to structure.",
              "ar": "كتبت كودًا قابلاً للصيانة ومراجَعًا مع الاهتمام بالبنية."
            }
          },
          {
            "id": "r-3",
            "text": {
              "en": "Collaborated on requirements and turned them into testable tasks.",
              "ar": "تعاونت على المتطلبات وحوّلتها إلى مهام قابلة للاختبار."
            }
          }
        ],
        "technologies": [
          {
            "id": "t-1",
            "label": {
              "en": "TypeScript",
              "ar": "TypeScript"
            }
          },
          {
            "id": "t-2",
            "label": {
              "en": "React",
              "ar": "React"
            }
          },
          {
            "id": "t-3",
            "label": {
              "en": "Node.js",
              "ar": "Node.js"
            }
          }
        ]
      }
    ]
  },
  "qa": {
    "eyebrow": {
      "en": "Software Testing / QA",
      "ar": "اختبار البرمجيات / ضمان الجودة"
    },
    "heading": {
      "en": "Quality is designed, not inspected in",
      "ar": "الجودة تُصمَّم ولا تُفتَّش لاحقًا"
    },
    "organization": {
      "en": "People in Need (PIN)",
      "ar": "People in Need (PIN)"
    },
    "intro": {
      "en": "Testing and QA work: test-case design, functional testing, bug identification and reporting, verification, and continuous quality improvement.",
      "ar": "أعمال الاختبار وضمان الجودة: تصميم حالات الاختبار، الاختبار الوظيفي، تحديد الأخطاء والإبلاغ عنها، التحقق، والتحسين المستمر للجودة."
    },
    "items": [
      {
        "id": "qa-1",
        "name": {
          "en": "[Placeholder] Testing project",
          "ar": "[بديل مؤقت] مشروع اختبار"
        },
        "role": {
          "en": "QA / Software Tester",
          "ar": "اختبار برمجيات / ضمان جودة"
        },
        "dates": {
          "en": "[Placeholder] 2023",
          "ar": "[بديل مؤقت] 2023"
        },
        "description": {
          "en": "Designed test cases, executed functional tests, and reported defects with clear reproduction steps.",
          "ar": "صمّمت حالات اختبار، ونفّذت اختبارات وظيفية، وأبلغت عن العيوب بخطوات إعادة إنتاج واضحة."
        },
        "image": {
          "src": "",
          "alt": {
            "en": "Testing project screenshot",
            "ar": "لقطة من مشروع الاختبار"
          }
        },
        "tools": [
          {
            "id": "qt-1",
            "label": {
              "en": "Test case design",
              "ar": "تصميم حالات الاختبار"
            }
          },
          {
            "id": "qt-2",
            "label": {
              "en": "Bug reporting",
              "ar": "الإبلاغ عن الأخطاء"
            }
          },
          {
            "id": "qt-3",
            "label": {
              "en": "Verification",
              "ar": "التحقق"
            }
          }
        ],
        "achievements": [
          {
            "id": "qa-a1",
            "text": {
              "en": "Improved defect report clarity for the development team.",
              "ar": "حسّنت وضوح تقارير العيوب لفريق التطوير."
            }
          }
        ]
      }
    ]
  },
  "skills": {
    "eyebrow": {
      "en": "Skills",
      "ar": "المهارات"
    },
    "heading": {
      "en": "Tools I think in",
      "ar": "الأدوات التي أفكّر بها"
    },
    "categories": [
      {
        "id": "sk-prog",
        "name": {
          "en": "Programming",
          "ar": "البرمجة"
        },
        "skills": [
          {
            "id": "s1",
            "label": {
              "en": "JavaScript",
              "ar": "JavaScript"
            }
          },
          {
            "id": "s2",
            "label": {
              "en": "TypeScript",
              "ar": "TypeScript"
            }
          },
          {
            "id": "s3",
            "label": {
              "en": "Python",
              "ar": "Python"
            }
          },
          {
            "id": "s4",
            "label": {
              "en": "Java",
              "ar": "Java"
            }
          }
        ]
      },
      {
        "id": "sk-fe",
        "name": {
          "en": "Frontend",
          "ar": "الواجهات الأمامية"
        },
        "skills": [
          {
            "id": "s5",
            "label": {
              "en": "React",
              "ar": "React"
            }
          },
          {
            "id": "s6",
            "label": {
              "en": "Next.js",
              "ar": "Next.js"
            }
          },
          {
            "id": "s7",
            "label": {
              "en": "HTML & CSS",
              "ar": "HTML & CSS"
            }
          },
          {
            "id": "s8",
            "label": {
              "en": "Tailwind",
              "ar": "Tailwind"
            }
          }
        ]
      },
      {
        "id": "sk-be",
        "name": {
          "en": "Backend",
          "ar": "الخلفية"
        },
        "skills": [
          {
            "id": "s9",
            "label": {
              "en": "Node.js",
              "ar": "Node.js"
            }
          },
          {
            "id": "s10",
            "label": {
              "en": "REST APIs",
              "ar": "REST APIs"
            }
          },
          {
            "id": "s11",
            "label": {
              "en": "Express",
              "ar": "Express"
            }
          }
        ]
      },
      {
        "id": "sk-db",
        "name": {
          "en": "Databases",
          "ar": "قواعد البيانات"
        },
        "skills": [
          {
            "id": "s12",
            "label": {
              "en": "PostgreSQL",
              "ar": "PostgreSQL"
            }
          },
          {
            "id": "s13",
            "label": {
              "en": "MySQL",
              "ar": "MySQL"
            }
          },
          {
            "id": "s14",
            "label": {
              "en": "MongoDB",
              "ar": "MongoDB"
            }
          }
        ]
      },
      {
        "id": "sk-tools",
        "name": {
          "en": "Tools & Development",
          "ar": "الأدوات والتطوير"
        },
        "skills": [
          {
            "id": "s15",
            "label": {
              "en": "Git",
              "ar": "Git"
            }
          },
          {
            "id": "s16",
            "label": {
              "en": "Docker",
              "ar": "Docker"
            }
          },
          {
            "id": "s17",
            "label": {
              "en": "CI/CD",
              "ar": "CI/CD"
            }
          }
        ]
      },
      {
        "id": "sk-qa",
        "name": {
          "en": "Testing / QA",
          "ar": "الاختبار / ضمان الجودة"
        },
        "skills": [
          {
            "id": "s18",
            "label": {
              "en": "Test case design",
              "ar": "تصميم حالات الاختبار"
            }
          },
          {
            "id": "s19",
            "label": {
              "en": "Functional testing",
              "ar": "الاختبار الوظيفي"
            }
          },
          {
            "id": "s20",
            "label": {
              "en": "Bug tracking",
              "ar": "تتبع الأخطاء"
            }
          }
        ]
      }
    ]
  },
  "projects": {
    "eyebrow": {
      "en": "Projects",
      "ar": "المشاريع"
    },
    "heading": {
      "en": "Selected work",
      "ar": "أعمال مختارة"
    },
    "items": [
      {
        "id": "p-1",
        "name": {
          "en": "[Placeholder] Project One",
          "ar": "[بديل مؤقت] المشروع الأول"
        },
        "category": {
          "en": "Web application",
          "ar": "تطبيق ويب"
        },
        "role": {
          "en": "Full-stack developer",
          "ar": "مطوّرة متكاملة"
        },
        "short": {
          "en": "A full-stack web application with a clean service layer and tested UI.",
          "ar": "تطبيق ويب متكامل بطبقة خدمات نظيفة وواجهة مختبَرة."
        },
        "detailed": {
          "en": "Describe the problem, the architecture decisions, and what you verified. Replace this placeholder in Edit Mode.",
          "ar": "صِف المشكلة وقرارات البنية وما تحققتِ منه. استبدلي هذا النص المؤقت من وضع التحرير."
        },
        "image": {
          "src": "",
          "alt": {
            "en": "Project One cover",
            "ar": "غلاف المشروع الأول"
          }
        },
        "technologies": [
          {
            "id": "pt-1",
            "label": {
              "en": "Next.js",
              "ar": "Next.js"
            }
          },
          {
            "id": "pt-2",
            "label": {
              "en": "PostgreSQL",
              "ar": "PostgreSQL"
            }
          }
        ],
        "features": [
          {
            "id": "pf-1",
            "text": {
              "en": "Authentication and role-based access",
              "ar": "مصادقة وصلاحيات حسب الدور"
            }
          },
          {
            "id": "pf-2",
            "text": {
              "en": "Responsive, accessible interface",
              "ar": "واجهة متجاوبة وسهلة الوصول"
            }
          }
        ],
        "github": "https://github.com/example/project-one",
        "demo": ""
      },
      {
        "id": "p-2",
        "name": {
          "en": "[Placeholder] Project Two",
          "ar": "[بديل مؤقت] المشروع الثاني"
        },
        "category": {
          "en": "Tooling",
          "ar": "أدوات"
        },
        "role": {
          "en": "Frontend engineer",
          "ar": "مهندسة واجهات"
        },
        "short": {
          "en": "An internal tool focused on data clarity and fast interactions.",
          "ar": "أداة داخلية تركّز على وضوح البيانات وسرعة التفاعل."
        },
        "detailed": {
          "en": "Placeholder detailed description.",
          "ar": "وصف تفصيلي مؤقت."
        },
        "image": {
          "src": "",
          "alt": {
            "en": "Project Two cover",
            "ar": "غلاف المشروع الثاني"
          }
        },
        "technologies": [
          {
            "id": "pt-3",
            "label": {
              "en": "React",
              "ar": "React"
            }
          },
          {
            "id": "pt-4",
            "label": {
              "en": "TypeScript",
              "ar": "TypeScript"
            }
          }
        ],
        "features": [
          {
            "id": "pf-3",
            "text": {
              "en": "Live filtering and search",
              "ar": "تصفية وبحث مباشر"
            }
          }
        ],
        "github": "",
        "demo": ""
      }
    ]
  },
  "education": {
    "eyebrow": {
      "en": "Education",
      "ar": "التعليم"
    },
    "heading": {
      "en": "Foundations",
      "ar": "الأسس"
    },
    "items": [
      {
        "id": "ed-1",
        "institution": {
          "en": "[Placeholder] University",
          "ar": "[بديل مؤقت] الجامعة"
        },
        "degree": {
          "en": "Bachelor of Engineering",
          "ar": "بكالوريوس في الهندسة"
        },
        "field": {
          "en": "Informatics Engineering",
          "ar": "هندسة المعلوماتية"
        },
        "dates": {
          "en": "[Placeholder] 2019 — 2024",
          "ar": "[بديل مؤقت] 2019 — 2024"
        },
        "description": {
          "en": "Software engineering, algorithms, databases, and systems.",
          "ar": "هندسة البرمجيات، الخوارزميات، قواعد البيانات، والأنظمة."
        },
        "achievements": [
          {
            "id": "ea-1",
            "text": {
              "en": "[Placeholder] Graduation project",
              "ar": "[بديل مؤقت] مشروع التخرج"
            }
          }
        ]
      }
    ]
  },
  "certifications": {
    "eyebrow": {
      "en": "Certifications & Achievements",
      "ar": "الشهادات والإنجازات"
    },
    "heading": {
      "en": "Proof of practice",
      "ar": "إثبات الممارسة"
    },
    "items": [
      {
        "id": "c-1",
        "title": {
          "en": "[Placeholder] Certification title",
          "ar": "[بديل مؤقت] عنوان الشهادة"
        },
        "issuer": {
          "en": "[Placeholder] Issuer",
          "ar": "[بديل مؤقت] الجهة المانحة"
        },
        "date": {
          "en": "[Placeholder] 2024",
          "ar": "[بديل مؤقت] 2024"
        },
        "kind": {
          "en": "Certification",
          "ar": "شهادة"
        },
        "description": {
          "en": "Short note about what this covered.",
          "ar": "ملاحظة قصيرة عمّا غطّته الشهادة."
        },
        "image": {
          "src": "",
          "alt": {
            "en": "Certificate preview",
            "ar": "معاينة الشهادة"
          }
        },
        "link": ""
      }
    ]
  },
  "contact": {
    "eyebrow": {
      "en": "Contact",
      "ar": "تواصل"
    },
    "heading": {
      "en": "Let’s build something careful and ambitious.",
      "ar": "لنبنِ معًا شيئًا دقيقًا وطموحًا."
    },
    "intro": {
      "en": "Open to software engineering and QA opportunities and collaborations.",
      "ar": "منفتحة على فرص وتعاونات في هندسة البرمجيات وضمان الجودة."
    },
    "items": [
      {
        "id": "ct-1",
        "label": {
          "en": "Email",
          "ar": "البريد"
        },
        "value": {
          "en": "hello@example.com",
          "ar": "hello@example.com"
        },
        "href": "mailto:hello@example.com"
      },
      {
        "id": "ct-2",
        "label": {
          "en": "Phone",
          "ar": "الهاتف"
        },
        "value": {
          "en": "+000 000 000 000",
          "ar": "+000 000 000 000"
        },
        "href": "tel:+000000000000"
      },
      {
        "id": "ct-3",
        "label": {
          "en": "LinkedIn",
          "ar": "لينكدإن"
        },
        "value": {
          "en": "linkedin.com/in/example",
          "ar": "linkedin.com/in/example"
        },
        "href": "https://linkedin.com/in/example"
      },
      {
        "id": "ct-4",
        "label": {
          "en": "GitHub",
          "ar": "غيت هب"
        },
        "value": {
          "en": "github.com/example",
          "ar": "github.com/example"
        },
        "href": "https://github.com/example"
      }
    ]
  },
  "footer": {
    "text": {
      "en": "© Basma Sagher. Crafted with care.",
      "ar": "© بسمة صقر. صُنع بعناية."
    },
    "links": [
      {
        "id": "fl-1",
        "label": {
          "en": "Back to top",
          "ar": "العودة للأعلى"
        },
        "href": "#top"
      }
    ]
  }
};
