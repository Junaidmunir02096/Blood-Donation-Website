import test from 'node:test';
import assert from 'node:assert/strict';
import { isCompatibleDonor, parseBloodGroupQuery } from '../src/constants/blood.js';
import { isValidPakistanPhone } from '../src/constants/pakistan.js';
import { formatDateInputValue, parseLocalDate } from '../src/utils/dateFormat.js';
import { getSafeInternalPath } from '../src/utils/navigation.js';
import { escapeCsvCell, rowsToCsv } from '../src/utils/csv.js';

test('safe redirects allow internal paths and reject external forms', () => {
  assert.equal(getSafeInternalPath('/dashboard?tab=settings'), '/dashboard?tab=settings');
  assert.equal(getSafeInternalPath('//example.com'), '/dashboard');
  assert.equal(getSafeInternalPath('/\\example.com'), '/dashboard');
  assert.equal(getSafeInternalPath('/%5Cexample.com'), '/dashboard');
  assert.equal(getSafeInternalPath('/%2Fexample.com'), '/dashboard');
  assert.equal(getSafeInternalPath('https://example.com'), '/dashboard');
});

test('blood-group parsing and compatibility use recipient rules', () => {
  assert.equal(parseBloodGroupQuery(' ab+ '), 'AB+');
  assert.equal(isCompatibleDonor('O-', 'AB+'), true);
  assert.equal(isCompatibleDonor('AB+', 'O-'), false);
});

test('Pakistan phone validation accepts supported local and international formats', () => {
  assert.equal(isValidPakistanPhone('0300-1234567'), true);
  assert.equal(isValidPakistanPhone('+923001234567'), true);
  assert.equal(isValidPakistanPhone('555-1234'), false);
});

test('date helpers preserve local calendar dates', () => {
  const date = parseLocalDate('2026-10-13');
  assert.equal(formatDateInputValue(date), '2026-10-13');
  assert.equal(parseLocalDate(''), null);
  assert.equal(parseLocalDate('2026-13-40'), null);
});

test('CSV output escapes punctuation and neutralizes spreadsheet formulas', () => {
  assert.equal(escapeCsvCell('Mayo Hospital, Lahore'), '"Mayo Hospital, Lahore"');
  assert.equal(escapeCsvCell('=HYPERLINK("bad")'), '"\'=HYPERLINK(""bad"")"');
  assert.equal(rowsToCsv([['Name', 'Value'], ['Donor', '+1']]), "Name,Value\nDonor,'+1");
});
