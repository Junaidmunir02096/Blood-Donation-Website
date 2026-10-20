import { test as base, request, APIRequestContext } from '@playwright/test';

/**
 * Custom fixture that provides an API request context with the correct baseURL
 * for testing the LifeStream API.
 */

type ApiFixtures = {
  apiRequest: APIRequestContext;
};

export const test = base.extend<ApiFixtures>({
  apiRequest: async ({}, use) => {
    // Create API request context directly using Playwright's request module
    const context = await request.newContext({
      baseURL: 'http://localhost:5000/api/v1',
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    await use(context);
    await context.dispose();
  },
});

export { expect } from '@playwright/test';