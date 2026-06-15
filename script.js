const today = new Date("2026-06-12T12:00:00");
const expirationDays = 30;
const pageMeta = {
  uk: {
    title: "Тьютор і Я - каталог фахівців для дітей з особливостями розвитку",
    description: "Сайт пошуку спеціалістів для дітей з ООП"
  },
  en: {
    title: "Tutor and Me - directory of specialists for children with developmental differences",
    description: "Specialist search site for children with special educational needs"
  }
};

const ukToEn = {
  "Тьютор і Я - каталог фахівців": "Tutor and Me - specialist directory",
  "Тьютор і Я - довідник спеціалізацій": "Tutor and Me - specialization guide",
  "Тьютор і Я - відгуки батьків": "Tutor and Me - parent reviews",
  "Тьютор і Я - розмістити оголошення": "Tutor and Me - post a listing",
  "Тьютор і Я - панель адміністратора": "Tutor and Me - admin panel",
  "Оголошення діє 30, 60 або 90 днів": "A listing is active for 30, 60, or 90 days",
  "Фахівець заповнює анкету, додає документи, обирає формат занять і строк автовидалення оголошення.\n            Батьки пишуть через вбудовані повідомлення, а відгуки з'являються після перевірки.":
    "A specialist fills in a profile, adds documents, selects session formats, and chooses the listing auto-removal term. Parents message through the built-in chat, and reviews appear after moderation.",
  "Фахівець заповнює анкету, додає документи, обирає формат занять і строк автовидалення оголошення.":
    "A specialist fills in a profile, adds documents, selects session formats, and chooses the listing auto-removal term.",
  "Батьки пишуть через вбудовані повідомлення, а відгуки з'являються після перевірки.":
    "Parents message through the built-in chat, and reviews appear after moderation.",
  "Каталог фахівців для дітей з особливостями розвитку":
    "Directory of specialists for children with developmental differences",
  "Сайт пошуку спеціалістів для дітей з ООП":
    "Specialist search site for children with special educational needs",
  "Пошук за містом, форматом і спеціалізацією. Відгуки батьків, повідомлення всередині сервісу та оголошення, які автоматично знімаються з публікації через 30 днів без продовження.":
    "Search by city, format, and specialization. Parent reviews, in-service messaging, and listings that are automatically unpublished after 30 days unless renewed.",
  "Пошук за містом, форматом і спеціалізацією. Відгуки батьків, повідомлення всередині сервісу\n            та оголошення, які автоматично знімаються з публікації через 30 днів без продовження.":
    "Search by city, format, and specialization. Parent reviews, in-service messaging, and listings that are automatically unpublished after 30 days unless renewed.",
  "Тьютор і Я, на головну": "Tutor and Me, home",
  "Тьютор і Я": "Tutor and Me",
  "Відкрити меню": "Open menu",
  "Каталог": "Directory",
  "Фахівці": "Specialists",
  "Шукаю фахівця": "Find a specialist",
  "Я фахівець": "I am a specialist",
  "Довідник": "Guide",
  "Відгуки": "Reviews",
  "Для фахівців": "For specialists",
  "Увійти": "Log in",
  "Розмістити оголошення": "Post a listing",
  "Пошук фахівців": "Specialist search",
  "Місто": "City",
  "Спеціалізація": "Specialization",
  "Формат": "Format",
  "Будь-яке": "Any",
  "Будь-яка": "Any",
  "Будь-який": "Any",
  "Знайти": "Search",
  "Фахівчиня, мама і дитина займаються за столом": "A specialist, mother, and child working at a table",
  "Каталог оголошень": "Listing directory",
  "Категорії": "Categories",
  "Увесь список": "Full list",
  "30 днів": "30 days",
  "Після публікації оголошення потрібно продовжити, інакше воно знімається з каталогу.":
    "After publication, a listing must be renewed or it is removed from the directory.",
  "Знайдено": "Found",
  "фахівців": "specialists",
  "Рекомендовані анкети": "Recommended profiles",
  "Рекомендовані": "Recommended",
  "Рейтинг": "Rating",
  "Невдовзі завершуються": "Expiring soon",
  "Допомога з вибором": "Help choosing",
  "Короткий маршрут підкаже, з кого почати: лікар, діагностика, корекційні заняття або супровід родини.":
    "A short guide suggests where to start: doctor, diagnostics, corrective sessions, or family support.",
  "Зібрати маршрут": "Build a route",
  "Модерація": "Moderation",
  "Усі нові оголошення, скарги й відгуки доступні адміністратору в одній панелі. Повідомлення видаляються автоматично після 3 унікальних дизлайків.":
    "All new listings, reports, and reviews are available to the administrator in one panel. Messages are automatically removed after 3 unique dislikes.",
  "Панель адміністратора": "Admin panel",
  "Оголошення діє 30 днів і продовжується вручну": "A listing is active for 30 days and is renewed manually",
  "Фахівець заповнює анкету, додає документи, отримує статус модерації та бачить таймер публікації. Батьки пишуть через вбудовані повідомлення, а відгуки з'являються після перевірки.":
    "A specialist fills in a profile, attaches documents, receives a moderation status, and sees the publication timer. Parents write through built-in messages, and reviews appear after review.",
  "Фахівець заповнює анкету, додає документи, отримує статус модерації та бачить таймер публікації.\n            Батьки пишуть через вбудовані повідомлення, а відгуки з'являються після перевірки.":
    "A specialist fills in a profile, attaches documents, receives a moderation status, and sees the publication timer. Parents write through built-in messages, and reviews appear after review.",
  "Чернетка оголошення фахівця": "Specialist listing draft",
  "Ім'я фахівця або назва центру": "Specialist or center name",
  "Наприклад, Анна Коваленко": "For example, Anna Kovalenko",
  "Київ або онлайн": "Kyiv or online",
  "Район міста": "City district",
  "Наприклад, Шевченківський": "For example, Shevchenkivskyi",
  "Формати занять": "Session formats",
  "Готовий займатися на виїзді": "Ready for home visits",
  "Готовий займатися онлайн": "Ready to work online",
  "Документи або приклади роботи": "Documents or work examples",
  "PDF, PNG або JPG; можна додати кілька файлів": "PDF, PNG, or JPG; multiple files allowed",
  "Автовидалення оголошення через": "Auto-remove listing after",
  "60 днів": "60 days",
  "90 днів": "90 days",
  "Оплата": "Payment",
  "Помісячна": "Monthly",
  "Разова": "One-time",
  "Погодинна": "Hourly",
  "Сума оплати": "Payment amount",
  "Наприклад, 1200": "For example, 1200",
  "Короткий опис": "Short description",
  "Досвід, методи роботи, формат занять": "Experience, methods, session format",
  "Надіслати на модерацію": "Send for moderation",
  "Довідник спеціалізацій": "Specialization guide",
  "Повний перелік ролей для каталогу": "Full list of roles for the directory",
  "Список зібрано за освітніми, реабілітаційними та медичними ролями, які найчастіше беруть участь у діагностиці, ранньому втручанні, корекційній роботі та супроводі родини.":
    "The list is organized by educational, rehabilitation, and medical roles that most often support diagnostics, early intervention, corrective work, and family support.",
  "Список зібрано за освітніми, реабілітаційними та медичними ролями, які найчастіше беруть участь\n            у діагностиці, ранньому втручанні, корекційній роботі та супроводі родини.":
    "The list is organized by educational, rehabilitation, and medical roles that most often support diagnostics, early intervention, corrective work, and family support.",
  "Відгуки батьків": "Parent reviews",
  "Відгуки про фахівця": "Reviews for the specialist",
  "Дата:": "Date:",
  "Оцінка:": "Rating:",
  "Лайк": "Like",
  "Дизлайк": "Dislike",
  "Вподобати відгук": "Like review",
  "Не вподобати відгук": "Dislike review",
  "Оцінка коментаря": "Comment rating",
  "середня оцінка за опублікованими відгуками": "average rating from published reviews",
  "Розподіл оцінок": "Rating distribution",
  "Марина, мама": "Maryna, mother",
  "Фахівчиня заздалегідь уточнила цілі, після заняття надіслала короткий план і вправи для дому. Дуже цінно, що можна писати всередині сервісу.":
    "The specialist clarified the goals in advance and sent a short plan and home exercises after the session. It is very helpful to message inside the service.",
  "Фахівчиня заздалегідь уточнила цілі, після заняття надіслала короткий план і вправи для дому.\n              Дуже цінно, що можна писати всередині сервісу.":
    "The specialist clarified the goals in advance and sent a short plan and home exercises after the session. It is very helpful to message inside the service.",
  "Олег, тато підлітка": "Oleh, father of a teenager",
  "Знайшли нейропсихолога з досвідом роботи зі школою. Відгуки допомогли зрозуміти стиль спілкування до першої зустрічі.":
    "We found a neuropsychologist with school experience. Reviews helped us understand the communication style before the first meeting.",
  "Ірина, мама": "Iryna, mother",
  "Після першої зустрічі отримали короткий план вправ і зрозуміли, як займатися вдома без перевантаження.":
    "After the first meeting, we received a short exercise plan and understood how to practice at home without overload.",
  "Андрій, тато": "Andrii, father",
  "Сподобалося, що фахівець пояснив цілі простими словами й уточнив, які зміни відстежувати щотижня.":
    "I liked that the specialist explained the goals in simple words and clarified which changes to track each week.",
  "Світлана, мама": "Svitlana, mother",
  "Консультація допомогла узгодити дії родини та школи. Окремо ціную спокійний тон спілкування.":
    "The consultation helped align the family and school. I especially value the calm communication style.",
  "Наталя, мама": "Nataliia, mother",
  "Побачили чітку структуру занять і домашніх кроків. Дитині було комфортно, без тиску.":
    "We saw a clear structure for sessions and home steps. The child felt comfortable, without pressure.",
  "Юлія, мама": "Yuliia, mother",
  "Фахівець уважно зібрав дані перед стартом і показав, як фіксувати прогрес у побутових ситуаціях.":
    "The specialist carefully gathered data before starting and showed how to record progress in everyday situations.",
  "Максим, тато": "Maksym, father",
  "Добре, що батьків включають у процес: після сесії є конкретні вправи й зрозумілі критерії успіху.":
    "It is good that parents are included in the process: after the session there are specific exercises and clear success criteria.",
  "Олена, мама": "Olena, mother",
  "Отримали корисні поради для дому: як організувати сенсорні паузи, робоче місце й побутові задачі.":
    "We received useful home advice: how to organize sensory breaks, the workspace, and daily tasks.",
  "Тарас, тато": "Taras, father",
  "Пояснення були практичними. Частину рекомендацій змогли застосувати вже наступного дня.":
    "The explanations were practical. We were able to apply part of the recommendations the next day.",
  "Вікторія, мама": "Viktoriia, mother",
  "Команда подивилася на запит комплексно й запропонувала пріоритети без зайвих призначень.":
    "The team looked at the request comprehensively and suggested priorities without unnecessary referrals.",
  "Роман, тато": "Roman, father",
  "Сподобалося, що після консультації був короткий висновок і зрозумілий маршрут наступних кроків.":
    "I liked that after the consultation there was a short summary and a clear route for next steps.",
  "Додати відгук": "Add a review",
  "Залишити відгук": "Leave a review",
  "Оцінка": "Rating",
  "Відгук": "Review",
  "Що було корисно родині": "What was helpful for the family",
  "Надіслати на перевірку": "Send for review",
  "Переглянути заявки родин": "View family requests",
  "Панель адміністратора": "Admin panel",
  "Оголошення": "Listings",
  "Скарги": "Reports",
  "Скарга": "Report",
  "Користувачі": "Users",
  "Вийти з панелі": "Exit panel",
  "Оголошення на перевірці": "Listings under review",
  "Пошук": "Search",
  "Ім'я, місто, скарга": "Name, city, report",
  "На перевірці": "Under review",
  "Завершується": "Expiring",
  "Завершуються за 3 дні": "Expiring in 3 days",
  "Скарги за тиждень": "Reports this week",
  "Зняті автоматично": "Auto-removed",
  "Черга оголошень": "Listing queue",
  "Фахівець": "Specialist",
  "Статус": "Status",
  "До зняття": "Until removal",
  "Дії": "Actions",
  "Закрити": "Close",
  "Повідомлення": "Messages",
  "Написати фахівцю": "Message a specialist",
  "Коротко опишіть запит і зручний формат": "Briefly describe your request and preferred format",
  "Надіслати": "Send",
  "Безпечний вхід": "Secure login",
  "Вхід адміністратора": "Administrator login",
  "Пароль": "Password",
  "Відкрити панель": "Open panel",
  "Маршрут родини": "Family route",
  "З кого почати": "Where to start",
  "Це короткий орієнтир для першого вибору фахівця. Він не замінює медичну консультацію, але допомагає зрозуміти, які ролі можуть бути корисними для мовлення, поведінки, моторики та навчання.":
    "This is a short guide for choosing the first specialist. It does not replace medical consultation, but helps clarify which roles may be useful for speech, behavior, motor skills, and learning.",
  "Якщо є сумніви щодо розвитку, почніть із педіатра розвитку, дитячого невролога або психолога.":
    "If you have concerns about development, start with a developmental pediatrician, child neurologist, or psychologist.",
  "Для мовлення й комунікації зверніть увагу на логопеда, фахівця AAC або сурдолога/аудіолога.":
    "For speech and communication, look for a speech therapist, AAC specialist, or hearing specialist/audiologist.",
  "Для навичок самообслуговування, сенсорної регуляції та моторики підійдуть ерготерапевт і фізичний терапевт.":
    "For self-care skills, sensory regulation, and motor skills, occupational and physical therapists may help.",
  "Для поведінки, адаптації та навчального середовища додайте ABA-фахівця, тьютора або спеціального педагога.":
    "For behavior, adaptation, and the learning environment, add an ABA specialist, tutor, or special educator.",
  "Очно": "In person",
  "Онлайн": "Online",
  "Виїзд": "Home visit",
  "Київ": "Kyiv",
  "Львів": "Lviv",
  "Одеса": "Odesa",
  "Дніпро": "Dnipro",
  "сьогодні, 16:30": "today, 16:30",
  "завтра, 10:00": "tomorrow, 10:00",
  "сьогодні, 18:00": "today, 18:00",
  "післязавтра, 09:30": "the day after tomorrow, 09:30",
  "п'ятниця, 12:00": "Friday, 12:00",
  "Усі фахівці": "All specialists",
  "Нічого не знайдено": "Nothing found",
  "Змініть місто, формат або спеціалізацію. У довіднику нижче є повний список ролей для розширення каталогу.":
    "Change the city, format, or specialization. The guide below has a full role list for expanding the directory.",
  "Документи перевірені": "Documents verified",
  "Деталі анкети": "Profile details",
  "Анкета фахівця": "Specialist profile",
  "Докладна анкета": "Detailed profile",
  "Детальніше": "Details",
  "Графік:": "Schedule:",
  "Нозології:": "Conditions:",
  "Ціна:": "Price:",
  "Рейтинг:": "Rating:",
  "Формат роботи:": "Work format:",
  "Термін оголошення:": "Listing term:",
  "Нозології, з якими працює": "Conditions and requests supported",
  "Освіта:": "Education:",
  "Досвід:": "Experience:",
  "Працює з:": "Works with:",
  "Для кого:": "For:",
  "Відповідає:": "Replies:",
  "Оголошення:": "Listing:",
  "Буде знято": "Will be removed",
  "Написати": "Message",
  "дн. до зняття": "days until removal",
  "1 дн. до зняття": "1 day until removal",
  "дн.": "days",
  "1 дн.": "1 day",
  "хв": "min",
  "Корекційно-педагогічні": "Corrective and educational",
  "Мовлення, навчання, адаптація середовища та спеціальні освітні маршрути.":
    "Speech, learning, environment adaptation, and special education pathways.",
  "Психологія і поведінка": "Psychology and behavior",
  "Оцінка розвитку, поведінкова підтримка, емоції, родина та соціальні навички.":
    "Developmental assessment, behavioral support, emotions, family, and social skills.",
  "Реабілітація і навички": "Rehabilitation and skills",
  "Самообслуговування, моторика, сенсорна регуляція, харчування та побутова самостійність.":
    "Self-care, motor skills, sensory regulation, feeding, and daily independence.",
  "Медицина і діагностика": "Medicine and diagnostics",
  "Діагностика, маршрутизація, супутні стани та медичне спостереження.":
    "Diagnostics, care routing, co-occurring conditions, and medical monitoring.",
  "Підтримка родини й освіти": "Family and education support",
  "Навігація послугами, права родини, інклюзія та комунікація зі школою або садком.":
    "Service navigation, family rights, inclusion, and communication with school or preschool.",
  "Логопед-дефектолог": "Speech and special education therapist",
  "Олігофренопедагог": "Intellectual disability educator",
  "Сурдопедагог": "Teacher of deaf/hard-of-hearing children",
  "Тифлопедагог": "Teacher of blind/low-vision children",
  "Спеціальний педагог": "Special educator",
  "Педагог раннього розвитку": "Early development educator",
  "Фахівець AAC": "AAC specialist",
  "Педагог з підготовки до школи": "School readiness educator",
  "Інструктор адаптивної фізкультури": "Adaptive physical education instructor",
  "Логопед": "Speech therapist",
  "Дефектолог": "Special education therapist",
  "Тьютор": "Tutor",
  "Дитячий психолог": "Child psychologist",
  "Клінічний психолог": "Clinical psychologist",
  "Нейропсихолог": "Neuropsychologist",
  "Дитячий психіатр": "Child psychiatrist",
  "Поведінковий аналітик": "Behavior analyst",
  "ABA-терапевт": "ABA therapist",
  "Ігровий терапевт": "Play therapist",
  "Арт-терапевт": "Art therapist",
  "Сімейний психолог": "Family psychologist",
  "Фахівець із соціальних навичок": "Social skills specialist",
  "Ерготерапевт": "Occupational therapist",
  "Фізичний терапевт": "Physical therapist",
  "Інструктор ЛФК": "Therapeutic exercise instructor",
  "Інструктор АФК": "Adaptive exercise instructor",
  "Фахівець із сенсорної інтеграції": "Sensory integration specialist",
  "Фахівець із харчування": "Feeding specialist",
  "Орально-моторний терапевт": "Oral-motor therapist",
  "Реабілітолог": "Rehabilitation specialist",
  "Ортезист": "Orthotist",
  "Фахівець із технічних засобів реабілітації": "Assistive technology specialist",
  "Педіатр розвитку": "Developmental pediatrician",
  "Педіатр": "Pediatrician",
  "Дитячий невролог": "Child neurologist",
  "Епілептолог": "Epileptologist",
  "Генетик": "Geneticist",
  "Сурдолог": "Hearing specialist",
  "Аудіолог": "Audiologist",
  "Офтальмолог": "Ophthalmologist",
  "Ортоптист": "Orthoptist",
  "Лікар ФРМ": "PM&R physician",
  "Ортопед": "Orthopedist",
  "Гастроентеролог": "Gastroenterologist",
  "Дієтолог": "Dietitian",
  "Лікар сну": "Sleep physician",
  "Координатор раннього втручання": "Early intervention coordinator",
  "Кейс-менеджер": "Case manager",
  "Соціальний працівник": "Social worker",
  "Консультант з ІПРА": "IPRA consultant",
  "Консультант з IEP/IFSP": "IEP/IFSP consultant",
  "Фахівець з інклюзії": "Inclusion specialist",
  "Юрист з освітніх прав": "Education rights lawyer",
  "Батьківський консультант": "Parent consultant",
  "Перекладач жестової мови": "Sign language interpreter",
  "Фахівець з орієнтації та мобільності": "Orientation and mobility specialist",
  "Центр раннього втручання": "Early intervention center",
  "Центр Гармонія": "Harmony Center",
  "ЦГ": "HC",
  "КС": "KS",
  "ІЛ": "IL",
  "ОЗ": "OZ",
  "Катерина Смирнова": "Kateryna Smyrnova",
  "Анна Кузнєцова": "Anna Kuznietsova",
  "Ігор Лебедєв": "Ihor Lebediev",
  "Ольга Захарова": "Olha Zakharova",
  "Марія Воронцова": "Mariia Vorontsova",
  "Олексій Фролов": "Oleksii Frolov",
  "Ольга Іванова": "Olha Ivanova",
  "Дмитро Соколов": "Dmytro Sokolov",
  "Психолог": "Psychologist",
  "Досвід 7 років. Працює із запуском мовлення, дизартрією та підготовкою домашньої програми.":
    "7 years of experience. Works on speech initiation, dysarthria, and home program preparation.",
  "Допомагає родинам вибудувати зрозумілу підтримку вдома та в школі.":
    "Helps families build clear support at home and at school.",
  "Веде поведінкові програми та навчає батьків відстежувати прогрес.":
    "Runs behavioral programs and teaches parents to track progress.",
  "Працює із самообслуговуванням, сенсорною регуляцією та дрібною моторикою.":
    "Works with self-care, sensory regulation, and fine motor skills.",
  "Командна робота: психолог, логопед, ерготерапевт і координатор родини.":
    "Team-based work: psychologist, speech therapist, occupational therapist, and family coordinator.",
  "ЗМР": "speech delay",
  "РАС (аутизм)": "ASD (autism)",
  "алалія": "alalia",
  "афазія": "aphasia",
  "фонетико-фонематичні порушення": "phonological and articulation disorders",
  "затримка психомовленнєвого розвитку": "psycho-speech developmental delay",
  "ехолалія": "echolalia",
  "дизартрія": "dysarthria",
  "ЗНМ": "developmental language disorder",
  "сенсомоторні труднощі": "sensorimotor difficulties",
  "шкільна дезадаптація": "school maladjustment",
  "селективний мутизм": "selective mutism",
  "емоційна дисрегуляція": "emotional dysregulation",
  "розлади навчання": "learning disorders",
  "поведінкові труднощі": "behavioral difficulties",
  "небажана поведінка": "challenging behavior",
  "тривожність": "anxiety",
  "аутизм": "autism",
  "СДУГ": "ADHD",
  "функціональна комунікація": "functional communication",
  "опозиційна поведінка": "oppositional behavior",
  "самоушкоджувальна поведінка": "self-injurious behavior",
  "навички спілкування": "communication skills",
  "ABC-аналіз": "ABC analysis",
  "сенсорна інтеграція": "sensory integration",
  "порушення сенсорної обробки": "sensory processing difficulties",
  "ДЦП": "cerebral palsy",
  "гіперчутливість до звуків": "sound hypersensitivity",
  "затримка моторного розвитку": "motor development delay",
  "моторика": "motor skills",
  "побутові навички": "daily living skills",
  "затримка загального розвитку": "global developmental delay",
  "генетичні синдроми": "genetic syndromes",
  "порушення харчування": "feeding difficulties",
  "команда": "team",
  "діагностика": "diagnostics",
  "раннє втручання": "early intervention",
  "Запуск мовлення, звуковимова та домашня програма для родини":
    "Speech initiation, sound production, and a home program for the family",
  "НПУ ім. Драгоманова, логопедія; сертифікат із запуску мовлення":
    "Dragomanov NPU, speech therapy; speech initiation certificate",
  "7 років практики": "7 years of practice",
  "ЗМР, ЗНМ, дизартрія, ехолалія": "speech delay, language disorder, dysarthria, echolalia",
  "дошкільнята, молодші школярі": "preschoolers, primary school children",
  "відповідає до 2 год": "replies within 2 hours",
  "Заняття з мовлення + план вправ для дому": "Speech session + home exercise plan",
  "запуск мовлення, звуковимова, комунікація": "speech initiation, sound production, communication",
  "онлайн або кабінет": "online or office",
  "На першій зустрічі визначає мовленнєвий профіль, узгоджує цілі та дає батькам зрозумілий план між заняттями.":
    "At the first meeting, defines the speech profile, agrees on goals, and gives parents a clear plan between sessions.",
  "Психологічна підтримка родини, адаптація до школи та емоційна регуляція":
    "Psychological family support, school adaptation, and emotional regulation",
  "КНУ ім. Шевченка, клінічна психологія; навчання з КПТ для дітей":
    "Taras Shevchenko National University, clinical psychology; CBT training for children",
  "9 років практики": "9 years of practice",
  "тривожність, аутизм, СДУГ, поведінкові труднощі": "anxiety, autism, ADHD, behavioral difficulties",
  "діти, підлітки, батьки": "children, teenagers, parents",
  "відповідає протягом дня": "replies during the day",
  "Консультація психолога для родини": "Family psychologist consultation",
  "емоції, адаптація, підтримка школи": "emotions, adaptation, school support",
  "онлайн": "online",
  "Після консультації надсилає короткий підсумок, рекомендації для дому та питання для узгодження зі школою.":
    "After the consultation, sends a short summary, home recommendations, and questions to align with school.",
  "ABA-програма, розвиток комунікації та навчання батьків":
    "ABA program, communication development, and parent training",
  "Сертифікована ABA-підготовка; супервізії з поведінковим аналітиком":
    "Certified ABA training; supervision with a behavior analyst",
  "6 років практики": "6 years of practice",
  "аутизм, функціональна комунікація, небажана поведінка": "autism, functional communication, challenging behavior",
  "дошкільнята, школярі, родини": "preschoolers, school children, families",
  "відповідає до 3 год": "replies within 3 hours",
  "Індивідуальна ABA-сесія з планом навичок": "Individual ABA session with a skills plan",
  "комунікація, самостійність, поведінковий аналіз": "communication, independence, behavior analysis",
  "кабінет або виїзд": "office or home visit",
  "Перед стартом збирає дані від родини, формує цілі навичок і показує, як відстежувати прогрес між зустрічами.":
    "Before starting, gathers family data, sets skill goals, and shows how to track progress between meetings.",
  "Ерготерапія, сенсорна регуляція та побутова самостійність":
    "Occupational therapy, sensory regulation, and daily independence",
  "НУФВСУ, ерготерапія; курси із сенсорної інтеграції":
    "National University of Ukraine on Physical Education and Sport, occupational therapy; sensory integration courses",
  "5 років практики": "5 years of practice",
  "сенсорна регуляція, моторика, самообслуговування": "sensory regulation, motor skills, self-care",
  "дошкільнята, молодші школярі, батьки": "preschoolers, primary school children, parents",
  "відповідає до 4 год": "replies within 4 hours",
  "Ерготерапевтичне заняття + домашня адаптація": "Occupational therapy session + home adaptation",
  "сенсорний профіль, моторика, побутові навички": "sensory profile, motor skills, daily living skills",
  "кабінет": "office",
  "Пояснює, як адаптувати побутові задачі, робоче місце та сенсорні паузи без перевантаження родини.":
    "Explains how to adapt daily tasks, the workspace, and sensory breaks without overloading the family.",
  "Командна оцінка розвитку та маршрут раннього втручання":
    "Team developmental assessment and early intervention route",
  "Мультидисциплінарна команда: психолог, логопед, ерготерапевт, координатор":
    "Multidisciplinary team: psychologist, speech therapist, occupational therapist, coordinator",
  "12 років роботи центру": "12 years of center practice",
  "раннє втручання, діагностика, супровід родини": "early intervention, diagnostics, family support",
  "родини з дітьми раннього та дошкільного віку": "families with toddlers and preschool children",
  "відповідає до 1 робочого дня": "replies within 1 business day",
  "Первинна командна консультація": "Initial team consultation",
  "оцінка розвитку, план занять, координація послуг": "developmental assessment, session plan, service coordination",
  "центр або виїзд": "center or home visit",
  "Після зустрічі родина отримує короткий висновок, пріоритети підтримки та пропозицію наступних фахівців.":
    "After the meeting, the family receives a short summary, support priorities, and recommended next specialists.",
  "Деталі оголошення": "Listing details",
  "Строк": "Term",
  "Нотатка модератора": "Moderator note",
  "Скарги й відгуки": "Reports and reviews",
  "До архіву": "Archive",
  "Продовжити на 30 днів": "Renew for 30 days",
  "Відкрити": "Open",
  "Схвалити": "Approve",
  "Відхилити": "Reject",
  "сьогодні": "today",
  "днів до автоматичного зняття": "days until automatic removal",
  "знімається автоматично": "removed automatically",
  "Перевірити диплом і сертифікат із запуску мовлення.": "Check diploma and speech initiation certificate.",
  "Є скарга на непідтверджену інформацію про досвід.": "There is a report about unverified experience information.",
  "Строк публікації завершується, надіслано нагадування про продовження.":
    "The publication term is ending; a renewal reminder was sent.",
  "Перевірити опис послуг для підлітків.": "Check the description of services for teenagers.",
  "Батьки запитують, чи працює фахівчиня з ехолалією.": "Parents ask whether the specialist works with echolalia.",
  "Модератор запросив уточнення щодо сертифіката BCBA/QBA.": "The moderator requested clarification on the BCBA/QBA certificate.",
  "Фахівчиня просить продовжити оголошення після оплати.": "The specialist asks to renew the listing after payment.",
  "Батьки уточнюють формат сімейної консультації.": "Parents are clarifying the family consultation format.",
  "Написати:": "Message:",
  "Добрий день. Підкажіть, будь ласка, чи працюєте ви із запитом:": "Hello. Please tell me whether you work with this request:",
  "Так, можу підказати маршрут і запропонувати перше вікно:": "Yes, I can suggest a route and offer the first slot:",
  "Дизлайк повідомлення": "Dislike message",
  "Усі повідомлення в цій розмові видалені автоматично після 3 унікальних дизлайків.":
    "All messages in this conversation were automatically removed after 3 unique dislikes.",
  "Повідомлення надіслано. Воно буде автоматично видалене після 3 унікальних дизлайків.":
    "Message sent. It will be automatically removed after 3 unique dislikes.",
  "Нове оголошення створене фахівцем і очікує перевірки документів.":
    "A new listing was created by a specialist and is waiting for document review.",
  "Чернетку надіслано на модерацію. Адміністратор побачить її в черзі.":
    "Draft sent for moderation. The administrator will see it in the queue.",
  "Відгук надіслано модератору на перевірку.": "Review sent to the moderator for approval."
};

