/**
 * Mock Authentication API Service
 * Simulates backend network calls, JWT issuance, and user credential validation.
 */

// Pre-seeded test accounts
const MOCK_USERS = [
  {
    id: 'usr_rider_101',
    name: 'Alex Rider',
    email: 'rider@cab.com',
    phone: '+1 555-0199',
    role: 'rider',
    rating: 4.9,
  },
  {
    id: 'usr_driver_202',
    name: 'Sam Driver',
    email: 'driver@cab.com',
    phone: '+1 555-0144',
    role: 'driver',
    rating: 4.8,
    vehicle: {
      make: 'Toyota',
      model: 'Camry',
      plate: 'CAB-9921',
      color: 'Silver',
    },
  },
];

/**
 * Simulate network delay
 */
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock login call
 * Valid credentials:
 * - rider@cab.com / password123
 * - driver@cab.com / password123
 */
export async function mockLogin(email, password) {
  await delay(600);

  if (!email || !password) {
    throw new Error('Please enter both email and password.');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = MOCK_USERS.find((u) => u.email === normalizedEmail);

  if (!user || password !== 'password123') {
    throw new Error('Invalid email or password. (Hint: test with password123)');
  }

  // Generate simulated mock JWT token
  const fakeToken = `mock_jwt_token_${user.id}_${Date.now()}`;

  return {
    user,
    token: fakeToken,
  };
}

/**
 * Mock registration call
 */
export async function mockRegister(userData) {
  await delay(700);

  const { name, email, password, role = 'rider', phone, vehicle } = userData;

  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required.');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = MOCK_USERS.find((u) => u.email === normalizedEmail);
  if (existing) {
    throw new Error('An account with this email address already exists.');
  }

  const newUser = {
    id: `usr_${role}_${Date.now()}`,
    name,
    email: normalizedEmail,
    phone: phone || '+1 555-0000',
    role,
    rating: 5.0,
    ...(role === 'driver' ? { vehicle: vehicle || {} } : {}),
  };

  MOCK_USERS.push(newUser);
  const fakeToken = `mock_jwt_token_${newUser.id}_${Date.now()}`;

  return {
    user: newUser,
    token: fakeToken,
  };
}
