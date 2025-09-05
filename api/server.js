/**
 * Shield Rights Backend API Server
 * Handles server-side operations including Stripe payments
 */

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
dotenv.config()

const app = express()
const port = process.env.PORT || 3000

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

/**
 * Stripe Payment Endpoints
 */

// Create payment intent for subscription
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', metadata = {} } = req.body

    if (!amount || amount < 50) {
      return res.status(400).json({ error: 'Invalid amount' })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        app: 'shield-rights',
        ...metadata
      },
      automatic_payment_methods: {
        enabled: true
      }
    })

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    })
  } catch (error) {
    console.error('Payment intent creation failed:', error)
    res.status(500).json({ error: 'Payment intent creation failed' })
  }
})

// Create subscription
app.post('/api/create-subscription', async (req, res) => {
  try {
    const { priceId, customerId, userId } = req.body

    if (!priceId || !customerId) {
      return res.status(400).json({ error: 'Missing required parameters' })
    }

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        app: 'shield-rights',
        userId: userId || ''
      }
    })

    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      status: subscription.status
    })
  } catch (error) {
    console.error('Subscription creation failed:', error)
    res.status(500).json({ error: 'Subscription creation failed' })
  }
})

// Create customer
app.post('/api/create-customer', async (req, res) => {
  try {
    const { email, name, userId } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        app: 'shield-rights',
        userId: userId || ''
      }
    })

    res.json({
      customerId: customer.id,
      email: customer.email
    })
  } catch (error) {
    console.error('Customer creation failed:', error)
    res.status(500).json({ error: 'Customer creation failed' })
  }
})

// Cancel subscription
app.post('/api/cancel-subscription', async (req, res) => {
  try {
    const { subscriptionId, userId } = req.body

    if (!subscriptionId) {
      return res.status(400).json({ error: 'Subscription ID is required' })
    }

    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    })

    // Update user subscription status in Supabase
    if (userId) {
      await supabase
        .from('users')
        .update({ 
          subscription_status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
    }

    res.json({
      subscriptionId: subscription.id,
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    })
  } catch (error) {
    console.error('Subscription cancellation failed:', error)
    res.status(500).json({ error: 'Subscription cancellation failed' })
  }
})

// Webhook endpoint for Stripe events
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        console.log('Payment succeeded:', paymentIntent.id)
        break

      case 'invoice.payment_succeeded':
        const invoice = event.data.object
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription)
        
        // Update user subscription status in Supabase
        if (subscription.metadata.userId) {
          await supabase
            .from('users')
            .update({ 
              subscription_status: 'active',
              subscription_expiry: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('user_id', subscription.metadata.userId)
        }
        break

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object
        console.log('Payment failed for invoice:', failedInvoice.id)
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object
        
        // Update user subscription status in Supabase
        if (deletedSubscription.metadata.userId) {
          await supabase
            .from('users')
            .update({ 
              subscription_status: 'cancelled',
              updated_at: new Date().toISOString()
            })
            .eq('user_id', deletedSubscription.metadata.userId)
        }
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    res.status(500).json({ error: 'Webhook handler failed' })
  }
})

/**
 * Content Generation Endpoints
 */

// Generate shareable content using OpenAI
app.post('/api/generate-content', async (req, res) => {
  try {
    const { encounterData, userState, userId } = req.body

    if (!encounterData || !userState) {
      return res.status(400).json({ error: 'Missing required parameters' })
    }

    // Verify user has access (premium feature)
    if (userId) {
      const { data: user } = await supabase
        .from('users')
        .select('subscription_status')
        .eq('user_id', userId)
        .single()

      if (!user || user.subscription_status !== 'active') {
        return res.status(403).json({ error: 'Premium subscription required' })
      }
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a legal rights educator. Generate concise, shareable summaries of legal encounters that educate others about their rights. Keep it factual, non-inflammatory, and educational.'
          },
          {
            role: 'user',
            content: `Generate a shareable summary for a legal encounter in ${userState}. Include key rights information and what was learned. Encounter details: ${JSON.stringify(encounterData)}`
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const generatedContent = data.choices[0]?.message?.content || 'Unable to generate content'

    res.json({ content: generatedContent })
  } catch (error) {
    console.error('Content generation failed:', error)
    res.status(500).json({ error: 'Content generation failed' })
  }
})

/**
 * User Management Endpoints
 */

// Get user subscription status
app.get('/api/user/:userId/subscription', async (req, res) => {
  try {
    const { userId } = req.params

    const { data: user, error } = await supabase
      .from('users')
      .select('subscription_status, subscription_expiry')
      .eq('user_id', userId)
      .single()

    if (error) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      subscriptionStatus: user.subscription_status,
      subscriptionExpiry: user.subscription_expiry,
      isPremium: user.subscription_status === 'active'
    })
  } catch (error) {
    console.error('User subscription fetch failed:', error)
    res.status(500).json({ error: 'Failed to fetch subscription status' })
  }
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error)
  res.status(500).json({ error: 'Internal server error' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

// Start server
app.listen(port, () => {
  console.log(`Shield Rights API server running on port ${port}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})
