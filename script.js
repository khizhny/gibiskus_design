const today = new Date("2026-06-12T12:00:00");
const expirationDays = 30;
const lowRatingThreshold = 4.0;
const negativeReviewThreshold = 3.0;
const adminEmails = ["khizhny@gmail.com", "nadya.khizhnaya@gmail.com"];
const adminVoteWeight = 100;
const sqliteWasmUrl = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.wasm";
const sqliteScriptUrl = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js";
const pageMeta = {
  uk: {
    title: "Пошук фахівця - каталог фахівців для дітей з особливостями розвитку",
    description: "Сайт пошуку спеціалістів для дітей з ООП"
  },
  en: {
    title: "Specialist Search - directory of specialists for children with developmental differences",
    description: "Specialist search site for children with special educational needs"
  }
};

const ukToEn = {
  "Довідник": "Guide",
  "Довідник спеціальностей": "Specialty guide",
  "Редагування запису каталогу": "Catalog record editing",
  "Розділ": "Section",
  "Назва запису": "Record title",
  "Наприклад, Репетитор з алгебри": "For example, Algebra tutor",
  "Додати запис": "Add record",
  "Зберегти зміни": "Save changes",
  "Скасувати": "Cancel",
  "фахівців": "specialists",
  "Редагувати": "Edit",
  "Видалити": "Delete",
  "Запис додано.": "Record added.",
  "Запис оновлено.": "Record updated.",
  "Запис видалено.": "Record deleted.",
  "Такий запис уже є в цій категорії.": "This record already exists in this category.",
  "Неможливо видалити: до цього напрямку прив'язані фахівці.": "Cannot delete: specialists are linked to this specialty.",
  "Оберіть запис для редагування.": "Choose a record to edit.",
  "Пошук фахівця - каталог фахівців": "Specialist Search - specialist directory",
  "Пошук фахівця - довідник спеціалізацій": "Specialist Search - specialization guide",
  "Пошук фахівця - відгуки батьків": "Specialist Search - parent reviews",
  "Пошук фахівця - розмістити оголошення": "Specialist Search - post a listing",
  "Пошук фахівця - панель адміністратора": "Specialist Search - admin panel",
  "Подаючи заявку, ви підтверджуєте, що готові займатися з дітьми з ООП. А також згодні надавати ваші контактні дані батькам, користувачам даного сайту.":
    "By submitting an application, you confirm that you are ready to work with children with special educational needs. You also agree to provide your contact details to parents who use this site.",
  "Батьки пишуть через вбудовані повідомлення, а відгуки відображаються в анкеті фахівця.":
    "Parents message through the built-in chat, and reviews appear in the specialist profile.",
  "Ця платформа створена для того, щоб кожен міг швидко та зручно знайти фахівців, які працюють з людьми з ООП: педагогів, тренерів, викладачів, психологів та інших спеціалістів. Зрозуміло, доступно й без довгих пошуків.":
    "This platform was created so everyone can quickly and easily find specialists who work with people with special educational needs: educators, coaches, teachers, psychologists, and other professionals. Clear, accessible, and without long searches.",
  "Сайт пошуку спеціалістів для дітей з ООП":
    "Specialist search site for children with special educational needs",
  "Пошук за містом, форматом і спеціалізацією. Відгуки батьків, повідомлення всередині сервісу та оголошення, які автоматично знімаються з публікації через 30 днів без продовження.":
    "Search by city, format, and specialization. Parent reviews, in-service messaging, and listings that are automatically unpublished after 30 days unless renewed.",
  "Пошук за містом, форматом і спеціалізацією. Відгуки батьків, повідомлення всередині сервісу\n            та оголошення, які автоматично знімаються з публікації через 30 днів без продовження.":
    "Search by city, format, and specialization. Parent reviews, in-service messaging, and listings that are automatically unpublished after 30 days unless renewed.",
  "Пошук фахівця, на головну": "Specialist Search, home",
  "Пошук фахівця": "Specialist Search",
  "Відкрити меню": "Open menu",
  "Каталог": "Directory",
  "Фахівці": "Specialists",
  "Шукаю фахівця": "Find a specialist",
  "Я фахівець": "I am a specialist",
  "Довідник": "Guide",
  "Про сайт": "About",
  "Адміністратор": "Administrator",
  "Відгуки": "Reviews",
  "Для фахівців": "For specialists",
  "Увійти": "Log in",
  "Розмістити оголошення": "Post a listing",
  "Пошук фахівців": "Specialist search",
  "Місто": "City",
  "Район міста": "City district",
  "Будь-який район": "Any district",
  "Спеціалізація": "Specialization",
  "Формат": "Format",
  "Будь-яке": "Any",
  "Будь-яка": "Any",
  "Будь-який": "Any",
  "Знайти": "Search",
  "Фахівчиня і дитина займаються за столом": "A specialist, and child working at a table",
  "Каталог оголошень": "Listing directory",
  "Категорії": "Categories",
  "Увесь список": "Full list",
  "30 днів": "30 days",
  "Після публікації оголошення потрібно продовжити, інакше воно знімається з каталогу.":
    "After publication, a listing must be renewed or it is removed from the directory.",
  "Знайдено": "Found",
  "фахівців": "specialists",
  "Знайдені фахівці": "Found specialists",
  "Рейтинг": "Rating",
  "від 4.9": "from 4.9",
  "від 4.8": "from 4.8",
  "від 4.7": "from 4.7",
  "Панель адміністратора": "Admin panel",
  "Оголошення діє 30 днів і продовжується вручну": "A listing is active for 30 days and is renewed manually",
  "Чернетка оголошення фахівця": "Specialist listing draft",
  "Ім'я фахівця або назва центру": "Specialist or center name",
  "Наприклад, Анна Коваленко": "For example, Anna Kovalenko",
  "Київ або онлайн": "Kyiv or online",
  "Район міста": "City district",
  "Категорія": "Category",
  "Підкатегорія": "Subcategory",
  "Спеціальності": "Specialties",
  "Оберіть одну або кілька спеціальностей з вибраної категорії.": "Choose one or more specialties from the selected category.",
  "Обрані спеціальності": "Selected specialties",
  "Прибрати спеціальність": "Remove specialty",
  "Оберіть хоча б одну спеціальність.": "Choose at least one specialty.",
  "Категорія спеціаліста": "Specialist category",
  "Будь-яка категорія": "Any category",
  "Наприклад, Шевченківський": "For example, Shevchenkivskyi",
  "Номер телефону": "Phone number",
  "Номери телефонів": "Phone numbers",
  "Email": "Email",
  "Додати телефон": "Add phone",
  "Додати email": "Add email",
  "Додатковий номер телефону": "Additional phone number",
  "Додатковий email": "Additional email",
  "Прибрати": "Remove",
  "Формати занять": "Session formats",
  "Місце занять": "Session location",
  "У фахівця": "At the specialist's place",
  "У учня": "At the student's place",
  "Райони міста для занять": "City districts for sessions",
  "Райони для занять у фахівця": "Districts for sessions at the specialist's place",
  "Райони для занять у учня": "Districts for sessions at the student's place",
  "Готовий займатися на виїзді": "Ready for home visits",
  "Готовий займатися онлайн": "Ready to work online",
  "Автовидалення оголошення через": "Auto-remove listing after",
  "60 днів": "60 days",
  "90 днів": "90 days",
  "Оплата": "Payment",
  "Помісячна": "Monthly",
  "Разова": "One-time",
  "Погодинна": "Hourly",
  "Вартість заняття": "Session price",
  "Тривалість заняття": "Session duration",
  "Наприклад, 1200": "For example, 1200",
  "Короткий опис": "Short description",
  "Досвід, методи роботи, формат занять": "Experience, methods, session format",
  "Опублікувати оголошення": "Publish listing",
  "Довідник спеціалізацій": "Specialization guide",
  "Повний перелік спеціальностей для каталогу": "Full list of specialties for the directory",
  "Список зібрано за освітніми, реабілітаційними та медичними спеціальностями, які найчастіше беруть участь у діагностиці, ранньому втручанні, корекційній роботі та супроводі родини. Зв'яжіться з нами, якщо вашої спеціальності тут немає.":
    "The list is organized by educational, rehabilitation, and medical specialties that most often support diagnostics, early intervention, corrective work, and family support. Contact us if your specialty is not listed here.",
  "Список зібрано за освітніми, реабілітаційними та медичними спеціальностями, які найчастіше беруть участь\n            у діагностиці, ранньому втручанні, корекційній роботі та супроводі родини. Зв'яжіться з нами, якщо вашої\n            спеціальності тут немає.":
    "The list is organized by educational, rehabilitation, and medical specialties that most often support diagnostics, early intervention, corrective work, and family support. Contact us if your specialty is not listed here.",
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
  "Марина": "Maryna",
  "Фахівчиня заздалегідь уточнила цілі, після заняття надіслала короткий план і вправи для дому. Дуже цінно, що можна писати всередині сервісу.":
    "The specialist clarified the goals in advance and sent a short plan and home exercises after the session. It is very helpful to message inside the service.",
  "Фахівчиня заздалегідь уточнила цілі, після заняття надіслала короткий план і вправи для дому.\n              Дуже цінно, що можна писати всередині сервісу.":
    "The specialist clarified the goals in advance and sent a short plan and home exercises after the session. It is very helpful to message inside the service.",
  "Олег": "Oleh",
  "Знайшли нейропсихолога з досвідом роботи зі школою. Відгуки допомогли зрозуміти стиль спілкування до першої зустрічі.":
    "We found a neuropsychologist with school experience. Reviews helped us understand the communication style before the first meeting.",
  "Ірина": "Iryna",
  "Після першої зустрічі отримали короткий план вправ і зрозуміли, як займатися вдома без перевантаження.":
    "After the first meeting, we received a short exercise plan and understood how to practice at home without overload.",
  "Андрій": "Andrii",
  "Сподобалося, що фахівець пояснив цілі простими словами й уточнив, які зміни відстежувати щотижня.":
    "I liked that the specialist explained the goals in simple words and clarified which changes to track each week.",
  "Світлана": "Svitlana",
  "Консультація допомогла узгодити дії родини та школи. Окремо ціную спокійний тон спілкування.":
    "The consultation helped align the family and school. I especially value the calm communication style.",
  "Наталя": "Nataliia",
  "Побачили чітку структуру занять і домашніх кроків. Дитині було комфортно, без тиску.":
    "We saw a clear structure for sessions and home steps. The child felt comfortable, without pressure.",
  "Юлія": "Yuliia",
  "Фахівець уважно зібрав дані перед стартом і показав, як фіксувати прогрес у побутових ситуаціях.":
    "The specialist carefully gathered data before starting and showed how to record progress in everyday situations.",
  "Максим": "Maksym",
  "Добре, що батьків включають у процес: після сесії є конкретні вправи й зрозумілі критерії успіху.":
    "It is good that parents are included in the process: after the session there are specific exercises and clear success criteria.",
  "Олена": "Olena",
  "Отримали корисні поради для дому: як організувати сенсорні паузи, робоче місце й побутові задачі.":
    "We received useful home advice: how to organize sensory breaks, the workspace, and daily tasks.",
  "Тарас": "Taras",
  "Пояснення були практичними. Частину рекомендацій змогли застосувати вже наступного дня.":
    "The explanations were practical. We were able to apply part of the recommendations the next day.",
  "Вікторія": "Viktoriia",
  "Команда подивилася на запит комплексно й запропонувала пріоритети без зайвих призначень.":
    "The team looked at the request comprehensively and suggested priorities without unnecessary referrals.",
  "Роман": "Roman",
  "Сподобалося, що після консультації був короткий висновок і зрозумілий маршрут наступних кроків.":
    "I liked that after the consultation there was a short summary and a clear route for next steps.",
  "Додати відгук": "Add a review",
  "Залишити відгук": "Leave a review",
  "Оцінка": "Rating",
  "Відгук": "Review",
  "Що було корисно родині": "What was helpful for the family",
  "Опублікувати відгук": "Publish review",
  "Панель адміністратора": "Admin panel",
  "Оголошення": "Listings",
  "Скарги": "Reports",
  "Скарга": "Report",
  "Користувачі": "Users",
  "Фахівці": "Specialists",
  "Батьки": "Parents",
  "Вийти з панелі": "Exit panel",
  "Керування": "Management",
  "Керування оголошеннями": "Listing management",
  "Пошук": "Search",
  "Ім'я, місто, скарга": "Name, city, report",
  "Активні": "Active",
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
  "Пошук фахівця - про сайт": "Specialist Search - about",
  "Про сайт Пошук фахівця: пошук спеціалістів для дітей з ООП та листування з адміністраторами.":
    "About Specialist Search: specialist search for children with special educational needs and messaging administrators.",
  "Допомагає родинам знаходити фахівців, а спеціалістам - публікувати анкети,\n            відповідати на заявки та підтримувати актуальність оголошень.":
    "Helps families find specialists, while specialists can publish profiles, reply to requests, and keep listings current.",
  "Листування з адміністратором": "Messaging an administrator",
  "Ваше ім'я": "Your name",
  "Наприклад, Олена": "For example, Olena",
  "Email для відповіді": "Reply email",
  "Автозаповнюється з профілю": "Auto-filled from profile",
  "Тема": "Subject",
  "Питання щодо сайту": "Question about the site",
  "Напишіть, що потрібно передати адміністраторам": "Write what should be sent to the administrators",
  "Написати адміністраторам": "Message administrators",
  "Лист підготовлено для адміністраторів сайту.": "The email has been prepared for the site administrators.",
  "Очно": "In person",
  "Онлайн": "Online",
  "Виїзд": "Home visit",
  "Київ": "Kyiv",
  "Львів": "Lviv",
  "Одеса": "Odesa",
  "Дніпро": "Dnipro",
  "Шевченківський": "Shevchenkivskyi",
  "Галицький": "Halytskyi",
  "Приморський": "Prymorskyi",
  "Соборний": "Sobornyi",
  "сьогодні, 16:30": "today, 16:30",
  "завтра, 10:00": "tomorrow, 10:00",
  "сьогодні, 18:00": "today, 18:00",
  "післязавтра, 09:30": "the day after tomorrow, 09:30",
  "п'ятниця, 12:00": "Friday, 12:00",
  "Усі фахівці": "All specialists",
  "Нічого не знайдено": "Nothing found",
  "Змініть місто, формат або спеціалізацію. У довіднику нижче є повний список спеціальностей для розширення каталогу.":
    "Change the city, format, or specialization. The guide below has a full specialty list for expanding the directory.",
  "Документи додані": "Documents added",
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
  "Фахівці з розвитку, корекційної педагогіки, психологічної, реабілітаційної, медичної та сімейної підтримки.":
    "Specialists in development, corrective education, psychological, rehabilitation, medical, and family support.",
  "Педагоги та тренери": "Teachers and coaches",
  "Фахівці для навчання, спорту, творчості, музики, предметної підготовки та розвитку інтересів.":
    "Specialists for learning, sports, creativity, music, subject tutoring, and interest development.",
  "Спорт": "Sports",
  "Музика": "Music",
  "Математика": "Mathematics",
  "Фізика": "Physics",
  "Творчість і мистецтво": "Creativity and arts",
  "Мови та комунікація": "Languages and communication",
  "Індивідуальні та групові заняття для руху, координації, витривалості й командної взаємодії.":
    "Individual and group sessions for movement, coordination, endurance, and teamwork.",
  "Музичні заняття, інструменти, вокал, ритміка та творчий розвиток.":
    "Music lessons, instruments, vocals, rhythm, and creative development.",
  "Підтримка у шкільній математиці, логіці, підготовці до контрольних і поступовому засвоєнні тем.":
    "Support with school math, logic, test preparation, and gradual topic mastery.",
  "Пояснення природничих тем через приклади, досліди, задачі та зрозумілу практику.":
    "Explaining science topics through examples, experiments, tasks, and clear practice.",
  "Практичні творчі заняття для самовираження, уваги, дрібної моторики та впевненості.":
    "Practical creative sessions for self-expression, attention, fine motor skills, and confidence.",
  "Мовні заняття, читання, письмо та розвиток комунікації у комфортному темпі.":
    "Language lessons, reading, writing, and communication development at a comfortable pace.",
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
  "Нотатка": "Note",
  "Скарги й відгуки": "Reports and reviews",
  "Видалити": "Delete",
  "Відхилити скаргу": "Dismiss report",
  "Нове": "New",
  "Низький рейтинг": "Low rating",
  "Модерація відгуків": "Review moderation",
  "Автор": "Author",
  "Відгуків для модерації немає": "No reviews to moderate",
  "Неперевірені відгуки з негативним рейтингом з'являться тут.": "Unmoderated reviews with a negative rating will appear here.",
  "Користувачі-фахівці": "Specialist users",
  "Користувачі-батьки": "Parent users",
  "Користувач": "User",
  "Контакти": "Contacts",
  "Реєстрація": "Registration",
  "Службові дані": "Internal data",
  "Заявки": "Requests",
  "Фахівців не знайдено": "No specialists found",
  "Батьків не знайдено": "No parents found",
  "Заявок для перевірки немає": "No listings to review",
  "Нові оголошення, скарги або низькі рейтинги з'являться тут.": "New listings, reports, or low ratings will appear here.",
  "Скаргу відхилено адміністратором. Оголошення залишено активним.":
    "The report was dismissed by the administrator. The listing remains active.",
  "Продовжити на 30 днів": "Renew for 30 days",
  "Відкрити": "Open",
  "Схвалити": "Approve",
  "Відхилити": "Reject",
  "сьогодні": "today",
  "днів до автоматичного зняття": "days until automatic removal",
  "знімається автоматично": "removed automatically",
  "Додано диплом і сертифікат із запуску мовлення.": "Diploma and speech initiation certificate added.",
  "Є скарга на непідтверджену інформацію про досвід.": "There is a report about unverified experience information.",
  "Строк публікації завершується, надіслано нагадування про продовження.":
    "The publication term is ending; a renewal reminder was sent.",
  "Опис послуг для підлітків оновлено.": "Teen service description updated.",
  "Батьки запитують, чи працює фахівчиня з ехолалією.": "Parents ask whether the specialist works with echolalia.",
  "Адміністратор отримав уточнення щодо сертифіката BCBA/QBA.": "Administrator received clarification on the BCBA/QBA certificate.",
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
  "Нове оголошення опубліковане фахівцем.": "A new listing was published by a specialist.",
  "Оголошення опубліковано. Адміністратор бачить його в панелі керування.":
    "Listing published. The administrator can see it in the management panel.",
  "Відгук опубліковано.": "Review published."
};

