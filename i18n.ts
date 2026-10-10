export type Lang = 'uz' | 'ru'

const dict = {
  appName: { uz: 'TSD Ombor', ru: 'TSD Склад' },

  // Modules
  receiving: { uz: 'Qabul qilish', ru: 'Приёмка' },
  putaway: { uz: 'Joylashtirish', ru: 'Размещение' },
  picking: { uz: "Yig'ish", ru: 'Сборка' },
  packing: { uz: 'Upakofka', ru: 'Упаковка' },
  sorting: { uz: 'Saralash', ru: 'Сортировка' },
  relocation: { uz: "Ko'chirish", ru: 'Перемещение' },
  shipping: { uz: "Jo'natish", ru: 'Отгрузка' },
  inventory: { uz: 'Inventarizatsiya', ru: 'Инвентаризация' },

  // Navigation
  home: { uz: 'Asosiy', ru: 'Главная' },
  alerts: { uz: 'Xabarlar', ru: 'Уведомл.' },
  sync: { uz: 'Sinxron', ru: 'Синхр.' },
  profile: { uz: 'Profil', ru: 'Профиль' },
  scan: { uz: 'Skaner', ru: 'Скан' },

  // Status bar
  online: { uz: 'Onlayn', ru: 'Онлайн' },
  offline: { uz: 'Oflayn', ru: 'Офлайн' },
  zone: { uz: 'Zona', ru: 'Зона' },
  device: { uz: 'Qurilma', ru: 'Устройство' },
  battery: { uz: 'Batareya', ru: 'Батарея' },
  operator: { uz: 'Operator', ru: 'Оператор' },

  // Steps
  stepScan: { uz: 'Skanerlash', ru: 'Скан' },
  stepCount: { uz: 'Sanash', ru: 'Подсчёт' },
  stepConfirm: { uz: 'Tasdiqlash', ru: 'Подтверждение' },
  stepAccept: { uz: 'Qabul', ru: 'Принять' },
  stepPick: { uz: "Yig'ish", ru: 'Сбор' },
  stepBox: { uz: 'Quti', ru: 'Коробка' },
  stepPack: { uz: 'Qadoqlash', ru: 'Упаковка' },
  stepRoute: { uz: "Yo'nalish", ru: 'Маршрут' },
  stepVehicle: { uz: 'Mashina', ru: 'Машина' },
  stepLoad: { uz: 'Yuklash', ru: 'Погрузка' },
  stepItem: { uz: 'Mahsulot', ru: 'Товар' },
  stepFrom: { uz: 'Qayerdan', ru: 'Откуда' },
  stepTo: { uz: 'Qayerga', ru: 'Куда' },
  stepOf: { uz: '{n}-qadam / {total}', ru: 'Шаг {n} из {total}' },

  // Common
  back: { uz: 'Orqaga', ru: 'Назад' },
  scanPlaceholder: { uz: 'Kodni skanerlang yoki kiriting', ru: 'Отсканируйте или введите код' },
  manualInput: { uz: "Qo'lda kiritish", ru: 'Ручной ввод' },
  demoCodes: { uz: "Namuna kodlar (o'quv rejimi)", ru: 'Тестовые коды (обучение)' },
  invalidCode: { uz: 'Kod topilmadi: {code}', ru: 'Код не найден: {code}' },
  scanNext: { uz: 'Keyingisini skanerlash', ru: 'Сканировать следующий' },
  done: { uz: 'Bajarildi', ru: 'Готово' },
  pcs: { uz: 'dona', ru: 'шт.' },
  total: { uz: 'Jami', ru: 'Итого' },
  remaining: { uz: 'Qoldi', ru: 'Осталось' },
  accepted: { uz: 'Qabul qilindi', ru: 'Принято' },
  expected: { uz: 'Kutilgan', ru: 'Ожидается' },
  cell: { uz: 'Yacheyka', ru: 'Ячейка' },
  finish: { uz: 'Yakunlash', ru: 'Завершить' },
  cancel: { uz: 'Bekor qilish', ru: 'Отмена' },
  next: { uz: 'Davom etish', ru: 'Далее' },
  quantity: { uz: 'Miqdor', ru: 'Количество' },
  of: { uz: 'dan', ru: 'из' },
  decrease: { uz: 'Kamaytirish', ru: 'Уменьшить' },
  increase: { uz: 'Oshirish', ru: 'Увеличить' },
  wrongItem: { uz: "Noto'g'ri mahsulot", ru: 'Неверный товар' },
  itemAlreadyComplete: { uz: "Bu mahsulot to'liq bajarilgan", ru: 'Этот товар уже выполнен' },
  goHome: { uz: 'Asosiy sahifaga', ru: 'На главную' },

  // Dashboard
  greeting: { uz: 'Xayrli kun, {name}', ru: 'Добрый день, {name}' },
  dashHint: {
    uz: 'Modulni tanlang yoki pastdagi tugma bilan kodni skanerlang',
    ru: 'Выберите модуль или отсканируйте код кнопкой внизу',
  },
  modulesTitle: { uz: 'Modullar', ru: 'Модули' },
  pending: { uz: 'kutmoqda', ru: 'ожидает' },
  shiftInfo: { uz: 'Smena: 08:00 – 20:00', ru: 'Смена: 08:00 – 20:00' },

  // Receiving
  recvScanTitle: { uz: 'Nakladnoy QR kodini skanerlang', ru: 'Отсканируйте QR-код накладной' },
  recvScanHint: {
    uz: 'Skanerni nakladnoydagi QR kodga yaqinlashtiring',
    ru: 'Поднесите сканер к QR-коду на накладной',
  },
  waybill: { uz: 'Nakladnoy', ru: 'Накладная' },
  supplier: { uz: 'Yetkazib beruvchi', ru: 'Поставщик' },
  recvCountHint: {
    uz: "Har bir mahsulot sonini tekshiring va to'g'rilang",
    ru: 'Проверьте и при необходимости исправьте количество',
  },
  totalAccepted: { uz: 'Jami qabul qilindi', ru: 'Всего принято' },
  sendToPutaway: { uz: 'Joylashtirishga yuborish', ru: 'Отправить на размещение' },
  recvDone: { uz: 'Nakladnoy joylashtirishga yuborildi', ru: 'Накладная отправлена на размещение' },
  waybillAlreadyReceived: { uz: 'Bu nakladnoy allaqachon qabul qilingan', ru: 'Эта накладная уже принята' },
  openPutaway: { uz: 'Joylashtirishni boshlash', ru: 'Начать размещение' },

  // Putaway
  putScanTitle: { uz: 'Kiruvchi nakladnoy QR kodini skanerlang', ru: 'Отсканируйте QR-код входящей накладной' },
  putScanHint: {
    uz: 'Faqat qabul qilingan nakladnoylar joylashtiriladi',
    ru: 'Размещаются только принятые накладные',
  },
  putScanItem: { uz: 'Mahsulot shtrix-kodini skanerlang', ru: 'Отсканируйте штрихкод товара' },
  placeIn: { uz: 'Shu yacheykaga joylang', ru: 'Разместите в ячейку' },
  putNotReady: { uz: 'Nakladnoy hali qabul qilinmagan', ru: 'Накладная ещё не принята' },
  putAlreadyDone: { uz: "Nakladnoy to'liq joylashtirilgan", ru: 'Накладная полностью размещена' },
  putDone: { uz: 'Barcha mahsulotlar joylashtirildi', ru: 'Все товары размещены' },
  itemNotInWaybill: { uz: "Bu mahsulot nakladnoyda yo'q", ru: 'Этого товара нет в накладной' },
  lastPlaced: { uz: 'Oxirgi skanerlangan', ru: 'Последний товар' },
  remainingItems: { uz: 'Qolgan mahsulotlar', ru: 'Осталось товаров' },

  // Picking
  newTask: { uz: 'Yangi topshiriq', ru: 'Новое задание' },
  order: { uz: 'Buyurtma', ru: 'Заказ' },
  rows: { uz: 'qator', ru: 'строк' },
  acceptTask: { uz: 'Topshiriqni qabul qilish', ru: 'Принять задание' },
  waitingOrders: { uz: 'Buyurtmalar kutilmoqda...', ru: 'Ожидание заказов...' },
  waitingHint: { uz: 'Yangi buyurtma avtomatik keladi', ru: 'Новый заказ придёт автоматически' },
  pickScanItem: { uz: 'Qatordagi mahsulotni skanerlang', ru: 'Отсканируйте товар из ячейки' },
  finishPicking: { uz: "Yig'ishni yakunlash", ru: 'Завершить сборку' },
  scanBoxTitle: { uz: 'Qutining QR kodini skanerlang', ru: 'Отсканируйте QR-код коробки' },
  scanBoxHint: {
    uz: "Yig'ilgan mahsulotlarni alohida qutiga soling va QR kodini skanerlang",
    ru: 'Сложите товары в отдельную коробку и отсканируйте её QR-код',
  },
  boxInUse: { uz: 'Bu quti band', ru: 'Эта коробка занята' },
  invalidBox: { uz: 'Quti kodi BOX- bilan boshlanishi kerak', ru: 'Код коробки должен начинаться с BOX-' },
  pickDone: { uz: "Mahsulotlar qutiga bog'landi", ru: 'Товары привязаны к коробке' },
  inQueue: { uz: 'Navbatda: {n}', ru: 'В очереди: {n}' },
  nextTask: { uz: 'Keyingi topshiriq', ru: 'Следующее задание' },
  destinationShort: { uz: "Yo'nalish", ru: 'Маршрут' },

  // Packing
  packScanTitle: { uz: "Yig'ish qutisining QR kodini skanerlang", ru: 'Отсканируйте QR-код коробки сборки' },
  packScanHint: {
    uz: 'Qadoqlash topshirig\u2018i qutidan avtomatik olinadi',
    ru: 'Задание на упаковку загрузится автоматически',
  },
  packScanItem: { uz: 'Qadoqlanayotgan mahsulotni skanerlang', ru: 'Отсканируйте упаковываемый товар' },
  boxNotFound: { uz: 'Quti topilmadi yoki tayyor emas', ru: 'Коробка не найдена или не готова' },
  scanPackageTitle: { uz: 'Yakuniy quti QR kodini skanerlang', ru: 'Отсканируйте QR-код итоговой коробки' },
  scanPackageHint: {
    uz: "Qadoqlangan mahsulotlar yakuniy qutiga bog'lanadi",
    ru: 'Упакованные товары будут привязаны к итоговой коробке',
  },
  invalidPackage: { uz: 'Kod PKG- bilan boshlanishi kerak', ru: 'Код должен начинаться с PKG-' },
  packageInUse: { uz: 'Bu yakuniy quti band', ru: 'Эта итоговая коробка занята' },
  packDone: { uz: 'Qadoqlash yakunlandi', ru: 'Упаковка завершена' },
  continuePack: { uz: "Yakuniy qutiga o'tish", ru: 'Перейти к итоговой коробке' },
  packed: { uz: 'Qadoqlandi', ru: 'Упаковано' },

  // Sorting
  sortScanTitle: { uz: 'Qadoqlangan quti QR kodini skanerlang', ru: 'Отсканируйте QR-код упакованной коробки' },
  sortScanHint: { uz: "Tizim yo'nalishni ko'rsatadi", ru: 'Система покажет маршрут' },
  sortScanRoute: { uz: "{route} yo'nalish qutisini skanerlang", ru: 'Отсканируйте коробку маршрута {route}' },
  putInto: { uz: 'Shu qutiga soling', ru: 'Положите в коробку' },
  wrongRoute: { uz: "Noto'g'ri yo'nalish! Kerak: {route}", ru: 'Неверный маршрут! Нужно: {route}' },
  notRouteBox: { uz: "Bu yo'nalish qutisi emas", ru: 'Это не коробка маршрута' },
  packageNotReady: { uz: 'Quti saralashga tayyor emas', ru: 'Коробка не готова к сортировке' },
  sortDone: { uz: '{route} qutisiga saralandi', ru: 'Отсортировано в {route}' },
  routeBoxes: { uz: "Yo'nalish qutilari", ru: 'Коробки маршрутов' },

  // Shipping
  shipScanTitle: { uz: 'Haydovchi mashinasi QR kodini skanerlang', ru: 'Отсканируйте QR-код автомобиля' },
  shipScanHint: { uz: 'QR kod davlat raqami yonida joylashgan', ru: 'QR-код расположен рядом с госномером' },
  vehicleNotFound: { uz: 'Mashina topilmadi', ru: 'Автомобиль не найден' },
  driver: { uz: 'Haydovchi', ru: 'Водитель' },
  loadingSession: { uz: 'Yuklash sessiyasi', ru: 'Сессия погрузки' },
  loadedItems: { uz: 'Yuklangan mahsulotlar', ru: 'Загружено товаров' },
  loadedBoxes: { uz: 'Qutilar', ru: 'Коробки' },
  loadedPackages: { uz: 'Joylar', ru: 'Места' },
  shipScanBox: { uz: "Tayyor yo'nalish qutisini skanerlang", ru: 'Отсканируйте готовую коробку маршрута' },
  boxEmpty: { uz: "Quti bo'sh", ru: 'Коробка пуста' },
  alreadyLoaded: { uz: 'Allaqachon yuklangan', ru: 'Уже загружено' },
  finishLoading: { uz: 'Yuklashni yakunlash', ru: 'Завершить погрузку' },
  shipDone: { uz: "Mashina jo'natildi", ru: 'Автомобиль отправлен' },
  loadedList: { uz: 'Yuklanganlar', ru: 'Загружено' },
  nothingLoaded: { uz: 'Hali hech narsa yuklanmagan', ru: 'Пока ничего не загружено' },

  // Relocation
  relScanSource: { uz: 'Joriy yacheykani skanerlang', ru: 'Отсканируйте исходную ячейку' },
  relScanSourceHint: { uz: "Mahsulot hozir turgan yacheyka", ru: 'Ячейка, где сейчас лежит товар' },
  relScanItem: { uz: 'Mahsulotni skanerlang', ru: 'Отсканируйте товар' },
  relScanTarget: { uz: 'Yangi yacheykani skanerlang', ru: 'Отсканируйте новую ячейку' },
  cellNotFound: { uz: 'Yacheyka topilmadi', ru: 'Ячейка не найдена' },
  cellEmpty: { uz: "Yacheyka bo'sh", ru: 'Ячейка пуста' },
  cellOccupied: { uz: 'Yacheykada boshqa mahsulot bor', ru: 'В ячейке другой товар' },
  sameCell: { uz: 'Boshqa yacheykani tanlang', ru: 'Выберите другую ячейку' },
  relDone: { uz: "Mahsulot ko'chirildi", ru: 'Товар перемещён' },
  available: { uz: 'Mavjud', ru: 'Доступно' },

  // Inventory
  invScanCell: { uz: 'Tekshiriladigan yacheykani skanerlang', ru: 'Отсканируйте ячейку для проверки' },
  invScanCellHint: { uz: "Yacheyka yorlig'idagi QR kod", ru: 'QR-код на этикетке ячейки' },
  invCountHint: { uz: 'Yacheykadagi har bir mahsulotni skanerlang', ru: 'Отсканируйте каждый товар в ячейке' },
  counted: { uz: 'Sanaldi', ru: 'Подсчитано' },
  inSystem: { uz: 'Tizimda', ru: 'В системе' },
  confirmCount: { uz: 'Natijani tasdiqlash', ru: 'Подтвердить результат' },
  invMatch: { uz: "Farq yo'q", ru: 'Расхождений нет' },
  invDiff: { uz: 'Farq: {n} dona', ru: 'Расхождение: {n} шт.' },
  invDone: { uz: 'Inventarizatsiya saqlandi', ru: 'Инвентаризация сохранена' },
  emptyCellCount: { uz: "Bo'sh yacheyka", ru: 'Пустая ячейка' },

  // Alerts
  alertsTitle: { uz: 'Xabarlar', ru: 'Уведомления' },
  noAlerts: { uz: "Yangi xabarlar yo'q", ru: 'Нет новых уведомлений' },
  markAllRead: { uz: "Barchasini o'qilgan deb belgilash", ru: 'Отметить все прочитанными' },
  alertNewOrder: { uz: 'Yangi buyurtma keldi: {id}', ru: 'Поступил новый заказ: {id}' },
  alertShift: { uz: 'Smena boshlandi. Omad!', ru: 'Смена начата. Удачи!' },
  alertWaybill: { uz: 'Yangi nakladnoy kutilmoqda: {id}', ru: 'Ожидается новая накладная: {id}' },
  alertDiscrepancy: { uz: 'Inventarizatsiyada farq: {id}', ru: 'Расхождение при инвентаризации: {id}' },
  alertShipped: { uz: "Mashina jo'natildi: {id}", ru: 'Автомобиль отправлен: {id}' },

  // Sync
  syncTitle: { uz: 'Sinxronlash', ru: 'Синхронизация' },
  lastSync: { uz: 'Oxirgi sinxronlash', ru: 'Последняя синхронизация' },
  pendingOps: { uz: 'Yuborilmagan amallar', ru: 'Неотправленные операции' },
  syncNow: { uz: 'Hozir sinxronlash', ru: 'Синхронизировать' },
  syncing: { uz: 'Sinxronlanmoqda...', ru: 'Синхронизация...' },
  synced: { uz: "Ma'lumotlar yangilandi", ru: 'Данные обновлены' },
  connection: { uz: 'Ulanish', ru: 'Подключение' },
  server: { uz: 'Server', ru: 'Сервер' },
  simulateOffline: { uz: 'Oflayn rejimni sinash', ru: 'Проверить офлайн-режим' },
  offlineWarn: { uz: "Tarmoq yo'q. Amallar saqlanadi", ru: 'Нет сети. Операции сохраняются' },

  // Profile
  shift: { uz: 'Smena', ru: 'Смена' },
  employeeId: { uz: 'Xodim ID', ru: 'Табельный №' },
  scansToday: { uz: 'Bugungi skanlar', ru: 'Сканов сегодня' },
  tasksDone: { uz: 'Bajarilgan amallar', ru: 'Выполнено операций' },
  language: { uz: 'Til', ru: 'Язык' },
  trainingMode: { uz: "O'quv rejimi", ru: 'Режим обучения' },
  trainingHint: { uz: "Skan maydonida namuna kodlar ko'rsatiladi", ru: 'Показывать тестовые коды у поля сканирования' },
  role: { uz: 'Ombor xodimi', ru: 'Сотрудник склада' },

  // Global scan
  globalScanTitle: { uz: 'Istalgan kodni skanerlang', ru: 'Отсканируйте любой код' },
  globalScanHint: { uz: 'Tizim kerakli modulni o\u2018zi ochadi', ru: 'Система сама откроет нужный модуль' },
  close: { uz: 'Yopish', ru: 'Закрыть' },
} satisfies Record<string, Record<Lang, string>>

export type TKey = keyof typeof dict
export type TParams = Record<string, string | number>

export function translate(lang: Lang, key: TKey, params?: TParams) {
  let text: string = dict[key][lang]
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replaceAll(`{${k}}`, String(v))
    }
  }
  return text
}