let currentLang = localStorage.getItem("siteLanguage") === "en" ? "en" : "uk";
const textNodeOriginals = new WeakMap();
const attrOriginals = new WeakMap();
const translatableAttributes = ["placeholder", "aria-label", "alt", "title"];
const initialPageTitle = document.title;
const initialPageDescription = document.querySelector('meta[name="description"]')?.getAttribute("content") || "";

const specialtyGroups = [
  {
    title: "Корекційно-педагогічні",
    description: "Мовлення, навчання, адаптація середовища та спеціальні освітні маршрути.",
    items: [
      "Логопед",
      "Логопед-дефектолог",
      "Дефектолог",
      "Олігофренопедагог",
      "Сурдопедагог",
      "Тифлопедагог",
      "Спеціальний педагог",
      "Педагог раннього розвитку",
      "Тьютор",
      "Фахівець AAC",
      "Педагог з підготовки до школи",
      "Інструктор адаптивної фізкультури"
    ]
  },
  {
    title: "Психологія і поведінка",
    description: "Оцінка розвитку, поведінкова підтримка, емоції, родина та соціальні навички.",
    items: [
      "Дитячий психолог",
      "Клінічний психолог",
      "Нейропсихолог",
      "Дитячий психіатр",
      "Поведінковий аналітик",
      "ABA-терапевт",
      "Ігровий терапевт",
      "Арт-терапевт",
      "Сімейний психолог",
      "Фахівець із соціальних навичок"
    ]
  },
  {
    title: "Реабілітація і навички",
    description: "Самообслуговування, моторика, сенсорна регуляція, харчування та побутова самостійність.",
    items: [
      "Ерготерапевт",
      "Фізичний терапевт",
      "Інструктор ЛФК",
      "Інструктор АФК",
      "Фахівець із сенсорної інтеграції",
      "Фахівець із харчування",
      "Орально-моторний терапевт",
      "Реабілітолог",
      "Ортезист",
      "Фахівець із технічних засобів реабілітації"
    ]
  },
  {
    title: "Медицина і діагностика",
    description: "Діагностика, маршрутизація, супутні стани та медичне спостереження.",
    items: [
      "Педіатр розвитку",
      "Педіатр",
      "Дитячий невролог",
      "Епілептолог",
      "Генетик",
      "Сурдолог",
      "Аудіолог",
      "Офтальмолог",
      "Ортоптист",
      "Лікар ФРМ",
      "Ортопед",
      "Гастроентеролог",
      "Дієтолог",
      "Лікар сну"
    ]
  },
  {
    title: "Підтримка родини й освіти",
    description: "Навігація послугами, права родини, інклюзія та комунікація зі школою або садком.",
    items: [
      "Координатор раннього втручання",
      "Кейс-менеджер",
      "Соціальний працівник",
      "Консультант з ІПРА",
      "Консультант з IEP/IFSP",
      "Фахівець з інклюзії",
      "Юрист з освітніх прав",
      "Батьківський консультант",
      "Перекладач жестової мови",
      "Фахівець з орієнтації та мобільності"
    ]
  }
];

