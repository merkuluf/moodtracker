# Система автоматизации процессов  в компании CDM
---

## 1. Введение

---

### 1.1. Цель

Основной целью проекта является объединение уже существующей автоматизации (Python скрипты, TargControl, Yandex.Tracker, 1C), перенос существующего workflow в кастомную систему менеджмента с улучшением и доработкой функицонала, отталкиваясь от обратной связи команды.

---

### 1.2. Область применения

В данный момент работа сотрудников компании во многом автоматизирована:

**Согласование**

В трекере есть типы задач которые должны пройти разные этапы согласования, поэтому система должна быть гибкой и независимой. В трекере есть большой плюс - нет жесткой иерархии в привязке задач. Тут можно от части повторить эту систему но доработав под нужды процессов компании.

**Закупки (работа с КА, офисом и складом)**

Существует настроеный пайплайн с интеграцией телеграм бота для ускорения согласования, оплаты и поставки необходимых материалов на площадку. Эти процессы затрагивают отдел снабжения, площадку и соглсование.

**Учет сотрудников**

1. Учет рабочего времени
    
    Есть автоматизированный процесс подсчета часов рабочих который включает в себя выгрузку часов из TargControl с помощью Python скрипта и автоматический подсчет заработанных денег для каждого сотрудника по каждому проекту на котором он работал.
    
2. Учет документов
    
    Существует дашборд в Yandex.Tracker в котором налажен процесс наблюдения за документами рабочих. Существует прототип системы извещения об истекающих патентах и система автоматической блокировки сотрудника в случае неоплаты или неизвещения об оплате патента.
    
3. Найм сотрудников
    
    Существует запрос на автоматизацию процесса заполнения анкет по фото документов, что упростит и ускорит процедуру оформления новых сотрудников. Важно, чтобы создаваемый пользовательский интерфейс был интуитивно понятным и удобным.
    

**Бухгалтерия**

Нет интеграции Yandex.Tracker с 1С и банковскими приложениями. Есть запрос на создание и автоматическую подачу документов в налоговую (например документы о выплатах сотрудникам) и привязки оплат из банка (например при оплате счета - отлавливать вебхук с сервера банка и привязывать чек к задаче). 

**Ведение проекта**

У каждого проекта существует свой дашборд в котором есть основная таблица (Бюджет - транзакции и Бюджет - задачи). В этой таблице ведется учет всех денежных средств задействованых в проекте, однако эти данные не связаны напрямую с сотрудниками, что заставляет вводить расходны на заработные платы самостоятельно. 

Также данный дашборд дает возможность общаться с офисом и создавать для него транзакции (ВАР, МАФ, Запросы, Акты приемки выполненных работ, документы) 

Но также есть разделы которые либо вообще не взаимиодействуют с workflow выстроенным в Yandex.Tracker либо взаимодействуют опосредованно и не имеют иерархического отношения с задачами, проектами, клиентами и так далее.

**Склад**

Отсутствует какая-либо информация о состоянии склада, которую можно было бы посмотреть в системе. Фактически существует материал и инструмент который возможно описан на складе, но для получения информации о котором - необходимо связываться с этим складом напрямую по телефону. Для площадки было бы удобнее создать заявку на товар со склада и после 

**Развитие**

Отсутствует любая автоматизация на этапе разработки новых клиентов. В Yandex.Tracker нет единой сущности клиента к которой привязываются его документы, проекты, ведущие его специалисты и так далее. Есть система контроля и выстроенные процессы, но нельзя сказать что это понятно и удобно.

Сметы на данный момент считаются вручную. Есть запрос на создание калькулятора смет.

---

## 2. Описание системы

---

### 2.1 Функциональные требования

Очень важно наличие файловой системы для всего приложения и сущностей Клиент, Проект и Склад.

- С каждым КА (Контрагентом) будет связан:
    - ИНН
    - Бановские реквизиты
    - Выписки
    - Договора и история взаимодействия (Проекты) →
- С каждый проектом будет связан пакет обязательных документов, без которых невозможна работа:
    - Первичка
    - КС-2,3
    - ВАРы
    - МАФы
    - Договора
- На складе будут хранится:
    - Накладные документы о поставках товара,
    - Фотографии прихода товара
    - Иная специфичная складу документация

Неоходимо упростить получение товара на площадке до чеклиста. Нужна история изменения статуса поставок. (склад - снабжение). После заказа товара сотрудником площадки - задача должна будет пройти несколько этапов до момента получения этого товара на площадке.

### Пример статусов завяки на заказ товара на площадку

1. Заявка открыта →
    
    Прораб или Начальник участка создал заявку. Заявка открыта и перенаправлена в отдел снабжения (Дамир)
    