let currentLang = "uk";
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
      "Центр раннього втручання",
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

const trainerSpecialtyGroups = [
  {
    title: "Спорт",
    description: "Індивідуальні та групові заняття для руху, координації, витривалості й командної взаємодії.",
    items: [
      "Тренер з роликів",
      "Тренер з велосипеда",
      "Тренер з футболу",
      "Тренер з плавання",
      "Тренер з гімнастики",
      "Тренер з легкої атлетики",
      "Тренер з танців",
      "Тренер з йоги",
      "Тренер з адаптивного фітнесу",
      "Тренер з настільного тенісу"
    ]
  },
  {
    title: "Музика",
    description: "Музичні заняття, інструменти, вокал, ритміка та творчий розвиток.",
    items: [
      "Викладач фортепіано",
      "Викладач гітари",
      "Викладач скрипки",
      "Викладач барабанів",
      "Викладач вокалу",
      "Викладач сольфеджіо",
      "Викладач музичної грамоти",
      "Викладач ритміки",
      "Викладач хору",
      "Викладач музичної імпровізації"
    ]
  },
  {
    title: "Математика",
    description: "Підтримка у шкільній математиці, логіці, підготовці до контрольних і поступовому засвоєнні тем.",
    items: [
      "Репетитор з математики",
      "Репетитор з алгебри",
      "Репетитор з геометрії",
      "Репетитор з логіки",
      "Репетитор з арифметики",
      "Репетитор з підготовки до НМТ з математики",
      "Репетитор з підготовки до ДПА з математики",
      "Репетитор з ментальної арифметики",
      "Репетитор з фінансової грамотності",
      "Репетитор з математичних ігор"
    ]
  },
  {
    title: "Фізика",
    description: "Пояснення природничих тем через приклади, досліди, задачі та зрозумілу практику.",
    items: [
      "Репетитор з фізики",
      "Репетитор з астрономії",
      "Репетитор з механіки",
      "Репетитор з електрики",
      "Репетитор з оптики",
      "Репетитор з термодинаміки",
      "Репетитор з підготовки до НМТ з фізики",
      "Викладач STEM",
      "Викладач робототехніки",
      "Викладач наукових дослідів"
    ]
  },
  {
    title: "Творчість і мистецтво",
    description: "Практичні творчі заняття для самовираження, уваги, дрібної моторики та впевненості.",
    items: [
      "Репетитор з малювання",
      "Викладач живопису",
      "Викладач ліплення",
      "Викладач кераміки",
      "Викладач аплікації",
      "Викладач дизайну",
      "Викладач анімації",
      "Викладач фотографії",
      "Викладач рукоділля",
      "Викладач театральної майстерності"
    ]
  },
  {
    title: "Мови та комунікація",
    description: "Мовні заняття, читання, письмо та розвиток комунікації у комфортному темпі.",
    items: [
      "Репетитор з української мови",
      "Репетитор з англійської мови",
      "Репетитор з польської мови",
      "Репетитор з німецької мови",
      "Репетитор з читання",
      "Репетитор з письма",
      "Викладач сторітелінгу",
      "Викладач ораторської майстерності",
      "Викладач підготовки до школи",
      "Викладач літератури"
    ]
  }
];

const allSpecialtyGroups = [...specialtyGroups, ...trainerSpecialtyGroups];

const specialtySections = [
  {
    title: "Корекційно-педагогічні",
    description: "Фахівці з розвитку, корекційної педагогіки, психологічної, реабілітаційної, медичної та сімейної підтримки.",
    groups: specialtyGroups
  },
  {
    title: "Педагоги та тренери",
    description: "Фахівці для навчання, спорту, творчості, музики, предметної підготовки та розвитку інтересів.",
    groups: trainerSpecialtyGroups
  }
];

const listings = [
  {
    id: 1,
    name: "Катерина Смирнова",
    initials: "КС",
    specialty: "Логопед",
    specialties: ["Логопед", "Логопед-дефектолог", "Педагог раннього розвитку"],
    regionId: "UA80000000000093317",
    region: "Київ",
    city: "UA80000000000093317",
    district: "Шевченківський",
    formats: ["У фахівця", "Онлайн"],
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
        author: "Ірина",
        date: "2026-06-03",
        rating: 5.0,
        text: "Після першої зустрічі отримали короткий план вправ і зрозуміли, як займатися вдома без перевантаження.",
        likes: 18,
        dislikes: 1
      },
      {
        id: "r1-2",
        author: "Андрій",
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
    specialties: ["Клінічний психолог", "Дитячий психолог", "Нейропсихолог"],
    regionId: "",
    region: "",
    city: "",
    district: "Онлайн",
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
        author: "Світлана",
        date: "2026-06-05",
        rating: 4.8,
        text: "Консультація допомогла узгодити дії родини та школи. Окремо ціную спокійний тон спілкування.",
        likes: 15,
        dislikes: 1
      },
      {
        id: "r2-2",
        author: "Наталя",
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
    specialties: ["ABA-терапевт", "Поведінковий аналітик", "Ігровий терапевт"],
    regionId: "UA46000000000026241",
    region: "Львівська",
    city: "UA46060250010015970",
    district: "Галицький",
    formats: ["У фахівця", "У учня"],
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
        author: "Юлія",
        date: "2026-06-01",
        rating: 5.0,
        text: "Фахівець уважно зібрав дані перед стартом і показав, як фіксувати прогрес у побутових ситуаціях.",
        likes: 21,
        dislikes: 2
      },
      {
        id: "r3-2",
        author: "Максим",
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
    specialties: ["Ерготерапевт", "Фахівець із сенсорної інтеграції", "Орально-моторний терапевт"],
    regionId: "UA51000000000030770",
    region: "Одеська",
    city: "UA51100270010076757",
    district: "Приморський",
    formats: ["У фахівця"],
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
        author: "Олена",
        date: "2026-06-07",
        rating: 4.9,
        text: "Отримали корисні поради для дому: як організувати сенсорні паузи, робоче місце й побутові задачі.",
        likes: 14,
        dislikes: 0
      },
      {
        id: "r4-2",
        author: "Тарас",
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
    specialties: ["Центр раннього втручання", "Координатор раннього втручання", "Кейс-менеджер"],
    regionId: "UA12000000000090473",
    region: "Дніпропетровська",
    city: "UA12020010010037010",
    district: "Соборний",
    formats: ["У фахівця", "У учня"],
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
        author: "Вікторія",
        date: "2026-06-04",
        rating: 4.8,
        text: "Команда подивилася на запит комплексно й запропонувала пріоритети без зайвих призначень.",
        likes: 24,
        dislikes: 2
      },
      {
        id: "r5-2",
        author: "Роман",
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
    city: "UA80000000000093317",
    status: "approved",
    createdAt: "2026-06-10",
    reports: 0,
    rating: 4.9,
    notes: "Додано диплом і сертифікат із запуску мовлення.",
    message: "Батьки запитують, чи працює фахівчиня з ехолалією."
  },
  {
    id: 102,
    name: "Олексій Фролов",
    specialty: "ABA-терапевт",
    city: "UA46060250010015970",
    status: "reported",
    createdAt: "2026-05-14",
    reports: 3,
    rating: 4.6,
    notes: "Є скарга на непідтверджену інформацію про досвід.",
    message: "Адміністратор отримав уточнення щодо сертифіката BCBA/QBA."
  },
  {
    id: 103,
    name: "Ольга Іванова",
    specialty: "Ерготерапевт",
    city: "UA51100270010076757",
    status: "expiring",
    createdAt: "2026-05-16",
    reports: 0,
    rating: 4.8,
    notes: "Строк публікації завершується, надіслано нагадування про продовження.",
    message: "Фахівчиня просить продовжити оголошення після оплати."
  },
  {
    id: 104,
    name: "Дмитро Соколов",
    specialty: "Психолог",
    city: "",
    formats: ["Онлайн"],
    status: "approved",
    createdAt: "2026-06-09",
    reports: 0,
    rating: 3.7,
    notes: "Опис послуг для підлітків оновлено.",
    message: "Батьки уточнюють формат сімейної консультації."
  }
];