const listings = [
  {
    id: 1,
    name: "Катерина Смирнова",
    initials: "КС",
    specialty: "Логопед",
    city: "Київ",
    formats: ["Очно", "Онлайн"],
    rating: 4.9,
    reviews: 56,
    price: 1200,
    duration: 50,
    next: "сьогодні, 16:30",
    createdAt: "2026-05-25",
    status: "active",
    verified: true,
    headline: "Запуск мовлення, звуковимова та домашня програма для родини",
    education: "НПУ ім. Драгоманова, логопедія; сертифікат із запуску мовлення",
    experience: "7 років практики",
    worksWith: "ЗМР, ЗНМ, дизартрія, ехолалія",
    nosologies: ["ЗМР", "ЗНМ", "дизартрія", "ехолалія", "алалія", "афазія", "фонетико-фонематичні порушення"],
    audience: "дошкільнята, молодші школярі",
    response: "відповідає до 2 год",
    offer: {
      title: "Заняття з мовлення + план вправ для дому",
      focus: "запуск мовлення, звуковимова, комунікація",
      format: "онлайн або кабінет"
    },
    tags: ["ЗМР", "дизартрія", "ЗНМ"],
    about:
      "На першій зустрічі визначає мовленнєвий профіль, узгоджує цілі та дає батькам зрозумілий план між заняттями.",
    reviewItems: [
      {
        id: "r1-1",
        author: "Ірина, мама",
        date: "2026-06-03",
        rating: 5.0,
        text: "Після першої зустрічі отримали короткий план вправ і зрозуміли, як займатися вдома без перевантаження.",
        likes: 18,
        dislikes: 1
      },
      {
        id: "r1-2",
        author: "Андрій, тато",
        date: "2026-05-28",
        rating: 4.9,
        text: "Сподобалося, що фахівець пояснив цілі простими словами й уточнив, які зміни відстежувати щотижня.",
        likes: 12,
        dislikes: 0
      }
    ]
  },
  {
    id: 2,
    name: "Анна Кузнєцова",
    initials: "АК",
    specialty: "Клінічний психолог",
    city: "Онлайн",
    formats: ["Онлайн"],
    rating: 4.8,
    reviews: 34,
    price: 1500,
    duration: 50,
    next: "завтра, 10:00",
    createdAt: "2026-05-15",
    status: "active",
    verified: true,
    headline: "Психологічна підтримка родини, адаптація до школи та емоційна регуляція",
    education: "КНУ ім. Шевченка, клінічна психологія; навчання з КПТ для дітей",
    experience: "9 років практики",
    worksWith: "тривожність, аутизм, СДУГ, поведінкові труднощі",
    nosologies: ["РАС (аутизм)", "СДУГ", "тривожність", "шкільна дезадаптація", "селективний мутизм", "емоційна дисрегуляція", "розлади навчання"],
    audience: "діти, підлітки, батьки",
    response: "відповідає протягом дня",
    offer: {
      title: "Консультація психолога для родини",
      focus: "емоції, адаптація, підтримка школи",
      format: "онлайн"
    },
    tags: ["тривожність", "аутизм", "СДУГ"],
    about:
      "Після консультації надсилає короткий підсумок, рекомендації для дому та питання для узгодження зі школою.",
    reviewItems: [
      {
        id: "r2-1",
        author: "Світлана, мама",
        date: "2026-06-05",
        rating: 4.8,
        text: "Консультація допомогла узгодити дії родини та школи. Окремо ціную спокійний тон спілкування.",
        likes: 15,
        dislikes: 1
      },
      {
        id: "r2-2",
        author: "Наталя, мама",
        date: "2026-05-22",
        rating: 4.7,
        text: "Побачили чітку структуру занять і домашніх кроків. Дитині було комфортно, без тиску.",
        likes: 10,
        dislikes: 0
      }
    ]
  },
  {
    id: 3,
    name: "Ігор Лебедєв",
    initials: "ІЛ",
    specialty: "ABA-терапевт",
    city: "Львів",
    formats: ["Очно", "Виїзд"],
    rating: 5.0,
    reviews: 42,
    price: 1400,
    duration: 60,
    next: "сьогодні, 18:00",
    createdAt: "2026-06-01",
    status: "active",
    verified: true,
    headline: "ABA-програма, розвиток комунікації та навчання батьків",
    education: "Сертифікована ABA-підготовка; супервізії з поведінковим аналітиком",
    experience: "6 років практики",
    worksWith: "аутизм, функціональна комунікація, небажана поведінка",
    nosologies: ["РАС (аутизм)", "СДУГ", "функціональна комунікація", "опозиційна поведінка", "самоушкоджувальна поведінка", "сенсомоторні труднощі"],
    audience: "дошкільнята, школярі, родини",
    response: "відповідає до 3 год",
    offer: {
      title: "Індивідуальна ABA-сесія з планом навичок",
      focus: "комунікація, самостійність, поведінковий аналіз",
      format: "кабінет або виїзд"
    },
    tags: ["аутизм", "навички спілкування", "ABC-аналіз"],
    about:
      "Перед стартом збирає дані від родини, формує цілі навичок і показує, як відстежувати прогрес між зустрічами.",
    reviewItems: [
      {
        id: "r3-1",
        author: "Юлія, мама",
        date: "2026-06-01",
        rating: 5.0,
        text: "Фахівець уважно зібрав дані перед стартом і показав, як фіксувати прогрес у побутових ситуаціях.",
        likes: 21,
        dislikes: 2
      },
      {
        id: "r3-2",
        author: "Максим, тато",
        date: "2026-05-26",
        rating: 4.9,
        text: "Добре, що батьків включають у процес: після сесії є конкретні вправи й зрозумілі критерії успіху.",
        likes: 17,
        dislikes: 1
      }
    ]
  },
  {
    id: 4,
    name: "Ольга Захарова",
    initials: "ОЗ",
    specialty: "Ерготерапевт",
    city: "Одеса",
    formats: ["Очно"],
    rating: 4.9,
    reviews: 27,
    price: 1300,
    duration: 45,
    next: "післязавтра, 09:30",
    createdAt: "2026-06-08",
    status: "active",
    verified: true,
    headline: "Ерготерапія, сенсорна регуляція та побутова самостійність",
    education: "НУФВСУ, ерготерапія; курси із сенсорної інтеграції",
    experience: "5 років практики",
    worksWith: "сенсорна регуляція, моторика, самообслуговування",
    nosologies: ["порушення сенсорної обробки", "ДЦП", "затримка моторного розвитку", "гіперчутливість до звуків", "сенсомоторні труднощі", "побутові навички"],
    audience: "дошкільнята, молодші школярі, батьки",
    response: "відповідає до 4 год",
    offer: {
      title: "Ерготерапевтичне заняття + домашня адаптація",
      focus: "сенсорний профіль, моторика, побутові навички",
      format: "кабінет"
    },
    tags: ["сенсорна інтеграція", "моторика", "побутові навички"],
    about:
      "Пояснює, як адаптувати побутові задачі, робоче місце та сенсорні паузи без перевантаження родини.",
    reviewItems: [
      {
        id: "r4-1",
        author: "Олена, мама",
        date: "2026-06-07",
        rating: 4.9,
        text: "Отримали корисні поради для дому: як організувати сенсорні паузи, робоче місце й побутові задачі.",
        likes: 14,
        dislikes: 0
      },
      {
        id: "r4-2",
        author: "Тарас, тато",
        date: "2026-05-30",
        rating: 4.8,
        text: "Пояснення були практичними. Частину рекомендацій змогли застосувати вже наступного дня.",
        likes: 9,
        dislikes: 1
      }
    ]
  },
  {
    id: 5,
    name: "Центр Гармонія",
    initials: "ЦГ",
    specialty: "Центр раннього втручання",
    city: "Дніпро",
    formats: ["Очно", "Виїзд"],
    rating: 4.7,
    reviews: 88,
    price: 1800,
    duration: 60,
    next: "п'ятниця, 12:00",
    createdAt: "2026-05-10",
    status: "active",
    verified: true,
    headline: "Командна оцінка розвитку та маршрут раннього втручання",
    education: "Мультидисциплінарна команда: психолог, логопед, ерготерапевт, координатор",
    experience: "12 років роботи центру",
    worksWith: "раннє втручання, діагностика, супровід родини",
    nosologies: ["затримка загального розвитку", "РАС (аутизм)", "ДЦП", "генетичні синдроми", "порушення харчування", "затримка психомовленнєвого розвитку"],
    audience: "родини з дітьми раннього та дошкільного віку",
    response: "відповідає до 1 робочого дня",
    offer: {
      title: "Первинна командна консультація",
      focus: "оцінка розвитку, план занять, координація послуг",
      format: "центр або виїзд"
    },
    tags: ["команда", "діагностика", "раннє втручання"],
    about:
      "Після зустрічі родина отримує короткий висновок, пріоритети підтримки та пропозицію наступних фахівців.",
    reviewItems: [
      {
        id: "r5-1",
        author: "Вікторія, мама",
        date: "2026-06-04",
        rating: 4.8,
        text: "Команда подивилася на запит комплексно й запропонувала пріоритети без зайвих призначень.",
        likes: 24,
        dislikes: 2
      },
      {
        id: "r5-2",
        author: "Роман, тато",
        date: "2026-05-24",
        rating: 4.7,
        text: "Сподобалося, що після консультації був короткий висновок і зрозумілий маршрут наступних кроків.",
        likes: 16,
        dislikes: 1
      }
    ]
  }
];

