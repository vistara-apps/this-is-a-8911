# Shield Rights - Testing Guide

This document outlines the comprehensive testing strategy for the Shield Rights application, covering all features and integrations.

## 🧪 Testing Strategy

### Testing Pyramid
```
    ┌─────────────────┐
    │   E2E Tests     │  ← User workflows
    │   (Cypress)     │
    ├─────────────────┤
    │ Integration     │  ← API & Component integration
    │ Tests (Jest)    │
    ├─────────────────┤
    │   Unit Tests    │  ← Individual functions/components
    │   (Jest/RTL)    │
    └─────────────────┘
```

## 📋 Test Checklist

### Core Functionality Tests

#### ✅ User Onboarding
- [ ] Welcome screen displays correctly
- [ ] State selection works
- [ ] Tutorial navigation functions
- [ ] Account creation (optional) works
- [ ] Guest mode functions properly

#### ✅ Rights Card Display
- [ ] State-specific rights load correctly
- [ ] "Do Not Say" section displays
- [ ] Specific laws section shows
- [ ] Content is readable on mobile
- [ ] State switching updates content

#### ✅ Audio Recording
- [ ] Microphone permission request
- [ ] Recording starts/stops correctly
- [ ] Audio playback works
- [ ] Recording duration displays
- [ ] Multiple recordings supported

#### ✅ IPFS Upload (Premium)
- [ ] Upload button appears for premium users
- [ ] Upload progress indicator works
- [ ] Success confirmation displays
- [ ] IPFS hash is generated
- [ ] Gateway URL is accessible

#### ✅ AI Content Generation (Premium)
- [ ] Generate button appears for premium users
- [ ] Loading state displays
- [ ] Generated content appears
- [ ] Content is relevant and appropriate
- [ ] Error handling for API failures

#### ✅ Social Sharing
- [ ] Native share API works (mobile)
- [ ] Copy to clipboard functions
- [ ] SMS sharing works
- [ ] Email sharing works
- [ ] Generated content is included

#### ✅ Subscription Management
- [ ] Free tier limitations enforced
- [ ] Upgrade flow works
- [ ] Payment processing succeeds
- [ ] Subscription status updates
- [ ] Cancellation works

### API Integration Tests

#### ✅ OpenAI Integration
```javascript
// Test content generation
describe('OpenAI Service', () => {
  test('generates shareable content', async () => {
    const encounterData = { type: 'traffic_stop', notes: 'Test encounter' }
    const content = await OpenAIService.generateShareableContent(encounterData, 'CA')
    expect(content).toBeTruthy()
    expect(content.length).toBeGreaterThan(50)
  })

  test('translates scripts to Spanish', async () => {
    const englishText = "I want to remain silent"
    const spanishText = await OpenAIService.translateScript(englishText, 'es')
    expect(spanishText).toContain('silencio')
  })
})
```

#### ✅ Supabase Integration
```javascript
// Test database operations
describe('Supabase Service', () => {
  test('creates user record', async () => {
    const userData = { userId: 'test-123', selectedState: 'CA' }
    const result = await SupabaseService.createUser(userData)
    expect(result.user_id).toBe('test-123')
  })

  test('saves encounter record', async () => {
    const encounterData = {
      recordId: 'enc-123',
      userId: 'user-123',
      stateId: 'CA',
      timestamp: new Date().toISOString()
    }
    const result = await SupabaseService.saveEncounter(encounterData)
    expect(result.record_id).toBe('enc-123')
  })
})
```

#### ✅ Pinata IPFS Integration
```javascript
// Test IPFS upload
describe('Pinata Service', () => {
  test('uploads audio file to IPFS', async () => {
    const mockBlob = new Blob(['test audio'], { type: 'audio/wav' })
    const result = await PinataService.uploadAudioFile(mockBlob, 'test.wav')
    expect(result.ipfsHash).toBeTruthy()
    expect(result.gatewayUrl).toContain('ipfs')
  })
})
```

#### ✅ Stripe Integration
```javascript
// Test payment processing
describe('Stripe Service', () => {
  test('creates payment intent', async () => {
    const result = await StripeService.createPaymentIntent(3.99)
    expect(result.clientSecret).toBeTruthy()
  })

  test('creates subscription', async () => {
    const result = await StripeService.createSubscription('price_123', 'cus_123')
    expect(result.subscriptionId).toBeTruthy()
  })
})
```

### Component Tests

#### ✅ RecordButton Component
```javascript
import { render, screen, fireEvent } from '@testing-library/react'
import RecordButton from '../components/RecordButton'

describe('RecordButton', () => {
  test('renders inactive state', () => {
    render(<RecordButton />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  test('starts recording on click', () => {
    const mockCallback = jest.fn()
    render(<RecordButton onRecordingComplete={mockCallback} />)
    fireEvent.click(screen.getByRole('button'))
    // Add assertions for recording state
  })

  test('shows IPFS upload for premium users', () => {
    render(<RecordButton enableIPFSUpload={true} />)
    // Record audio first, then check for upload button
  })
})
```

#### ✅ ShareButton Component
```javascript
describe('ShareButton', () => {
  test('renders share options', () => {
    render(<ShareButton content="Test content" />)
    expect(screen.getByText('Share')).toBeInTheDocument()
    expect(screen.getByText('Copy')).toBeInTheDocument()
  })

  test('shows AI generation for premium users', () => {
    render(
      <ShareButton 
        content="Test" 
        enableAIGeneration={true}
        encounterData={{}}
        userState="CA"
      />
    )
    expect(screen.getByText('Generate AI Summary')).toBeInTheDocument()
  })
})
```

### End-to-End Tests