let adminReviewItems = [
  {
    id: "amr-1",
    specialist: "Олексій Фролов",
    author: "Ірина",
    date: "2026-06-09",
    rating: 1.4,
    moderated: false,
    text: "Не отримали відповіді після оплати пробної консультації. Потрібна перевірка комунікації."
  },
  {
    id: "amr-2",
    specialist: "Дмитро Соколов",
    author: "Марина",
    date: "2026-06-07",
    rating: 2.1,
    moderated: false,
    text: "Консультація була коротшою за домовленість, рекомендації залишились нечіткими."
  },
  {
    id: "amr-3",
    specialist: "Центр Гармонія",
    author: "Олена",
    date: "2026-06-05",
    rating: 2.8,
    moderated: false,
    text: "Довго чекали на висновок після зустрічі, частина запитань лишилась без відповіді."
  },
  {
    id: "amr-4",
    specialist: "Катерина Смирнова",
    author: "Андрій",
    date: "2026-06-03",
    rating: 4.6,
    moderated: false,
    text: "Позитивний відгук не потрапляє в негативну чергу."
  },
  {
    id: "amr-5",
    specialist: "Ольга Захарова",
    author: "Тарас",
    date: "2026-06-01",
    rating: 1.9,
    moderated: true,
    text: "Уже промодерований відгук не показується в черзі."
  }
];

const specialistUsers = [
  {
    id: "sp-101",
    name: "Марія Воронцова",
    role: "Логопед",
    phone: "+380 67 421 19 04",
    email: "m.vorontsova@example.com",
    registeredAt: "2026-04-18",
    listings: 1,
    activeListings: 1,
    reviews: 18,
    averageRating: 4.9,
    lastActive: "2026-06-12",
    payment: "Помісячна",
    notes: "Документи додані, очікує оновлення сертифіката у липні."
  },
  {
    id: "sp-102",
    name: "Олексій Фролов",
    role: "ABA-терапевт",
    phone: "+380 50 883 44 21",
    email: "o.frolov@example.com",
    registeredAt: "2026-03-29",
    listings: 2,
    activeListings: 1,
    reviews: 7,
    averageRating: 4.6,
    lastActive: "2026-06-10",
    payment: "Погодинна",
    notes: "Є історія скарг, потрібна перевірка підтвердження досвіду."
  },
  {
    id: "sp-103",
    name: "Дмитро Соколов",
    role: "Психолог",
    phone: "+380 93 118 27 62",
    email: "d.sokolov@example.com",
    registeredAt: "2026-05-20",
    listings: 1,
    activeListings: 1,
    reviews: 4,
    averageRating: 3.7,
    lastActive: "2026-06-09",
    payment: "Разова",
    notes: "Низький рейтинг, варто перевірити останні відгуки."
  }
];

const parentUsers = [
  {
    id: "pa-201",
    name: "Ірина Коваленко",
    phone: "+380 97 304 12 86",
    email: "iryna.k@example.com",
    registeredAt: "2026-05-02",
    requests: 3,
    activeRequests: 1,
    reviews: 5,
    lastActive: "2026-06-11",
    city: "Київ",
    notes: "Шукає логопеда та психолога, часто користується онлайн-форматом."
  },
  {
    id: "pa-202",
    name: "Марина Левченко",
    phone: "+380 66 590 08 17",
    email: "maryna.l@example.com",
    registeredAt: "2026-04-14",
    requests: 2,
    activeRequests: 1,
    reviews: 2,
    lastActive: "2026-06-07",
    city: "Львів",
    notes: "Є відгук з негативним рейтингом у черзі модерації."
  },
  {
    id: "pa-203",
    name: "Роман Гнатюк",
    phone: "+380 73 206 45 90",
    email: "roman.h@example.com",
    registeredAt: "2026-02-26",
    requests: 1,
    activeRequests: 0,
    reviews: 3,
    lastActive: "2026-05-30",
    city: "Дніпро",
    notes: "Потребує повторного підтвердження email після зміни адреси."
  }
];

let sortMode = "rating";
let selectedCategory = "all";
let selectedModerationId = moderationItems[0].id;
let reviewVotes = {};
let messageDislikes = {};
let activeChatMessages = [];
const selectedPublishSpecialties = new Set();
let catalogSuggestions = [];
let mapDatabasePromise = null;
let siteDatabasePromise = null;
let searchCatalogTree = [];
const cityNameCache = new Map();

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

try {
  catalogSuggestions = JSON.parse(localStorage.getItem("catalogSuggestions") || "[]");
} catch {
  catalogSuggestions = [];
}

function saveCatalogSuggestions() {
  localStorage.setItem("catalogSuggestions", JSON.stringify(catalogSuggestions));
}

function getAllSpecialties() {
  return [...new Set(allSpecialtyGroups.flatMap((group) => group.items))].sort((a, b) => a.localeCompare(b, "uk"));
}