let moderationItems = [
  {
    id: 101,
    name: "Марія Воронцова",
    specialty: "Логопед",
    city: "Київ",
    status: "pending",
    createdAt: "2026-06-10",
    reports: 0,
    notes: "Перевірити диплом і сертифікат із запуску мовлення.",
    message: "Батьки запитують, чи працює фахівчиня з ехолалією."
  },
  {
    id: 102,
    name: "Олексій Фролов",
    specialty: "ABA-терапевт",
    city: "Львів",
    status: "reported",
    createdAt: "2026-05-14",
    reports: 3,
    notes: "Є скарга на непідтверджену інформацію про досвід.",
    message: "Модератор запросив уточнення щодо сертифіката BCBA/QBA."
  },
  {
    id: 103,
    name: "Ольга Іванова",
    specialty: "Ерготерапевт",
    city: "Одеса",
    status: "expiring",
    createdAt: "2026-05-16",
    reports: 0,
    notes: "Строк публікації завершується, надіслано нагадування про продовження.",
    message: "Фахівчиня просить продовжити оголошення після оплати."
  },
  {
    id: 104,
    name: "Дмитро Соколов",
    specialty: "Психолог",
    city: "Онлайн",
    status: "pending",
    createdAt: "2026-06-09",
    reports: 0,
    notes: "Перевірити опис послуг для підлітків.",
    message: "Батьки уточнюють формат сімейної консультації."
  }
];

