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
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        update: {
          error: 'Не удалось изменить пользователя',
          success: 'Пользователь успешно изменён',
        },
        delete: {
          error: 'Вы не можете редактировать или удалять другого пользователя',
          success: 'Пользователь успешно удалён',
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
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        statuses: 'Статусы',
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
