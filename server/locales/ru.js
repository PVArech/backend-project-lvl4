// @ts-check

module.exports = {
  translation: {
    appName: 'Менеджер задач',
    flash: {
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      users: {
        create: {
          success: 'Пользователь успешно зарегистрирован',
          error: 'Не удалось зарегистрировать',
        },
        update: {
          success: 'Пользователь успешно изменён',
          error: 'Не удалось изменить пользователя',
        },
        delete: {
          success: 'Пользователь успешно удалён',
          error: 'Вы не можете редактировать или удалять другого пользователя',
          errorForeign: 'Не удалось удалить пользователя (пользователь связан с задачей)',
        },
      },
      statuses: {
        create: {
          success: 'Статус успешно создан',
          error: 'Не удалось создать статус',
        },
        update: {
          success: 'Статус успешно изменён',
          error: 'Не удалось изменить статус',
        },
        delete: {
          success: 'Статус успешно удалён',
          error: 'Не удалось удалить статус',
        },
      },
      tasks: {
        create: {
          success: 'Задача успешно создана',
          error: 'Не удалось создать задачу',
        },
        update: {
          success: 'Задача успешно изменёна',
          error: 'Не удалось изменить задачу',
        },
        delete: {
          success: 'Задача успешно удалена',
          error: 'Задачу может удалить только её автор',
          errorForeign: 'Не удалось удалить задачу',
        },
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        statuses: 'Статусы',
        tasks: 'Задачи',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
      },
    },
    views: {
      labels: {
        id: 'ID',
        fullName: 'Полное имя',
        firstName: 'Имя',
        lastName: 'Фамилия',
        email: 'Email',
        password: 'Пароль',
        name: 'Наименование',
        createdAt: 'Дата создания',
        status: 'Статус',
        statusId: 'Статус',
        creator: 'Автор',
        executor: 'Исполнитель',
        executorId: 'Исполнитель',
        description: 'Описание',
        edit: 'Изменить',
        delete: 'Удалить',
      },
      session: {
        new: {
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      users: {
        new: {
          signUp: 'Регистрация',
          submit: 'Сохранить',
        },
        edit: {
          signUp: 'Изменение пользователя',
          submit: 'Изменить',
        },
      },
      statuses: {
        newStatus: 'Создать статус',
        new: {
          signUp: 'Создание статуса',
          submit: 'Создать',
        },
        edit: {
          signUp: 'Изменение статуса',
          submit: 'Изменить',
        },
      },
      tasks: {
        newTask: 'Создать задачу',
        new: {
          signUp: 'Создание задачи',
          submit: 'Создать',
        },
        edit: {
          signUp: 'Изменение задачи',
          submit: 'Изменить',
        },
      },
      welcome: {
        index: {
          hello: 'Привет от Хекслета!',
          description: 'Практические курсы по программированию',
          more: 'Узнать Больше',
        },
      },
    },
  },
};