let sortMode = "recommended";
let selectedCategory = "all";
let selectedModerationId = moderationItems[0].id;
let reviewVotes = {};
let messageDislikes = {};
let activeChatMessages = [];

try {
  reviewVotes = JSON.parse(localStorage.getItem("reviewVotes") || "{}");
} catch {
  reviewVotes = {};
}

try {
  messageDislikes = JSON.parse(localStorage.getItem("messageDislikes") || "{}");
} catch {
  messageDislikes = {};
}

const allSpecialties = [...new Set(specialtyGroups.flatMap((group) => group.items))].sort((a, b) =>
  a.localeCompare(b, "uk")
);

const elements = {
  cityFilter: document.querySelector("#cityFilter"),
  specialtyFilter: document.querySelector("#specialtyFilter"),
  formatFilter: document.querySelector("#formatFilter"),
  publishSpecialty: document.querySelector("#publishSpecialty"),
  categoryList: document.querySelector("#categoryList"),
  listingList: document.querySelector("#listingList"),
  resultCount: document.querySelector("#resultCount"),
  specialtyGrid: document.querySelector("#specialtyGrid"),
  messageDrawer: document.querySelector("#messageDrawer"),
  chatThread: document.querySelector("#chatThread"),
  specialistModal: document.querySelector("#specialistModal"),
  specialistDetail: document.querySelector("#specialistDetail"),
  adminModal: document.querySelector("#adminModal"),
  guideModal: document.querySelector("#guideModal"),
  adminPanel: document.querySelector("#adminPanel"),
  moderationRows: document.querySelector("#moderationRows"),
  moderationDetail: document.querySelector("#moderationDetail"),
  metricPending: document.querySelector("#metricPending"),
  metricExpiring: document.querySelector("#metricExpiring"),
  metricReports: document.querySelector("#metricReports"),
  metricArchived: document.querySelector("#metricArchived"),
  adminSearch: document.querySelector("#adminSearch")
};