2. Коммерческое предложение →
    
    Отдел снабжения получил заявку и собирает коммерческое предложение. Как только все готово - ставит в следущий этап.
    
3.  Согласование →
    
    Заявка проходит согласование  
    
4. Согласование 2 →
    
     Заявка проходит дополнительное согласование
    
5. В оплате →
    
    В отделе Финансов создается платежное поручение (Саша)
    
6. В банке →
    
    Казначейство (Кирилл или Ангелина) отправляет документы в банк  
    
7. Оплачено →
    
    Когда Казначейство оплатило заявку - она перенаправляется обратно в отдел снабжения (Дамир) 
    
8. Доставка →
    
    Снабжение договаривается о доставке и ставит статус 
    
9. Подтверждено 
    
    Когда материал приехал на площадку - создатель заявки проверяет материал по чеклисту, прикладывает фото и закрывает заявку как завершенную.
    

**Избавиться от родительских тикетов в задачах и создать явную иерархию.** Это будет реализовано при создании задачи. Задачи будут иметь нессколько статусов, которые будут зависеть от способа создания задачи. Если задача создана из вкладки клиента - она автоматически привяжется к нему. Если из вкладки проекта - будет применена такая же логика.

Для каждого этапа задачи надо назначать группу пользователей которые могу менять ей статус и высылать им оповещение

Добавить вкладку “Документы” на странице сущностей для легкого доступа к файловой системе.

При добавлении вара после согласовании надо сорздавать новую смету автоматически базируясь на сумме вара и сметы. Округлять до сотых на каждом этапе чтобы все сходилось.

Сейчас есть проблема с устройством сотрудников - слишком сложный процесс. Надо искать тарг айди и вбивать его вручную, фотка сама не грузится в тарг (из тарга). Необходимо облегчить процесс заполнения форм (например сканировать данные из фотографии и автоматически подставлять эту информацию в поля)

---

### 2.2 Нефункциональные требования

Система должна быть отказоустойчива и иметь разделение на модули, каждый из которых будет выполнять свою строго отведенную ему бизнес логику. Каждый модуль должен иметь свою собственную базу данных для снижения вероятности даунтайма всего приложения по причине проблем с соединением или базой.

Приложение должно быть безопасным, иметь разделение доступа по модулям, следовать четкой иерархии. Для этого будут созданы роли с доступами, которые можно будет настраивать и собирать как конструктор.

Учитывая модульную (микросервисную) архитектуру проиложения оно будет легко и быстро масштабируемым. Новые модули будут подключаться к Gateway сервису, который будет служить как система авторизации и маршрутизации запросов пользователя.

---

### 2.3 Интеграция

Для корректной автоматизации модуля “Финансы” необходимо интегрироваться с существующей системой учета 1С (создание задачи в нашей система при отправке каких-либо документов, платежей и тому подобном). 

Так-же для атвоматизации оплат необходимо интегрировать сервис с Tinkoff API (получать вебхук об успешной оплате того или иного счета для автоматического закрытия задачи или триггерить выплату по API).

