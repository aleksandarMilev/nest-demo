import createNestApplication from './common/builders/app.builder.js';

void (async () =>
  (await createNestApplication())
    .withLogger()
    .withPipes()
    .withFilters()
    .withCors()
    .withSwagger()
    .run())();