function daysBetween(startDate, endDate = today) {
  const start = new Date(`${startDate}T12:00:00`);
  return Math.floor((endDate - start) / 86400000);
}

function daysLeft(item) {
  return expirationDays - daysBetween(item.createdAt);
}

function formatReviewDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString(currentLang === "en" ? "en-US" : "uk-UA", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

function reviewCounts(review) {
  const vote = reviewVotes[review.id];
  return {
    likes: review.likes + (vote === "like" ? 1 : 0),
    dislikes: review.dislikes + (vote === "dislike" ? 1 : 0),
    vote
  };
}

function saveReviewVotes() {
  localStorage.setItem("reviewVotes", JSON.stringify(reviewVotes));
}

function saveMessageDislikes() {
  localStorage.setItem("messageDislikes", JSON.stringify(messageDislikes));
}

function currentMessageViewerId() {
  const stored = localStorage.getItem("demoMessageViewerId");
  if (stored) return stored;
  const viewerId = `viewer-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  localStorage.setItem("demoMessageViewerId", viewerId);
  return viewerId;
}

function escapeHtml(value) {
  const replacements = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return String(value).replace(/[&<>"']/g, (char) => replacements[char]);
}

function messageDislikeCount(messageId) {
  return new Set(messageDislikes[messageId] || []).size;
}

function isMessageDeleted(messageId) {
  return messageDislikeCount(messageId) >= 3;
}

function renderChatMessage(message) {
  const dislikes = messageDislikeCount(message.id);
  const dislikedByViewer = (messageDislikes[message.id] || []).includes(currentMessageViewerId());

  return `
    <div class="chat-message ${message.reply ? "is-reply" : ""}" data-chat-message="${message.id}">
      <div class="chat-bubble ${message.reply ? "reply" : ""}">${escapeHtml(message.text)}</div>
      <button
        class="message-dislike ${dislikedByViewer ? "is-active" : ""}"
        type="button"
        data-message-dislike="${message.id}"
        aria-label="Дизлайк повідомлення"
      >
        <span aria-hidden="true">&#128078;</span>
        <span>${dislikes}</span>
      </button>
    </div>
  `;
}

function renderChatMessages() {
  if (!elements.chatThread) return;
  const visibleMessages = activeChatMessages.filter((message) => !isMessageDeleted(message.id));

  elements.chatThread.innerHTML = visibleMessages.length
    ? visibleMessages.map((message) => renderChatMessage(message)).join("")
    : `<p class="chat-empty">Усі повідомлення в цій розмові видалені автоматично після 3 унікальних дизлайків.</p>`;
  applyLanguage(elements.chatThread);
}

function handleMessageDislike(messageId) {
  if (!messageId) return;
  const viewerId = currentMessageViewerId();
  const voters = new Set(messageDislikes[messageId] || []);

  if (voters.has(viewerId)) {
    voters.delete(viewerId);
  } else {
    voters.add(viewerId);
  }

  messageDislikes[messageId] = [...voters];
  saveMessageDislikes();
  renderChatMessages();
}

function statusLabel(status) {
  const labels = {
    pending: "На перевірці",
    reported: "Скарга",
    expiring: "Завершується",
    approved: "Схвалено",
    rejected: "Відхилено",
    archived: "Архів"
  };
  return labels[status] || status;
}

function statusClass(status, remaining) {
  if (status === "reported" || status === "rejected") return "danger";
  if (status === "expiring" || remaining <= 3) return "warning";
  return "";
}

function translateText(value, lang) {
  if (!value || lang === "uk") return value;
  return Object.entries(ukToEn)
    .sort((a, b) => b[0].length - a[0].length)
    .reduce((text, [uk, en]) => text.split(uk).join(en), value);
}

function applyLanguage(root = document.body) {
  if (!root) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach((node) => {
    if (!textNodeOriginals.has(node)) textNodeOriginals.set(node, node.nodeValue);
    node.nodeValue = translateText(textNodeOriginals.get(node), currentLang);
  });

  root.querySelectorAll?.("*").forEach((element) => {
    translatableAttributes.forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;
      if (!attrOriginals.has(element)) attrOriginals.set(element, {});
      const originals = attrOriginals.get(element);
      if (!originals[attribute]) originals[attribute] = element.getAttribute(attribute);
      element.setAttribute(attribute, translateText(originals[attribute], currentLang));
    });
  });
}

function updateLanguageButtons() {
  document.querySelectorAll("[data-lang-switch]").forEach((button) => {
    const isActive = button.dataset.langSwitch === currentLang;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function setLanguage(lang) {
  currentLang = lang === "en" ? "en" : "uk";
  localStorage.setItem("siteLanguage", currentLang);
  document.documentElement.lang = currentLang;
  document.title = translateText(initialPageTitle || pageMeta.uk.title, currentLang);
  document.querySelector('meta[name="description"]')?.setAttribute(
    "content",
    translateText(initialPageDescription || pageMeta.uk.description, currentLang)
  );
  updateLanguageButtons();
  applyLanguage();
}

function bindLanguageSwitch() {
  document.querySelectorAll("[data-lang-switch]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.langSwitch));
  });
}

function fillSelects() {
  const specialtyOptions = [`<option value="all">Будь-яка</option>`]
    .concat(allSpecialties.map((item) => `<option value="${item}">${item}</option>`))
    .join("");
  if (elements.specialtyFilter) {
    elements.specialtyFilter.innerHTML = specialtyOptions;
    applyLanguage(elements.specialtyFilter);
  }
  if (elements.publishSpecialty) {
    elements.publishSpecialty.innerHTML = allSpecialties.map((item) => `<option value="${item}">${item}</option>`).join("");
    applyLanguage(elements.publishSpecialty);
  }
}

function renderCategories() {
  if (!elements.categoryList) return;
  const featured = [
    "all",
    "Логопед",
    "Дефектолог",
    "Дитячий психолог",
    "Ерготерапевт",
    "Фізичний терапевт",
    "ABA-терапевт",
    "Тьютор",
    "Педіатр розвитку"
  ];

  elements.categoryList.innerHTML = featured
    .map((item) => {
      const count =
        item === "all"
          ? listings.filter((listing) => listing.status !== "archived").length
          : listings.filter((listing) => listing.specialty === item).length;
      const label = item === "all" ? "Усі фахівці" : item;
      return `
        <button class="category-item ${selectedCategory === item ? "is-active" : ""}" type="button" data-category="${item}">
          <span>${label}</span>
          <span>${count}</span>
        </button>
      `;
    })
    .join("");
  applyLanguage(elements.categoryList);
}

function filteredListings() {
  const city = elements.cityFilter?.value || "all";
  const specialty = elements.specialtyFilter?.value || "all";
  const format = elements.formatFilter?.value || "all";

  let result = listings.filter((listing) => {
    if (listing.status === "archived") return false;
    if (city !== "all" && listing.city !== city && !(city === "Онлайн" && listing.formats.includes("Онлайн"))) return false;
    if (specialty !== "all" && listing.specialty !== specialty) return false;
    if (selectedCategory !== "all" && listing.specialty !== selectedCategory) return false;
    if (format !== "all" && !listing.formats.includes(format)) return false;
    return true;
  });

  if (sortMode === "rating") {
    result = result.sort((a, b) => b.rating - a.rating);
  } else if (sortMode === "expires") {
    result = result.sort((a, b) => daysLeft(a) - daysLeft(b));
  } else {
    result = result.sort((a, b) => Number(b.verified) - Number(a.verified) || b.reviews - a.reviews);
  }

  return result;
}

function renderListings() {
  if (!elements.listingList || !elements.resultCount) return;
  const data = filteredListings();
  elements.resultCount.textContent = data.length;

  if (!data.length) {
    elements.listingList.innerHTML = `
      <div class="listing-card">
        <div class="avatar">?</div>
        <div class="listing-main">
          <h3>Нічого не знайдено</h3>
          <p>Змініть місто, формат або спеціалізацію. У довіднику нижче є повний список ролей для розширення каталогу.</p>
        </div>
      </div>
    `;
    return;
  }

  elements.listingList.innerHTML = data
    .map((listing) => {
      const remaining = daysLeft(listing);
      const expiring = remaining <= 3;
      const visibleNosologies = listing.nosologies.slice(0, 3).join(", ");
      const hiddenNosologyCount = listing.nosologies.length - 3;
      return `
        <article class="listing-card listing-card-compact ${expiring ? "is-expiring" : ""}">
          <div class="avatar" aria-hidden="true">${listing.initials}</div>
          <div class="listing-main">
            <h3>${listing.name}</h3>
            <div class="compact-stats">
              <span class="compact-nosologies"><strong>Нозології:</strong> ${visibleNosologies}${hiddenNosologyCount > 0 ? ` +${hiddenNosologyCount}` : ""}</span>
              <span class="rating"><span class="star">★</span>${listing.rating.toFixed(1)} <small>(${listing.reviews})</small></span>
              <span class="price">${listing.price.toLocaleString("uk-UA")} ₴ / ${listing.duration} хв</span>
            </div>
          </div>
          <div class="listing-actions">
            <button class="secondary-button" type="button" data-details="${listing.id}">Детальніше</button>
            <button class="primary-button" type="button" data-message="${listing.id}">Написати</button>
          </div>
        </article>
      `;
    })
    .join("");
  applyLanguage(elements.listingList);
}

function renderSpecialtyGrid() {
  if (!elements.specialtyGrid) return;
  elements.specialtyGrid.innerHTML = specialtyGroups
    .map(
      (group) => `
        <article class="specialty-card">
          <h3>${group.title}</h3>
          <p>${group.description}</p>
          <ul>
            ${group.items.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");
  applyLanguage(elements.specialtyGrid);
}

function renderSpecialistReviews(listing) {
  return `
    <section class="specialist-reviews" aria-label="Відгуки про фахівця">
      <div class="review-section-head">
        <div>
          <p class="section-note">Відгуки батьків</p>
          <h3>Відгуки про фахівця</h3>
        </div>
        <span class="rating"><span class="star">★</span>${listing.rating.toFixed(1)} <small>(${listing.reviews})</small></span>
      </div>
      <div class="profile-review-list">
        ${listing.reviewItems
          .map((review) => {
            const counts = reviewCounts(review);
            return `
              <article class="profile-review">
                <div class="profile-review-top">
                  <div>
                    <strong>${review.author}</strong>
                    <span>Дата: ${formatReviewDate(review.date)}</span>
                  </div>
                  <span class="rating"><span class="star">★</span>${review.rating.toFixed(1)}</span>
                </div>
                <p>${review.text}</p>
                <div class="review-reactions" aria-label="Оцінка коментаря">
                  <button class="reaction-button ${counts.vote === "like" ? "is-active" : ""}" type="button" data-review-vote data-review-id="${review.id}" data-vote="like" aria-label="Вподобати відгук">
                    <span aria-hidden="true">&#128077;</span>
                    <span>${counts.likes}</span>
                  </button>
                  <button class="reaction-button ${counts.vote === "dislike" ? "is-active" : ""}" type="button" data-review-vote data-review-id="${review.id}" data-vote="dislike" aria-label="Не вподобати відгук">
                    <span aria-hidden="true">&#128078;</span>
                    <span>${counts.dislikes}</span>
                  </button>
                </div>
              </article>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function openSpecialistDetails(listingId) {
  const listing = listings.find((item) => item.id === Number(listingId));
  if (!listing || !elements.specialistModal || !elements.specialistDetail) return;
  const remaining = daysLeft(listing);
  elements.specialistDetail.dataset.listingId = listing.id;
  elements.specialistDetail.innerHTML = `
    <div class="specialist-detail-head">
      <div class="avatar" aria-hidden="true">${listing.initials}</div>
      <div>
        <p class="section-note">Анкета фахівця</p>
        <h2 id="specialistDetailTitle">${listing.name}</h2>
        <p>${listing.specialty} · ${listing.city} · ${listing.formats.join(", ")}</p>
      </div>
    </div>
    <div class="specialist-summary">
      <span><strong>Рейтинг:</strong> <span class="star">★</span>${listing.rating.toFixed(1)} (${listing.reviews})</span>
      <span><strong>Ціна:</strong> ${listing.price.toLocaleString("uk-UA")} ₴ / ${listing.duration} хв</span>
      <span><strong>Графік:</strong> ${listing.next}</span>
      <span><strong>Термін оголошення:</strong> ${remaining > 0 ? `${remaining} дн. до зняття` : "Буде знято"}</span>
    </div>
    <p class="listing-subtitle">${listing.headline}</p>
    <p>${listing.about}</p>
    <div class="listing-facts" aria-label="Деталі анкети">
      <span><strong>Освіта:</strong> ${listing.education}</span>
      <span><strong>Досвід:</strong> ${listing.experience}</span>
      <span><strong>Працює з:</strong> ${listing.worksWith}</span>
      <span><strong>Для кого:</strong> ${listing.audience}</span>
      <span><strong>Відповідає:</strong> ${listing.response}</span>
      <span><strong>Формат роботи:</strong> ${listing.formats.join(", ")}</span>
    </div>
    <div class="listing-offer">
      <strong>Оголошення:</strong>
      <span>${listing.offer.title}</span>
      <small>${listing.offer.focus} · ${listing.offer.format}</small>
    </div>
    <section class="nosology-block">
      <h3>Нозології, з якими працює</h3>
      <div class="tag-row">
        ${listing.nosologies.map((item) => `<span class="tag">${item}</span>`).join("")}
      </div>
    </section>
    ${renderSpecialistReviews(listing)}
    <div class="tag-row">
      ${listing.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
      ${listing.verified ? `<span class="tag">Документи перевірені</span>` : ""}
    </div>
    <div class="detail-actions">
      <button class="primary-button" type="button" data-message="${listing.id}">Написати</button>
    </div>
  `;
  applyLanguage(elements.specialistDetail);
  openModal(elements.specialistModal);
}

function closeSpecialistDetails() {
  closeModal(elements.specialistModal);
}

function handleReviewVote(reviewId, vote) {
  if (!reviewId || !vote) return;
  if (reviewVotes[reviewId] === vote) {
    delete reviewVotes[reviewId];
  } else {
    reviewVotes[reviewId] = vote;
  }
  saveReviewVotes();

  const listingId = elements.specialistDetail?.dataset.listingId;
  if (listingId) openSpecialistDetails(listingId);
}

function openDrawer(listingId) {
  const listing = listings.find((item) => item.id === Number(listingId));
  const drawerTitle = document.querySelector("#drawerTitle");
  if (!listing || !elements.messageDrawer || !elements.chatThread || !drawerTitle) return;
  drawerTitle.textContent = `Написати: ${listing.name}`;
  activeChatMessages = [
    {
      id: `listing-${listing.id}-parent`,
      text: `Добрий день. Підкажіть, будь ласка, чи працюєте ви із запитом: ${listing.tags[0].toLowerCase()}?`,
      reply: false
    },
    {
      id: `listing-${listing.id}-specialist`,
      text: `Так, можу підказати маршрут і запропонувати перше вікно: ${listing.next}.`,
      reply: true
    }
  ];
  renderChatMessages();
  applyLanguage(elements.messageDrawer);
  elements.messageDrawer.classList.add("is-open");
  elements.messageDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
}

function closeDrawer() {
  if (!elements.messageDrawer) return;
  elements.messageDrawer.classList.remove("is-open");
  elements.messageDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");
}

function openModal(modal) {
  if (!modal) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function renderModeration() {
  if (!elements.moderationRows) return;
  const query = elements.adminSearch?.value.trim().toLowerCase() || "";
  const data = moderationItems.filter((item) => {
    const text = `${item.name} ${item.specialty} ${item.city} ${item.notes}`.toLowerCase();
    return text.includes(query);
  });

  elements.moderationRows.innerHTML = data
    .map((item) => {
      const remaining = daysLeft(item);
      return `
        <div class="table-row">
          <span><strong>${item.name}</strong><small>${item.notes}</small></span>
          <span>${item.specialty}</span>
          <span>${item.city}</span>
          <span><span class="status ${statusClass(item.status, remaining)}">${statusLabel(item.status)}</span></span>
          <span>${remaining > 0 ? `${remaining} дн.` : "сьогодні"}</span>
          <span class="row-actions">
            <button class="mini-button" type="button" data-detail="${item.id}">Відкрити</button>
            <button class="mini-button approve" type="button" data-action="approved" data-id="${item.id}">Схвалити</button>
            <button class="mini-button reject" type="button" data-action="rejected" data-id="${item.id}">Відхилити</button>
          </span>
        </div>
      `;
    })
    .join("");
  applyLanguage(elements.moderationRows);

  const selected = moderationItems.find((item) => item.id === selectedModerationId) || moderationItems[0];
  if (selected) renderModerationDetail(selected);
  renderMetrics();
}

function renderModerationDetail(item) {
  if (!elements.moderationDetail) return;
  selectedModerationId = item.id;
  const remaining = daysLeft(item);
  elements.moderationDetail.innerHTML = `
    <div>
      <p class="section-note">Деталі оголошення</p>
      <h3>${item.name}</h3>
    </div>
    <dl class="detail-list">
      <div><dt>Спеціалізація</dt><dd>${item.specialty}</dd></div>
      <div><dt>Місто</dt><dd>${item.city}</dd></div>
      <div><dt>Статус</dt><dd>${statusLabel(item.status)}</dd></div>
      <div><dt>Строк</dt><dd>${remaining > 0 ? `${remaining} днів до автоматичного зняття` : "знімається автоматично"}</dd></div>
      <div><dt>Нотатка модератора</dt><dd>${item.notes}</dd></div>
    </dl>
    <div class="message-card">
      <strong>Скарги й відгуки</strong>
      <p>${item.message}</p>
    </div>
    <button class="primary-button" type="button" data-action="approved" data-id="${item.id}">Схвалити</button>
    <button class="ghost-button" type="button" data-action="archived" data-id="${item.id}">До архіву</button>
    <button class="secondary-button" type="button" data-renew="${item.id}">Продовжити на 30 днів</button>
  `;
  applyLanguage(elements.moderationDetail);
}

function renderMetrics() {
  if (elements.metricPending) {
    elements.metricPending.textContent = moderationItems.filter((item) => item.status === "pending").length;
  }
  if (elements.metricExpiring) {
    elements.metricExpiring.textContent = moderationItems.filter((item) => daysLeft(item) <= 3 && item.status !== "archived").length;
  }
  if (elements.metricReports) {
    elements.metricReports.textContent = moderationItems.reduce((sum, item) => sum + item.reports, 0);
  }
  if (elements.metricArchived) {
    elements.metricArchived.textContent = moderationItems.filter((item) => item.status === "archived").length;
  }
}

function runExpirationSweep() {
  moderationItems = moderationItems.map((item) => {
    if (daysLeft(item) < 0 && item.status !== "approved") {
      return { ...item, status: "archived" };
    }
    return item;
  });
}

function renewItem(id) {
  const isoDate = today.toISOString().slice(0, 10);
  moderationItems = moderationItems.map((item) =>
    item.id === Number(id) ? { ...item, createdAt: isoDate, status: item.status === "archived" ? "pending" : item.status } : item
  );
  renderModeration();
}

function bindEvents() {
  document.querySelector("[data-menu-toggle]")?.addEventListener("click", () => {
    document.querySelector(".site-header")?.classList.toggle("is-open");
  });

  document.querySelector("#searchForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    selectedCategory = "all";
    renderCategories();
    renderListings();
  });

  [elements.cityFilter, elements.specialtyFilter, elements.formatFilter].forEach((control) => {
    control?.addEventListener("change", () => {
      selectedCategory = "all";
      renderCategories();
      renderListings();
    });
  });

  elements.categoryList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    selectedCategory = button.dataset.category;
    if (elements.specialtyFilter) elements.specialtyFilter.value = "all";
    renderCategories();
    renderListings();
  });

  document.querySelectorAll("[data-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      sortMode = button.dataset.sort;
      document.querySelectorAll("[data-sort]").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      renderListings();
    });
  });

  elements.listingList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-message]");
    const detailsButton = event.target.closest("[data-details]");
    if (button) openDrawer(button.dataset.message);
    if (detailsButton) openSpecialistDetails(detailsButton.dataset.details);
  });

  elements.specialistDetail?.addEventListener("click", (event) => {
    const messageButton = event.target.closest("[data-message]");
    const voteButton = event.target.closest("[data-review-vote]");
    if (messageButton) {
      closeSpecialistDetails();
      openDrawer(messageButton.dataset.message);
    }
    if (voteButton) {
      handleReviewVote(voteButton.dataset.reviewId, voteButton.dataset.vote);
    }
  });

  document.querySelector("[data-close-specialist]")?.addEventListener("click", closeSpecialistDetails);
  document.querySelector("[data-close-drawer]")?.addEventListener("click", closeDrawer);
  elements.messageDrawer?.addEventListener("click", (event) => {
    if (event.target === elements.messageDrawer) closeDrawer();
  });
  elements.chatThread?.addEventListener("click", (event) => {
    const dislikeButton = event.target.closest("[data-message-dislike]");
    if (dislikeButton) handleMessageDislike(dislikeButton.dataset.messageDislike);
  });

  document.querySelector("#messageForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const textarea = event.currentTarget.querySelector("textarea");
    const text = textarea.value.trim();
    if (!text) return;
    activeChatMessages.push({
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text,
      reply: false
    });
    renderChatMessages();
    textarea.value = "";
    const status = document.querySelector("#messageStatus");
    if (status) {
      status.textContent = "Повідомлення надіслано. Воно буде автоматично видалене після 3 унікальних дизлайків.";
      applyLanguage(status);
    }
  });

  document.querySelectorAll("[data-open-admin]").forEach((button) => {
    button.addEventListener("click", () => openModal(elements.adminModal));
  });

  document.querySelector("[data-close-admin]")?.addEventListener("click", () => closeModal(elements.adminModal));
  document.querySelector("#adminLoginForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    closeModal(elements.adminModal);
    if (elements.adminPanel) {
      elements.adminPanel.hidden = false;
      elements.adminPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    renderModeration();
  });

  document.querySelector("[data-exit-admin]")?.addEventListener("click", () => {
    if (elements.adminPanel) elements.adminPanel.hidden = true;
    const catalog = document.querySelector("#catalog");
    if (catalog) {
      catalog.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.href = "index.html";
    }
  });

  document.querySelectorAll("[data-open-guide]").forEach((button) => {
    button.addEventListener("click", () => openModal(elements.guideModal));
  });
  document.querySelector("[data-close-guide]")?.addEventListener("click", () => closeModal(elements.guideModal));

  [elements.adminModal, elements.guideModal, elements.specialistModal].forEach((modal) => {
    modal?.addEventListener("click", (event) => {
      if (event.target === modal) closeModal(modal);
    });
  });

  elements.adminSearch?.addEventListener("input", renderModeration);
  elements.moderationRows?.addEventListener("click", handleModerationClick);
  elements.moderationDetail?.addEventListener("click", handleModerationClick);

  document.querySelectorAll("[data-scroll-to]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(`#${button.dataset.scrollTo}`);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.querySelector("#publishForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formats = data.getAll("formats");
    const files = data
      .getAll("documents")
      .filter((file) => file && typeof file.name === "string" && file.name.trim());
    const fileNames = files.map((file) => file.name).join(", ");
    const district = data.get("district")?.trim();
    const autoDeleteDays = data.get("autoDeleteDays");
    const paymentType = data.get("paymentType");
    const paymentAmount = Number(data.get("paymentAmount") || 0).toLocaleString("uk-UA");
    const notes = [
      `Опис: ${data.get("description")}`,
      district ? `Район: ${district}` : "Район: не вказано",
      `Формати: ${formats.length ? formats.join(", ") : "не вказано"}`,
      `Автовидалення: ${autoDeleteDays} днів`,
      `Оплата: ${paymentType}, ${paymentAmount} ₴`,
      `Файли: ${fileNames || "не додано"}`
    ].join(" · ");
    moderationItems.unshift({
      id: Date.now(),
      name: data.get("name"),
      specialty: data.get("specialty"),
      city: district ? `${data.get("city")}, ${district}` : data.get("city"),
      status: "pending",
      createdAt: today.toISOString().slice(0, 10),
      reports: 0,
      notes,
      message: `Нове оголошення створене фахівцем і очікує перевірки документів. Вкладення: ${fileNames || "немає"}.`
    });
    const status = document.querySelector("#publishStatus");
    if (status) {
      status.textContent = "Чернетку надіслано на модерацію. Адміністратор побачить її в черзі.";
      applyLanguage(status);
    }
    event.currentTarget.reset();
    renderModeration();
  });

  document.querySelector("#reviewForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = document.querySelector("#reviewStatus");
    if (status) {
      status.textContent = "Відгук надіслано модератору на перевірку.";
      applyLanguage(status);
    }
    event.currentTarget.reset();
  });
}

function handleModerationClick(event) {
  const detailButton = event.target.closest("[data-detail]");
  const actionButton = event.target.closest("[data-action]");
  const renewButton = event.target.closest("[data-renew]");

  if (detailButton) {
    const item = moderationItems.find((entry) => entry.id === Number(detailButton.dataset.detail));
    if (item) renderModerationDetail(item);
    return;
  }

  if (actionButton) {
    const id = Number(actionButton.dataset.id);
    moderationItems = moderationItems.map((item) =>
      item.id === id ? { ...item, status: actionButton.dataset.action } : item
    );
    selectedModerationId = id;
    renderModeration();
    return;
  }

  if (renewButton) {
    renewItem(renewButton.dataset.renew);
  }
}

function init() {
  bindLanguageSwitch();
  fillSelects();
  runExpirationSweep();
  renderCategories();
  renderListings();
  renderSpecialtyGrid();
  renderModeration();
  bindEvents();
  setLanguage(currentLang);
  setInterval(() => {
    runExpirationSweep();
    renderModeration();
  }, 60000);
}

init();