Повторить уже существующую интеграцию с TargControl (пока не будет написан модуль доступа на площадку = расширен модуль “Учет сотрудников”. Это необходимо для подсчета часов и корректной работы модуля “Финансы”

Необходимо интегрироваться с АПИ сервисом отправки нотификаций сотрудникам (обновление патентов)

При наличии телеграм бота и/или сайта - можно интегрироваться с АПИ Telegram для автоматизации холодных лидов.

---

## 3. Архитектура системы

---

### 3.1 Общая архитектура

Проект будет использовать микросервисы. Точка входа в приложение будет Gateway сервис который будет иметь две задачи:

1. Авторизация, регистрация и права доступа
2. Маршрутизация запросов

Любой запрос пользователя, пройдя гейтвей сервис будет направлен на нужный сервис внутри закрытой системы посредством брокера сообщений, что позволит сохранять и отслеживать историю транзакций.

Каждый микросервис (любая зависимость gateway сервиса) будет иметь свою базу данных и сервисы не будут связаны  друг с другом, что позволит повысить отказоустойчивость всего приложения, безопасность данных и в целом будет следовать лучшим практикам соверменного программирования.

Приложение на первых этапах будет развернуто на арендованных серверах в докер контейнерах. Так же в идеале надо иметь локально расположеный NAS (Network Attached Storage) для хранения резервных копий базы данных. А так же и локальные версии нашего приложения для снижения риска отказа работы приложения.

Кроме технических мер, важно сосредоточиться на процессах и политике безопасности. Это включает обучение сотрудников, разработку строгих политик доступа и управления данными, а также проведение аудитов и тестов на проникновение. Эти меры помогут создать надежную систему, соответствующую высоким стандартам безопасности и защищающую конфиденциальные данные компании.

---

### 3.2 Технологический стек

- Язык программирования - JavaScript (TypeScript)
    
    JavaScript популярный и язык программирования широко используемый для создания как клиентских так и серверных приложений. Суперсет TypeScirpt позволяет строго типизировать всю кодовую базу, что облегчит написание кода в команде, повысит предсказумеость поведения системы и полностью избавит от ошибок runtime.
    
- Окружение
    
    Лучшее решение на данный момент - использовать систему контейниризации приложения - Docker. Это сильно облегчает процесс развертывания и увеличивает предсказуемость поведения. Облегчает процесс миграции и позволяет проектировать масштабируемое приложение, которое в будущем может оркестрироваться с помощью Kubernetes. 
    
- Транспорт
    
    Поскольку выбрана микросервисная архитектура - в данном случае необходим брокер сообщений который эти приложения связывал бы. Приложение может работать и обрабатывать специфичную логику как через брокер так и через HTTP запросы однако точкой старта для нашей архитектуры станет Kafka. Это log брокер сообщений который позволяет быстро развернуть сеть сервисов и сохранить историю событий.
    
- База Данных
    
    Для проекта который предполагает микросервисную архитектуру необходимо использоватьреляционную базу данных. Посколько каждый сервис будет иметь свою базу - реляции в каждой из них облегчат и повысят предсказуемиость поведения и запросов. PostgreSQL является лучшим решением, с удобными инструментами настроек конфигураций и резервных копий.
    
    - ORM
        
        В качестве ORM будет использована Prisma. Это современная модель которая позволяет писать запросы и управлять состоянием базы данных на языке JavaScript, поддерживает типизацию и имеет удобный интерфейс в виде CLI.
        
- Серверный Фреймворк
    
    Стандартом на рынке серверных приложения написанных на TypeScript является NestJS. Этот фреймворк построен с целью быть легкомасштабируемым, стирого типизированным и следующим всем принципам Объектно Ориентированного Программирования. В нем реализована инъекция зависимостей из коробки так же как и поддержка типизации. 
    
- Клиентский Фреймворк
    
    Лучшим решением для интерактивного клиентского приложения является React JS. Возможность скоростных ре-рендеров и компонентная архитектура позволяет ускорить время работы и сократить время написания кода. Так же React является одним из самых популярных решений для разработки клиентских приложений, что облегчит поддержку в будущем.
    

---

## 4. Модули системы

---

### 4.1 Модуль “Финансы”

### Описание

Модуль “Финансы” отвечает за автоматизацию финансовых операций, интеграцию с внешними системами учета и банками, а также за управление денежными потоками компании.

В нем будет реализован функционал подсчета затрат и доходов компании отталкиваясь от взаимодействия с клиентами (сметы, вары, транзакции и любые другние операции превносящие изменения в итоговую стоимость и доход от проекта)

### Функциональные требования

1. **Интеграция с 1С**
    - При отправке документов, платежей и другой информации в 1С надо так же высылать webhook из 1С на наш сервер и обрабатывать это событие (сохранять документ или менять его статус).
2. **Интеграция с банковскими приложениями**
    - Подключение к API банков для автоматического получения и обработки платежей.
    - Отлавливание вебхуков от банка для автоматического закрытия задач и привязки чеков к задачам.
3. **Управление денежными потоками**
    - Создание и ведение отчетов о финансовых потоках по проектам.
    - Управление бюджетом и транзакциями проекта.
    - Автоматическая генерация и обновление смет на основе данных из ВАРов.
    - Удобная визуализация расхода и поступления денежных средств.
4. **Обработка платежей и счетов**
    - Автоматическая обработка платежей и создание платежных поручений.
    - Согласование и ведение учета счетов и расходных накладных.

### Нефункциональные требования

- **Отказоустойчивость:** Использование механизма резервного копирования данных и интеграции с внешними сервисами.
- **Безопасность:** Шифрование данных при передаче и хранении, разграничение доступа по ролям.
- **Масштабируемость:** Возможность добавления новых интеграций и расширения функционала без значительных изменений в существующей архитектуре.

---

### 4.2 Модуль “Учет сотрудников”

### Описание

Модуль “Учет сотрудников” предназначен для автоматизации процессов учета рабочего времени, управления документами и найма новых сотрудников.

### Функциональные требования

1. **Учет рабочего времени**
    - Интеграция с TargControl для автоматического получения данных о рабочих часах.
    - Подсчет заработной платы сотрудников на основе отработанных часов и связанных проектов.
2. **Учет документов**
    - Хранение и управление документами сотрудников (например, патенты, паспорта).
    - Автоматическое извещение об истекающих патентах и блокировка доступа в случае неоплаты.
3. **Процесс найма сотрудников**
    - Автоматизация заполнения анкет и обработки документов при найме новых сотрудников.
    - Интуитивно понятный пользовательский интерфейс для упрощения заполнения анкет.

### Нефункциональные требования

- **Интерфейс:** Удобный и интуитивно понятный интерфейс для пользователей, работающих с документами и данными сотрудников.
- **Безопасность:** Защита персональных данных сотрудников, обеспечение конфиденциальности информации.

---

### 4.3 Модуль “Проектный менеджмент”

### Описание

Модуль “Проектный менеджмент” обеспечивает управление проектами, включая учет бюджета, задач и взаимодействие с офисом.

### Функциональные требования

1. **Управление проектами**
    - Создание и ведение дашбордов для каждого проекта.
    - Управление бюджетом, задачами и транзакциями проекта.
2. **Интеграция с офисом**
    - Возможность создания и обработки ВАРов, МАФов, актов приемки выполненных работ и других документов.
3. **История транзакций**
    - Ведение истории всех денежных операций и документов, связанных с проектом.

### Нефункциональные требования

- **Отказоустойчивость:** Механизмы резервного копирования и восстановления данных.
- **Производительность:** Оптимизация работы с большими объемами данных и документов.

---

### 4.4 Модуль “Склад”

### Описание

Модуль “Склад” отвечает за учет состояния склада, управление заявками на товар и интеграцию с другими модулями системы.

### Функциональные требования

1. **Учет склада**
    - Хранение информации о поставках, накладных и фотографиях прихода товара.
    - Обновление статуса заявок на товар и ведение истории изменений.
2. **Процесс заказа**
    - Управление заявками на товар с возможностью отслеживания статуса и этапов выполнения.
    - Интеграция с модулем снабжения для автоматизации процесса доставки товара.

### Нефункциональные требования

- **Доступность:** Возможность получения актуальной информации о состоянии склада в реальном времени.
- **Интерфейс:** Удобный интерфейс для создания и отслеживания заявок на товар.

---

### 4.5 Модуль “Развитие”

### Описание

Модуль “Развитие” включает в себя управление клиентами, сметами и процессами разработки новых клиентов.

### Функциональные требования

1. **Управление клиентами**
    - Создание и хранение информации о клиентах, проектах и связанных документах.
    - Автоматизация процесса создания и обработки новых запросов от клиентов.
2. **Калькулятор смет**
    - Автоматическое создание и обновление смет на основе данных о проекте.
    - Возможность настройки калькулятора для различных типов проектов и расходов.

### Нефункциональные требования

- **Гибкость:** Возможность настройки и адаптации калькулятора смет под различные требования.
- **Удобство:** Интуитивно понятный интерфейс для управления клиентами и сметами.

---

## 5. Тестирование

---

### 5.1 План тестирования

1. **Функциональное тестирование**
    - Проверка соответствия всех функциональных требований, описанных в ТЗ.
    - Тестирование всех интеграций и взаимодействий между модулями.
2. **Нагрузочное тестирование**
    - Проверка производительности системы при высоких нагрузках и больших объемах данных.
    - Тестирование масштабируемости и отказоустойчивости.
3. **Безопасностное тестирование**
    - Оценка уровня безопасности данных и процессов, включая защиту от несанкционированного доступа.
4. **Пользовательское тестирование**
    - Проверка удобства и интуитивности интерфейса для конечных пользователей.
    - Сбор обратной связи и внесение необходимых улучшений.

---

## 6. Внедрение и поддержка

---

### 6.1 Внедрение

1. **Планирование**
    - Разработка плана внедрения системы, включая временные рамки и ответственные лица.
    - Обучение сотрудников и подготовка документации.
2. **Запуск**
    - Развертывание системы на рабочем окружении.
    - Мониторинг работы системы и устранение возможных проблем.

### 6.2 Поддержка

1. **Техническая поддержка**
    - Обеспечение технической поддержки пользователей системы.
    - Регулярное обновление и поддержка системы в рабочем состоянии.
2. **Документация**
    - Обновление документации системы и пользовательских руководств.
    - Ведение базы знаний по вопросам использования системы и устранения неполадок.

---

## 7. Заключение

---

### 7.1 Резюме

Введение в систему автоматизации процессов компании CDM позволяет значительно улучшить существующий workflow, повысить эффективность работы и обеспечить интеграцию с необходимыми внешними системами. Обеспечение высокого уровня отказоустойчивости, безопасности и удобства использования является ключевыми аспектами успешной реализации проекта.