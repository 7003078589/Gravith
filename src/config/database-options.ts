// Multiple database configuration options to try
export const dbConfigOptions = [
  {
    name: "Option 1: Maha@Secure##",
    config: {
      user: 'postgres',
      host: 'localhost',
      database: 'Gravith_DB',
      password: 'Maha@Secure##',
      port: 5432,
    }
  },
  {
    name: "Option 2: postgres (common default)",
    config: {
      user: 'postgres',
      host: 'localhost',
      database: 'Gravith_DB',
      password: 'postgres',
      port: 5432,
    }
  },
  {
    name: "Option 3: admin (common default)",
    config: {
      user: 'postgres',
      host: 'localhost',
      database: 'Gravith_DB',
      password: 'admin',
      port: 5432,
    }
  },
  {
    name: "Option 4: password (common default)",
    config: {
      user: 'postgres',
      host: 'localhost',
      database: 'Gravith_DB',
      password: 'password',
      port: 5432,
    }
  },
  {
    name: "Option 5: root (common default)",
    config: {
      user: 'postgres',
      host: 'localhost',
      database: 'Gravith_DB',
      password: 'root',
      port: 5432,
    }
  },
  {
    name: "Option 6: Empty password",
    config: {
      user: 'postgres',
      host: 'localhost',
      database: 'Gravith_DB',
      password: '',
      port: 5432,
    }
  }
];
