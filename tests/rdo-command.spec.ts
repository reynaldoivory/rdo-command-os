// FILE: tests/rdo-command.spec.ts
// E2E Tests for RDO COMMAND OS.25
// Enterprise Test Suite with hydration-aware selectors

import { test, expect } from '@playwright/test';

test.describe('RDO COMMAND OS.25', () => {

    test.beforeEach(async ({ page }) => {
        // 1. Navigate to the app
        await page.goto('http://localhost:5173');

        // 2. Wait for the Critical Render Path (The Title)
        // This ensures React has hydrated and the "Dashboard" component mounted.
        await expect(page.locator('h1', { hasText: 'RDO COMMAND' })).toBeVisible({ timeout: 10000 });

        // 3. Reset State Logic (Simulate Fresh Spawn)
        await page.evaluate(() => {
            localStorage.clear();
            // We don't reload here because we want to test the app's ability to handle clean state
        });
    });

    // --- CORE UI TESTS ---

    test('renders main dashboard structure', async ({ page }) => {
        // Verify Header
        await expect(page.locator('h1')).toContainText('RDO COMMAND');

        // Verify Left Column (Wallet)
        await expect(page.getByText('Wallet State')).toBeVisible();

        // Verify Right Column (Cart)
        await expect(page.getByText('Purchase Plan')).toBeVisible();
    });

    test('Profile Manager toggle works', async ({ page }) => {
        // 1. Find the trigger button by data-testid
        const trigger = page.getByTestId('profile-trigger');
        await expect(trigger).toBeVisible();

        // 2. Click it
        await trigger.click();

        // 3. Verify dropdown appears (input for new profile name)
        await expect(page.getByTestId('new-profile-input')).toBeVisible();
    });

    test('Catalog Interaction (Add to Cart)', async ({ page }) => {
        // 1. Find an add-to-cart button by data-testid
        const addButton = page.getByTestId('add-to-cart-w_rev_navy');
        await expect(addButton).toBeVisible();

        // 2. Click Add
        await addButton.click();

        // 3. Verify Cart Count increases
        await expect(page.getByText(/1 items? selected/i)).toBeVisible();
    });

    // --- LOGIC TESTS ---

    test('Wallet Input Logic', async ({ page }) => {
        // Use semantic test IDs for stable selectors
        const cashInput = page.getByTestId('wallet-cash-input');

        // Fill cash value
        await cashInput.fill('500');

        // Verify value persisted
        await expect(cashInput).toHaveValue('500');
    });

    test('Mission Timer Toggle', async ({ page }) => {
        const timer = page.getByTestId('mission-timer');
        await expect(timer).toBeVisible();

        const toggleBtn = page.getByTestId('timer-toggle');

        // Initial State should be START
        await expect(toggleBtn).toContainText(/START/i);

        // Click Start
        await toggleBtn.click();
        await expect(toggleBtn).toContainText(/PAUSE/i);
    });

    test('Role cards display correctly', async ({ page }) => {
        // All 5 role cards should be visible
        await expect(page.getByTestId('role-card-bountyHunter')).toBeVisible();
        await expect(page.getByTestId('role-card-trader')).toBeVisible();
        await expect(page.getByTestId('role-card-collector')).toBeVisible();
        await expect(page.getByTestId('role-card-moonshiner')).toBeVisible();
        await expect(page.getByTestId('role-card-naturalist')).toBeVisible();
    });

});