#### ✅ Complete User Journey (Cypress)
```javascript
// cypress/integration/user-journey.spec.js
describe('Complete User Journey', () => {
  it('completes onboarding and records encounter', () => {
    cy.visit('/')
    
    // Onboarding
    cy.contains('Welcome to Shield Rights').should('be.visible')
    cy.get('[data-testid="state-selector"]').select('CA')
    cy.get('[data-testid="continue-button"]').click()
    
    // Navigate to encounter page
    cy.get('[data-testid="encounter-button"]').click()
    
    // Start recording
    cy.get('[data-testid="record-button"]').click()
    cy.wait(2000) // Record for 2 seconds
    cy.get('[data-testid="record-button"]').click() // Stop recording
    
    // Verify recording saved
    cy.contains('Recording saved').should('be.visible')
  })

  it('handles premium upgrade flow', () => {
    cy.visit('/settings')
    
    // Click upgrade
    cy.get('[data-testid="upgrade-button"]').click()
    
    // Fill payment form (test mode)
    cy.get('[data-testid="card-number"]').type('4242424242424242')
    cy.get('[data-testid="card-expiry"]').type('1225')
    cy.get('[data-testid="card-cvc"]').type('123')
    
    // Submit payment
    cy.get('[data-testid="pay-button"]').click()
    
    // Verify upgrade success
    cy.contains('Premium').should('be.visible')
  })
})
```

### Performance Tests

#### ✅ Load Time Tests
```javascript
describe('Performance', () => {
  test('page loads within 3 seconds', async () => {
    const startTime = Date.now()
    await page.goto('http://localhost:5173')
    await page.waitForSelector('[data-testid="app-loaded"]')
    const loadTime = Date.now() - startTime
    expect(loadTime).toBeLessThan(3000)
  })

  test('audio recording starts quickly', async () => {
    const startTime = Date.now()
    await page.click('[data-testid="record-button"]')
    await page.waitForSelector('[data-testid="recording-indicator"]')
    const responseTime = Date.now() - startTime
    expect(responseTime).toBeLessThan(1000)
  })
})
```

### Security Tests

#### ✅ Data Protection
```javascript
describe('Security', () => {
  test('no sensitive data in localStorage', () => {
    // Check that API keys are not stored client-side
    const localStorage = window.localStorage
    const sensitiveKeys = ['api_key', 'secret', 'private']
    
    Object.keys(localStorage).forEach(key => {
      sensitiveKeys.forEach(sensitiveKey => {
        expect(key.toLowerCase()).not.toContain(sensitiveKey)
      })
    })
  })

  test('API endpoints require authentication', async () => {
    const response = await fetch('/api/user/123/subscription')
    expect(response.status).toBe(401) // Unauthorized
  })
})
```

### Accessibility Tests

#### ✅ A11y Compliance
```javascript
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('Accessibility', () => {
  test('main page has no accessibility violations', async () => {
    const { container } = render(<App />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  test('record button is keyboard accessible', () => {
    render(<RecordButton />)
    const button = screen.getByRole('button')
    button.focus()
    expect(button).toHaveFocus()
    
    fireEvent.keyDown(button, { key: 'Enter' })
    // Verify recording starts
  })
})
```

### Mobile Tests

#### ✅ Responsive Design
```javascript
describe('Mobile Responsiveness', () => {
  test('adapts to mobile viewport', () => {
    cy.viewport(375, 667) // iPhone SE
    cy.visit('/')
    
    // Check mobile-specific elements
    cy.get('[data-testid="mobile-nav"]').should('be.visible')
    cy.get('[data-testid="desktop-nav"]').should('not.be.visible')
  })

  test('touch interactions work', () => {
    cy.viewport('iphone-x')
    cy.visit('/encounter')
    
    // Test touch recording
    cy.get('[data-testid="record-button"]').trigger('touchstart')
    cy.get('[data-testid="record-button"]').trigger('touchend')
  })
})
```

## 🚀 Running Tests

### Setup Test Environment
```bash
# Install test dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom cypress

# Install API testing tools
npm install --save-dev supertest nock
```

### Run Unit Tests
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test RecordButton.test.js
```

### Run Integration Tests
```bash
# Start test database
npm run test:db:setup

# Run integration tests
npm run test:integration
```

### Run E2E Tests
```bash
# Start application
npm run dev

# Run Cypress tests
npm run cypress:open

# Run headless
npm run cypress:run
```

### Run Performance Tests
```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run performance audit
lhci autorun
```

## 📊 Test Coverage Goals

### Coverage Targets
- **Unit Tests**: 80%+ line coverage
- **Integration Tests**: All API endpoints
- **E2E Tests**: Critical user paths
- **Performance**: Core Web Vitals passing

### Critical Paths
1. User onboarding flow
2. Audio recording and playback
3. Payment processing
4. Content generation
5. Social sharing

## 🐛 Bug Reporting

### Test Failure Protocol
1. Capture screenshot/video
2. Log browser console errors
3. Record network requests
4. Document reproduction steps
5. Create GitHub issue with details

### Continuous Testing
- Run tests on every PR
- Performance tests on staging
- Security scans weekly
- Accessibility audits monthly

---

## ✅ Testing Checklist Summary

Before deploying to production, ensure all tests pass:

- [ ] Unit tests (80%+ coverage)
- [ ] Integration tests (all APIs)
- [ ] E2E tests (critical paths)
- [ ] Performance tests (< 3s load)
- [ ] Security tests (no vulnerabilities)
- [ ] Accessibility tests (WCAG AA)
- [ ] Mobile tests (responsive design)
- [ ] Cross-browser tests (Chrome, Safari, Firefox)

**Remember**: Testing is not just about finding bugs—it's about ensuring a great user experience and maintaining code quality as the application grows.