function escapeAttribute(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function getListingSpecialties(item) {
  const values = Array.isArray(item?.specialties) ? item.specialties : [];
  return [...new Set([...values, item?.specialty].filter(Boolean))];
}

function listingHasSpecialty(item, specialty) {
  return getListingSpecialties(item).includes(specialty);
}

function listingHasSpecialtyFromGroup(item, groupTitle) {
  const group = allSpecialtyGroups.find((entry) => entry.title === groupTitle);
  if (!group) return false;
  return getListingSpecialties(item).some((specialty) => group.items.includes(specialty));
}

function fallbackCatalogTree() {
  return specialtySections.map((section) => ({
    title: section.title,
    groups: section.groups.map((group) => ({
      title: group.title,
      description: group.description || "",
      items: [...group.items]
    }))
  }));
}

function activeCatalogTree() {
  return searchCatalogTree.length ? searchCatalogTree : fallbackCatalogTree();
}

function activeCatalogGroups() {
  return activeCatalogTree().flatMap((section) =>
    (section.groups || []).map((group) => ({
      ...group,
      sectionTitle: section.title
    }))
  );
}

function findActiveCatalogGroup(groupTitle) {
  for (const section of activeCatalogTree()) {
    const group = (section.groups || []).find((entry) => entry.title === groupTitle);
    if (group) return { section, group };
  }
  return null;
}

function buildCatalogTreeFromRows(rows) {
  const groupMap = new Map();
  rows.forEach((row) => {
    const groupTitle = String(row.group_title || "").trim();
    const subgroupTitle = String(row.subgroup_title || "").trim();
    const recordTitle = String(row.record_title || "").trim();
    if (!groupTitle || !subgroupTitle || !recordTitle) return;

    if (!groupMap.has(groupTitle)) {
      groupMap.set(groupTitle, {
        title: groupTitle,
        groups: [],
        subgroupMap: new Map()
      });
    }

    const group = groupMap.get(groupTitle);
    if (!group.subgroupMap.has(subgroupTitle)) {
      const subgroup = {
        title: subgroupTitle,
        description: row.subgroup_description || "",
        items: []
      };
      group.subgroupMap.set(subgroupTitle, subgroup);
      group.groups.push(subgroup);
    }

    const subgroup = group.subgroupMap.get(subgroupTitle);
    if (!subgroup.items.includes(recordTitle)) {
      subgroup.items.push(recordTitle);
    }
  });

  return [...groupMap.values()].map(({ subgroupMap, ...group }) => group);
}

function selectedSearchSpecialists() {
  return [...(elements.specialistRecordFilters || [])]
    .filter((control) => control.checked)
    .map((control) => control.value);
}

function updateSpecialistSummary() {
  if (!elements.specialistSummary) return;
  const selectedSpecialists = selectedSearchSpecialists();
  if (!selectedSpecialists.length) {
    elements.specialistSummary.textContent = "Будь-який спеціаліст";
  } else if (selectedSpecialists.length === 1) {
    elements.specialistSummary.textContent = selectedSpecialists[0];
  } else {
    elements.specialistSummary.textContent = `${selectedSpecialists.length} спеціалісти`;
  }
  elements.specialistSelect?.classList.toggle("has-value", selectedSpecialists.length > 0);
}

function renderSpecialistTree() {
  if (!elements.specialistTree) return;
  const selectedValues = new Set(selectedSearchSpecialists());
  const tree = searchCatalogTree.length ? searchCatalogTree : fallbackCatalogTree();

  elements.specialistTree.innerHTML = tree.length
    ? tree
        .map(
          (group) => `
            <section class="specialist-tree-group">
              <div class="specialist-tree-group-title">${escapeHtml(group.title)}</div>
              ${(group.groups || [])
                .map(
                  (subgroup) => `
                    <div class="specialist-tree-subgroup">
                      <div class="specialist-tree-subgroup-title">${escapeHtml(subgroup.title)}</div>
                      <div class="specialist-tree-records">
                        ${(subgroup.items || [])
                          .map(
                            (record) => `
                              <label class="multi-select-option specialist-tree-record">
                                <input
                                  type="checkbox"
                                  name="specialistFilter"
                                  value="${escapeAttribute(record)}"
                                  data-catalog-group="${escapeAttribute(group.title)}"
                                  data-catalog-subgroup="${escapeAttribute(subgroup.title)}"
                                  ${selectedValues.has(record) ? "checked" : ""}
                                />
                                <span>${escapeHtml(record)}</span>
                              </label>
                            `
                          )
                          .join("")}
                      </div>
                    </div>
                  `
                )
                .join("")}
            </section>
          `
        )
        .join("")
    : `<p class="specialist-tree-empty">Каталог спеціальностей не завантажено.</p>`;

  applyLanguage(elements.specialistTree);
  elements.specialistRecordFilters = elements.specialistTree.querySelectorAll('input[name="specialistFilter"]');
  elements.specialistRecordFilters.forEach((control) => {
    control.addEventListener("change", () => {
      selectedCategory = "all";
      updateSpecialistSummary();
      renderCategories();
      renderListings();
    });
  });
  updateSpecialistSummary();
}

function clearSearchSpecialists() {
  elements.specialistRecordFilters?.forEach((control) => {
    control.checked = false;
  });
  updateSpecialistSummary();
}

function selectedPublishGroup() {
  return findActiveCatalogGroup(elements.publishCategory?.value)?.group || activeCatalogGroups()[0] || null;
}

function updatePublishCategorySummary() {
  if (!elements.publishCategorySummary) return;
  const found = findActiveCatalogGroup(elements.publishCategory?.value);
  elements.publishCategorySummary.textContent = found
    ? `${found.section.title} / ${found.group.title}`
    : "Оберіть підгрупу";
  elements.publishCategoryTree?.classList.toggle("has-value", Boolean(found));
}

function renderPublishCategoryTree(selectedTitle = elements.publishCategory?.value) {
  if (!elements.publishCategoryMenu || !elements.publishCategory) return;
  const groups = activeCatalogGroups();
  const selectedGroup = groups.find((group) => group.title === selectedTitle) || groups[0] || null;
  elements.publishCategory.value = selectedGroup?.title || "";

  elements.publishCategoryMenu.innerHTML = activeCatalogTree().length
    ? activeCatalogTree()
        .map(
          (section) => `
            <section class="publish-category-group">
              <div class="publish-category-group-title">${escapeHtml(section.title)}</div>
              <div class="publish-category-subgroups">
                ${(section.groups || [])
                  .map(
                    (group) => `
                      <button
                        class="publish-category-button ${group.title === elements.publishCategory.value ? "is-active" : ""}"
                        type="button"
                        data-publish-category="${escapeAttribute(group.title)}"
                      >
                        ${escapeHtml(group.title)}
                      </button>
                    `
                  )
                  .join("")}
              </div>
            </section>
          `
        )
        .join("")
    : `<p class="specialist-tree-empty">Каталог спеціальностей не завантажено.</p>`;

  updatePublishCategorySummary();
  applyLanguage(elements.publishCategoryMenu);
}

function selectPublishCategory(groupTitle) {
  const found = findActiveCatalogGroup(groupTitle);
  if (!found || !elements.publishCategory) return;
  elements.publishCategory.value = found.group.title;
  renderPublishCategoryTree(found.group.title);
  updatePublishSpecialtyOptions(false);
  if (elements.publishCategoryTree) elements.publishCategoryTree.open = false;
}

function formatListingSpecialties(item, limit = 3) {
  const specialties = getListingSpecialties(item);
  if (specialties.length <= limit) return specialties.join(", ");
  return `${specialties.slice(0, limit).join(", ")} +${specialties.length - limit}`;
}

function normalizeCatalogInput(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function findCatalogGroup(groupTitle) {
  for (const section of specialtySections) {
    const group = section.groups.find((entry) => entry.title === groupTitle);
    if (group) return { section, group };
  }
  return null;
}

function defaultSuggestionSection() {
  const selected = findCatalogGroup(elements.publishCategory?.value);
  return selected?.section || specialtySections.find((section) => section.title === "Педагоги та тренери") || specialtySections[0];
}

function setCatalogSuggestionStatus(message) {
  if (!elements.catalogSuggestionStatus) return;
  elements.catalogSuggestionStatus.textContent = message;
  applyLanguage(elements.catalogSuggestionStatus);
}

function pendingCatalogSuggestions() {
  return catalogSuggestions.filter((suggestion) => suggestion.status === "pending" && suggestion.enabled === false);
}

function suggestionMatches(suggestion, sectionTitle, groupTitle, recordTitle) {
  return (
    suggestion.status === "pending" &&
    suggestion.sectionTitle === sectionTitle &&
    suggestion.groupTitle.toLocaleLowerCase("uk-UA") === groupTitle.toLocaleLowerCase("uk-UA") &&
    String(suggestion.recordTitle || "").toLocaleLowerCase("uk-UA") === String(recordTitle || "").toLocaleLowerCase("uk-UA")
  );
}

function addCatalogSuggestionFromFields({ silent = false } = {}) {
  const rawCategory = normalizeCatalogInput(elements.suggestedCategory?.value);
  const rawSpecialty = normalizeCatalogInput(elements.suggestedSpecialty?.value);
  if (!rawCategory && !rawSpecialty) {
    if (!silent) setCatalogSuggestionStatus("Введіть нову категорію або спеціальність.");
    return null;
  }

  const selectedGroupTitle = elements.publishCategory?.value || allSpecialtyGroups[0]?.title || "";
  const groupTitle = rawCategory || selectedGroupTitle;
  const recordTitle = rawSpecialty;
  const section = defaultSuggestionSection();
  const existingGroup = findCatalogGroup(groupTitle);
  const existingRecord = recordTitle ? findCatalogRecord(recordTitle) : null;

  if (!rawCategory && recordTitle && existingRecord) {
    selectedPublishSpecialties.add(existingRecord.group.items[existingRecord.index]);
    renderSelectedPublishSpecialties();
    if (!silent) setCatalogSuggestionStatus("Ця спеціальність уже є в каталозі та додана до анкети.");
    return null;
  }

  if (rawCategory && !recordTitle && existingGroup) {
    if (!silent) setCatalogSuggestionStatus("Така категорія вже є в каталозі.");
    return null;
  }

  const duplicate = catalogSuggestions.find((suggestion) =>
    suggestionMatches(suggestion, section.title, groupTitle, recordTitle)
  );

  const suggestion =
    duplicate ||
    {
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: recordTitle ? "record" : "group",
      sectionTitle: section.title,
      groupTitle,
      recordTitle,
      suggestedBy: "Фахівець",
      suggestedAt: today.toISOString().slice(0, 10),
      status: "pending",
      enabled: false
    };

  if (!duplicate) {
    catalogSuggestions.unshift(suggestion);
    saveCatalogSuggestions();
  }

  if (recordTitle) {
    selectedPublishSpecialties.add(recordTitle);
    renderSelectedPublishSpecialties();
  }

  if (elements.suggestedCategory) elements.suggestedCategory.value = "";
  if (elements.suggestedSpecialty) elements.suggestedSpecialty.value = "";
  if (!silent) {
    setCatalogSuggestionStatus(
      duplicate ? "Така пропозиція вже очікує затвердження." : "Пропозицію додано. Адміністратор побачить її в оновленнях каталогу."
    );
  }
  renderCatalogUpdates();
  return suggestion;
}

const elements = {
  regionFilter: document.querySelector("#regionFilter"),
  cityFilter: document.querySelector("#cityFilter"),
  districtFilter: document.querySelector("#districtFilter"),
  specialistSelect: document.querySelector("#specialistFilter"),
  specialistSummary: document.querySelector("[data-specialist-summary]"),
  specialistTree: document.querySelector("#specialistTree"),
  specialistRecordFilters: document.querySelectorAll('input[name="specialistFilter"]'),
  formatSelect: document.querySelector("#formatFilter"),
  formatSummary: document.querySelector("[data-format-summary]"),
  formatFilters: document.querySelectorAll('input[name="formatFilter"]'),
  ratingFilter: document.querySelector("#ratingFilter"),
  publishCategory: document.querySelector("#publishCategory"),
  publishCategoryTree: document.querySelector("#publishCategoryTree"),
  publishCategorySummary: document.querySelector("[data-publish-category-summary]"),
  publishCategoryMenu: document.querySelector("#publishCategoryMenu"),
  publishSpecialty: document.querySelector("#publishSpecialty"),
  regionSelect: document.querySelector("#regionSelect"),
  publishCitySelect: document.querySelector("#publishCitySelect"),
  suggestedCategory: document.querySelector("#suggestedCategory"),
  suggestedSpecialty: document.querySelector("#suggestedSpecialty"),
  addCatalogSuggestion: document.querySelector("#addCatalogSuggestion"),
  catalogSuggestionStatus: document.querySelector("#catalogSuggestionStatus"),
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
  adminNavButtons: document.querySelectorAll("[data-admin-view]"),
  adminViews: document.querySelectorAll("[data-admin-view-panel]"),
  adminReviewRows: document.querySelector("#adminReviewRows"),
  adminCatalogRows: document.querySelector("#adminCatalogRows"),
  catalogUpdatesRows: document.querySelector("#catalogUpdatesRows"),
  catalogUpdatesCount: document.querySelector("#catalogUpdatesCount"),
  catalogEditorForm: document.querySelector("#catalogEditorForm"),
  catalogSectionSelect: document.querySelector("#catalogSectionSelect"),
  catalogGroupSelect: document.querySelector("#catalogGroupSelect"),
  catalogOriginalRecord: document.querySelector("#catalogOriginalRecord"),
  catalogRecordTitle: document.querySelector("#catalogRecordTitle"),
  catalogSubmitButton: document.querySelector("#catalogSubmitButton"),
  catalogCancelEdit: document.querySelector("#catalogCancelEdit"),
  catalogStatus: document.querySelector("#catalogStatus"),
  smtpSettingsForm: document.querySelector("#smtpSettingsForm"),
  smtpSettingsStatus: document.querySelector("#smtpSettingsStatus"),
  smtpPasswordHint: document.querySelector("#smtpPasswordHint"),
  specialistUserRows: document.querySelector("#specialistUserRows"),
  parentUserRows: document.querySelector("#parentUserRows"),
  allUsersRows: document.querySelector("#allUsersRows"),
  allUsersStatus: document.querySelector("#allUsersStatus"),
  allUsersSearch: document.querySelector("#allUsersSearch"),
  metricPending: document.querySelector("#metricPending"),
  metricExpiring: document.querySelector("#metricExpiring"),
  metricReports: document.querySelector("#metricReports"),
  metricArchived: document.querySelector("#metricArchived"),
  adminSearch: document.querySelector("#adminSearch"),
  adminContactForm: document.querySelector("#adminContactForm"),
  profileEmailFields: document.querySelectorAll("[data-profile-email]"),
  publishPhoneOptions: document.querySelector("#publishPhoneOptions"),
  selectedSpecialties: document.querySelector("[data-selected-specialties]"),
  placeDistrictPanels: document.querySelectorAll("[data-district-panel]"),
  publishSubmit: document.querySelector("[data-publish-submit]"),
  publishConsents: document.querySelectorAll("[data-publish-consent]"),
  adminContactStatus: document.querySelector("#adminContactStatus")
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
  const state = normalizedReviewVote(review.id);
  return {
    likes: review.likes + (state.vote === "like" ? state.weight : 0),
    dislikes: review.dislikes + (state.vote === "dislike" ? state.weight : 0),
    vote: state.vote
  };
}

function saveReviewVotes() {
  localStorage.setItem("reviewVotes", JSON.stringify(reviewVotes));
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function currentUserEmail() {
  return normalizeEmail(localStorage.getItem("siteUserEmail"));
}

function currentProfileEmail() {
  return (
    normalizeEmail(localStorage.getItem("profileEmail")) ||
    currentUserEmail()
  );
}

function fillProfileEmail(email = currentProfileEmail()) {
  elements.profileEmailFields.forEach((input) => {
    input.value = normalizeEmail(email);
  });
}

function renderPublishPhoneOptions(phones = []) {
  if (!elements.publishPhoneOptions) return;
  elements.publishPhoneOptions.replaceChildren();
  if (!phones.length) {
    const empty = document.createElement("p");
    empty.className = "account-empty-inline";
    empty.textContent = "Додайте контактний номер в особистому кабінеті.";
    elements.publishPhoneOptions.append(empty);
    return;
  }
  phones.forEach((phone) => {
    const label = document.createElement("label");
    label.className = "checkbox-row publish-phone-option";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "phones";
    input.value = String(phone.value || "");
    const text = document.createElement("span");
    text.textContent = input.value;
    label.append(input, text);
    elements.publishPhoneOptions.append(label);
  });
}

async function loadPublishAccountContacts() {
  fillProfileEmail();
  if (!elements.publishPhoneOptions) return;
  try {
    const response = await fetch("/api/account/index.php", {
      credentials: "same-origin",
      headers: { Accept: "application/json" }
    });
    if (response.status === 401) {
      window.location.href = `auth.php?next=${encodeURIComponent("publish.html")}`;
      return;
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Не вдалося завантажити контакти акаунта.");
    fillProfileEmail(data.profile?.email || "");
    renderPublishPhoneOptions(Array.isArray(data.phones) ? data.phones : []);
  } catch (error) {
    renderPublishPhoneOptions([]);
  }
}

function renderSelectedPublishSpecialties() {
  if (!elements.selectedSpecialties) return;
  const values = [...selectedPublishSpecialties];
  elements.selectedSpecialties.innerHTML = values.length
    ? values
        .map(
          (specialty) => `
            <span class="specialty-chip">
              <span>${specialty}</span>
              <input type="hidden" name="specialties" value="${escapeAttribute(specialty)}" />
              <button class="delete-action delete-action--icon-only" type="button" data-remove-specialty="${escapeAttribute(specialty)}" aria-label="Прибрати спеціальність" title="Прибрати спеціальність"></button>
            </span>
          `
        )
        .join("")
    : `<span class="field-label">Обрані спеціальності</span>`;
  applyLanguage(elements.selectedSpecialties);
}

function updatePlaceDistrictPanel() {
  elements.placeDistrictPanels.forEach((panel) => {
    const target = panel.dataset.districtPanel;
    const shouldShow = Boolean(document.querySelector(`[data-district-target="${target}"]:checked`));
    panel.classList.toggle("is-hidden", !shouldShow);
    if (!shouldShow) {
      panel.querySelectorAll('input[type="checkbox"]').forEach((input) => {
        input.checked = false;
      });
    }
  });
}

function isAdminEmail(email) {
  return adminEmails.includes(normalizeEmail(email));
}

function currentVoterId() {
  return currentUserEmail() || currentMessageViewerId();
}

function voteWeightFor(voterId = currentVoterId()) {
  return isAdminEmail(voterId) ? adminVoteWeight : 1;
}

function normalizedReviewVote(reviewId) {
  const stored = reviewVotes[reviewId];
  if (!stored) return { vote: null, weight: 0, voterId: "" };
  if (typeof stored === "string") {
    return { vote: stored, weight: 1, voterId: "guest" };
  }
  return {
    vote: stored.vote || null,
    weight: Number(stored.weight) || 1,
    voterId: stored.voterId || stored.email || "guest"
  };
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
  return [...new Set(messageDislikes[messageId] || [])].reduce((sum, voterId) => sum + voteWeightFor(voterId), 0);
}

function isMessageDeleted(messageId) {
  return messageDislikeCount(messageId) >= 3;
}

function renderChatMessage(message) {
  const dislikes = messageDislikeCount(message.id);
  const dislikedByViewer = (messageDislikes[message.id] || []).includes(currentVoterId());

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
  const viewerId = currentVoterId();
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
    pending: "Нове",
    reported: "Скарга",
    expiring: "Завершується",
    approved: "Активне",
    active: "Активне",
    rejected: "Архів",
    archived: "Архів"
  };
  return labels[status] || status;
}

function hasReports(item) {
  return item.reports > 0 || item.status === "reported";
}

function hasLowRating(item) {
  return typeof item.rating === "number" && item.rating < lowRatingThreshold;
}

function isNewModerationItem(item) {
  return item.status === "pending" || item.status === "new";
}

function needsAdminAttention(item) {
  return item.status !== "archived" && (isNewModerationItem(item) || hasReports(item) || hasLowRating(item));
}

function moderationStatusLabel(item) {
  if (hasReports(item)) return "Скарга";
  if (isNewModerationItem(item)) return "Нове";
  if (hasLowRating(item)) return "Низький рейтинг";
  return statusLabel(item.status);
}

function moderationStatusClass(item, remaining) {
  if (hasReports(item) || hasLowRating(item)) return "danger";
  if (isNewModerationItem(item)) return "";
  return statusClass(item.status, remaining);
}

function statusClass(status, remaining) {
  if (status === "reported" || status === "rejected" || status === "archived") return "danger";
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

function setLanguage() {
  currentLang = "uk";
  localStorage.removeItem("siteLanguage");
  document.documentElement.lang = currentLang;
  document.title = translateText(initialPageTitle || pageMeta.uk.title, currentLang);
  document.querySelector('meta[name="description"]')?.setAttribute(
    "content",
    translateText(initialPageDescription || pageMeta.uk.description, currentLang)
  );
  applyLanguage();
}

function fillSelects() {
  renderSpecialistTree();
  renderPublishCategoryTree();
  updatePublishSpecialtyOptions();
}

function updatePublishSpecialtyOptions(ensureDefault = true) {
  if (elements.publishSpecialty) {
    const selectedGroup = selectedPublishGroup();
    if (ensureDefault && !selectedPublishSpecialties.size && selectedGroup?.items?.[0]) {
      selectedPublishSpecialties.add(selectedGroup.items[0]);
    }
    elements.publishSpecialty.innerHTML = (selectedGroup?.items || [])
      .map(
        (item) => `
          <label class="checkbox-row">
            <input type="checkbox" name="specialtyOptions" value="${escapeAttribute(item)}" ${selectedPublishSpecialties.has(item) ? "checked" : ""} />
            <span>${item}</span>
          </label>
        `
      )
      .join("");
    applyLanguage(elements.publishSpecialty);
    renderSelectedPublishSpecialties();
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
          : listings.filter((listing) => listingHasSpecialty(listing, item)).length;
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

function selectedSearchFormats() {
  return [...(elements.formatFilters || [])]
    .filter((control) => control.checked)
    .map((control) => control.value);
}

function updateFormatSummary() {
  if (!elements.formatSummary) return;
  const selectedFormats = selectedSearchFormats();
  if (!selectedFormats.length) {
    elements.formatSummary.textContent = "Будь-який";
  } else if (selectedFormats.length === 1) {
    elements.formatSummary.textContent = selectedFormats[0];
  } else {
    elements.formatSummary.textContent = `${selectedFormats.length} формати`;
  }
  elements.formatSelect?.classList.toggle("has-value", selectedFormats.length > 0);
}

function updatePublishSubmitState() {
  if (!elements.publishSubmit) return;
  const consents = [...(elements.publishConsents || [])];
  elements.publishSubmit.disabled = !consents.length || consents.some((control) => !control.checked);
}

function filteredListings() {
  const region = elements.regionFilter?.value || "all";
  const city = elements.cityFilter?.value || "all";
  const district = elements.districtFilter?.value || "all";
  const selectedSpecialists = selectedSearchSpecialists();
  const selectedFormats = selectedSearchFormats();
  const rating = elements.ratingFilter?.value || "all";

  let result = listings.filter((listing) => {
    if (listing.status === "archived") return false;
    if (region !== "all" && listing.regionId !== region) return false;
    if (city !== "all" && listing.city !== city) return false;
    if (district !== "all" && listing.district !== district) return false;
    if (selectedSpecialists.length && !selectedSpecialists.some((specialty) => listingHasSpecialty(listing, specialty))) return false;
    if (selectedCategory !== "all" && !listingHasSpecialty(listing, selectedCategory)) return false;
    if (selectedFormats.length && !selectedFormats.some((format) => listing.formats.includes(format))) return false;
    if (rating !== "all" && listing.rating < Number(rating)) return false;
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
          <p>Змініть місто, формат або спеціалізацію. У довіднику нижче є повний список спеціальностей для розширення каталогу.</p>
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
  elements.specialtyGrid.innerHTML = specialtySections
    .map(
      (section) => `
        <section class="specialty-section">
          <div class="specialty-section-head">
            <h2>${section.title}</h2>
            <p>${section.description}</p>
          </div>
          <div class="specialty-card-grid">
            ${section.groups
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
              .join("")}
          </div>
        </section>
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
  const listingSpecialties = getListingSpecialties(listing);
  elements.specialistDetail.dataset.listingId = listing.id;
  elements.specialistDetail.innerHTML = `
    <div class="specialist-detail-head">
      <div class="avatar" aria-hidden="true">${listing.initials}</div>
      <div>
        <p class="section-note">Анкета фахівця</p>
        <h2 id="specialistDetailTitle">${listing.name}</h2>
        <p>${formatListingSpecialties(listing)} · ${listingCityLabel(listing)} · ${listing.formats.join(", ")}</p>
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
      <span><strong>Спеціальності:</strong> ${listingSpecialties.join(", ")}</span>
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
      ${listing.verified ? `<span class="tag">Документи додані</span>` : ""}
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
  const currentVote = normalizedReviewVote(reviewId);
  if (currentVote.vote === vote) {
    delete reviewVotes[reviewId];
  } else {
    const voterId = currentVoterId();
    reviewVotes[reviewId] = {
      vote,
      voterId,
      weight: voteWeightFor(voterId)
    };
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
    const text = `${item.name} ${formatListingSpecialties(item)} ${listingCityLabel(item)} ${item.notes}`.toLowerCase();
    return needsAdminAttention(item) && text.includes(query);
  });

  if (!data.length) {
    elements.moderationRows.innerHTML = `
      <div class="table-row">
        <span><strong>Заявок для перевірки немає</strong><small>Нові оголошення, скарги або низькі рейтинги з'являться тут.</small></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    applyLanguage(elements.moderationRows);
    selectedModerationId = null;
    if (elements.moderationDetail) {
      elements.moderationDetail.innerHTML = "";
    }
    renderMetrics();
    return;
  }

  elements.moderationRows.innerHTML = data
    .map((item) => {
      const remaining = daysLeft(item);
      const itemHasReports = hasReports(item);
      const primaryAction = itemHasReports
        ? `<button class="mini-button approve" type="button" data-action="dismiss-report" data-id="${item.id}">Відхилити скаргу</button>`
        : `<button class="mini-button" type="button" data-detail="${item.id}">Відкрити</button>`;
      return `
        <div class="table-row">
          <span><strong>${item.name}</strong><small>${item.notes}</small></span>
          <span>${formatListingSpecialties(item)}</span>
          <span>${listingCityLabel(item)}</span>
          <span><span class="status ${moderationStatusClass(item, remaining)}">${moderationStatusLabel(item)}</span></span>
          <span>${remaining > 0 ? `${remaining} дн.` : "сьогодні"}</span>
          <span class="row-actions">
            ${primaryAction}
            <button class="mini-button reject delete-action" type="button" data-action="archived" data-id="${item.id}">Видалити</button>
          </span>
        </div>
      `;
    })
    .join("");
  applyLanguage(elements.moderationRows);

  const selected = data.find((item) => item.id === selectedModerationId) || data[0];
  if (selected) renderModerationDetail(selected);
  renderMetrics();
}

function renderModerationDetail(item) {
  if (!elements.moderationDetail) return;
  selectedModerationId = item.id;
  const remaining = daysLeft(item);
  const hasReports = item.reports > 0 || item.status === "reported";
  elements.moderationDetail.innerHTML = `
    <div>
      <p class="section-note">Деталі оголошення</p>
      <h3>${item.name}</h3>
    </div>
    <dl class="detail-list">
      <div><dt>Спеціальності</dt><dd>${formatListingSpecialties(item)}</dd></div>
      <div><dt>Місто</dt><dd>${listingCityLabel(item)}</dd></div>
      <div><dt>Статус</dt><dd>${moderationStatusLabel(item)}</dd></div>
      <div><dt>Строк</dt><dd>${remaining > 0 ? `${remaining} днів до автоматичного зняття` : "знімається автоматично"}</dd></div>
      <div><dt>Нотатка</dt><dd>${item.notes}</dd></div>
    </dl>
    <div class="message-card">
      <strong>Скарги й відгуки</strong>
      <p>${item.message}</p>
    </div>
    ${
      hasReports
        ? `<button class="secondary-button" type="button" data-action="dismiss-report" data-id="${item.id}">Відхилити скаргу</button>`
        : ""
    }
    <button class="ghost-button delete-action" type="button" data-action="archived" data-id="${item.id}">Видалити</button>
    <button class="secondary-button" type="button" data-renew="${item.id}">Продовжити на 30 днів</button>
  `;
  applyLanguage(elements.moderationDetail);
}

function filteredAdminReviews() {
  return adminReviewItems
    .filter((review) => !review.moderated && review.rating < negativeReviewThreshold)
    .sort((a, b) => a.rating - b.rating || new Date(b.date) - new Date(a.date));
}

function renderAdminReviews() {
  if (!elements.adminReviewRows) return;
  const reviews = filteredAdminReviews();

  if (!reviews.length) {
    elements.adminReviewRows.innerHTML = `
      <article class="review-moderation-card">
        <div>
          <strong>Відгуків для модерації немає</strong>
          <p>Неперевірені відгуки з негативним рейтингом з'являться тут.</p>
        </div>
      </article>
    `;
    applyLanguage(elements.adminReviewRows);
    return;
  }

  elements.adminReviewRows.innerHTML = reviews
    .map(
      (review) => `
        <article class="review-moderation-card" data-review-moderation="${review.id}">
          <div>
            <span class="section-note">${review.specialist}</span>
            <strong>${review.author}</strong>
            <p>${review.text}</p>
          </div>
          <span class="rating"><span class="star">★</span>${review.rating.toFixed(1)}</span>
          <span>${formatReviewDate(review.date)}</span>
        </article>
      `
    )
    .join("");
  applyLanguage(elements.adminReviewRows);
}

function catalogRecordCount(recordTitle) {
  return listings.filter((listing) => listingHasSpecialty(listing, recordTitle)).length;
}

function findCatalogRecord(recordTitle) {
  for (const section of specialtySections) {
    for (const group of section.groups) {
      const index = group.items.indexOf(recordTitle);
      if (index !== -1) return { section, group, index };
    }
  }
  return null;
}

function selectedCatalogSection() {
  return specialtySections.find((section) => section.title === elements.catalogSectionSelect?.value) || specialtySections[0];
}

function selectedCatalogGroup() {
  const section = selectedCatalogSection();
  return section?.groups.find((group) => group.title === elements.catalogGroupSelect?.value) || section?.groups[0];
}

function setCatalogStatus(message) {
  if (!elements.catalogStatus) return;
  elements.catalogStatus.textContent = message;
  applyLanguage(elements.catalogStatus);
}

function resetCatalogEditor() {
  elements.catalogEditorForm?.reset();
  if (elements.catalogOriginalRecord) elements.catalogOriginalRecord.value = "";
  if (elements.catalogSubmitButton) elements.catalogSubmitButton.textContent = "Додати запис";
  applyLanguage(elements.catalogSubmitButton);
  if (elements.catalogCancelEdit) elements.catalogCancelEdit.hidden = true;
  renderCatalogSelectors();
}

function updateCatalogSelectors() {
  if (!elements.catalogSectionSelect || !elements.catalogGroupSelect) return;
  const currentSectionTitle = elements.catalogSectionSelect.value || specialtySections[0]?.title;
  elements.catalogSectionSelect.innerHTML = specialtySections
    .map((section) => `<option value="${escapeAttribute(section.title)}">${section.title}</option>`)
    .join("");
  elements.catalogSectionSelect.value = specialtySections.some((section) => section.title === currentSectionTitle)
    ? currentSectionTitle
    : specialtySections[0]?.title || "";

  const section = selectedCatalogSection();
  const currentGroupTitle = elements.catalogGroupSelect.value || section?.groups[0]?.title;
  elements.catalogGroupSelect.innerHTML = (section?.groups || [])
    .map((group) => `<option value="${escapeAttribute(group.title)}">${group.title}</option>`)
    .join("");
  elements.catalogGroupSelect.value = section?.groups.some((group) => group.title === currentGroupTitle)
    ? currentGroupTitle
    : section?.groups[0]?.title || "";
  applyLanguage(elements.catalogSectionSelect);
  applyLanguage(elements.catalogGroupSelect);
}

function renderCatalogSelectors() {
  updateCatalogSelectors();
  renderAdminCatalog();
}

function updateSpecialtyReferences(oldTitle, newTitle) {
  listings.forEach((listing) => {
    if (listing.specialty === oldTitle) listing.specialty = newTitle;
    if (Array.isArray(listing.specialties)) {
      listing.specialties = listing.specialties.map((specialty) => (specialty === oldTitle ? newTitle : specialty));
    }
  });
  moderationItems.forEach((item) => {
    if (item.specialty === oldTitle) item.specialty = newTitle;
    if (Array.isArray(item.specialties)) {
      item.specialties = item.specialties.map((specialty) => (specialty === oldTitle ? newTitle : specialty));
    }
  });
}

function refreshCatalogDependents() {
  fillSelects();
  renderCategories();
  renderListings();
  renderAdminCatalog();
  renderCatalogUpdates();
  renderModeration();
}

function renderAdminCatalog() {
  if (!elements.adminCatalogRows) return;
  elements.adminCatalogRows.innerHTML = specialtySections
    .map(
      (section) => `
        <section class="catalog-admin-section">
          <div class="catalog-admin-section-head">
            <h2>${section.title}</h2>
            <p>${section.description}</p>
          </div>
          ${section.groups
            .map(
              (group) => `
                <article class="catalog-admin-group">
                  <div class="catalog-admin-group-head">
                    <h3>${group.title}</h3>
                    <p>${group.description}</p>
                  </div>
                  <div class="catalog-record-list">
                    ${group.items
                      .map((record) => {
                        const count = catalogRecordCount(record);
                        return `
                          <div class="catalog-record-row">
                            <span><strong>${record}</strong></span>
                            <span><strong>${count}</strong> <span>фахівців</span></span>
                            <span class="row-actions">
                              <button class="mini-button" type="button" data-edit-catalog-record="${escapeAttribute(record)}">Редагувати</button>
                              <button class="mini-button reject delete-action" type="button" data-delete-catalog-record="${escapeAttribute(record)}" ${count > 0 ? "disabled" : ""}>Видалити</button>
                            </span>
                          </div>
                        `;
                      })
                      .join("")}
                  </div>
                </article>
              `
            )
            .join("")}
        </section>
      `
    )
    .join("");
  applyLanguage(elements.adminCatalogRows);
}

function updateCatalogUpdatesBadge() {
  if (!elements.catalogUpdatesCount) return;
  elements.catalogUpdatesCount.textContent = pendingCatalogSuggestions().length;
}

function ensureCatalogGroup(sectionTitle, groupTitle) {
  const existing = findCatalogGroup(groupTitle);
  if (existing) return existing.group;

  const section =
    specialtySections.find((entry) => entry.title === sectionTitle) ||
    specialtySections.find((entry) => entry.title === "Педагоги та тренери") ||
    specialtySections[0];
  const group = {
    title: groupTitle,
    description: "Запропоновано користувачем.",
    items: []
  };
  section.groups.push(group);
  if (!allSpecialtyGroups.includes(group)) allSpecialtyGroups.push(group);
  return group;
}

function approveCatalogSuggestion(suggestion, card) {
  const groupTitle = normalizeCatalogInput(card?.querySelector('[data-update-field="groupTitle"]')?.value || suggestion.groupTitle);
  const recordTitle = normalizeCatalogInput(card?.querySelector('[data-update-field="recordTitle"]')?.value || suggestion.recordTitle);
  if (!groupTitle && !recordTitle) return;

  const group = ensureCatalogGroup(suggestion.sectionTitle, groupTitle || suggestion.groupTitle);
  if (recordTitle && !group.items.includes(recordTitle)) {
    group.items.push(recordTitle);
  }

  suggestion.groupTitle = group.title;
  suggestion.recordTitle = recordTitle;
  suggestion.status = "approved";
  suggestion.enabled = true;
  saveCatalogSuggestions();
  refreshCatalogDependents();
  renderCatalogUpdates();
}

function rejectCatalogSuggestion(suggestion) {
  suggestion.status = "rejected";
  suggestion.enabled = false;
  saveCatalogSuggestions();
  renderCatalogUpdates();
}

function renderCatalogUpdates() {
  updateCatalogUpdatesBadge();
  if (!elements.catalogUpdatesRows) return;
  const pending = pendingCatalogSuggestions();
  elements.catalogUpdatesRows.innerHTML = pending.length
    ? pending
        .map(
          (suggestion) => `
            <article class="catalog-update-card" data-suggestion-id="${suggestion.id}">
              <div>
                <strong>${suggestion.recordTitle || suggestion.groupTitle}</strong>
                <p>${suggestion.recordTitle ? "Нова спеціальність" : "Нова категорія"} · ${suggestion.sectionTitle}</p>
                <small>Запропонував: ${suggestion.suggestedBy} · ${formatReviewDate(suggestion.suggestedAt)}</small>
              </div>
              <div class="catalog-update-fields">
                <label>
                  <span>Категорія</span>
                  <input type="text" data-update-field="groupTitle" value="${escapeAttribute(suggestion.groupTitle)}" />
                </label>
                <label>
                  <span>Спеціальність</span>
                  <input type="text" data-update-field="recordTitle" value="${escapeAttribute(suggestion.recordTitle || "")}" placeholder="Не обов'язково для нової категорії" />
                </label>
              </div>
              <span class="row-actions">
                <button class="mini-button" type="button" data-approve-catalog-update="${suggestion.id}">Затвердити</button>
                <button class="mini-button reject" type="button" data-reject-catalog-update="${suggestion.id}">Відхилити</button>
              </span>
            </article>
          `
        )
        .join("")
    : `<article class="catalog-update-card catalog-update-empty"><strong>Немає пропозицій</strong><p>Нові категорії та спеціальності з форми фахівця з'являться тут.</p><span></span></article>`;
  applyLanguage(elements.catalogUpdatesRows);
}

function handleCatalogUpdateClick(event) {
  const approveButton = event.target.closest("[data-approve-catalog-update]");
  const rejectButton = event.target.closest("[data-reject-catalog-update]");
  if (!approveButton && !rejectButton) return;

  const id = Number(approveButton?.dataset.approveCatalogUpdate || rejectButton?.dataset.rejectCatalogUpdate);
  const suggestion = catalogSuggestions.find((item) => item.id === id);
  if (!suggestion) return;
  const card = event.target.closest("[data-suggestion-id]");

  if (approveButton) {
    approveCatalogSuggestion(suggestion, card);
  } else {
    rejectCatalogSuggestion(suggestion);
  }
}

function beginCatalogEdit(recordTitle) {
  const found = findCatalogRecord(recordTitle);
  if (!found) {
    setCatalogStatus("Оберіть запис для редагування.");
    return;
  }
  if (elements.catalogOriginalRecord) elements.catalogOriginalRecord.value = recordTitle;
  if (elements.catalogRecordTitle) elements.catalogRecordTitle.value = recordTitle;
  if (elements.catalogSectionSelect) elements.catalogSectionSelect.value = found.section.title;
  updateCatalogSelectors();
  if (elements.catalogGroupSelect) elements.catalogGroupSelect.value = found.group.title;
  if (elements.catalogSubmitButton) elements.catalogSubmitButton.textContent = "Зберегти зміни";
  applyLanguage(elements.catalogSubmitButton);
  if (elements.catalogCancelEdit) elements.catalogCancelEdit.hidden = false;
  setCatalogStatus("");
  elements.catalogRecordTitle?.focus();
}

function submitCatalogRecord(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const originalTitle = String(formData.get("originalRecord") || "").trim();
  const newTitle = String(formData.get("recordTitle") || "").trim();
  const group = selectedCatalogGroup();
  if (!group || !newTitle) return;

  const existing = findCatalogRecord(newTitle);
  if (existing && newTitle !== originalTitle) {
    setCatalogStatus("Такий запис уже є в цій категорії.");
    return;
  }

  if (originalTitle) {
    const original = findCatalogRecord(originalTitle);
    if (!original) {
      setCatalogStatus("Оберіть запис для редагування.");
      return;
    }
    original.group.items.splice(original.index, 1);
    group.items.push(newTitle);
    updateSpecialtyReferences(originalTitle, newTitle);
    setCatalogStatus("Запис оновлено.");
  } else {
    group.items.push(newTitle);
    setCatalogStatus("Запис додано.");
  }

  resetCatalogEditor();
  refreshCatalogDependents();
}

function deleteCatalogRecord(recordTitle) {
  const count = catalogRecordCount(recordTitle);
  if (count > 0) {
    setCatalogStatus("Неможливо видалити: до цього напрямку прив'язані фахівці.");
    return;
  }
  const found = findCatalogRecord(recordTitle);
  if (!found) return;
  found.group.items.splice(found.index, 1);
  resetCatalogEditor();
  refreshCatalogDependents();
  setCatalogStatus("Запис видалено.");
}

function userContactMarkup(user) {
  return `
    <a href="tel:${user.phone.replace(/\s/g, "")}">${user.phone}</a>
    <a href="mailto:${user.email}">${user.email}</a>
  `;
}

function renderSpecialistUsers() {
  if (!elements.specialistUserRows) return;
  elements.specialistUserRows.innerHTML = specialistUsers.length
    ? specialistUsers
        .map(
          (user) => `
            <article class="user-row">
              <span><strong>${user.name}</strong><small>${user.role}</small></span>
              <span class="contact-stack">${userContactMarkup(user)}</span>
              <span>${formatReviewDate(user.registeredAt)}<small>Останній вхід: ${formatReviewDate(user.lastActive)}</small></span>
              <span>${user.activeListings} активних з ${user.listings}<small>Оплата: ${user.payment}</small></span>
              <span><span class="rating"><span class="star">★</span>${user.averageRating.toFixed(1)}</span><small>${user.reviews} відгуків</small></span>
              <span>${user.notes}</span>
            </article>
          `
        )
        .join("")
    : `<article class="user-row"><span><strong>Фахівців не знайдено</strong></span><span></span><span></span><span></span><span></span><span></span></article>`;
  applyLanguage(elements.specialistUserRows);
}

function renderParentUsers() {
  if (!elements.parentUserRows) return;
  elements.parentUserRows.innerHTML = parentUsers.length
    ? parentUsers
        .map(
          (user) => `
            <article class="user-row">
              <span><strong>${user.name}</strong><small>${user.city}</small></span>
              <span class="contact-stack">${userContactMarkup(user)}</span>
              <span>${formatReviewDate(user.registeredAt)}<small>Останній вхід: ${formatReviewDate(user.lastActive)}</small></span>
              <span>${user.activeRequests} активних з ${user.requests}</span>
              <span>${user.reviews} відгуків</span>
              <span>${user.notes}</span>
            </article>
          `
        )
        .join("")
    : `<article class="user-row"><span><strong>Батьків не знайдено</strong></span><span></span><span></span><span></span><span></span><span></span></article>`;
  applyLanguage(elements.parentUserRows);
}

function renderAdminUsers() {
  renderSpecialistUsers();
  renderParentUsers();
}

function loadExternalScript(src, globalName) {
  if (window[globalName]) return Promise.resolve(window[globalName]);
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window[globalName]), { once: true });
      existing.addEventListener("error", () => reject(new Error(`Cannot load ${src}`)), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve(window[globalName]);
    script.onerror = () => reject(new Error(`Cannot load ${src}`));
    document.head.append(script);
  });
}

async function loadSqlJs() {
  const initSqlJs = await loadExternalScript(sqliteScriptUrl, "initSqlJs");
  return initSqlJs({
    locateFile: () => sqliteWasmUrl
  });
}

function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("Cannot read file."));
    reader.readAsArrayBuffer(file);
  });
}

async function fetchArrayBuffer(url, fallbackFile, fallbackLabel) {
  if (fallbackFile) return readFileAsArrayBuffer(fallbackFile);
  const noCacheUrl = `${url}${url.includes("?") ? "&" : "?"}v=${Date.now()}`;
  let lastError = null;
  for (const requestUrl of [noCacheUrl, url]) {
    try {
      const response = await fetch(requestUrl, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.arrayBuffer();
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(`Cannot load ${fallbackLabel}. Select it manually with the file picker. Details: ${lastError?.message || "unknown error"}`);
}

function quoteSqlName(name) {
  return `"${String(name).replace(/"/g, '""')}"`;
}

function quoteSqlValue(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function resolveOblastId(db, oblastId) {
  const regionValue = quoteSqlValue(oblastId);
  try {
    return (
      sqlRows(
        db,
        `SELECT oblast_id FROM oblasti WHERE oblast_id = ${regionValue} or name = ${regionValue} LIMIT 1`
      )[0]?.oblast_id || oblastId
    );
  } catch (error) {
    console.warn("Cannot resolve oblast id from map.sqlite", error);
    return oblastId;
  }
}

function sqlRows(db, sql, params = []) {
  const result = db.exec(sql, params)[0];
  if (!result) return [];
  return result.values.map((values) =>
    Object.fromEntries(values.map((value, index) => [result.columns[index], value]))
  );
}

async function loadMapDatabase() {
  if (!mapDatabasePromise) {
    mapDatabasePromise = (async () => {
      const SQL = await loadSqlJs();
      const buffer = await fetchArrayBuffer("database/map.sqlite", null, "database/map.sqlite");
      return new SQL.Database(new Uint8Array(buffer));
    })();
  }
  return mapDatabasePromise;
}

async function loadSiteDatabase() {
  if (!siteDatabasePromise) {
    siteDatabasePromise = (async () => {
      const SQL = await loadSqlJs();
      const buffer = await fetchArrayBuffer("database/site.sqlite", null, "database/site.sqlite");
      return new SQL.Database(new Uint8Array(buffer));
    })();
  }
  return siteDatabasePromise;
}

async function loadSearchCatalogTree() {
  if (!elements.specialistTree) return;
  try {
    const db = await loadSiteDatabase();
    const rows = sqlRows(
      db,
      `SELECT
        g.id as group_id,
        g.title as group_title,
        g.sort_order as group_sort,
        s.id as subgroup_id,
        s.title as subgroup_title,
        s.description as subgroup_description,
        s.sort_order as subgroup_sort,
        r.id as record_id,
        r.title as record_title,
        r.sort_order as record_sort
      FROM Catalog_groups g
      JOIN Catalog_subgroups s ON s.group_id = g.id AND s.enabled = 1
      JOIN Catalog_record r ON r.subgroup_id = s.id AND r.enabled = 1
      WHERE g.enabled = 1
      ORDER BY g.sort_order, g.id, s.sort_order, s.id, r.sort_order, r.id`
    );
    const tree = buildCatalogTreeFromRows(rows);
    if (tree.length) {
      searchCatalogTree = tree;
      renderSpecialistTree();
      renderPublishCategoryTree(elements.publishCategory?.value);
      updatePublishSpecialtyOptions(false);
    }
  } catch (error) {
    console.warn("Cannot load specialist catalog from site.sqlite", error);
    searchCatalogTree = fallbackCatalogTree();
    renderSpecialistTree();
    renderPublishCategoryTree(elements.publishCategory?.value);
    updatePublishSpecialtyOptions(false);
  }
}

function normalizeRegionOptions(regions) {
  const regionMap = new Map();
  regions.forEach((item) => {
    const name = String(typeof item === "string" ? item : item?.name || "").trim();
    if (!name) return;
    const oblastId = String(
      typeof item === "string" ? item : item?.oblast_id || item?.l1_parent_id || item?.id || name
    ).trim();
    regionMap.set(oblastId || name, { oblastId: oblastId || name, name });
  });
  return [...regionMap.values()].sort((a, b) => a.name.localeCompare(b.name, "uk"));
}

function renderRegionOptionsInto(select, regions, { selectedValue = "", placeholder = "Оберіть область", allValue = "" } = {}) {
  if (!select) return;
  const uniqueRegions = normalizeRegionOptions(regions);
  select.innerHTML = [
    `<option value="${escapeAttribute(allValue)}">${escapeHtml(placeholder)}</option>`,
    ...uniqueRegions.map(
      (region) =>
        `<option value="${escapeAttribute(region.oblastId)}" data-region-name="${escapeAttribute(region.name)}">${escapeHtml(region.name)}</option>`
    )
  ].join("");
  const selectedRegion = uniqueRegions.find((region) => region.oblastId === selectedValue || region.name === selectedValue);
  if (selectedRegion) {
    select.value = selectedRegion.oblastId;
  }
  applyLanguage(select);
}

function normalizeCityOptions(cities) {
  const cityMap = new Map();
  cities.forEach((item) => {
    const name = String(item?.city_name || item?.name || "").trim();
    const cityId = String(item?.cityId || item?.city_id || item?.l4_parent_id || item?.l1_parent_id || "").trim();
    if (!name || !cityId) return;
    if (!cityMap.has(cityId)) {
      cityMap.set(cityId, { cityId, name });
      cityNameCache.set(cityId, name);
    }
  });
  return [...cityMap.values()];
}

function renderCityOptionsInto(select, cities, { selectedValue = "all", placeholder = "Будь-яке місто", allValue = "all" } = {}) {
  if (!select) return;
  const uniqueCities = normalizeCityOptions(cities);
  select.innerHTML = [
    `<option value="${escapeAttribute(allValue)}">${escapeHtml(placeholder)}</option>`,
    ...uniqueCities.map((city) => `<option value="${escapeAttribute(city.cityId)}">${escapeHtml(city.name)}</option>`)
  ].join("");
  if (uniqueCities.some((city) => city.cityId === selectedValue)) {
    select.value = selectedValue;
  } else {
    select.value = allValue;
  }
  applyLanguage(select);
}

function normalizeDistrictOptions(districts) {
  const districtMap = new Map();
  districts.forEach((item) => {
    const name = String(item?.district_name || item?.name || "").trim();
    const districtId = String(item?.districtId || item?.district_id || item?.l5_parent_id || name).trim();
    if (!name) return;
    if (!districtMap.has(name)) {
      districtMap.set(name, { districtId, name });
    }
  });
  return [...districtMap.values()];
}

function renderDistrictOptionsInto(select, districts, { selectedValue = "all", placeholder = "Будь-який район", allValue = "all" } = {}) {
  if (!select) return;
  const uniqueDistricts = normalizeDistrictOptions(districts);
  select.innerHTML = [
    `<option value="${escapeAttribute(allValue)}">${escapeHtml(placeholder)}</option>`,
    ...uniqueDistricts.map(
      (district) =>
        `<option value="${escapeAttribute(district.name)}" data-district-id="${escapeAttribute(district.districtId)}">${escapeHtml(district.name)}</option>`
    )
  ].join("");
  select.value = uniqueDistricts.some((district) => district.name === selectedValue) ? selectedValue : allValue;
  applyLanguage(select);
}

async function loadCitiesForRegion(oblastId) {
  if (!oblastId || oblastId === "all") return [];
  const db = await loadMapDatabase();
  const regionValue = quoteSqlValue(resolveOblastId(db, oblastId));
  return normalizeCityOptions(
    sqlRows(
      db,
      `SELECT
        name as city_name,
        COALESCE(l4_parent_id, l1_parent_id) as city_id
      FROM entries
      WHERE type in (2, 5) and l1_parent_id = ${regionValue}
      ORDER BY type asc, name`
    )
  );
}

async function loadDistrictsForCity(cityId) {
  if (!cityId || cityId === "all") return [];
  const db = await loadMapDatabase();
  const cityValue = quoteSqlValue(cityId);
  return normalizeDistrictOptions(
    sqlRows(
      db,
      `SELECT
        name as district_name,
        l5_parent_id as district_id
      FROM entries
      WHERE type = 9 and l4_parent_id = ${cityValue}
      ORDER BY name`
    )
  );
}

async function updateSearchCityOptions(selectedValue = "all") {
  if (!elements.cityFilter) return;
  const oblastId = elements.regionFilter?.value || "all";
  if (!oblastId || oblastId === "all") {
    renderCityOptionsInto(elements.cityFilter, [], {
      selectedValue: "all",
      placeholder: "Спочатку оберіть область",
      allValue: "all"
    });
    return;
  }
  try {
    const cities = await loadCitiesForRegion(oblastId);
    renderCityOptionsInto(elements.cityFilter, cities, {
      selectedValue,
      placeholder: "Будь-яке місто",
      allValue: "all"
    });
  } catch (error) {
    console.warn("Cannot load cities from map.sqlite", error);
    renderCityOptionsInto(elements.cityFilter, [], {
      selectedValue: "all",
      placeholder: "Міста не завантажено",
      allValue: "all"
    });
  }
}

async function updateSearchDistrictOptions(selectedValue = "all") {
  if (!elements.districtFilter) return;
  const cityId = elements.cityFilter?.value || "all";
  if (!cityId || cityId === "all") {
    renderDistrictOptionsInto(elements.districtFilter, [], {
      selectedValue: "all",
      placeholder: "Спочатку оберіть місто",
      allValue: "all"
    });
    return;
  }
  try {
    const districts = await loadDistrictsForCity(cityId);
    renderDistrictOptionsInto(elements.districtFilter, districts, {
      selectedValue,
      placeholder: districts.length ? "Будь-який район" : "Районів не знайдено",
      allValue: "all"
    });
  } catch (error) {
    console.warn("Cannot load city districts from map.sqlite", error);
    renderDistrictOptionsInto(elements.districtFilter, [], {
      selectedValue: "all",
      placeholder: "Райони не завантажено",
      allValue: "all"
    });
  }
}

async function updatePublishCityOptions(selectedValue = "") {
  if (!elements.publishCitySelect) return;
  const oblastId = elements.regionSelect?.value || "";
  if (!oblastId) {
    renderCityOptionsInto(elements.publishCitySelect, [], {
      selectedValue: "",
      placeholder: "Спочатку оберіть область",
      allValue: ""
    });
    return;
  }
  try {
    const cities = await loadCitiesForRegion(oblastId);
    renderCityOptionsInto(elements.publishCitySelect, cities, {
      selectedValue,
      placeholder: "Оберіть місто",
      allValue: ""
    });
  } catch (error) {
    console.warn("Cannot load publish cities from map.sqlite", error);
    renderCityOptionsInto(elements.publishCitySelect, [], {
      selectedValue: "",
      placeholder: "Міста не завантажено",
      allValue: ""
    });
  }
}

function cityDisplayName(cityId) {
  const normalizedCityId = String(cityId || "").trim();
  if (!normalizedCityId) return "";
  return cityNameCache.get(normalizedCityId) || normalizedCityId;
}

function listingCityLabel(listing) {
  return cityDisplayName(listing?.city) || (listing?.formats || []).find((format) => format === "Онлайн") || "Не вказано";
}

async function loadCityName(cityId) {
  const normalizedCityId = String(cityId || "").trim();
  if (!normalizedCityId || cityNameCache.has(normalizedCityId)) return;
  try {
    const db = await loadMapDatabase();
    const cityValue = quoteSqlValue(normalizedCityId);
    const row = sqlRows(
      db,
      `SELECT name
      FROM entries
      WHERE type in (2, 5, 7, 8) and (l4_parent_id = ${cityValue} or l1_parent_id = ${cityValue})
      ORDER BY type asc
      LIMIT 1`
    )[0];
    if (row?.name) cityNameCache.set(normalizedCityId, String(row.name));
  } catch (error) {
    console.warn("Cannot resolve city name from map.sqlite", error);
  }
}

async function hydrateCityNames() {
  const cityIds = [...new Set([...listings, ...moderationItems].map((item) => item.city).filter(Boolean))];
  await Promise.all(cityIds.map((cityId) => loadCityName(cityId)));
}

function renderRegionOptions(regions, selectedValue = "") {
  renderRegionOptionsInto(elements.regionSelect, regions, {
    selectedValue,
    placeholder: "Оберіть область",
    allValue: ""
  });
}

function renderSearchRegionOptions(regions, selectedValue = "all") {
  renderRegionOptionsInto(elements.regionFilter, regions, {
    selectedValue,
    placeholder: "Будь-яка область",
    allValue: "all"
  });
}

async function loadRegionOptions() {
  if (!elements.regionSelect && !elements.regionFilter) return;
  const selectedPublishValue = elements.regionSelect?.value || "";
  const selectedSearchValue = elements.regionFilter?.value || "all";
  try {
    const db = await loadMapDatabase();
    const rows = sqlRows(db, "SELECT oblast_id, name FROM oblasti ORDER BY name");
    if (rows.length) {
      renderRegionOptions(rows, selectedPublishValue);
      renderSearchRegionOptions(rows, selectedSearchValue);
    }
    await updateSearchCityOptions(elements.cityFilter?.value || "all");
    await updateSearchDistrictOptions(elements.districtFilter?.value || "all");
    await updatePublishCityOptions(elements.publishCitySelect?.value || "");
    await hydrateCityNames();
    renderListings();
    renderModeration();
  } catch (error) {
    console.warn("Cannot load regions from map.sqlite", error);
    await updateSearchCityOptions("all");
    await updatePublishCityOptions("");
  }
}

function tableExists(db, tableName) {
  return Boolean(
    sqlRows(db, "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?", [tableName]).length
  );
}

function getUserTables(db) {
  return sqlRows(
    db,
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
  ).map((row) => row.name);
}

function getTableColumns(db, tableName) {
  return sqlRows(db, `PRAGMA table_info(${quoteSqlName(tableName)})`);
}

function setAdminView(viewName) {
  const activeView = viewName || "listings";
  elements.adminNavButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.adminView === activeView);
  });
  elements.adminViews.forEach((view) => {
    const isActive = view.dataset.adminViewPanel === activeView;
    view.hidden = !isActive;
    view.classList.toggle("is-active", isActive);
  });
  if (activeView === "reviews") renderAdminReviews();
  if (activeView === "catalog") renderAdminCatalog();
  if (activeView === "catalog-updates") renderCatalogUpdates();
  if (activeView === "specialist-users" || activeView === "parent-users") renderAdminUsers();
  if (activeView === "all-users") loadAllUsers();
  if (activeView === "email-settings") loadSmtpSettings();
}

let allDatabaseUsers = [];
let allUsersLoaded = false;

function setAllUsersStatus(message, type = "") {
  if (!elements.allUsersStatus) return;
  elements.allUsersStatus.textContent = message;
  elements.allUsersStatus.dataset.status = type;
}

function databaseUserDate(value) {
  if (!value) return "Не вказано";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("uk-UA", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

function renderAllUsers() {
  if (!elements.allUsersRows) return;
  const query = String(elements.allUsersSearch?.value || "").trim().toLowerCase();
  const users = allDatabaseUsers.filter((user) => {
    if (!query) return true;
    return [user.name, user.email, user.phone, user.id].some((value) => String(value || "").toLowerCase().includes(query));
  });
  elements.allUsersRows.innerHTML = users.length
    ? users.map((user) => `
        <article class="all-user-row" data-database-user="${user.id}">
          <span><strong>${escapeHtml(user.name || "Без імені")}</strong><small>ID: ${user.id}</small></span>
          <span class="contact-stack"><small>${escapeHtml(user.email || "Email не вказано")}</small><small>${escapeHtml(user.phone || "Телефон не вказано")}</small></span>
          <span>${escapeHtml(databaseUserDate(user.registeredAt))}<small>Останній вхід: ${escapeHtml(databaseUserDate(user.lastActive))}</small></span>
          <span><small>Оголошення: ${user.specialists}</small><small>Запити: ${user.requests}</small><small>Коментарі: ${user.comments}</small><small>Повідомлення: ${user.messages}</small></span>
          <span>${user.isAdmin
            ? ''
            : `<button class="danger-button all-user-delete" type="button" data-delete-database-user="${user.id}">Видалити</button>`}
          </span>
        </article>`).join("")
    : '<article class="all-user-row all-user-row-empty"><strong>Користувачів не знайдено</strong></article>';
}

async function adminUsersRequest(options = {}) {
  const response = await fetch("/api/admin/users.php", {
    credentials: "same-origin",
    headers: { Accept: "application/json", ...(options.body ? { "Content-Type": "application/json" } : {}) },
    ...options
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || "Не вдалося завантажити користувачів.");
  return result;
}

async function loadAllUsers(force = false) {
  if (!elements.allUsersRows || (allUsersLoaded && !force)) return;
  setAllUsersStatus("Завантажуємо користувачів...");
  try {
    const result = await adminUsersRequest();
    allDatabaseUsers = Array.isArray(result.users) ? result.users : [];
    allUsersLoaded = true;
    renderAllUsers();
    setAllUsersStatus(`Усього користувачів: ${allDatabaseUsers.length}`, "success");
  } catch (error) {
    setAllUsersStatus(error.message || "Не вдалося завантажити користувачів.", "error");
  }
}

async function deleteDatabaseUser(userId, button) {
  const user = allDatabaseUsers.find((item) => item.id === Number(userId));
  if (!user || user.isAdmin) return;
  const confirmed = window.confirm(`Видалити користувача «${user.name || user.email}» і всі пов'язані дані? Цю дію неможливо скасувати.`);
  if (!confirmed) return;
  button.disabled = true;
  setAllUsersStatus("Видаляємо користувача...");
  try {
    await adminUsersRequest({
      method: "POST",
      body: JSON.stringify({ userId: user.id, confirmation: "DELETE_USER" })
    });
    allDatabaseUsers = allDatabaseUsers.filter((item) => item.id !== user.id);
    renderAllUsers();
    setAllUsersStatus("Користувача та всі пов'язані дані видалено.", "success");
  } catch (error) {
    button.disabled = false;
    setAllUsersStatus(error.message || "Не вдалося видалити користувача.", "error");
  }
}

let smtpSettingsLoaded = false;

function setSmtpSettingsStatus(message, type = "") {
  if (!elements.smtpSettingsStatus) return;
  elements.smtpSettingsStatus.textContent = message;
  elements.smtpSettingsStatus.dataset.status = type;
}

async function smtpSettingsRequest(options = {}) {
  const response = await fetch("/api/admin/email-settings.php", {
    credentials: "same-origin",
    headers: { Accept: "application/json", ...(options.body ? { "Content-Type": "application/json" } : {}) },
    ...options
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || "Не вдалося зберегти налаштування SMTP.");
  return result.settings || {};
}

function fillSmtpSettings(settings) {
  const form = elements.smtpSettingsForm;
  if (!form) return;
  form.elements.siteName.value = settings.siteName || "Пошук фахівця";
  form.elements.mailFrom.value = settings.mailFrom || "";
  form.elements.host.value = settings.host || "mx1.mirohost.net";
  form.elements.port.value = settings.port || 465;
  form.elements.encryption.value = settings.encryption || "ssl";
  form.elements.username.value = settings.username || "";
  form.elements.password.value = "";
  if (elements.smtpPasswordHint) {
    elements.smtpPasswordHint.textContent = settings.passwordConfigured
      ? "Пароль уже збережено. Залиште поле порожнім, щоб не змінювати його."
      : "Введіть пароль поштової скриньки.";
  }
}

async function loadSmtpSettings() {
  if (!elements.smtpSettingsForm || smtpSettingsLoaded) return;
  setSmtpSettingsStatus("Завантажуємо налаштування...");
  try {
    const settings = await smtpSettingsRequest();
    fillSmtpSettings(settings);
    smtpSettingsLoaded = true;
    setSmtpSettingsStatus("");
  } catch (error) {
    setSmtpSettingsStatus(error.message || "Не вдалося завантажити налаштування SMTP.", "error");
  }
}

async function saveSmtpSettings(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const data = new FormData(form);
  setSmtpSettingsStatus("Зберігаємо...");
  try {
    const settings = await smtpSettingsRequest({
      method: "POST",
      body: JSON.stringify({
        siteName: String(data.get("siteName") || "").trim(),
        mailFrom: String(data.get("mailFrom") || "").trim(),
        host: String(data.get("host") || "").trim(),
        port: Number(data.get("port")),
        encryption: String(data.get("encryption") || ""),
        username: String(data.get("username") || "").trim(),
        password: String(data.get("password") || "")
      })
    });
    fillSmtpSettings(settings);
    smtpSettingsLoaded = true;
    setSmtpSettingsStatus("Налаштування SMTP збережено.", "success");
  } catch (error) {
    setSmtpSettingsStatus(error.message || "Не вдалося зберегти налаштування SMTP.", "error");
  }
}

function renderMetrics() {
  const reportsCount = moderationItems.reduce((sum, item) => sum + item.reports, 0);
  if (elements.metricPending) {
    elements.metricPending.textContent = moderationItems.filter((item) => item.status !== "archived").length;
  }
  if (elements.metricExpiring) {
    elements.metricExpiring.textContent = moderationItems.filter((item) => daysLeft(item) <= 3 && item.status !== "archived").length;
  }
  if (elements.metricReports) {
    elements.metricReports.textContent = reportsCount;
  }
  if (elements.metricArchived) {
    elements.metricArchived.textContent = moderationItems.filter((item) => item.status === "archived").length;
  }
}

function runExpirationSweep() {
  moderationItems = moderationItems.map((item) => {
    if (daysLeft(item) < 0 && item.status !== "archived") {
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

  elements.regionFilter?.addEventListener("change", async () => {
    selectedCategory = "all";
    await updateSearchCityOptions("all");
    await updateSearchDistrictOptions("all");
    renderCategories();
    renderListings();
  });

  elements.regionSelect?.addEventListener("change", async () => {
    await updatePublishCityOptions("");
  });

  elements.cityFilter?.addEventListener("change", async () => {
    selectedCategory = "all";
    await updateSearchDistrictOptions("all");
    renderCategories();
    renderListings();
  });

  [elements.districtFilter, elements.ratingFilter].forEach((control) => {
    control?.addEventListener("change", () => {
      selectedCategory = "all";
      renderCategories();
      renderListings();
    });
  });

  elements.formatFilters?.forEach((control) => {
    control.addEventListener("change", () => {
      selectedCategory = "all";
      updateFormatSummary();
      renderCategories();
      renderListings();
    });
  });

  document.addEventListener("click", (event) => {
    if (elements.formatSelect && !elements.formatSelect.contains(event.target)) {
      elements.formatSelect.open = false;
    }
    if (elements.specialistSelect && !elements.specialistSelect.contains(event.target)) {
      elements.specialistSelect.open = false;
    }
    if (elements.publishCategoryTree && !elements.publishCategoryTree.contains(event.target)) {
      elements.publishCategoryTree.open = false;
    }
  });

  document.querySelectorAll('input[name="formats"]').forEach((control) => {
    control.addEventListener("change", updatePlaceDistrictPanel);
  });
  updatePlaceDistrictPanel();

  elements.publishCategoryMenu?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-publish-category]");
    if (!button) return;
    selectPublishCategory(button.dataset.publishCategory || button.textContent.trim());
  });
  elements.publishSpecialty?.addEventListener("change", (event) => {
    const input = event.target.closest('input[name="specialtyOptions"]');
    if (!input) return;
    if (input.checked) {
      selectedPublishSpecialties.add(input.value);
    } else {
      selectedPublishSpecialties.delete(input.value);
    }
    renderSelectedPublishSpecialties();
  });
  elements.addCatalogSuggestion?.addEventListener("click", () => addCatalogSuggestionFromFields());

  elements.categoryList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    selectedCategory = button.dataset.category;
    clearSearchSpecialists();
    renderCategories();
    renderListings();
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
  elements.adminNavButtons.forEach((button) => {
    button.addEventListener("click", () => setAdminView(button.dataset.adminView));
  });
  elements.allUsersSearch?.addEventListener("input", renderAllUsers);
  elements.allUsersRows?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-database-user]");
    if (button) deleteDatabaseUser(button.dataset.deleteDatabaseUser, button);
  });
  elements.catalogSectionSelect?.addEventListener("change", () => {
    updateCatalogSelectors();
  });
  elements.catalogEditorForm?.addEventListener("submit", submitCatalogRecord);
  elements.smtpSettingsForm?.addEventListener("submit", saveSmtpSettings);
  elements.catalogCancelEdit?.addEventListener("click", () => {
    resetCatalogEditor();
    setCatalogStatus("");
  });
  elements.adminCatalogRows?.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit-catalog-record]");
    const deleteButton = event.target.closest("[data-delete-catalog-record]");
    if (editButton) {
      beginCatalogEdit(editButton.dataset.editCatalogRecord);
      return;
    }
    if (deleteButton) {
      deleteCatalogRecord(deleteButton.dataset.deleteCatalogRecord);
    }
  });
  elements.catalogUpdatesRows?.addEventListener("click", handleCatalogUpdateClick);
  loadPublishAccountContacts();
  elements.publishConsents?.forEach((control) => {
    control.addEventListener("change", updatePublishSubmitState);
  });
  updatePublishSubmitState();

  document.querySelector("#publishForm")?.addEventListener("click", (event) => {
    const removeSpecialtyButton = event.target.closest("[data-remove-specialty]");
    if (removeSpecialtyButton) {
      selectedPublishSpecialties.delete(removeSpecialtyButton.dataset.removeSpecialty);
      updatePublishSpecialtyOptions(false);
      return;
    }
  });

  document.querySelectorAll("[data-scroll-to]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(`#${button.dataset.scrollTo}`);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  elements.adminContactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`[Пошук фахівця] ${data.get("subject")}`);
    const body = encodeURIComponent(
      `Ім'я: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`
    );
    window.location.href = `mailto:${adminEmails.join(",")}?subject=${subject}&body=${body}`;
    if (elements.adminContactStatus) {
      elements.adminContactStatus.textContent = "Лист підготовлено для адміністраторів сайту.";
      applyLanguage(elements.adminContactStatus);
    }
  });

  document.querySelector("#publishForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    addCatalogSuggestionFromFields({ silent: true });
    const data = new FormData(event.currentTarget);
    const formats = data.getAll("formats");
    const phones = data.getAll("phones").map((value) => String(value).trim()).filter(Boolean);
    const email = normalizeEmail(data.get("email"));
    const specialistDistricts = data.getAll("specialistDistricts").map((value) => String(value).trim()).filter(Boolean);
    const studentDistricts = data.getAll("studentDistricts").map((value) => String(value).trim()).filter(Boolean);
    const allDistricts = [...new Set([...specialistDistricts, ...studentDistricts])];
    const regionId = String(data.get("region") || "").trim();
    const selectedRegionOption = elements.regionSelect?.selectedOptions?.[0];
    const regionName = String(selectedRegionOption?.dataset.regionName || selectedRegionOption?.textContent || regionId).trim();
    const cityId = String(data.get("city") || "").trim();
    const cityName = cityDisplayName(cityId);
    const specialtyCategory = data.get("specialtyCategory");
    const selectedSpecialties = data.getAll("specialties").map((value) => String(value).trim()).filter(Boolean);
    const primarySpecialty = selectedSpecialties[0];
    if (!primarySpecialty) {
      const status = document.querySelector("#publishStatus");
      if (status) {
        status.textContent = "Оберіть хоча б одну спеціальність.";
        applyLanguage(status);
      }
      return;
    }
    const autoDeleteDays = data.get("autoDeleteDays");
    const durationMinutes = Number(data.get("durationMinutes") || 60);
    const rawPaymentAmount = String(data.get("paymentAmount") || "").trim();
    const paymentAmount = rawPaymentAmount ? `${Number(rawPaymentAmount).toLocaleString("uk-UA")} ₴` : "не вказано";
    const notes = [
      `Опис: ${data.get("description")}`,
      `Категорія: ${specialtyCategory}`,
      `Спеціальності: ${selectedSpecialties.join(", ")}`,
      `Телефони: ${phones.length ? phones.join(", ") : "не вказано"}`,
      `Email: ${email || "не вказано"}`,
      `Область: ${regionName || "не вказано"}`,
      `ID області: ${regionId || "не вказано"}`,
      `Місто: ${cityName || "не вказано"}`,
      `ID міста: ${cityId || "не вказано"}`,
      `Місце занять: ${formats.length ? formats.join(", ") : "не вказано"}`,
      `Райони у фахівця: ${specialistDistricts.length ? specialistDistricts.join(", ") : "не вказано"}`,
      `Райони у учня: ${studentDistricts.length ? studentDistricts.join(", ") : "не вказано"}`,
      `Автовидалення: ${autoDeleteDays} днів`,
      `Вартість заняття: ${paymentAmount}`,
      `Тривалість заняття: ${durationMinutes} хв`
    ].join(" · ");
    const publishStatus = document.querySelector("#publishStatus");
    try {
      const response = await fetch("/api/account/listings.php", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          city: cityId,
          specialties: selectedSpecialties,
          formats,
          districts: allDistricts,
          phones,
          email,
          price: rawPaymentAmount || 0,
          durationMinutes,
          autoDeleteDays,
          description: data.get("description")
        })
      });
      const result = await response.json().catch(() => ({}));
      if (response.status === 401) {
        window.location.href = `auth.php?next=${encodeURIComponent("publish.html")}`;
        return;
      }
      if (!response.ok) throw new Error(result.message || "Не вдалося опублікувати оголошення.");
    } catch (error) {
      if (publishStatus) {
        publishStatus.textContent = error.message || "Не вдалося опублікувати оголошення.";
        applyLanguage(publishStatus);
      }
      return;
    }
    moderationItems.unshift({
      id: Date.now(),
      name: localStorage.getItem("siteUserName") || "Фахівець",
      specialty: primarySpecialty,
      specialties: selectedSpecialties,
      regionId,
      region: regionName,
      city: cityId,
      price: Number(rawPaymentAmount || 0),
      duration: durationMinutes,
      districts: allDistricts.join(", "),
      status: "pending",
      createdAt: today.toISOString().slice(0, 10),
      reports: 0,
      rating: null,
      notes,
      message: "Нове оголошення опубліковане фахівцем."
    });
    if (publishStatus) {
      publishStatus.textContent = "Оголошення опубліковано та додано до особистого кабінету.";
      applyLanguage(publishStatus);
    }
    event.currentTarget.reset();
    selectedPublishSpecialties.clear();
    updatePublishSpecialtyOptions();
    updatePublishCityOptions("");
    updatePlaceDistrictPanel();
    loadPublishAccountContacts();
    updatePublishSubmitState();
    setCatalogSuggestionStatus("");
    renderModeration();
  });

  document.querySelector("#reviewForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = document.querySelector("#reviewStatus");
    if (status) {
      status.textContent = "Відгук опубліковано.";
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
    const action = actionButton.dataset.action;
    moderationItems = moderationItems.map((item) => {
      if (item.id !== id) return item;
      if (action === "dismiss-report") {
        return {
          ...item,
          reports: 0,
          status: "approved",
          message: "Скаргу відхилено адміністратором. Оголошення залишено активним."
        };
      }
      return { ...item, status: action };
    });
    selectedModerationId = id;
    renderModeration();
    return;
  }

  if (renewButton) {
    renewItem(renewButton.dataset.renew);
  }
}

function init() {
  fillSelects();
  loadSearchCatalogTree();
  loadRegionOptions();
  runExpirationSweep();
  renderCategories();
  updateFormatSummary();
  updatePublishSubmitState();
  renderListings();
  renderSpecialtyGrid();
  renderModeration();
  renderAdminReviews();
  renderCatalogSelectors();
  renderCatalogUpdates();
  renderAdminUsers();
  setAdminView("listings");
  bindEvents();
  setLanguage(currentLang);
  setInterval(() => {
    runExpirationSweep();
    renderModeration();
  }, 60000);
}

init();
